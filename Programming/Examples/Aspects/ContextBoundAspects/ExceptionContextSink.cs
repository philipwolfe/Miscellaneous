using System;
using System.Diagnostics;
using System.Reflection;
using System.Runtime.Remoting.Messaging;

namespace ContextBoundAspects
{
	/// <summary>
	/// The ExceptionContextSink is responsible for performing the bulk of the work associated with
	/// handling exceptions at the context-level.  When handling the exception, the sink checks the
	/// method's attributes for an attribute of type ExceptionMethodContextAttribute.  The properties
	/// of that attribute, if present, are checked for certain information to determine what steps
	/// can be taken.
	/// </summary>
	public class ExceptionContextSink : IMessageSink
	{
		/// <summary>
		/// We have to store a reference to the next sink in the sink chain.
		/// </summary>
		protected IMessageSink _NextSink;

		/// <summary>
		/// The default constructor is marked as protected to avoid having other classes call it.  This
		/// forces callers to be aware that the class expects a sink.  Whether or not they provide it
		/// is completely up to them.
		/// </summary>
		protected ExceptionContextSink()
		{
		}

		/// <summary>
		/// The constructor that all classes creating an instance of this must use.  The internal 
		/// member variable that references the next sink in the chain will be setup.
		/// </summary>
		/// <param name="next">
		/// The next sink in the sink chain.
		/// </param>
		public ExceptionContextSink(IMessageSink next)
		{
			_NextSink = next;
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
			// Get the return message by passing the processing down the chain.
			IMessage msgRet = _NextSink.SyncProcessMessage(msg);

			// Cast the return message to a ReturnMessage object.
			IMethodReturnMessage rmReturn = (IMethodReturnMessage) msgRet;

			// Keep processing only if the return message has an exception associated with it.
			if (rmReturn.Exception != null) HandleMessageException(rmReturn);

			// Pass the message back up the chain.
			return msgRet;
		}

		/// <summary>
		/// Defined by the IMessageSink interface.  Asynchronously processes the given message.
		/// </summary>
		/// <param name="msg">
		/// The message to process.
		/// </param>
		/// <param name="replySink">
		/// The reply sink for the reply message.
		/// </param>
		/// <returns>
		/// Returns an IMessageCtrl interface that provides a way to control asynchronous 
		/// messages after they have been dispatched.
		/// </returns>
		public IMessageCtrl AsyncProcessMessage(IMessage msg, IMessageSink replySink)
		{
			// Create a delegate reference to the callback function that will handle async calls.
			AsyncExceptionContextSink.AsyncExceptionDelegate aed =
				new AsyncExceptionContextSink.AsyncExceptionDelegate(AsyncCallback);

			// Create a new AsyncExceptionContextSink object to act as the reply sink.
			replySink = (IMessageSink) new AsyncExceptionContextSink(replySink, aed);

			// Pass the call on to the next sink in the chain.
			return _NextSink.AsyncProcessMessage(msg, replySink);
		}

		#endregion

		/// <summary>
		/// Defined by the IMessageSink interface.  Synchronously processes the given message for
		/// an asynchronous server call.
		/// </summary>
		/// <param name="msg">
		/// The message to process.
		/// </param>
		/// <returns>
		/// A reply message in response to the request.
		/// </returns>
		public IMessage AsyncCallback(IMessage msg)
		{
			// Cast the return message to a ReturnMessage object.
			IMethodReturnMessage rmReturn = (IMethodReturnMessage) msg;

			// Keep processing only if the return message has an exception associated with it.
			if (rmReturn.Exception != null) HandleMessageException(rmReturn);

			// Pass the message back up the chain.
			return msg;
		}

		/// <summary>
		/// A helper function that retrieves custom method attributes and handles a return method 
		/// exception based on the custom attribute properties.
		/// </summary>
		/// <param name="msgRet">
		/// The return message information that contains the exception to handle.
		/// </param>
		protected void HandleMessageException(IMethodReturnMessage msgRet)
		{
			// Get the method information for the method that was originally called.
			Type calledType = Type.GetType(msgRet.TypeName);
			MethodInfo calledMethod = calledType.GetMethod(msgRet.MethodName);

			// Retrieve the ExceptionMethodContextAttribute attribute, if present.  Do not search 
			// down to the base class for inherited attributes.
			Object[] customAttributes = calledMethod.GetCustomAttributes(
				typeof (ExceptionMethodContextAttribute), false);

			// Skip out if the attribute does not exist for the method.
			if (customAttributes.Length == 0) return;

			// Perform a casting operation to get the type that we need to check.
			Debug.Assert(customAttributes[0].GetType() == typeof (ExceptionMethodContextAttribute));
			ExceptionMethodContextAttribute emca = (ExceptionMethodContextAttribute) customAttributes[0];

			// Write to the event log if attributed to do so.
			if (emca.WriteToEventLog)
			{
				EventLog.WriteEntry("Application", String.Format("Exception thrown: {0}",
				                                                 msgRet.Exception.ToString()));
			}

			// Remove the exception from the return message if attributed to do so.
			if (emca.SwallowException)
			{
				// WARNING: This uses reflection to wipe out a reference in a private variable.  Since
				// the variable is not documented, it could change in future releases of the .NET
				// Framework.  As much as I wanted to get around having to do this, I could not find
				// any other way at this time.
				Type rmType = Type.GetType("System.Runtime.Remoting.Messaging.ReturnMessage");
				FieldInfo rmException = rmType.GetField("_e", BindingFlags.NonPublic | BindingFlags.Instance);
				if (rmException != null) rmException.SetValue(msgRet, null);

				// Update the default return value when the exception is swallowed using reflection.
				FieldInfo rmReturnValue = rmType.GetField("_ret", BindingFlags.NonPublic | BindingFlags.Instance);
				if (rmReturnValue != null) rmReturnValue.SetValue(msgRet, emca.ExceptionReturnValue);
			}
		}
	}
}