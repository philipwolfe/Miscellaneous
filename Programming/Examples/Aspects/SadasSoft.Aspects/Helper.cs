using System;
using System.Reflection;
using System.IO;
using SadasSof.Aspects.Attributes;

namespace SadasSof.Aspects
{

	public  class Helper
	{
		public static Type[] GetParameterTypes( MethodInfo method )
		{
			if(method==null)
				return null;
			ParameterInfo[] pIColl = method.GetParameters();

			Type[] t = new Type[pIColl.Length];


			int i=0;
			foreach(ParameterInfo pI in pIColl)
			{
				t[i] = pI.ParameterType;
				i++;
			}

			return t;
		}


        public static MethodInfo GetMethodFromType(Type type, MethodBase methodBase) 
		{           
			MethodInfo method = type.GetMethod(methodBase.Name);            
			
			return method;            
		}


		public static AspectAttribute[] AspectUnion (object[] obj)
		{

			AspectAttribute[] aAC=new AspectAttribute[obj.Length];

			int i=0;
			foreach(AspectAttribute aA in obj)
			{
				aAC[i]=aA;
				i++;
			}
			return aAC;
		
		}

		public static  void SaveToFile(string name, string message, string adit, string path)
		{
			
			try
			{


				FileStream file = new FileStream(path, FileMode.OpenOrCreate, FileAccess.Write);
            
	
				StreamWriter sw = new StreamWriter(file);
				
				
				sw.Write(adit);
				sw.Write("\n\n-------------------------------------\n\n");
				sw.Write(name + " - "+ System.DateTime.Now.ToLocalTime());
				sw.Write(sw.NewLine);
				sw.Write(message);
				sw.Write(sw.NewLine);
				sw.Close();


				// Close file
				file.Close();
	
			}
			catch(Exception ex)
			{
				string s= ex.Message;
				throw;
			}


		}

		public static string ReadFile(string path)
		{
			string s= string.Empty;
			FileStream file=null;
			StreamReader sr=null;
			try
			{
				file = new FileStream(path, FileMode.OpenOrCreate, FileAccess.Read);

				sr = new StreamReader(file);


				s = sr.ReadToEnd();

				sr.Close();

				file.Close();
			}
			catch
			{
			}

			return s;

		}

		
	}
}
