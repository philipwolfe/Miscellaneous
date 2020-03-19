using System.Runtime.Remoting.Messaging;

namespace ContextBoundAspects
{
	/// <summary>
	/// The AsyncExceptionContextSink gets called when an asynchronous method call returns from being
	/// processed by the context-bound object.
	/// </summary>
	public class AsyncExceptionContextSink : IMessageSink
	{
		#region Delegates

		/// <summary>
		/// The delegate that must be implemented in order to get a callback for async processing.
		/// </summary>
		public delegate IMessage AsyncExceptionDelegate(IMessage msg);

		#endregion

		protected AsyncExceptionDelegate _Delegate;

		/// <summary>
		/// Store our protected reference to the next reply sink and the delegate to call when this
		/// sink is called.
		/// </summary>
		protected IMessageSink _NextSink;

		/// <summary>
		/// The default constructor is marked as protected to avoid having other classes call it.  This
		/// forces callers to be aware that the class expects a sink and a delegate.  Whether or not 
		/// they provide it is completely up to them.
		/// </summary>
		protected AsyncExceptionContextSink()
		{
		}

		/// <summary>
		/// The constructor that all classes creating an instance of this must use.  This class should
		/// only be used for handling asynchronous message calls.
		/// </summary>
		/// <param name="next">
		/// The next sink in the sink chain.
		/// </param>
		/// <param name="aed">
		/// The delegate that will be called when an async call returns.
		/// </param>
		public AsyncExceptionContextSink(IMessageSink next, AsyncExceptionDelegate aed)
		{
			_NextSink = next;
			_Delegate = aed;
		}

		#region IMessageSink Members

		/// <summary>
		/// Defined by the IMessageSink interface as a read-only property that returns the internal
		/// reference to the next sink in the sink chain.
		/// </summary>
		public IMessageSink NextSink
		{
			get { return _NextSink; }
		}

		/// <summary>
		/// Defined by the IMessageSink interface.  Synchronously processes the given message.
		/// </summary>
		/// <param name="msg">
		/// The message to process.
		/// </param>
		/// <returns>
		/// A reply message in response to the request.
		/// </returns>
		public IMessage SyncProcessMessage(IMessage msg)
		{
			// Process the message via a delegate call if the delegate is not null.
			if (_Delegate != null) return _Delegate(msg);

			// Otherwise, return the original message.
			return msg;
		}

		/// <summary>
		/// Defined by the IMessageSink interface.  Asynchronously processes the given message.
		/// </summary>
		/// <param name="msg">
		/// Ignored.
		/// </param>
		/// <param name="replySink">
		/// Ignored.
		/// </param>
		/// <returns>
		/// Ignored.
		/// </returns>
		public IMessageCtrl AsyncProcessMessage(IMessage msg, IMessageSink replySink)
		{
			// Return a null reference since this method cannot be called on this object since
			// it is meant to only handle processing of asynchronous message calls.
			return null;
		}

		#endregion
	}
}