using System;
using System.Runtime.Remoting.Contexts;
using System.Runtime.Remoting.Messaging;

namespace ContextBoundAspects
{
	/// <summary>
	/// The ExceptionContextProperty defines the necessary methods to create a server object sink
	/// that will handle the exception management.  This object can be changed to exist context-wide
	/// or as an envoy sink.  Refer to .NET documentation for details on how to accomplish that task.
	/// </summary>
	[Serializable()]
	public class ExceptionContextProperty : IContextProperty, IContributeObjectSink
	{
		#region IContextProperty Members

		/// <summary>
		/// Defined by the IContextProperty interface.  This method is called when no more information
		/// should be added to the context.
		/// </summary>
		/// <param name="ctx">
		/// Ignored.
		/// </param>
		public void Freeze(Context ctx)
		{
			// Do not add any more context properties to the context.
		}

		/// <summary>
		/// Defined by the IContextProperty interface.  Always returns true to signal that the current
		/// context is OK for the automatic exception handling to run.
		/// </summary>
		/// <param name="ctx">
		/// Ignored.
		/// </param>
		/// <returns>
		/// A boolean value.
		/// </returns>
		public Boolean IsNewContextOK(Context ctx)
		{
			// Always return true
			return true;
		}

		/// <summary>
		/// Defined by the IContextProperty interface.  Returns a string indicating the name of
		/// the property that this class represents.
		/// </summary>
		public String Name
		{
			get { return "ExceptionContextProperty"; }
		}

		#endregion

		#region IContributeObjectSink Members

		/// <summary>
		/// Defined by the IContributeObjectSink interface.  This method is called when the server
		/// object sink chain is created and the sink needs to be added.
		/// </summary>
		/// <param name="mro">
		/// Ignored.
		/// </param>
		/// <param name="next">
		/// The next sink in the chain.
		/// </param>
		/// <returns>
		/// An IMessageSink that is to be added to the server object sink chain.
		/// </returns>
		public IMessageSink GetObjectSink(MarshalByRefObject mro, IMessageSink next)
		{
			return new ExceptionContextSink(next);
		}

		#endregion
	}
}