//#define SaveDLL

using System;
using System.Reflection;
using System.Reflection.Emit;
using SadasSof.Aspects.Attributes;



namespace SadasSof.Aspects
{

	
	public  delegate object MethodCall(object target, 
	MethodBase method, 
	object[] parameters, 
	AspectAttribute[] attributes );

	public class CodeInjection
	{

		public  const string assemblyName = "TempAssemblyInjection";

		public  const string className   = "TempClassInjection";


		/// <summary>
		/// Create a instance of our external type
		/// </summary>
		/// <param name="target">External type instance</param>
		/// <param name="interfaceType">Decorate interface methods with attributes</param>
		/// <returns>Intercepted type</returns>
		public static object Create(object target, Type interfaceType)
		{
			Type proxyType= EmiProxyType(target.GetType(),interfaceType);

			return Activator.CreateInstance(proxyType , new object[]{target,interfaceType});
		}


		private static TypeBuilder typeBuilder;

		private static FieldBuilder target, iface;
		
		/// <summary>
		/// Generate proxy type emiting IL code.
		/// </summary>
		/// <param name="targetType"></param>
		/// <param name="interfaceType"></param>
		/// <returns></returns>
		private static Type EmiProxyType( Type targetType, Type interfaceType )
		{

			AssemblyBuilder myAssemblyBuilder;
			// Get the current application domain for the current thread.
			AppDomain myCurrentDomain =System.Threading.Thread.GetDomain();
			AssemblyName myAssemblyName = new AssemblyName();
			myAssemblyName.Name = assemblyName;
			
		

			//Only save the custom-type dll while debugging
			#if SaveDLL && DEBUG
				myAssemblyBuilder = myCurrentDomain.DefineDynamicAssembly(myAssemblyName,AssemblyBuilderAccess.RunAndSave);
			ModuleBuilder modBuilder = myAssemblyBuilder.DefineDynamicModule(className,"Test.dll");
			#else
			myAssemblyBuilder = myCurrentDomain.DefineDynamicAssembly(myAssemblyName,AssemblyBuilderAccess.Run);
			ModuleBuilder modBuilder = myAssemblyBuilder.DefineDynamicModule(className);
			#endif
			

			Type type = modBuilder.GetType(assemblyName + "__Proxy" + interfaceType.Name + targetType.Name);
 

			if(type==null)
				{
					typeBuilder= modBuilder.DefineType(
						assemblyName + "__Proxy" + interfaceType.Name + targetType.Name,
						TypeAttributes.Class | TypeAttributes.Public,targetType.BaseType,
						new Type[]{interfaceType} );

					target = typeBuilder.DefineField("target",interfaceType,FieldAttributes.Private);

					iface = typeBuilder.DefineField("iface",typeof(Type),FieldAttributes.Private);
				
					EmitConstructor(typeBuilder, target, iface);

					MethodInfo[] methods = interfaceType.GetMethods();

					foreach(MethodInfo m in methods)
						EmitProxyMethod(m, typeBuilder);


				type=typeBuilder.CreateType();

				}


			#if SaveDLL && DEBUG
			myAssemblyBuilder.Save("Test.dll");
			#endif

			return type;
		}

		/// <summary>
		/// Generate the method emiting IL Code 
		/// </summary>
		/// <param name="m">External method info</param>
		/// <param name="typeBuilder">TypeBuilder needed to generate proxy type using IL code</param>
		private static void EmitProxyMethod(MethodInfo m, TypeBuilder typeBuilder)
		{
			Type[] paramTypes = Helper.GetParameterTypes(m);

			MethodBuilder mb = typeBuilder.DefineMethod(m.Name,
				MethodAttributes.Public | MethodAttributes.Virtual, 
				m.ReturnType,
				paramTypes);

			ILGenerator il = mb.GetILGenerator();

	
			LocalBuilder parameters = il.DeclareLocal(typeof(object[]));
			il.Emit(OpCodes.Ldc_I4, paramTypes.Length);
			il.Emit(OpCodes.Newarr, typeof(object));
			il.Emit(OpCodes.Stloc, parameters);
			for (int i=0; i<paramTypes.Length; i++)
			{
				il.Emit(OpCodes.Ldloc,parameters);
				il.Emit(OpCodes.Ldc_I4, i);
				il.Emit(OpCodes.Ldarg, i+1);
				if (paramTypes[i].IsValueType)
					il.Emit(OpCodes.Box, paramTypes[i]);
				il.Emit(OpCodes.Stelem_Ref);
			}
			
			il.EmitCall(OpCodes.Callvirt,
				typeof(CodeInjection).GetProperty("InjectHandler").
				GetGetMethod(),null);

			
			//Parameter 1  object targetObject
			il.Emit(OpCodes.Ldarg_0);
			il.Emit(OpCodes.Ldfld, (FieldInfo)target);
	
			il.Emit(OpCodes.Ldarg_0);
			il.Emit(OpCodes.Ldfld, (FieldInfo)target);
			
			il.EmitCall(OpCodes.Call, typeof(object).GetMethod("GetType"),null);
			il.EmitCall(OpCodes.Call, typeof(MethodBase).
				GetMethod("GetCurrentMethod"), null);
			//Parameter 2 MethodBase method
			il.EmitCall(OpCodes.Call,
				typeof(Helper).GetMethod("GetMethodFromType"), null);
			//Parameter 3  object[] parameters
			il.Emit(OpCodes.Ldloc,parameters);
			
			il.Emit(OpCodes.Ldarg_0);
			il.Emit(OpCodes.Ldfld, (FieldInfo)iface);
			il.EmitCall(OpCodes.Call,
				typeof(MethodBase).GetMethod("GetCurrentMethod"), null);
			il.EmitCall(OpCodes.Call,
				typeof(Helper).GetMethod("GetMethodFromType"), null);
			
			il.Emit(OpCodes.Ldtoken,typeof(AspectAttribute));
			il.Emit(OpCodes.Call, typeof(Type).GetMethod("GetTypeFromHandle"));
			
			il.Emit(OpCodes.Ldc_I4,1);
			il.EmitCall(OpCodes.Callvirt,
				typeof(MethodInfo).GetMethod("GetCustomAttributes",
				new Type[] { typeof(Type), typeof (bool) }), null);
		
			//Parameter 4  AspectAttribute[] aspects
			il.EmitCall(OpCodes.Callvirt,
				typeof(Helper).GetMethod("AspectUnion"), null);
			
			il.EmitCall(OpCodes.Callvirt,
				typeof(MethodCall).GetMethod("Invoke"),null);
			
			if (m.ReturnType == typeof(void))
				il.Emit(OpCodes.Pop);
			else if (m.ReturnType.IsValueType)
			{
				il.Emit(OpCodes.Unbox, m.ReturnType);
				il.Emit(OpCodes.Ldind_Ref);
			}
			il.Emit(OpCodes.Ret);





		}


		/// <summary>
		/// Generate the contructor of our proxy type
		/// </summary>
		/// <param name="typeBuilder">TypeBuilder needed to generate proxy type using IL code</param>
		/// <param name="target">Proxy type target</param>
		/// <param name="iface">Proxy type interface </param>
		private static void EmitConstructor(TypeBuilder typeBuilder,FieldBuilder target,FieldBuilder iface)
		{
			

			Type objType = Type.GetType("System.Object"); 
			ConstructorInfo objCtor = objType.GetConstructor(new Type[0]);

			ConstructorBuilder pointCtor = typeBuilder.DefineConstructor(
				MethodAttributes.Public,
				CallingConventions.Standard,
				new Type[]{typeof(object),typeof(Type)});
			ILGenerator ctorIL = pointCtor.GetILGenerator();
 

			ctorIL.Emit(OpCodes.Ldarg_0);


			ctorIL.Emit(OpCodes.Call, objCtor);


			ctorIL.Emit(OpCodes.Ldarg_0);
			ctorIL.Emit(OpCodes.Ldarg_1);
			ctorIL.Emit(OpCodes.Stfld, target); 


			ctorIL.Emit(OpCodes.Ldarg_0);
			ctorIL.Emit(OpCodes.Ldarg_2);
			ctorIL.Emit(OpCodes.Stfld, iface);

			ctorIL.Emit(OpCodes.Ret);
		}


		public static MethodCall InjectHandler 
		{
			get{return new MethodCall(InjectHandlerMethod);}
		}


		/// <summary>
		/// Injection handler
		/// </summary>
		/// <param name="target">Target type witch will be intercepted</param>
		/// <param name="method">Methot to intercept</param>
		/// <param name="parameters">Addtional parameters</param>
		/// <param name="attributes">Attributes decore</param>
		/// <returns></returns>
		public static object InjectHandlerMethod(object target, 
												 MethodBase method, 
												 object[] parameters, 
												 AspectAttribute[] attributes )
		{

			object returnValue = null;

			foreach(AspectAttribute b in attributes)
					if(b is BeforeAttribute)
						b.Action(target,method,parameters,null);

			try
			{
				 returnValue = 
					target.GetType().GetMethod(method.Name).Invoke(target,parameters);
			}
			catch(Exception ex)
			{
				foreach(AspectAttribute b in attributes)
					if(b is LogExceptionAttribute)
						b.Action(target,method,parameters,ex);
				throw;
			}
			

			foreach(AspectAttribute a in attributes)
				if(a is AfterAttribute)
					a.Action(target,method,parameters,returnValue);

		return returnValue;
		}
	}
}
