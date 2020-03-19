using System;
using System.Runtime.Remoting.Activation;
using System.Runtime.Remoting.Contexts;

namespace ContextBoundAspects
{
	/// <summary>
	/// The ExceptionContextAttribute attribute should be applied to classes that wish to have 
	/// automatic exception handling for method calls.  The attribute is only responsible for
	/// pushing to load to the ExceptionContextProperty object which creates the sink that runs
	/// as a server object sink.  Only classes that derive from ContextBoundObject can use this
	/// attribute.
	/// </summary>
	[AttributeUsage(AttributeTargets.Class)]
	public class ExceptionContextAttribute : Attribute, IContextAttribute
	{
		#region IContextAttribute Members

		/// <summary>
		/// Defined by the IContextAttribute interface.  Assigns properties to the new
		/// context.  In this case, a new ExceptionContextProperty object.
		/// </summary>
		/// <param name="ccm">
		/// The construction call message headed for the context bound object that this
		/// attribute is applied to.
		/// </param>
		public void GetPropertiesForNewContext(IConstructionCallMessage ccm)
		{
			// Add the context property
			ccm.ContextProperties.Add(new ExceptionContextProperty());
		}

		/// <summary>
		/// Defined by the IContextAttribute interface.  Checks to make sure that
		/// the current context is OK for the sink.
		/// </summary>
		/// <param name="ctx">
		/// The context whose properties are to be checked.
		/// </param>
		/// <param name="ccm">
		/// Ignored.
		/// </param>
		/// <returns>
		/// A boolean value.
		/// </returns>
		public Boolean IsContextOK(Context ctx, IConstructionCallMessage ccm)
		{
			// Return a boolean value based on whether or not the context currently
			// defines the ExceptionContextProperty key.
			return (ctx.GetProperty("ExceptionContextProperty") != null);
		}

		#endregion
	}
}