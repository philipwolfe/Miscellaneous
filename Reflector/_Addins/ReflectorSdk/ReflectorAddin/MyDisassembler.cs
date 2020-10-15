// Lutz Roeder's .NET Reflector, SDK Example, January 2001.
// http://www.aisto.com/roeder/dotnet
// roeder@aisto.com
//

// Description:
// Show's how to add a new command to the tools menu of Reflector.

namespace Reflector.AddIn
{
	using System;
	using System.Drawing;
	using System.Reflection;
	using System.Reflection.Emit;
	using System.Windows.Forms;
	using Reflector;
	using Reflector.Browser;
	using Reflector.ComponentModel;
	using Reflector.Disassembler;
	using Reflector.Library;
	using Reflector.Reflection;
	using Reflector.UserInterface;

	internal sealed class MyDisassemblerCommand : Command
	{
		private HtmlFormatterViewer viewer = null;

		private void Panel_Navigate(Object s, MemberEventArgs e)
		{      
			IBrowser browser = (IBrowser) this.Site.GetService(typeof(IBrowser));
			browser.GoToMember(e.Member);
		}
	
		public override bool IsEnabled
		{
			get
			{
				IBrowser browser = (IBrowser) this.Site.GetService(typeof(IBrowser));
				if ((browser == null) || (browser.ActiveNode == null) || (browser.ActiveNode.Value == null))
					return false;
				
				if (!(browser.ActiveNode.Value is MethodBase))
					return false;

				MethodBase methodBase = (MethodBase) browser.ActiveNode.Value;

				// Native, Runtime, OPTIL can not be disassembled
				MethodImplAttributes attributes = methodBase.GetMethodImplementationFlags() & MethodImplAttributes.CodeTypeMask;
				if ((attributes == MethodImplAttributes.Native) || (attributes == MethodImplAttributes.Runtime) || (attributes == MethodImplAttributes.OPTIL))
					return false;

				return true;
			}
		}
	
		public override void Execute()
		{
			if (this.viewer == null)
			{
				this.viewer = new HtmlFormatterViewer();
				this.viewer.Font = new Font("Courier New", 8.25f);
				this.viewer.Dock = DockStyle.Fill;
				this.viewer.Navigate += new MemberEventHandler(Panel_Navigate);
			}
	
			ILanguageManager languageManager = (ILanguageManager) this.Site.GetService(typeof(ILanguageManager));
			ILanguage language = languageManager.ActiveLanguage;
			if (language != null)
			{
				IAssemblyLoader assemblyLoader = (IAssemblyLoader) this.Site.GetService(typeof(IAssemblyLoader));

				IBrowser browser = (IBrowser) this.Site.GetService(typeof(IBrowser));	
				IBrowserNode node = browser.ActiveNode;
				if (node.Value is MethodBase)
				{
					MethodBase methodBase = (MethodBase) node.Value;
	
					Module module = methodBase.DeclaringType.Module;
					if (module != null)
					{
						this.viewer.HtmlFormatter = null;
			
						IToolWindow toolWindow = (IToolWindow) this.Site.GetService(typeof(IToolWindow));
						toolWindow.Open(this.viewer, "Disassembler");

						HtmlFormatter formatter = new HtmlFormatter();
						
						try
						{
							ModuleReader reader = new ModuleReader(module, assemblyLoader);
							MethodBody methodBody = reader.GetMethodBody(methodBase);
							reader = null;
			
							if (methodBody != null)
							{
								if (methodBase.DeclaringType != null)
								{
									language.Type(formatter, methodBase.DeclaringType);
									formatter.Write(".");
								}
								formatter.WriteReference(methodBase.Name, methodBase.Name, methodBase);
								formatter.WriteLine();
								formatter.WriteLine();
								this.Format(formatter, methodBody, language);
							}
							else
							{
								formatter.Write("Method can not be disassembled. Method body is either empty or contains native/optimized instructions.");
							}
						}
						catch (ModuleReaderException exception)
						{
							formatter.WriteBold("Disassembler failed: ");
							formatter.Write(exception.Message);
							formatter.WriteProperty("Stack", exception.StackTrace);
						}
						catch (Exception exception)
						{
							formatter.WriteBold("Unhandled exception: ");
							formatter.Write(exception.Message);
							formatter.WriteProperty("Stack", exception.StackTrace);
						}
			
						viewer.HtmlFormatter = formatter;
					}
				}
			}
		}
	
		private void Format(IFormatter formatter, MethodBody methodBody, ILanguage language)
		{
			formatter.WriteBold(".maxstack " + methodBody.MaxStack);
			formatter.WriteLine();
	
			// Local variables
			Type[] locals = methodBody.GetLocals();
			if ((locals != null) && (locals.Length > 0))
			{
				formatter.WriteBold(".locals (");
				for (int i = 0; i < locals.Length; i++)
				{
					language.Type(formatter, locals[i]);
					formatter.Write(" ");
					formatter.WriteBold("V_" + i);
					if (i != (locals.Length - 1)) formatter.Write(", ");
				}
				formatter.Write(")");
				formatter.WriteLine();
			}
	
			// Exception handlers
			ExceptionHandler[] exceptions = methodBody.GetExceptions();
			if (exceptions != null)
			{
				foreach (ExceptionHandler handler in exceptions)
				{
					formatter.WriteBold(".try");
					formatter.Write(" ");
					formatter.Write("L_" + handler.TryOffset.ToString("x4"));
					formatter.Write(" ");
					formatter.WriteBold("to");
					formatter.Write(" ");
					formatter.Write("L_" + (handler.TryOffset + handler.TryLength).ToString("x4"));
					formatter.Write(" ");
	
					if (handler.Type == ExceptionHandlerType.Catch)
					{
						formatter.WriteBold("catch");
						formatter.Write(" ");
						language.Type(formatter, handler.CatchType);
					}
	
					if (handler.Type == ExceptionHandlerType.Filter)
					{
						formatter.WriteBold("filter");
						formatter.Write(" ");
						formatter.Write("L_" + handler.FilterOffset.ToString("x4"));
					}
	
					if (handler.Type == ExceptionHandlerType.Finally)
					{
						formatter.WriteBold("finally");
					}
					
					if (handler.Type == ExceptionHandlerType.Fault)
					{
						formatter.WriteBold("fault");
					}
	
					formatter.Write(" ");
					formatter.Write("L_" + handler.HandlerOffset.ToString("x4"));
					formatter.Write(" ");
					formatter.WriteBold("to");
					formatter.Write(" ");	
					formatter.Write("L_" + (handler.HandlerOffset + handler.HandlerLength).ToString("x4"));
					formatter.WriteLine();   
				}
			}
	
			// Instructions
			foreach (Instruction instruction in methodBody.GetInstructions())
			{
				OpCode code = instruction.Code;
				Object operand = instruction.Operand;
				Byte[] operandData = instruction.GetOperandData();
	
				formatter.Write("L_" + instruction.Offset.ToString("x4") + ": ");
				formatter.Write(code.Name);
				formatter.Write(" ");
	
				if (operand != null)
				{
					switch (code.OperandType)
					{
						case OperandType.InlineNone:
							break;
		
						case OperandType.ShortInlineBrTarget:
						case OperandType.InlineBrTarget:
							int target = (int) operand;
							formatter.Write("L_" + target.ToString("x4"));
							break;
	
						case OperandType.ShortInlineI:
						case OperandType.InlineI:
						case OperandType.InlineI8:
						case OperandType.ShortInlineR:
						case OperandType.InlineR:
							formatter.Write(operand.ToString());
							break;
	
						case OperandType.InlineString:
							formatter.Write("\"" + operand.ToString() + "\"");
							break;
	
						case OperandType.ShortInlineVar:
						case OperandType.InlineVar:
							if (operand is int)
								formatter.Write("V_" + operand.ToString());
							else if (operand is ParameterInfo)
							{
								ParameterInfo parameterInfo = (ParameterInfo) operand;
								formatter.Write((parameterInfo.Name != null) ? parameterInfo.Name : ("A_" + parameterInfo.Position));
							}
							break;
	
						case OperandType.InlineSwitch:
							formatter.Write("(");
							int[] targets = (int[]) operand;
							for (int i = 0; i < targets.Length; i++)
							{
								if (i != 0) formatter.Write(", ");
								formatter.Write("L_" + targets[i].ToString("x4"));  
							}
							formatter.Write(")");
							break;
	
						case OperandType.InlineSig:
						case OperandType.InlineMethod:
						case OperandType.InlineField:
						case OperandType.InlineType:
						case OperandType.InlineTok:
							if (operand is Type)
							{
								Type type = (Type) operand;
								language.Type(formatter, type);
							}
							else if (operand is MemberInfo)
							{
								MemberInfo memberInfo = (MemberInfo) operand;
								if (memberInfo.DeclaringType != null)
								{
									language.Type(formatter, memberInfo.DeclaringType);
									formatter.Write(".");
								}
								formatter.WriteReference(memberInfo.Name, memberInfo.Name, memberInfo);
							}
							else
								throw new Exception();
							break;
					}
				}
				else
				{
					if (operandData != null)
					{
						formatter.Write("null");
						formatter.Write(" // " + instruction.Code.OperandType + " ");
						foreach (Byte b in operandData) formatter.Write(b.ToString("X2") + " ");
					}
				}      
				
				formatter.WriteLine();
			}
		}
	}
}