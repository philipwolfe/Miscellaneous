// This .NET Reflector plug-in outputs the C# source text for a given type.
// It is adapted from the TxRef tool by Brad Abrams and Anders Hejlsberg.
// To use this plug-in download .NET Reflector at http://www.aisto.com/roeder/dotnet
// and add TxRef.dll using the Tools->Customize dialog.
// Andre Seibel (andreseibel@hotmail.com)

namespace Reflector.AddIn
{
	using System;
	using System.Drawing;
	using System.IO;
	using System.Reflection;
	using System.Collections;
	using System.Text;
	using System.Windows.Forms;
	
	using Reflector;
	using Reflector.Browser;
	using Reflector.ComponentModel;
	using Reflector.Library;

	public class MyTxRefCommand : Command
	{
		public override bool IsEnabled
		{
			get 
			{ 
				IBrowser browser = (IBrowser) this.Site.GetService(typeof(IBrowser));
				return ((browser.ActiveNode != null) && (browser.ActiveNode.Value != null) && (browser.ActiveNode.Value is Type)); 
			}
		}
	
		public override void Execute()
		{
			IBrowser browser = (IBrowser) this.Site.GetService(typeof(IBrowser));
			Type type = (Type) browser.ActiveNode.Value;
	
			StringWriter stringWriter = new StringWriter();
			TypeWriter typeWriter = new TypeWriter(stringWriter);
			typeWriter.WriteTypeDecl(type);
	
			TextBox textBox = new TextBox();
			textBox.ReadOnly = true;
			textBox.Multiline = true;
			textBox.WordWrap = false;
			textBox.ScrollBars = ScrollBars.Both;
			textBox.Font = new Font("Courier New", 9.0f);
			textBox.Dock = DockStyle.Fill;
	
			IToolWindow toolWindow = (IToolWindow) this.Site.GetService(typeof(IToolWindow));
			toolWindow.Open(textBox, "TxRef");
			textBox.Text = stringWriter.ToString();
			textBox.Select(0, 0);
			textBox.ScrollToCaret();
		}  
	
		public class TypeWriter
		{
			static Hashtable typeNames;
			static Hashtable opNames;
			static Hashtable opSortKeys;
		
			public static int memberCt;
		
			TextWriter writer;
			int indent;
			bool startOfLine;
			bool includeMemberKeys;
			bool fullTypeNames;
			bool showExcludedMembers;
			Hashtable supportedTypes;
			Hashtable excludedMembers;
		
			public TypeWriter(TextWriter writer) 
			{
				this.writer = writer;
				supportedTypes = new Hashtable();
				excludedMembers = new Hashtable();
			}
		
			static TypeWriter() 
			{
				typeNames = new Hashtable();
				typeNames.Add(typeof(void), "void");
				typeNames.Add(typeof(System.Object), "object");
				typeNames.Add(typeof(System.String), "string");
				typeNames.Add(typeof(System.SByte), "sbyte");
				typeNames.Add(typeof(System.Byte), "byte");
				typeNames.Add(typeof(System.Int16), "short");
				typeNames.Add(typeof(System.UInt16), "ushort");
				typeNames.Add(typeof(System.Int32), "int");
				typeNames.Add(typeof(System.UInt32), "uint");
				typeNames.Add(typeof(System.Int64), "long");
				typeNames.Add(typeof(System.UInt64), "ulong");
				typeNames.Add(typeof(System.Char), "char");
				typeNames.Add(typeof(System.Boolean), "bool");
				typeNames.Add(typeof(System.Single), "float");
				typeNames.Add(typeof(System.Double), "double");
				typeNames.Add(typeof(System.Decimal), "decimal");
				opNames = new Hashtable();
				opNames.Add("op_UnaryPlus", "+");
				opNames.Add("op_Addition", "+");
				opNames.Add("op_Increment", "++");
				opNames.Add("op_UnaryNegation", "-");
				opNames.Add("op_Subtraction", "-");
				opNames.Add("op_Decrement", "--");
				opNames.Add("op_Multiply", "*");
				opNames.Add("op_Division", "/");
				opNames.Add("op_Modulus", "%");
				opNames.Add("op_BitwiseAnd", "&");
				opNames.Add("op_BitwiseOr", "|");
				opNames.Add("op_ExclusiveOr", "^");
				opNames.Add("op_Negation", "!");
				opNames.Add("op_OnesComplement", "~");
				opNames.Add("op_LeftShift", "<<");
				opNames.Add("op_RightShift", ">>");
				opNames.Add("op_Equality", "==");
				opNames.Add("op_Inequality", "!=");
				opNames.Add("op_GreaterThanOrEqual", ">=");
				opNames.Add("op_LessThanOrEqual", "<=");
				opNames.Add("op_GreaterThan", ">");
				opNames.Add("op_LessThan", "<");
				opNames.Add("op_True", "true");
				opNames.Add("op_False", "false");
				opNames.Add("op_Implicit", "implicit");
				opNames.Add("op_Explicit", "explicit");
				opSortKeys = new Hashtable();
				opSortKeys.Add("op_UnaryPlus", "A");
				opSortKeys.Add("op_Addition", "B");
				opSortKeys.Add("op_Increment", "C");
				opSortKeys.Add("op_UnaryNegation", "D");
				opSortKeys.Add("op_Subtraction", "E");
				opSortKeys.Add("op_Decrement", "F");
				opSortKeys.Add("op_Multiply", "G");
				opSortKeys.Add("op_Division", "H");
				opSortKeys.Add("op_Modulus", "I");
				opSortKeys.Add("op_BitwiseAnd", "J");
				opSortKeys.Add("op_BitwiseOr", "K");
				opSortKeys.Add("op_ExclusiveOr", "L");
				opSortKeys.Add("op_Negation", "M");
				opSortKeys.Add("op_OnesComplement", "N");
				opSortKeys.Add("op_LeftShift", "O");
				opSortKeys.Add("op_RightShift", "P");
				opSortKeys.Add("op_Equality", "Q");
				opSortKeys.Add("op_Inequality", "R");
				opSortKeys.Add("op_GreaterThanOrEqual", "S");
				opSortKeys.Add("op_LessThanOrEqual", "T");
				opSortKeys.Add("op_GreaterThan", "U");
				opSortKeys.Add("op_LessThan", "V");
				opSortKeys.Add("op_True", "W");
				opSortKeys.Add("op_False", "X");
				opSortKeys.Add("op_Implicit", "Y");
				opSortKeys.Add("op_Explicit", "Z");
			}
		
			public bool FullTypeNames 
			{
				get { return fullTypeNames; }
				set { fullTypeNames = value; }
			}
		
			public bool IncludeMemberKeys 
			{
				get { return includeMemberKeys; }
				set { includeMemberKeys = value; }
			}
		
			public bool ShowExcludedMembers 
			{
				get { return showExcludedMembers; }
				set { showExcludedMembers = value; }
			}
		
			public void AddExcludedMember(string s) 
			{
				string [] args = s.Split (new char [] {';'});
				if (args.Length > 1) 
				{
					s = args[0];
				}
				s = s.Trim();
		
				excludedMembers[s] = s;
			}
		
			void AddMemberEntries(ArrayList list, Type type, bool inherited) 
			{
				foreach (MemberInfo member in type.GetMembers(
					//| BindingFlags.DeclaredOnly
					BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public)) 
				{
					if (member.DeclaringType != member.ReflectedType) 
					{
						continue;
					}
					// if (!inherited || member.MemberType != MemberTypes.Constructor) {
					list.Add(new MemberEntry(member));
					//}
				}
			}
		
			public void AddSupportedType(Type type) 
			{
				supportedTypes[type] = type;
			}
		
			static void AppendParams(StringBuilder sb, ParameterInfo[] parameters) 
			{
				sb.Append('(');
				for (int i = 0; i < parameters.Length; i++) 
				{
					if (i != 0) sb.Append(',');
					AppendType(sb, parameters[i].ParameterType);
				}
				sb.Append(')');
			}
		
			static void AppendType(StringBuilder sb, Type type) 
			{
				if (IsArray(type)) 
				{
					AppendType(sb, type.GetElementType());
					sb.Append("[]");
				}
				else if (type.IsByRef) 
				{
					AppendType(sb, type.GetElementType());
					sb.Append("@");
				}
				else if (type.IsPointer) 
				{
					AppendType(sb, type.GetElementType());
					sb.Append("*");
				}
				else 
				{
					sb.Append(type.FullName);
				}
			}
		
		
			static bool ContainsInterface(Type[] types, Type type) 
			{
				foreach (Type t in types) 
				{
					if (ContainsType(t.GetInterfaces(), type)) return true;
				}
				return false;
			}
		
			static bool ContainsType(Type[] types, Type type) 
			{
				if (types != null) 
				{
					foreach (Type t in types) 
					{
						if (t == type) return true;
					}
				}
				return false;
			}
		
			static MethodInfo GetAccessor(EventInfo evnt) 
			{
				return evnt.GetAddMethod();
			}
		
			static MethodInfo GetAccessor(PropertyInfo property) 
			{
				MethodInfo result = property.GetGetMethod();
				if (result == null) result = property.GetSetMethod();
				return result;
			}
		
			static string GetMemberKey(MemberInfo member) 
			{
				StringBuilder sb = new StringBuilder();
				switch (member.MemberType) 
				{
					case MemberTypes.Constructor:
						sb.Append("M:");
						sb.Append(member.DeclaringType.FullName);
						sb.Append(".#ctor");
						AppendParams(sb, ((ConstructorInfo)member).GetParameters());
						break;
					case MemberTypes.Field:
						sb.Append("F:");
						sb.Append(member.DeclaringType.FullName);
						sb.Append('.');
						sb.Append(((FieldInfo)member).Name);
						break;
					case MemberTypes.Property:
						sb.Append("P:");
						sb.Append(member.DeclaringType.FullName);
						sb.Append('.');
						sb.Append(((PropertyInfo)member).Name);
						ParameterInfo[] pi = ((PropertyInfo)member).GetIndexParameters();
						if (pi.Length != 0) AppendParams(sb, pi);
						break;
					case MemberTypes.Method:
						sb.Append("M:");
						sb.Append(member.DeclaringType.FullName);
						sb.Append('.');
						sb.Append(((MethodInfo)member).Name);
						AppendParams(sb, ((MethodInfo)member).GetParameters());
						break;
					case MemberTypes.Event:
						sb.Append("E:");
						sb.Append(member.DeclaringType.FullName);
						sb.Append('.');
						sb.Append(((EventInfo)member).Name);
						break;
				}
				return sb.ToString().Trim();
			}
		
			string[] GetInterfaceNames(Type type) 
			{
				Type[] typeIntfs = type.GetInterfaces();
				if (typeIntfs.Length == 0) return new string[0];
				Type[] baseIntfs = type.BaseType == null? null: type.BaseType.GetInterfaces();
				ArrayList list = new ArrayList();
				foreach (Type intf in typeIntfs) 
				{
					list.Add(intf.Name);
				}
				list.Sort();
				return (string[])list.ToArray(typeof(string));
			}
		
			static bool IsVarArgs (MethodBase m) 
			{
				return (m.CallingConvention == CallingConventions.VarArgs);		
			}
			static bool IsArray(Type type) 
			{
				return type.IsArray && type != typeof(Array);
			}
		
			static bool IsDelegate(Type type) 
			{
				return type.IsSubclassOf(typeof(Delegate)) && type != typeof(MulticastDelegate);
			}
		
			static bool IsOverride(MethodInfo method) 
			{
				return (method.Attributes & (MethodAttributes.Virtual |
					MethodAttributes.NewSlot)) == MethodAttributes.Virtual;
			}
		
			void Write(string s) 
			{
				WriteIndent();
				writer.Write(s);
			}
		
			void Write(char ch) 
			{
				WriteIndent();
				writer.Write(ch);
			}
		
			void WriteConstructor(ConstructorInfo ctor) 
			{
				if (!(ctor.IsPublic || ctor.IsFamily || ctor.IsFamilyOrAssembly)) return;
				if (ctor.IsStatic) return;
				Write(ctor.IsPublic? "public ": "protected ");
				Write(ctor.DeclaringType.Name);
				Write('(');
				WriteParamList(ctor.GetParameters());
				if (IsVarArgs (ctor)) 
				{
					Write (", __arglist");
				}
				Write(");");
				WriteMemberEnd(ctor);
			}
		
			void WriteEvent(EventInfo evnt) 
			{
				if (evnt.GetAddMethod() == null) 
				{
					return;
				}
				if (!(evnt.GetAddMethod().IsPublic || evnt.GetAddMethod().IsFamily || evnt.GetAddMethod().IsFamilyOrAssembly)) return;
		
				memberCt++;
				Write (evnt.GetAddMethod().IsPublic? "public ": "protected ");
				Write ("event ");
				Write (evnt.EventHandlerType.Name);
				Write (" ");
				Write (evnt.Name);
				Write (";");
				WriteMemberEnd(evnt);
			}
		
			void WriteField(FieldInfo field) 
			{
				if (!(field.IsPublic || field.IsFamily || field.IsFamilyOrAssembly)) return;
				if (field.DeclaringType.IsEnum) 
				{
					if (!field.IsLiteral) return;
					Write(field.Name);
					Write(',');
				}
				else 
				{
					Write(field.IsPublic? "public ": "protected ");
					if (field.IsStatic && field.IsLiteral) 
					{
						Write("const ");
					}
					else 
					{
						if (field.IsStatic) Write("static ");
						if (field.IsInitOnly) Write("readonly ");
					}
					WriteType(field.FieldType);
					Write(' ');
					Write(field.Name);
					Write(';');
				}
				WriteMemberEnd(field);
			}
		
			void WriteIndent() 
			{
				if (startOfLine) 
				{
					for (int i = 0; i < indent; i++) writer.Write("    ");
					startOfLine = false;
				}
			}
		
			void WriteLine() 
			{
				writer.WriteLine();
				startOfLine = true;
			}
		
			public void WriteMember(MemberInfo member) 
			{
		        
				switch (member.MemberType) 
				{
					case MemberTypes.Constructor:
						WriteConstructor((ConstructorInfo)member);
						break;
					case MemberTypes.Field:
						WriteField((FieldInfo)member);
						break;
					case MemberTypes.Property:
						WriteProperty((PropertyInfo)member);
						break;
					case MemberTypes.Method:
						WriteMethod((MethodInfo)member);
						break;
					case MemberTypes.Event:
						WriteEvent((EventInfo)member);
						break;
				}
			}
		
			void WriteMemberEnd(MemberInfo member) 
			{
				if (includeMemberKeys) 
				{
					Write(" // ");
					Write(GetMemberKey(member));
				}
				WriteLine();
			}
		
			void WriteMethod(MethodInfo method) 
			{
				if (!(method.IsPublic || method.IsFamily || method.IsFamilyOrAssembly)) return;
				if (method.IsSpecialName && !opNames.Contains(method.Name)) return;
		
				if (IsOverride(method)) Write (""); //return;
				memberCt++;
				Write(method.IsPublic? "public ": "protected ");
				if (method.IsStatic) Write("static ");
				WriteMethodModifiers(method);
				if (method.IsSpecialName) 
				{
					string op = (string)opNames[method.Name];
					if (op == "explicit" || op == "implicit") 
					{
						Write(op);
						Write(" operator ");
						WriteType(method.ReturnType);
					}
					else 
					{
						WriteType(method.ReturnType);
						Write(" operator ");
						Write(op);
					}
				}
				else 
				{
					WriteType(method.ReturnType);
					Write(' ');
					Write(method.Name);
				}
				Write('(');
				WriteParamList(method.GetParameters());
				if (IsVarArgs (method)) 
				{
					Write (", __arglist");
				}
				Write(");");
				WriteMemberEnd(method);
			}
		
			void WriteMethodModifiers(MethodInfo method) 
			{
				if (method.DeclaringType.IsInterface) 
				{
					return;
				}
				MethodAttributes attrs = method.Attributes;
				if ((attrs & MethodAttributes.Final) != 0 &&
					(attrs & MethodAttributes.Virtual) != 0 &&
					(attrs & MethodAttributes.NewSlot) != 0) 
				{
					attrs = 0;
				}
				if ((attrs & MethodAttributes.Final) != 0) Write("sealed ");
				if ((attrs & MethodAttributes.Virtual) != 0) 
				{
					switch (attrs & (MethodAttributes.NewSlot | MethodAttributes.Abstract)) 
					{
						case 0:
							Write("override ");
							break;
						case MethodAttributes.NewSlot:
							Write("virtual ");
							break;
						case MethodAttributes.Abstract:
							Write("abstract override ");
							break;
						case MethodAttributes.NewSlot | MethodAttributes.Abstract:
							Write("abstract ");
							break;
					}
				}
			}
		
			void WriteParamList(ParameterInfo[] parameters) 
			{
				for (int i = 0; i < parameters.Length; i++) 
				{
					ParameterInfo param = parameters[i];
					if (i != 0) Write(", ");
					Type type = param.ParameterType;
					if (IsArray(type) && Attribute.IsDefined(param, typeof(ParamArrayAttribute), true)) 
					{
						Write("params ");
					}
					WriteType(type);
					Write(' ');
					Write(param.Name);
				}
			}
		
			void WriteProperty(PropertyInfo property) 
			{
				MethodInfo accessor = GetAccessor(property);
				if (accessor == null) return;
				if (!(accessor.IsPublic || accessor.IsFamily || accessor.IsFamilyOrAssembly)) return;
				if (IsOverride(accessor)) return;
				ParameterInfo[] parameters = property.GetIndexParameters();
				memberCt++;
				Write(accessor.IsPublic? "public ": "protected ");
				if (accessor.IsStatic) Write("static ");
				WriteMethodModifiers(accessor);
				WriteType(property.PropertyType);
				Write(' ');
				if (parameters.Length == 0) 
				{
					Write(property.Name);
				}
				else 
				{
					Write("this[");
					WriteParamList(accessor.GetParameters());
					Write("]");
				}
				Write(" { ");
				if (property.CanRead) Write("get; ");
				if (property.CanWrite) Write("set; ");
				Write("}");
				WriteMemberEnd(property);
			}
		
			void WriteType(Type type) 
			{
				if (IsArray(type)) 
				{
					WriteType(type.GetElementType());
					Write('[');
					for (int i = type.GetArrayRank(); i > 1; i--) Write(',');
					Write(']');
				}
				else if (type.IsByRef) 
				{
					Write("ref ");
					WriteType(type.GetElementType());
				}
				else if (type.IsPointer) 
				{
					WriteType(type.GetElementType());
					Write('*');
				}
				else 
				{
					string name = (string)typeNames[type];
					if (name == null) name = type.Name;
					Write(name);
				}
			}
		
			public void WriteTypeDecl(Type type) 
			{
		
				if (type.IsPublic || type.IsNestedPublic) 
				{
					Write("public ");
				}
				else if (type.IsNestedPrivate) 
				{
					Write("private ");
				}
				else if (type.IsNestedAssembly) 
				{
					Write("internal ");
				}
				else if (type.IsNestedFamily) 
				{
					Write("protected ");
				}
				else if (type.IsNestedFamORAssem) 
				{
					Write("protected internal ");
				}
				if (IsDelegate(type)) 
				{
					Write("delegate ");
					MethodInfo method = type.GetMethod("Invoke");
					WriteType(method.ReturnType);
					Write(' ');
					WriteTypeName(type);
					Write('(');
					WriteParamList(method.GetParameters());
					Write(");");
				}
				else 
				{
					ArrayList list = new ArrayList();
					AddMemberEntries(list, type, true);
					if (type.IsEnum) 
					{
						Write("enum ");
						WriteTypeName(type);
					}
					else 
					{
						bool colonWritten = false;
						if (type.IsValueType) 
						{
							Write("struct ");
							WriteTypeName(type);
						}
						else if (type.IsInterface) 
						{
							Write("interface ");
							WriteTypeName(type);
						}
						else 
						{
							if (type.IsAbstract) Write("abstract ");
							if (type.IsSealed) Write("sealed ");
							Write("class ");
							WriteTypeName(type);
							Type baseType = type.BaseType;
							if (baseType != null && baseType != typeof(object)) 
							{
								Write(": ");
								Write(baseType.Name);
								colonWritten = true;
							}
						}
						foreach (string s in GetInterfaceNames(type)) 
						{
							Write(colonWritten? ", ": ": ");
							Write(s);
							colonWritten = true;
						}
					}
					WriteLine();
					Write('{');
					WriteLine();
					list.Sort();
					indent++;
					foreach (MemberEntry entry in list) WriteMember(entry.Member);
					indent--;
					Write('}');
				}
				WriteLine();
				WriteLine();
			}
		
			void WriteTypeName(Type type) 
			{
				Write(fullTypeNames? type.FullName: type.Name);
			}
		
			class MemberEntry: IComparable
			{
				MemberInfo member;
				string sortKey;
		
				public MemberEntry(MemberInfo member) 
				{
					this.member = member;
					StringBuilder sb = new StringBuilder();
					switch (member.MemberType) 
					{
						case MemberTypes.Constructor:
							sb.Append('A');
							AppendParams(sb, ((ConstructorInfo)member).GetParameters());
							break;
						case MemberTypes.Field:
							sb.Append('B');
							sb.Append(member.Name);
							break;
						case MemberTypes.Property:
							ParameterInfo[] parameters = ((PropertyInfo)member).GetIndexParameters();
							if (parameters.Length == 0) 
							{
								sb.Append('C');
								sb.Append(member.Name);
							}
							else 
							{
								sb.Append('D');
								AppendParams(sb, parameters);
							}
							break;
						case MemberTypes.Method:
							if (((MethodInfo)member).IsSpecialName && opSortKeys.Contains(member.Name)) 
							{
								sb.Append('F');
								sb.Append((string)opSortKeys[member.Name]);
								if (member.Name == "op_Implicit" || member.Name == "op_Explicit") 
								{
									AppendType(sb, ((MethodInfo)member).ReturnType);
								}
							}
							else 
							{
								sb.Append('E');
								sb.Append(member.Name);
							}
							AppendParams(sb, ((MethodInfo)member).GetParameters());
							break;
						case MemberTypes.Event:
							sb.Append('G');
							sb.Append(member.Name);
							break;
					}
					sortKey = sb.ToString();
				}
		
				public MemberInfo Member 
				{
					get { return member; }
				}
		
				int IComparable.CompareTo(object other) 
				{
					return sortKey.CompareTo(((MemberEntry)other).sortKey);
				}
		
				static void AppendParams(StringBuilder sb, ParameterInfo[] parameters) 
				{
					foreach (ParameterInfo param in parameters) 
					{
						AppendType(sb, param.ParameterType);
					}
				}
		
				static void AppendType(StringBuilder sb, Type type) 
				{
					if (IsArray(type)) 
					{
						AppendType(sb, type.GetElementType());
						sb.Append("[]");
					}
					else if (type.IsByRef) 
					{
						AppendType(sb, type.GetElementType());
						sb.Append("@");
					}
					else if (type.IsPointer) 
					{
						AppendType(sb, type.GetElementType());
						sb.Append("*");
					}
					else 
					{
						sb.Append(',');
						string name = (string)typeNames[type];
						if (name == null) name = type.Name;
						sb.Append(name);
					}
				}
			}
		}
	}
}