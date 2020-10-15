// -----------------------------------------------------------
// Delphi Language view for Lutz Roeder's .NET Reflector
// Copyright (C) 2003 Peter Sawatzki. All rights reserved.
// Peter@Sawatzki.de
// for latest version see http://www.sawatzki.de
//
// based on CSharpLanguage from Lutz Roeder (roeder@aisto.com)
// -----------------------------------------------------------
//
// Contributing
// ------------
// Peter Sawatzki <Peter@Sawatzki.de>       (PS)
// Hallvard Vassbotn <vassbotn@infront.as>  (HV)
// Lutz Roeder <roeder@aisto.com>           (LR)
//
// Release History
// ---------------
// 01.06.2003 PS initial conversion
// 19.06.2003 PS prel. event, prel. prop
// 19.06.2003 HV for-loop from HV
// 20.06.2003 PS release for Reflector SDK 3.2.0.0
// 12.07.2003 LR Updated CustomAttributes API
// 13.08.2003 PS add operator overloading

// notice: the Delphi for .NET syntax is still evolving and this version
// is based on the public preview, documentation from the Borland website
// and some educated guesswork.
//
// Please report problems and suggestions to Peter@Sawatzki.de.
// Thanks. PS


namespace Reflector.AddIn
{ using System;
  using System.Collections;
  using System.ComponentModel;
  using System.Drawing;
  using System.Globalization;
  using System.IO;
  using System.Reflection;
  using System.Security;
  using System.Text;
  using Reflector;
  using Reflector.CodeModel;
  using Reflector.ComponentModel;
  using Reflector.Library;
  using Reflector.Reflection;

/*
[assembly: System.Reflection.AssemblyTitle(".NET Reflector Delphi Add-In")]
[assembly: System.Reflection.AssemblyVersion("1.0.0.0")]
[assembly: System.Reflection.AssemblyCopyright("Copyright (C) Peter Sawatzki, Lutz Roeder. All rights reserved.")]

  public class Package : IPackage {
    private IServiceProvider serviceProvider;
    private ILanguage FDelphiLanguage = new DelphiLanguage();

    public void Load(IServiceProvider serviceProvider)
    { this.serviceProvider = serviceProvider;
      ILanguageManager languageManager = (ILanguageManager) this.serviceProvider.GetService(typeof(ILanguageManager));
      languageManager.AddLanguage(this.FDelphiLanguage, "Delphi");
    }

    public void Unload()
    { ILanguageManager languageManager = (ILanguageManager) this.serviceProvider.GetService(typeof(ILanguageManager));
      languageManager.RemoveLanguage(this.FDelphiLanguage);
    }
  }

*/

  [Description("Delphi language view")]
  internal class DelphiLanguage : Language
  {
    public Image Image { get { return null; } }
    public string Name { get { return "Delphi"; } }
    private bool FOutdentPending = false;

    public override void NamespaceDeclaration(IFormatter formatter, NamespaceInfo namespaceInfo)
    { formatter.Write("unit ");
      formatter.WriteBold((namespaceInfo.Name.Length == 0) ? "unnamed" : namespaceInfo.Name);
    }

    public override void Type(IFormatter formatter, Type type)
    { if (type == null)
      { formatter.Write("?");
        return;
      }

      if ((type.IsArray) && (type != typeof(Array)))
      { for (int i = type.GetArrayRank(); i > 0; i--)
          formatter.Write("array of ");
        this.Type(formatter, type.GetElementType());
      } else
        if (type.IsByRef)
          this.Type(formatter, type.GetElementType());
        else
          if (type.IsPointer)
          { formatter.Write("^");
            this.Type(formatter, type.GetElementType());
          }
          else
          { string name = type.Name;
            if (type == typeof(void))    name = "";
            if (type == typeof(Object))  name = "TObject";
            if (type == typeof(string))  name = "String";
            if (type == typeof(SByte))   name = "ShortInt";
            if (type == typeof(Byte))    name = "Byte";
            if (type == typeof(Int16))   name = "SmallInt";
            if (type == typeof(UInt16))  name = "Word";
            if (type == typeof(Int32))   name = "Integer";
            if (type == typeof(UInt32))  name = "Cardinal";
            if (type == typeof(Int64))   name = "Int64";
            if (type == typeof(UInt64))  name = "UInt64";
            if (type == typeof(Char))    name = "Char";
            if (type == typeof(Boolean)) name = "Boolean";
            if (type == typeof(Single))  name = "Single";
            if (type == typeof(Double))  name = "Double";
            if (type == typeof(Decimal)) name = "Decimal";
            formatter.WriteReference(name, type.FullName, type);
          }
    }

    public override void TypeDeclaration(IFormatter formatter, Type type)
    { this.CustomAttributes(formatter, type, string.Empty, true, "[", "]");

      switch (type.Attributes & TypeAttributes.VisibilityMask)
      { case TypeAttributes.Public:
        case TypeAttributes.NestedPublic:      formatter.Write("public ");             break;
        case TypeAttributes.NotPublic:
        case TypeAttributes.NestedAssembly:    formatter.Write("private ");            break;
        case TypeAttributes.NestedPrivate:     formatter.Write("strict private ");     break;
        case TypeAttributes.NestedFamily:      formatter.Write("protected ");          break;
        case TypeAttributes.NestedFamANDAssem: formatter.Write("protected internal "); break; // don't know FamANDAssem mapping for Delphi
        case TypeAttributes.NestedFamORAssem:  formatter.Write("protected ");          break; // FamORAssem maps to protected in Delphi
        default: throw new NotSupportedException();
      }

      bool isDelegate = ((type.IsSubclassOf(typeof(Delegate))) && (type != typeof(MulticastDelegate)));
      if (isDelegate)
      { formatter.Write("delegate ");
        MethodInfo invoke = type.GetMethod("Invoke");
        this.Type(formatter, invoke.ReturnType);
        formatter.Write(" ");
        formatter.WriteBold(type.Name);
        formatter.Write("(");
        this.Parameters(formatter, invoke.GetParameters());
        formatter.Write(")");
      }
      else
      { formatter.WriteBold(type.Name);
        formatter.Write(" = ");
        if (type.IsEnum)
          formatter.Write("(");
        else
        { if (type.IsValueType)
            formatter.Write("record");
          else
            if (type.IsInterface)
              formatter.Write("interface");
            else
            { formatter.Write("class");
              if (type.IsSealed)
                formatter.Write(" sealed");
            }

          Type baseType = type.BaseType;
          Type[] interfaces = TypeInformation.GetInterfaces(type);
          if (((interfaces!=null) && (interfaces.Length>0)) || ((baseType!=null) && (baseType!=typeof(object))))
          { bool first = true;
            formatter.Write("(");
            if (baseType!=null) {
              this.Type(formatter, baseType);
              first = false;
            }
            foreach (Type interfaceType in interfaces)
            { if (first)
                first = false;
              else
                formatter.Write(", ");
              this.Type(formatter, interfaceType);
            }
            formatter.Write(")");
          }
        }
      }

      StringBuilder builder = new StringBuilder();
      if (type.IsSerializable)
        builder.Append("Serializable ");
      if ((type.Attributes & TypeAttributes.SpecialName) != 0)
        builder.Append("SpecialName ");
      if ((type.Attributes & TypeAttributes.Import) != 0)
        builder.Append("Import ");
      if ((type.Attributes & TypeAttributes.HasSecurity) != 0)
        builder.Append("HasSecurity ");
      if ((type.Attributes & TypeAttributes.BeforeFieldInit) != 0)
        builder.Append("BeforeFieldInit ");
      if (type.IsCOMObject)
        builder.Append("COM ");

      switch (type.Attributes & TypeAttributes.StringFormatMask)
      { case TypeAttributes.AnsiClass:      builder.Append("Ansi ");    break;
        case TypeAttributes.UnicodeClass:   builder.Append("Unicode "); break;
        case TypeAttributes.AutoClass:      builder.Append("Auto ");    break;
      }

      switch (type.Attributes & TypeAttributes.ExplicitLayout)
      { case TypeAttributes.ExplicitLayout:   builder.Append("Explicit ");   break;
        case TypeAttributes.AutoLayout:       builder.Append("Auto ");       break;
        case TypeAttributes.SequentialLayout: builder.Append("Sequential "); break;
      }

      if (type.DeclaringType != null)
        formatter.WriteProperty("DeclaringType", type.DeclaringType.FullName);
      else
        formatter.WriteProperty("Namespace", (type.Namespace == null) ? string.Empty : type.Namespace);
      formatter.WriteProperty("GUID", type.GUID.ToString());

      if (builder.Length != 0)
        formatter.WriteProperty("Modifiers", builder.ToString());
    }

    public override void TypeReference(IFormatter formatter, Type type)
    { bool isDelegate = ((type.IsSubclassOf(typeof(Delegate))) && (type != typeof(MulticastDelegate)));
      if      (isDelegate)                   formatter.Write("delegate ");
      else if (type.IsEnum)                  formatter.Write("{enum(tr)} ");
      else if (type.IsValueType)             formatter.Write("record ");
      else if (type.IsInterface)             formatter.Write("interface ");
      else if (type.IsClass)                 formatter.Write("class ");

      this.Type(formatter, type);
      if (type.DeclaringType != null)
        formatter.WriteProperty("Declaring Type", type.DeclaringType.FullName);
      else
        formatter.WriteProperty("Namespace", (type.Namespace == null) ? string.Empty : type.Namespace);
    }

    private void MethodParameterDeclaration(IFormatter formatter, MethodBase info)
    { if (info.GetParameters().Length>0) {
        formatter.Write("(");
        this.Parameters(formatter, info.GetParameters());
        if (info.CallingConvention == CallingConventions.VarArgs)
          formatter.Write(" {varargs}");
        formatter.Write(")");
      }
    }

    public override void ConstructorDeclaration(IFormatter formatter, ConstructorInfo constructorInfo)
    { this.MethodBaseImplementationFlags(formatter, constructorInfo);
      this.MethodVisibilityModifiers(formatter, constructorInfo);
      this.CustomAttributes(formatter, constructorInfo, string.Empty, true, "[", "]");
      ConstructorDeclarationCore(formatter, constructorInfo, false);
      this.MethodBaseModifiers(formatter, constructorInfo);

      if (constructorInfo.ReflectedType != constructorInfo.DeclaringType)
        formatter.WriteProperty("Declaring Type", constructorInfo.DeclaringType.FullName);
    }

    public override void ConstructorDeclaration(IFormatter formatter, ConstructorInfo constructorInfo, StatementCollection statements)
    { formatter.AllowProperties = false;
      ConstructorDeclarationCore(formatter, constructorInfo, true);
      formatter.WriteLine();

      this.WriteLabelList(formatter, statements);
      this.WriteVariableList(formatter, statements);

      formatter.Write("begin");
      formatter.WriteIndent();
      this.WriteStatementList(formatter, statements);
      formatter.WriteOutdent();
      formatter.Write("end;");
    }

    private void ConstructorDeclarationCore(IFormatter formatter, ConstructorInfo constructorInfo, bool asImplementation)
    { formatter.Write("constructor ");
      if (asImplementation)
      { formatter.Write(constructorInfo.DeclaringType.Name);
        formatter.Write(".");
      }
      formatter.WriteBold("Create");
      this.MethodParameterDeclaration(formatter, constructorInfo);
      formatter.Write(";");
    }

    public override void MethodDeclaration(IFormatter formatter, MethodInfo methodInfo)
    { this.MethodBaseImplementationFlags(formatter, methodInfo);
      this.MethodVisibilityModifiers(formatter, methodInfo);
      this.CustomAttributes(formatter, methodInfo.ReturnType, "return: ", true, "[", "]");
      this.CustomAttributes(formatter, methodInfo, string.Empty, true, "[", "]");
      MethodDeclarationCore(formatter, methodInfo, false);
      this.MethodBaseModifiers(formatter, methodInfo);
      if (methodInfo.ReflectedType != methodInfo.DeclaringType)
        formatter.WriteProperty("Declaring Type", methodInfo.DeclaringType.FullName);
    }

    public override void MethodDeclaration(IFormatter formatter, MethodInfo methodInfo, StatementCollection statements)
    { MethodReturnStatement returnStatement = null;
      formatter.AllowProperties = false;
      MethodDeclarationCore(formatter, methodInfo, true);
      formatter.WriteLine();

      this.WriteLabelList(formatter, statements);
      this.WriteVariableList(formatter, statements);

      formatter.Write("begin");
      formatter.WriteIndent();

      // this code is to optimize the last expression return statement a bit for a more clean Delphi code
      if (statements.Count > 0)
      { returnStatement = (statements[(statements.Count-1)] as MethodReturnStatement);
        if (returnStatement!=null)
          if (returnStatement.Expression == null)
            returnStatement = null;
          else
            statements.RemoveAt((statements.Count - 1));
      }

      this.WriteStatementList(formatter, statements);

      // output the last expression return statement for clean Delphi code
      if (returnStatement != null)
      { if (statements.Count > 0)
        { formatter.Write(";");
          formatter.WriteLine();
        }
        formatter.Write("result:= ");
        this.WriteExpression(formatter, returnStatement.Expression);
      }

      formatter.WriteOutdent();
      formatter.Write("end;");
    }

    private void MethodDeclarationCore(IFormatter formatter, MethodInfo methodInfo, bool asImplementation)
    { string name = methodInfo.Name;
      if (methodInfo.IsSpecialName)
      { if (name == "op_UnaryPlus")          name = "Positive";
        if (name == "op_Addition")           name = "Add";
        if (name == "op_Increment")          name = "Inc";
        if (name == "op_UnaryNegation")      name = "Negative";
        if (name == "op_Subtraction")        name = "Subtract";
        if (name == "op_Decrement")          name = "Dec";
        if (name == "op_Multiply")           name = "Multiply";
        if (name == "op_Division")           name = "Divide";
        if (name == "op_Modulus")            name = "Modulus";
        if (name == "op_BitwiseAnd")         name = "BitwiseAnd";
        if (name == "op_BitwiseOr")          name = "BitwiseOr";
        if (name == "op_ExclusiveOr")        name = "LogicalOr";
        if (name == "op_Negation")           name = "LogicalNot";
        if (name == "op_OnesComplement")     name = "BitwiseNot";
        if (name == "op_LeftShift")          name = "ShiftLeft";
        if (name == "op_RightShift")         name = "ShiftRight";
        if (name == "op_Equality")           name = "Equal";
        if (name == "op_Inequality")         name = "NotEqual";
        if (name == "op_GreaterThanOrEqual") name = "GreaterThanOrEqual";
        if (name == "op_LessThanOrEqual")    name = "LessThanOrEqual";
        if (name == "op_GreaterThan")        name = "GreaterThan";
        if (name == "op_LessThan")           name = "LessThan";
        if (name == "op_True")               name = "true";
        if (name == "op_False")              name = "false";
        if (name == "op_Implicit")           name = "Implicit";
        if (name == "op_Explicit")           name = "Explicit";
      }

      if (methodInfo.IsStatic)
        formatter.Write("class ");

      if (name != methodInfo.Name)
        formatter.Write("operator ");
      else
        if (methodInfo.ReturnType == typeof(void))
          formatter.Write("procedure ");
        else
          formatter.Write("function ");

      if (asImplementation)
      { formatter.Write(methodInfo.DeclaringType.Name);
        formatter.Write(".");
      }
      formatter.WriteBold(name);

      this.MethodParameterDeclaration(formatter, methodInfo);
      if (methodInfo.ReturnType != typeof(void)) {
        formatter.Write(": ");
        this.Type(formatter, methodInfo.ReturnType);
      }
      formatter.Write(";");
    }

    protected void WriteStatementInternal(IFormatter formatter, Statement statement)
    // we need this because Delphi has no inline Variable Declaration
    { CheckPendingOutdent(formatter);
      if      (statement is CommentStatement)         this.WriteCommentStatement(formatter, ((CommentStatement) statement));
      else if (statement is MethodReturnStatement)    this.WriteMethodReturnStatement(formatter, ((MethodReturnStatement) statement));
      else if (statement is ConditionStatement)       this.WriteConditionStatement(formatter, ((ConditionStatement) statement));
      else if (statement is IterationStatement)       this.WriteIterationStatement(formatter, ((IterationStatement) statement));
      else if (statement is TryCatchFinallyStatement) this.WriteTryCatchFinallyStatement(formatter, ((TryCatchFinallyStatement) statement));
      else if (statement is AssignStatement)          this.WriteAssignStatement(formatter, ((AssignStatement) statement));
      else if (statement is ExpressionStatement)      this.WriteExpressionStatement(formatter, ((ExpressionStatement) statement));
      else if (statement is ThrowExceptionStatement)  this.WriteThrowExceptionStatement(formatter, ((ThrowExceptionStatement) statement));
      else if (statement is AttachEventStatement)     this.WriteAttachEventStatement(formatter, ((AttachEventStatement) statement));
      else if (statement is RemoveEventStatement)     this.WriteRemoveEventStatement(formatter, ((RemoveEventStatement) statement));
      else if (statement is GotoStatement)            this.WriteGotoStatement(formatter, ((GotoStatement) statement));
      else if (statement is SwitchStatement)          this.WriteSwitchStatement(formatter, ((SwitchStatement) statement));
      else if (statement is LabeledStatement)         this.WriteLabeledStatement(formatter, ((LabeledStatement) statement));
      else if (!(statement is VariableDeclarationStatement))   // ignore variable declaration statements here and throw error for all remaining
        throw new ArgumentException(string.Concat(statement.GetType().Name, " not handled."), "statement");
    }

    protected override void WriteStatementList(IFormatter formatter, StatementCollection statements)
    { bool first = true;
      foreach (Statement statement in statements)
        if ((statement as VariableDeclarationStatement)==null)
        { if (first)
            first = false;
          else
          { formatter.Write(";");
            formatter.WriteLine();
          }
          WriteStatementInternal(formatter, statement);
        }
      CheckPendingOutdent(formatter);
    }

    protected void CheckPendingOutdent (IFormatter formatter)
    { if (FOutdentPending)
      { formatter.WriteOutdent();
        FOutdentPending = false;
      }
    }

    protected void WriteVariableList(IFormatter formatter, StatementCollection statements)
    { bool hasvar = false;
      foreach (Statement statement in statements)
        if ((statement as VariableDeclarationStatement) != null)
        { if (hasvar==false)
          { formatter.Write("var");
            formatter.WriteIndent();
            hasvar = true;
          }
          this.WriteVariableDeclarationStatement(formatter, ((VariableDeclarationStatement) statement));
        }
      if (hasvar==true)
        formatter.WriteOutdent();
    }

    protected void WriteLabelList(IFormatter formatter, StatementCollection statements)
    { bool haslabel = false;
      foreach (Statement statement in statements)
        if ((statement as LabeledStatement) != null)
        { if (haslabel==false)
          { formatter.Write("label ");
            haslabel = true;
          } else
            formatter.Write(", ");
          formatter.Write((statement as LabeledStatement).Label);
        }
      if (haslabel==true) {
        formatter.Write(";");
        formatter.WriteLine();
      }
    }

    public override void EventDeclaration(IFormatter formatter, EventInfo eventInfo)
    { this.CustomAttributes(formatter, eventInfo, string.Empty, true, "[", "]");

      if ((eventInfo.DeclaringType == null) || (!eventInfo.DeclaringType.IsInterface))
        formatter.Write("public ");

      // we don't know the syntax of an event declaration yet!
      formatter.WriteBold(eventInfo.Name);
      formatter.Write(" = {Event Of }");
      this.Type(formatter, eventInfo.EventHandlerType);

      if (eventInfo.IsMulticast)
        formatter.WriteProperty("Modifiers", "Multicast ");
      if (eventInfo.ReflectedType != eventInfo.DeclaringType)
        formatter.WriteProperty("Declaring Type", eventInfo.DeclaringType.FullName);
    }

    public override void PropertyDeclaration(IFormatter formatter, PropertyInfo propertyInfo)
    { this.CustomAttributes(formatter, propertyInfo, string.Empty, true, "[", "]");

      MethodInfo getMethod = null;
      try
      { getMethod = propertyInfo.GetGetMethod(true);
      }
      catch (SecurityException) { }

      MethodInfo setMethod = null;
      try
      { setMethod = propertyInfo.GetSetMethod(true);
      }
      catch (SecurityException) { }

      if (getMethod != null)
      { this.MethodDeclaration(formatter, getMethod);
        formatter.WriteLine();
      }
      if (setMethod != null)
      { this.MethodDeclaration(formatter, setMethod);
        formatter.WriteLine();
      }

      bool equal = ((setMethod == getMethod) || ((setMethod == null) || (getMethod == null) || (setMethod.Attributes == getMethod.Attributes)));
      if (equal)
      { if (getMethod == null)
          this.MethodBaseModifiers(formatter, setMethod);
        else
          this.MethodBaseModifiers(formatter, getMethod);
      }
      formatter.Write("property ");
      formatter.WriteBold(propertyInfo.Name.Equals("Item") ? "Self" : propertyInfo.Name);
      formatter.Write(": ");
      this.Type(formatter, propertyInfo.PropertyType);

      try
      { ParameterInfo[] parameters = propertyInfo.GetIndexParameters();
        if (parameters.Length > 0)
        { formatter.Write("[");
          this.Parameters(formatter, parameters);
          formatter.Write("]");
        }
      }
      catch (SecurityException) { }

      if (propertyInfo.CanRead)
      { formatter.WriteBold(" read ");
        formatter.Write(getMethod.Name);
      }
      if (propertyInfo.CanWrite)
      { formatter.WriteBold(" write ");
        formatter.Write(setMethod.Name);
      }
      formatter.Write(";");
      if (propertyInfo.ReflectedType != propertyInfo.DeclaringType)
        formatter.WriteProperty("Declaring Type", propertyInfo.DeclaringType.FullName);
    }

    public override void FieldDeclaration(IFormatter formatter, FieldInfo fieldInfo)
    { if (fieldInfo.Name == "vbNullChar")
        System.Diagnostics.Debug.WriteLine("...");

      this.CustomAttributes(formatter, fieldInfo, string.Empty, true, "[", "]");
      bool isEnumElement = ((fieldInfo.DeclaringType == fieldInfo.FieldType) && (fieldInfo.DeclaringType.IsEnum));

      if (!isEnumElement)
      { if      (fieldInfo.IsPublic)            formatter.Write("public ");
        else if (fieldInfo.IsPrivate)           formatter.Write("strict private ");
        else if (fieldInfo.IsFamily)            formatter.Write("strict protected ");
        else if (fieldInfo.IsAssembly)          formatter.Write("private "); // Assembly maps to private in Delphi!
        else if (fieldInfo.IsFamilyAndAssembly) formatter.Write("protected {FamAndAssem} ");
        else if (fieldInfo.IsFamilyOrAssembly)  formatter.Write("protected ");

        if ((fieldInfo.IsLiteral) && (fieldInfo.IsStatic))
          formatter.Write("const ");
        else
        { if (fieldInfo.IsStatic)
            formatter.Write("static ");
          if (fieldInfo.IsInitOnly)
            formatter.Write("readonly ");
        }
      }

      formatter.WriteBold(fieldInfo.Name);
      formatter.Write(": ");

      try
      { Type fieldType = fieldInfo.FieldType;
        this.Type(formatter, fieldInfo.FieldType);
      }
      catch (TypeLoadException exception)
      { formatter.Write("\'" + exception.Message + "\'");
      }

      this.FieldInitialValue(formatter, fieldInfo, " = ");
      formatter.Write(";");

      string modifier = string.Empty;
      if (fieldInfo.IsStatic)   modifier += "Static ";
      if (fieldInfo.IsLiteral)  modifier += "Literal ";
      if (fieldInfo.IsInitOnly) modifier += "Read-only ";
      if (modifier.Length != 0)
        formatter.WriteProperty("Modifiers", modifier);

      if (fieldInfo.ReflectedType != fieldInfo.DeclaringType)
        formatter.WriteProperty("Declaring Type", fieldInfo.DeclaringType.FullName);
    }

    private void ParameterDeclaration(IFormatter formatter, ParameterInfo parameterInfo)
    { this.ParameterDeclarationAttributes(formatter, parameterInfo);
      this.CustomAttributes(formatter, parameterInfo, string.Empty, false, "[", "]");
      if (parameterInfo.ParameterType.IsByRef)
        formatter.Write("var ");

      if (parameterInfo.Name == null) {
        formatter.Write("A");
        formatter.Write(parameterInfo.ParameterType.Name);
      } else
        formatter.Write(parameterInfo.Name);

      formatter.Write(": ");

      if (parameterInfo.ParameterType.IsPointer)
        formatter.Write("P"); // hopefully this type is defined!
      this.Type(formatter, parameterInfo.ParameterType);
      this.ParameterDefaultValue(formatter, parameterInfo);
    }

    private void Parameters(IFormatter formatter, ParameterInfo[] parameters)
    { for (int i = 0; i < parameters.Length; i++)
      { if (i != 0)
          formatter.Write("; ");
        Type type = parameters[i].ParameterType;
        if ((type.IsArray) && (type != typeof(Array)) && Attribute.IsDefined(parameters[i], typeof(ParamArrayAttribute), true))
          formatter.Write("array of ");
        this.ParameterDeclaration(formatter, parameters[i]);
      }
    }

    private void MethodVisibilityModifiers(IFormatter formatter, MethodBase methodBase)
    { if (methodBase == null) return;
      if ((methodBase.DeclaringType == null) || (!methodBase.DeclaringType.IsInterface)) {
        if      (methodBase.IsPublic)            formatter.Write("public ");
        else if (methodBase.IsPrivate)           formatter.Write("strict private ");
        else if (methodBase.IsFamily)            formatter.Write("strict protected ");
        else if (methodBase.IsAssembly)          formatter.Write("private ");
        else if (methodBase.IsFamilyAndAssembly) formatter.Write("protected internal ");
        else if (methodBase.IsFamilyOrAssembly)  formatter.Write("protected ");
      }
    }

    private void MethodBaseModifiers(IFormatter formatter, MethodBase methodBase)
    { if (((methodBase.Attributes & MethodAttributes.Virtual) != 0) && (methodBase.DeclaringType != null) && (!methodBase.DeclaringType.IsInterface))
      { switch (methodBase.Attributes & (MethodAttributes.NewSlot | MethodAttributes.Abstract)) {
          case 0:                         formatter.Write(" override;"); break;
          case MethodAttributes.NewSlot:  formatter.Write(" virtual;"); break;
          case MethodAttributes.Abstract: formatter.Write(" abstract;"); break; // does this exist ???
          case MethodAttributes.NewSlot
             | MethodAttributes.Abstract: formatter.Write(" virtual; abstract;"); break;
        }
        if ((methodBase.Attributes & MethodAttributes.Final) != 0)
          formatter.Write(" final;");
      }
    }

    public override void TypeView(IFormatter formatter, Type[] types)
    { if (types.Length == 1)
        this.TypeView(formatter, types[0]);
      else
      { NamespaceList namespaceList = new NamespaceList(types);
        foreach (NamespaceInfo namespaceInfo in namespaceList.Namespaces)
        { this.NamespaceDeclaration(formatter, namespaceInfo);
          formatter.WriteLine();
          formatter.Write("type");
          formatter.WriteIndent();
          Type[] array = namespaceInfo.GetTypes();
          if (this.Settings.Sort)
            Array.Sort(array, new TypeComparer());

          for (int i = 0; i < array.Length; i++)
          { this.TypeView(formatter, array[i]);
            formatter.WriteLine();
          }

          formatter.WriteOutdent();
        }
      }
    }

    private void TypeView(IFormatter formatter, Type type)
    { formatter.AllowProperties = false;
      this.TypeDeclaration(formatter, type);
      formatter.WriteLine();
      formatter.WriteIndent();
      this.TypeViewBody(formatter, type, this);

      Type[] nestedTypes = type.GetNestedTypes(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.Instance | BindingFlags.DeclaredOnly);
      if (this.Settings.Sort)
        Array.Sort(nestedTypes, new TypeComparer());
      if (nestedTypes.Length>0)
      { formatter.Write("type");
        formatter.WriteLine();
        formatter.WriteIndent();
        for (int i = 0; i < nestedTypes.Length; i++)
        { if (this.Visibility.Type(nestedTypes[i]))
          { formatter.WriteLine();
            this.TypeView(formatter, nestedTypes[i]);
          }
        }
        formatter.WriteOutdent();
      }

      formatter.WriteOutdent();
      if (type.IsEnum)
        formatter.Write(");");
      else
        formatter.Write("end;");
      formatter.WriteLine();
    }

    private void MethodBaseImplementationFlags(IFormatter formatter, MethodBase methodBase)
    { if (methodBase != null)
      { MethodImplAttributes attributes = methodBase.GetMethodImplementationFlags();
        StringBuilder builder = new StringBuilder();

        switch (attributes & MethodImplAttributes.CodeTypeMask)
        { case MethodImplAttributes.IL:        builder.Append("IL ");        break;
          case MethodImplAttributes.Native:    builder.Append("Native ");    break;
          case MethodImplAttributes.OPTIL:     builder.Append("Optimized "); break;
          case MethodImplAttributes.Runtime:   builder.Append("Runtime ");   break;
        }

        switch (attributes & MethodImplAttributes.ManagedMask)
        { case MethodImplAttributes.Managed:   builder.Append("Managed ");   break;
          case MethodImplAttributes.Unmanaged: builder.Append("Unmanaged "); break;
        }

        if ((attributes & MethodImplAttributes.NoInlining) != 0)
          builder.Append("No-Inlining ");

        if ((attributes & MethodImplAttributes.ForwardRef) != 0)
          builder.Append("Forward-Ref ");

        if ((attributes & MethodImplAttributes.Synchronized) != 0)
          builder.Append("Synchronized ");

        if ((attributes & MethodImplAttributes.InternalCall) != 0)
          builder.Append("Internal ");

        if (builder.Length != 0)
          formatter.WriteProperty("Flags", builder.ToString());
      }
    }

    protected override void WriteCommentStatement(IFormatter formatter, CommentStatement statement)
    { if (statement.Comment.Text.IndexOf("\n") == -1)
      { formatter.Write("// ");
        formatter.Write(statement.Comment.Text);
        formatter.WriteLine();
      }
      else
      { formatter.Write("{ ");
        formatter.Write(statement.Comment.Text);
        formatter.Write(" }");
        formatter.WriteLine();
      }
    }

    protected override void WriteMethodReturnStatement(IFormatter formatter, MethodReturnStatement statement)
    { if (statement.Expression != null) {
        formatter.Write("begin");
        formatter.WriteIndent();
        formatter.Write("result:= ");
        this.WriteExpression(formatter, statement.Expression);
        formatter.Write(";");
        formatter.WriteLine();
        formatter.Write("exit");
        formatter.WriteOutdent();
        formatter.Write("end");
      } else
        formatter.Write("exit");
    }

    protected override void WriteConditionStatement(IFormatter formatter, ConditionStatement statement)
    { FOutdentPending = false;
      formatter.Write("if ");
      this.WriteExpression(formatter, statement.Condition);
      formatter.Write(" then");
      formatter.WriteLine();
      if (statement.TrueStatements.Count>1)
        formatter.Write("begin");
      formatter.WriteIndent();
      this.WriteStatementList(formatter, statement.TrueStatements);
      if (statement.TrueStatements.Count>1) {
        formatter.WriteOutdent();
        formatter.Write("end");
      } else
        FOutdentPending = true;

      if (statement.FalseStatements.Count > 0)
      { if (FOutdentPending) {
          formatter.WriteOutdent();
          FOutdentPending = false;
        }
        formatter.WriteLine();
        formatter.Write("else");
        if (statement.FalseStatements.Count > 1)
          formatter.Write(" begin");
        formatter.WriteLine();
        formatter.WriteIndent();
        this.WriteStatementList(formatter, statement.FalseStatements);
        if (statement.FalseStatements.Count > 1) {
          formatter.WriteOutdent();
          formatter.Write("end");
        } else
          FOutdentPending = true;
      }
    }

    protected override void WriteTryCatchFinallyStatement(IFormatter formatter, TryCatchFinallyStatement statement)
    { if ((statement.FinallyStatements.Count>0) && (statement.CatchClauses.Count>0)) {
        formatter.Write("try"); // we have to use a nested "try try except finally end end" here!
        formatter.WriteLine();
        formatter.WriteIndent();
        formatter.Write("try");
      } else
        formatter.Write("try");
      formatter.WriteLine();
      formatter.WriteIndent();
      this.WriteStatementList(formatter, statement.TryStatements);
      formatter.WriteOutdent();
      formatter.WriteLine();

      if (statement.CatchClauses.Count>0) {
        formatter.Write("except");
        formatter.WriteLine();
        formatter.WriteIndent();

        foreach (CatchClause catchClause in statement.CatchClauses) {
          formatter.Write("on ");
          bool hasEmptyType = (catchClause.CatchExceptionType.Type == typeof(object)) && (!catchClause.CatchExceptionType.Type.IsArray);
          bool hasEmptyLocalName = (catchClause.LocalName == null) || (catchClause.LocalName.Length == 0);
          if ((!hasEmptyType) || (!hasEmptyLocalName)) {
            if (!hasEmptyLocalName) {
              this.WriteDeclaration(formatter, catchClause.LocalName);
              formatter.Write(": ");
            }
            this.WriteTypeReference(formatter, catchClause.CatchExceptionType);
            formatter.Write(" do");
          }
          formatter.Write(" begin");
          formatter.WriteLine();
          formatter.WriteIndent();
          this.WriteStatementList(formatter, catchClause.Statements);
          formatter.WriteOutdent();
          formatter.Write("end;");
          formatter.WriteLine();
        }
      }

      if (statement.FinallyStatements.Count > 0) {
        if (statement.CatchClauses.Count>0) {
          formatter.WriteOutdent();
          formatter.Write("end");
          formatter.WriteLine();
        }

        formatter.Write("finally");
        formatter.WriteLine();
        formatter.WriteIndent();
        this.WriteStatementList(formatter, statement.FinallyStatements);
        formatter.WriteOutdent();
        formatter.WriteLine();
      }
      formatter.Write("end");
    }

    protected override void WriteAddressDereferenceExpression(IFormatter formatter, AddressDereferenceExpression expression)
    { base.WriteExpression(formatter, expression.Expression);
      formatter.Write("^");
    }

    protected override void WriteAddressOfExpression(IFormatter formatter, AddressOfExpression expression)
    { formatter.Write("@");
      base.WriteExpression(formatter, expression.Expression);
    }

    protected override void WriteAssignStatement(IFormatter formatter, AssignStatement statement)
    { this.WriteExpression(formatter, statement.Left);
      formatter.Write(":= ");
      this.WriteExpression(formatter, statement.Right);
    }

    protected override void WriteExpressionStatement(IFormatter formatter, ExpressionStatement statement)
    { this.WriteExpression(formatter, statement.Expression);
    }

    protected override void WriteBinaryOperator(IFormatter formatter, BinaryOperatorType operatorType)
    { switch (operatorType) {
        case BinaryOperatorType.Add:                formatter.Write("+"); return;
        case BinaryOperatorType.Subtract:           formatter.Write("-"); return;
        case BinaryOperatorType.Multiply:           formatter.Write("*"); return;
        case BinaryOperatorType.Divide:             formatter.Write("div"); return;
        case BinaryOperatorType.Modulus:            formatter.Write("mod"); return;
        case BinaryOperatorType.ShiftLeft:          formatter.Write("shl"); return;
        case BinaryOperatorType.ShiftRight:         formatter.Write("shr"); return;
        case BinaryOperatorType.Assign:             formatter.Write(":="); return;
        case BinaryOperatorType.IdentityInequality: formatter.Write("<>"); return;
        case BinaryOperatorType.IdentityEquality:   formatter.Write("="); return;
        case BinaryOperatorType.ValueEquality:      formatter.Write("="); return;
        case BinaryOperatorType.BitwiseOr:          formatter.Write("or"); return;
        case BinaryOperatorType.BitwiseAnd:         formatter.Write("and"); return;
        case BinaryOperatorType.BitwiseExclusiveOr: formatter.Write("xor"); return;
        case BinaryOperatorType.BooleanOr:          formatter.Write("or"); return;
        case BinaryOperatorType.BooleanAnd:         formatter.Write("and"); return;
        case BinaryOperatorType.LessThan:           formatter.Write("<"); return;
        case BinaryOperatorType.LessThanOrEqual:    formatter.Write("<="); return;
        case BinaryOperatorType.GreaterThan:        formatter.Write(">"); return;
        case BinaryOperatorType.GreaterThanOrEqual: formatter.Write(">="); return;
      }
      throw new NotSupportedException(operatorType.ToString());
    }

    protected override void WriteUnaryOperator(IFormatter formatter, UnaryOperatorType operatorType)
    { switch (operatorType) {
        case UnaryOperatorType.Not: formatter.Write("not"); return;
        case UnaryOperatorType.Negate: formatter.Write("-"); return;
      }
      throw new NotSupportedException(operatorType.ToString());
    }

    protected override void WriteUnaryOperatorExpression(IFormatter formatter, UnaryOperatorExpression expression)
    { WriteUnaryOperator(formatter, expression.Operator);
      if (expression.Operator==UnaryOperatorType.Not)
        formatter.Write("(");
      WriteExpression(formatter, expression.Expression);
      if (expression.Operator==UnaryOperatorType.Not)
        formatter.Write(")");
    }

    protected override void WriteIterationStatement(IFormatter formatter, IterationStatement statement)
    { bool canUseForLoop = false;

      // Check if the iteration statement is limited enough to emit a Delphi for-loop
      AssignStatement InitAssignment = statement.InitStatement as AssignStatement;
      AssignStatement IncrementAssignment = statement.IncrementStatement as AssignStatement;
      BinaryOperatorExpression TestOperator = statement.TestExpression as BinaryOperatorExpression;
      BinaryOperatorExpression IncrRight = null;

      if ( (InitAssignment != null) && (IncrementAssignment != null) && (TestOperator != null) )
      { VariableReferenceExpression InitLeft = InitAssignment.Left as VariableReferenceExpression;
        // PrimitiveExpression InitRight = InitAssignment.Right as PrimitiveExpression;
        VariableReferenceExpression IncrLeft = IncrementAssignment.Left as VariableReferenceExpression;
        IncrRight = IncrementAssignment.Right as BinaryOperatorExpression;
        VariableReferenceExpression TestLeft = TestOperator.Left as VariableReferenceExpression;

        if ( (InitLeft != null) && (IncrLeft != null) && (IncrRight != null) && (TestLeft != null) )
        { if ( (InitLeft.Variable == IncrLeft.Variable) && (InitLeft.Variable == TestLeft.Variable) )
          { VariableReferenceExpression IncrFromVar = IncrRight.Left as VariableReferenceExpression;
            PrimitiveExpression IncrExp = IncrRight.Right as PrimitiveExpression;
            if ( (IncrFromVar != null) && (IncrExp != null) )
            { if ( (InitLeft.Variable == IncrFromVar.Variable) && (IncrExp.Value.Equals(1)) )
              { if ((IncrRight.Operator == BinaryOperatorType.Add) &&
                    ((TestOperator.Operator == BinaryOperatorType.LessThan) ||
                     (TestOperator.Operator == BinaryOperatorType.LessThanOrEqual)) )
                  canUseForLoop = true;
                else
                  if ((IncrRight.Operator == BinaryOperatorType.Subtract) &&
                      ((TestOperator.Operator == BinaryOperatorType.GreaterThan) ||
                      (TestOperator.Operator == BinaryOperatorType.GreaterThanOrEqual)) )
                    canUseForLoop = true;

              }
            }
          }
        }
      }

      if (canUseForLoop)
      { formatter.Write("for ");
        this.WriteStatementInternal(formatter, statement.InitStatement);
        if (IncrRight.Operator == BinaryOperatorType.Add)
          formatter.Write(" to ");
        else
          formatter.Write(" downto ");
        this.WriteExpression(formatter, TestOperator.Right);
        // TODO: Handle special case of literal+1 -> 1 etc.
        if (IncrRight.Operator == BinaryOperatorType.Add)
        { if (TestOperator.Operator == BinaryOperatorType.LessThan)
            formatter.Write("-1 ");
        }
        else
        { if (TestOperator.Operator == BinaryOperatorType.GreaterThan)
            formatter.Write("+1 ");
        }
      }
      else
      { // Fall back to version that emits while-loops!
        if (statement.InitStatement != null)
        { this.WriteStatementInternal(formatter, statement.InitStatement);
          formatter.Write(";");
          formatter.WriteLine();
        }

        formatter.Write("while (");
        if (statement.TestExpression != null)
          this.WriteExpression(formatter, statement.TestExpression);
        else
          formatter.Write("true");
        formatter.Write(")");
      }
      formatter.Write(" do");
      formatter.WriteLine();
      formatter.Write("begin");
      formatter.WriteIndent();
      this.WriteStatementList(formatter, statement.Statements);
      if (!canUseForLoop)
        if (statement.IncrementStatement != null)
        { formatter.Write(";");
          formatter.WriteLine();
          this.WriteStatementInternal(formatter, statement.IncrementStatement);
        }
      formatter.WriteOutdent();
      formatter.Write("end");
    }

    protected override void WriteThrowExceptionStatement(IFormatter formatter, ThrowExceptionStatement statement)
    { formatter.Write("raise ");
      if (statement.ToThrow != null)
        this.WriteExpression(formatter, statement.ToThrow);
      else
        formatter.Write("exception.Create");
    }

    protected override void WriteVariableDeclarationStatement(IFormatter formatter, VariableDeclarationStatement statement)
    { this.WriteDeclaration(formatter, statement.Name);
      formatter.Write(": ");
      this.WriteTypeReference(formatter, statement.Type);

      if (statement.InitExpression != null)
      { formatter.Write(" = ");
        this.WriteExpression(formatter, statement.InitExpression);
      }

      formatter.Write(";");
      formatter.WriteLine();
    }

    protected override void WriteAttachEventStatement(IFormatter formatter, AttachEventStatement statement)
    { formatter.Write("Include(");
      this.WriteEventReferenceExpression(formatter, statement.Event);
      formatter.Write(", ");
      this.WriteExpression(formatter, statement.Listener);
      formatter.Write(")");
    }

    protected override void WriteRemoveEventStatement(IFormatter formatter, RemoveEventStatement statement)
    { formatter.Write("Exclude(");
      this.WriteEventReferenceExpression(formatter, statement.Event);
      formatter.Write(", ");
      this.WriteExpression(formatter, statement.Listener);
      formatter.Write(")");
    }

    protected override void WriteSizeOfExpression(IFormatter formatter, SizeOfExpression expression)
    { formatter.Write("sizeof(");
      WriteTypeReference(formatter, expression.Type);
      formatter.Write(")");
    }

    protected override void WriteSwitchStatement(IFormatter formatter, SwitchStatement statement)
    { formatter.Write("case ");
      this.WriteExpression(formatter, statement.Expression);
      formatter.Write(" of");
      formatter.WriteLine();
      formatter.WriteIndent();

      foreach (SwitchCase switchCase in statement.Cases)
      { this.WriteExpression(formatter, switchCase.TestExpression);
        formatter.Write(": begin");
        formatter.WriteIndent();
        formatter.WriteLine();
        this.WriteStatementList(formatter, switchCase.Statements);
        formatter.WriteOutdent();
        formatter.Write("end;");
        formatter.WriteLine();
      }

      formatter.WriteOutdent();
      formatter.Write("end");
    }

    protected override void WriteGotoStatement(IFormatter formatter, GotoStatement statement)
    { formatter.Write("goto ");
      formatter.Write(statement.Label.Label);
    }

    protected override void WriteLabeledStatement(IFormatter formatter, LabeledStatement statement)
    { formatter.WriteOutdent();
      formatter.WriteBold(statement.Label);
      formatter.Write(":");
      formatter.WriteLine();
      formatter.WriteIndent();
      if (statement.Statement != null)
        this.WriteStatementInternal(formatter, statement.Statement);
    }

    protected override void WriteArrayCreateExpression(IFormatter formatter, ArrayCreateExpression expression)
    { if (expression.Initializers.Count > 0)
      { if ((expression.CreateType.Type.IsArray) && (expression.CreateType.Type.GetArrayRank() == 0))
          formatter.Write("array of ");
        this.WriteTypeReference(formatter, expression.CreateType);
        formatter.Write(" = (");
        formatter.WriteLine();
        formatter.WriteIndent();
        // Use newLineBetweenItems to fix bug 33100
        this.WriteExpressionList(formatter, expression.Initializers, true);
        formatter.WriteOutdent();
        formatter.Write(")");
      }
      else
      { formatter.Write(" array[0..");
        if (expression.SizeExpression != null)
          this.WriteExpression(formatter, expression.SizeExpression);
        else
          formatter.Write(expression.Size.ToString(CultureInfo.InvariantCulture));
        formatter.Write("-1] of ");
        this.WriteTypeReference(formatter, expression.CreateType);
      }
    }

    protected override void WriteBaseReferenceExpression(IFormatter formatter, BaseReferenceExpression expression)
    { formatter.Write("inherited ");
    }

    protected override void WriteAsTypeExpression(IFormatter formatter, AsTypeExpression expression)
    { formatter.Write("(");
      this.WriteExpression(formatter, expression.Expression);
      formatter.Write(" as ");
      this.WriteTypeReference(formatter, expression.TargetType);
      formatter.Write(")");
    }

    protected override void WriteCastExpression(IFormatter formatter, CastExpression expression)
    { this.WriteTypeReference(formatter, expression.TargetType);
      formatter.Write("(");
      this.WriteExpression(formatter, expression.Expression);
      formatter.Write(")");
    }

    protected override void WriteConditionExpression(IFormatter formatter, ConditionExpression expression)
    { // MISSING
      formatter.Write("(");
      this.WriteExpression(formatter, expression.Condition);
      formatter.Write(" ? ");
      this.WriteExpression(formatter, expression.TrueExpression);
      formatter.Write(" : ");
      this.WriteExpression(formatter, expression.FalseExpression);
      formatter.Write(")");
    }

    protected override void WriteDelegateCreateExpression(IFormatter formatter, DelegateCreateExpression expression)
    { // DONE
      formatter.Write(" ");
      this.WriteTypeReference(formatter, expression.DelegateType);
      formatter.Write(".Create");
      formatter.Write("(");
      this.WriteExpression(formatter, expression.Target);
      formatter.Write(".");
      this.WriteReference(formatter, expression.Method.Name, MethodInformation.GetText(expression.Method, this), expression.Method, true);
      formatter.Write(")");
    }

    protected override void WriteFieldReferenceExpression(IFormatter formatter, FieldReferenceExpression expression)
    { bool escape = true;
      if (expression.Target != null)
      { this.WriteExpression(formatter, expression.Target);
        if (!(expression.Target is BaseReferenceExpression)) // no dot for "inherited"
          formatter.Write(".");
        escape = false;
      }

      FieldInfo fieldInfo = expression.Field;
      this.WriteReference(formatter, fieldInfo.Name, FieldInformation.GetText(fieldInfo, this), fieldInfo, escape);
    }

    protected override void WriteArgumentReferenceExpression(IFormatter formatter, ArgumentReferenceExpression expression)
    { this.WriteReference(formatter, expression.ParameterName, "Parameter", null, true);
    }

    protected override void WriteVariableReferenceExpression(IFormatter formatter, VariableReferenceExpression expression)
    { this.WriteReference(formatter, expression.Variable.Name, "Local Variable", null, true);
    }

    protected override void WriteIndexerExpression(IFormatter formatter, IndexerExpression expression)
    { this.WriteExpression(formatter, expression.Target);
      formatter.Write("[");

      bool first = true;
      foreach (Expression index in expression.Indices)
      { if (first)
          first = false;
        else
          formatter.Write(", ");
        this.WriteExpression(formatter, index);
      }
      formatter.Write("]");
    }

    protected override void WriteArrayIndexerExpression(IFormatter formatter, ArrayIndexerExpression expression)
    { this.WriteExpression(formatter, expression.Target);
      formatter.Write("[");
      bool first = true;
      foreach (Expression index in expression.Indices)
      { if (first)
          first = false;
        else
          formatter.Write(", ");
        this.WriteExpression(formatter, index);
      }
      formatter.Write("]");
    }

    protected override void WriteMethodInvokeExpression(IFormatter formatter, MethodInvokeExpression expression)
    { this.WriteMethodReferenceExpression(formatter, expression.Method);
      if (expression.Parameters.Count>0)
      { formatter.Write("(");
        this.WriteExpressionList(formatter, expression.Parameters, false);
        formatter.Write(")");
      }
    }

    protected override void WriteMethodReferenceExpression(IFormatter formatter, MethodReferenceExpression expression)
    { bool escape = true;
      if (expression.Target != null)
      { escape = false;
        if (expression.Target is BinaryOperatorExpression)
        { formatter.Write("(");
          this.WriteExpression(formatter, expression.Target);
          formatter.Write(")");
        }
        else
          this.WriteExpression(formatter, expression.Target);
        if (!(expression.Target is BaseReferenceExpression)) // no dot for "inherited"
          formatter.Write(".");
      }

      MethodBase methodBase = expression.Method;
      this.WriteReference(formatter, methodBase.Name, MethodInformation.GetText(methodBase, this), methodBase, escape);
    }

    protected override void WriteEventReferenceExpression(IFormatter formatter, EventReferenceExpression expression)
    { bool escape = true;
      if (expression.Target != null)
      { escape = false;
        this.WriteExpression(formatter, expression.Target);
        if (!(expression.Target is BaseReferenceExpression)) // no dot for "inherited"
          formatter.Write(".");
      }

      EventInfo eventInfo = expression.Event;
      this.WriteReference(formatter, eventInfo.Name, EventInformation.GetText(eventInfo, this), eventInfo, escape);
    }

    protected override void WriteDelegateInvokeExpression(IFormatter formatter, DelegateInvokeExpression expression)
    { if (expression.Target != null)
        this.WriteExpression(formatter, expression.Target);
      if (expression.Parameters.Count>0)
      { formatter.Write("(");
        this.WriteExpressionList(formatter, expression.Parameters, false);
        formatter.Write(")");
      }
    }

    protected override void WriteObjectCreateExpression(IFormatter formatter, ObjectCreateExpression expression)
    { this.WriteTypeReference(formatter, expression.CreateType);
      formatter.Write(".Create");
      if (expression.Parameters.Count>0)
      { formatter.Write("(");
        this.WriteExpressionList(formatter, expression.Parameters, false);
        formatter.Write(")");
      }
    }

    protected override void WriteDirectionExpression(IFormatter formatter, DirectionExpression expression)
    { switch (expression.Direction)
      { case FieldDirection.In: break;
        case FieldDirection.Out: formatter.Write("out "); break;
        case FieldDirection.Ref: formatter.Write("ref "); break;
      }
      this.WriteExpression(formatter, expression.Expression);
    }

    protected override void WritePrimitiveExpression(IFormatter formatter, PrimitiveExpression expression)
    { if (expression.Value is char)
        switch ((char) expression.Value)
        { case '\r': formatter.Write("#13"); break;
          case '\t': formatter.Write("#9");  break;
          case '\'': formatter.Write("\'\'\'\'"); break;
          case '\0': formatter.Write("#0");  break;
          case '\n': formatter.Write("#10"); break;
          default:   formatter.Write("\'");
                     formatter.Write(expression.Value.ToString());
                     formatter.Write("\'");
                     break;
        }
      else
        if (expression.Value is string) {
          formatter.Write("\'");
          formatter.Write((string) expression.Value);
          formatter.Write("\'");
        }
        else
          base.WritePrimitiveExpression(formatter, expression);
    }

    protected override void WritePropertyReferenceExpression(IFormatter formatter, PropertyReferenceExpression expression)
    { bool escape = true;
      if (expression.Target != null)
      { escape = false;
        this.WriteExpression(formatter, expression.Target);
        if (!(expression.Target is BaseReferenceExpression)) // no dot for "inherited"
          formatter.Write(".");
      }

      PropertyInfo propertyInfo = expression.Property;
      this.WriteReference(formatter, propertyInfo.Name, PropertyInformation.GetText(propertyInfo, this), propertyInfo, escape);
    }

    protected override void WritePropertySetValueReferenceExpression(IFormatter formatter, PropertySetValueReferenceExpression expression)
    { formatter.Write("value");
    }

    protected override void WriteThisReferenceExpression(IFormatter formatter, ThisReferenceExpression expression)
    { formatter.Write("Self");
    }

    protected override void WriteTypeReferenceExpression(IFormatter formatter, TypeReferenceExpression expression)
    { this.WriteTypeReference(formatter, expression.Type);
    }

    protected override void WriteTypeOfExpression(IFormatter formatter, TypeOfExpression expression)
    { formatter.Write("typeof(");
      this.WriteTypeReference(formatter, expression.Type);
      formatter.Write(")");
    }

    protected override void WriteSingle(IFormatter formatter, Single value)
    { formatter.Write(value.ToString(CultureInfo.InvariantCulture));
    }

    protected override void WriteDouble(IFormatter formatter, Double value)
    { formatter.Write(value.ToString("R", CultureInfo.InvariantCulture));
    }

    protected override void WriteDecimal(IFormatter formatter, Decimal value)
    { formatter.Write(value.ToString(CultureInfo.InvariantCulture));
    }

    protected override void WriteTypeReference(IFormatter formatter, TypeReference typeReference)
    { this.Type(formatter, typeReference.Type);
    }

    protected override void WriteDeclaration(IFormatter formatter, string name)
    { formatter.WriteBold((Array.IndexOf(this.keywords, name) != -1) ? ("&" + name) : name);
    }

    protected override void WriteReference(IFormatter formatter, string name, string toolTip, object reference, bool escape)
    { string text = name;
      if (name.Equals(".ctor"))
        text = "Create";
      if (name.Equals("..ctor"))
        text = "{Class} Create";
      if (escape) {
        if (Array.IndexOf(this.keywords, name) != -1)
          text = "&" + name;
      }
      formatter.WriteReference(text, toolTip, reference);
    }

    protected override void WriteNull(IFormatter formatter)
    { formatter.Write("nil");
    }

    private string[] keywords = new string[] {
      "and",            "array",         "as",           "asm",
      "begin",          "case",          "class",        "const",
      "constructor",    "destructor",    "dispinterface","div",
      "do",             "downto",        "else",         "end",
      "except",         "exports",       "file",         "finalization",
      "finally",        "for",           "function",     "goto",
      "if",             "implementation","in",           "inherited",
      "initialization", "inline",        "interface",    "is",
      "label",          "library",       "mod",          "nil",
      "not",            "object",        "of",           "or",
      "out",            "packed",        "procedure",    "program",
      "property",       "raise",         "record",       "repeat",
      "resourcestring", "set",           "shl",          "shr",
      "string",         "then",          "threadvar",    "to",
      "try",            "type",          "unit",         "until",
      "uses",           "var",           "while",        "with",
      "xor"
    };
  }

}
