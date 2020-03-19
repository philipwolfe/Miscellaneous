// Reflection based managed IL Reader example
// Copyright (C) 2000-2002 Lutz Roeder. All rights reserved.
// http://www.aisto.com/roeder
// ******@aisto.com

namespace ILReader
{
	using System;
	using System.Reflection;
	using System.Reflection.Emit;
	using System.Reflection.ILReader;
	
	class Example
	{
		public static void Main(String[] args)
		{
			Type type = (args.Length > 0) ? Type.GetType(args[0]) : typeof(Object);
			Console.WriteLine(type.ToString());	
	    
			ILReader reader = new ILReader(type.Module, new AssemblyLoader());
			foreach (MethodBase methodBase in type.GetMethods(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.Instance | BindingFlags.DeclaredOnly))
			{
				Console.WriteLine("------------------------------------------------------------------------");
				Console.WriteLine(methodBase.ToString());      	
				MethodBody methodBody = reader.GetMethodBody(methodBase);      	
				if (methodBody == null) 
					Console.WriteLine("EMPTY");
				else
					Dump(methodBody);
			}
	    
			reader.Dispose();
		}
	  	
		public static void Dump(MethodBody methodBody)
		{
			Console.WriteLine("// Code Size: ", methodBody.CodeSize + " Bytes");	
	
			Console.Write(".maxstack " + methodBody.MaxStack);
			Console.WriteLine();
	
			// Local variables
			Type[] locals = methodBody.Locals;
			if ((locals != null) && (locals.Length > 0))
			{
				Console.Write(".locals (");
				for (int i = 0; i < locals.Length; i++)
				{
					Console.Write(locals[i].ToString());
					Console.Write(" ");
					Console.Write("V_" + i);
					if (i != (locals.Length - 1)) Console.Write(", ");
				}
	      
				Console.Write(")");
				Console.WriteLine();
			}
	
			// Exception handlers
			ExceptionHandler[] exceptions = methodBody.Exceptions;
			if (exceptions != null)
			{
				foreach (ExceptionHandler handler in exceptions)
				{
					Console.Write(".try");
					Console.Write(" ");
					Console.Write("L_" + handler.Try.Offset.ToString("x4"));
					Console.Write(" ");
					Console.Write("to");
					Console.Write(" ");
					Console.Write("L_" + (handler.Try.Offset + handler.Try.Length).ToString("x4"));
					Console.Write(" ");
	
					if (handler is Catch)
					{
						Console.Write("catch");
						Console.Write(" ");
						Catch catchHandler = (Catch) handler;
						Console.Write(catchHandler.Type.ToString());
					}
	
					if (handler is Filter)
					{
						Console.Write("filter");
						Console.Write(" ");
						Filter filterHandler = (Filter) handler;
						Console.Write("L_" + filterHandler.Expression.ToString("x4"));
					}
	
					if (handler is Finally) Console.Write("finally");
					if (handler is Fault) Console.Write("fault");
	
					Console.Write(" ");
					Console.Write("L_" + handler.Handler.Offset.ToString("x4"));
					Console.Write(" ");
					Console.Write("to");
					Console.Write(" ");
					Console.Write("L_" + (handler.Handler.Offset + handler.Handler.Length).ToString("x4"));
					Console.WriteLine();   
				}
			}
	
			// Instructions
			foreach (Instruction instruction in methodBody)
			{
				OpCode opCode = instruction.OpCode;
				Object operand = instruction.Operand;
				Byte[] operandData = instruction.OperandData;
	
				Console.Write("L_" + instruction.Offset.ToString("x4") + ": ");
				Console.Write(opCode.Name);
				Console.Write(" ");
	
				if (operand != null)
				{
					switch (opCode.OperandType)
					{
						case OperandType.InlineNone:
							break;
	  
						case OperandType.ShortInlineBrTarget:
						case OperandType.InlineBrTarget:
							int target = (int) operand;
							Console.Write("L_" + target.ToString("x4"));
							break;
	
						case OperandType.ShortInlineI:
						case OperandType.InlineI:
						case OperandType.InlineI8:
						case OperandType.ShortInlineR:
						case OperandType.InlineR:
							Console.Write(operand.ToString());
							break;
	
						case OperandType.InlineString:
							Console.Write("\"" + operand.ToString() + "\"");
							break;
	
						case OperandType.ShortInlineVar:
						case OperandType.InlineVar:
							if (operand is int)
								Console.Write("V_" + operand.ToString());
							else if (operand is ParameterInfo)
							{
								ParameterInfo parameterInfo = (ParameterInfo) operand;
								Console.Write((parameterInfo.Name != null) ? parameterInfo.Name : ("A_" + parameterInfo.Position));
							}
							break;
	
						case OperandType.InlineSwitch:
							Console.Write("(");
							int[] targets = (int[]) operand;
							for (int i = 0; i < targets.Length; i++)
							{
								if (i != 0) Console.Write(", ");
								Console.Write("L_" + targets[i].ToString("x4"));  
							}
							Console.Write(")");
							break;
	
						case OperandType.InlineSig:
						case OperandType.InlineMethod:
						case OperandType.InlineField:
						case OperandType.InlineType:
						case OperandType.InlineTok:
							if (operand is Type)
								Console.Write((Type) operand);
							else if (operand is MemberInfo)
							{
								MemberInfo memberInfo = (MemberInfo) operand;
								if (memberInfo.DeclaringType != null)
								{
									Console.Write(memberInfo.DeclaringType);
									Console.Write("::");
								}
								Console.Write(memberInfo);
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
						Console.Write("null");
						Console.Write(" // " + instruction.OpCode.OperandType + " ");
						foreach (Byte b in operandData) Console.Write(b.ToString("X2") + " ");
					}
				}      
	   	  
				Console.WriteLine();
			}
		}

		class AssemblyLoader : IAssemblyLoader
		{
			public Assembly Load(string assemblyName)
			{
				return Assembly.Load(assemblyName);	
			}
			
			public Assembly LoadFrom(string fileName)
			{
				return Assembly.LoadFrom(fileName);
			}
		}
	}
}
