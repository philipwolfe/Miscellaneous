using System;
using System.Reflection;
using System.Collections;
using System.Collections.Specialized;
using System.Data;
using System.IO;
using System.Threading;

namespace SadasSof.Aspects.Attributes
{
	[AttributeUsage(AttributeTargets.Method | AttributeTargets.Property |
	 AttributeTargets.Interface, Inherited = true)]
	public abstract class AspectAttribute : Attribute
	{
		public abstract object Action(object target, MethodBase method, object[] parameters, object result);
	}

	public abstract class BeforeAttribute : AspectAttribute
	{
	}

	public abstract class AfterAttribute : AspectAttribute
	{
	}

	public abstract class LogExceptionAttribute : AspectAttribute
	{
	}


	public class LoggerExceptionToFile : LogExceptionAttribute
	{
		string pathInternal = @"c:\logException.txt";

		public LoggerExceptionToFile(string path)
		{
			pathInternal = path;

		}

		public LoggerExceptionToFile()
		{
		}

		public override object Action(object target, MethodBase method, object[] parameters, object result)
		{
			string namePrincipal = Thread.CurrentPrincipal.Identity.Name;
			if (namePrincipal == string.Empty)
				namePrincipal = "Anonymous User";

			namePrincipal = "User: " + namePrincipal;

			string text = "Assambly: " + target.ToString() +
			"\nMethod: " + method.Name +
			"\n\nInnerException: " + ((Exception)result).InnerException;

			string content = SadasSof.Aspects.Helper.ReadFile(pathInternal);

			try
			{
				SadasSof.Aspects.Helper.SaveToFile(namePrincipal, text, content, pathInternal);
			}
			catch
			{
				throw;
			}

			return null;
		}
	}


	public class LoggerToFile : BeforeAttribute
	{
		string pathInternal = @"c:\log.txt";

		public LoggerToFile(string path)
		{
			pathInternal = path;

		}

		public LoggerToFile()
		{
		}

		public override object Action(object target, MethodBase method, object[] parameters, object result)
		{
			string namePrincipal = Thread.CurrentPrincipal.Identity.Name;
			if (namePrincipal == string.Empty)
				namePrincipal = "Anonymous User";

			namePrincipal = "User: " + namePrincipal;

			string text = "Assambly: " + target.ToString() + "\nMethod: " + method.Name;

			string content = SadasSof.Aspects.Helper.ReadFile(pathInternal);

			try
			{
				SadasSof.Aspects.Helper.SaveToFile(namePrincipal, text, content, pathInternal);
			}
			catch
			{
				throw;
			}

			return null;
		}
	}


	public class CountingCalls : BeforeAttribute
	{
		static Hashtable calls;

		public override object Action(object target, MethodBase method, object[] parameters, object result)
		{
			if (calls == null)
				calls = new Hashtable();

			if (calls[method.Name] == null)
				calls[method.Name] = 1;
			else
				calls[method.Name] = ((int)calls[method.Name]) + 1;

			return null;

		}

		public static int Calls(string methodName)
		{

			if (calls == null || calls[methodName] == null)
				return 0;
			else
				return (int)calls[methodName];

		}

		public static void Clear(string methodName)
		{
			if (calls != null && calls[methodName] != null)
				calls[methodName] = 0;
		}
	}


	public class ExternalFilter : AfterAttribute
	{

		public override object Action(object target, MethodBase method, object[] parameters, object result)
		{

			DataRowCollection drC = ((DataSet)result).Tables[0].Rows;


			for (int i = 0; i < drC.Count; i++)
			{
				if (!(bool)drC[i]["External"])
				{
					drC[i].Delete();
					i--;
				}
			}

			((DataSet)result).AcceptChanges();

			return result;

		}




	}




}
