using System;

namespace ContextBoundAspects
{
	/// <summary>
	/// The ExceptionMethodContextAttribute attribute should be applied to methods within a 
	/// ContextBoundObject-derived class that contains the ExceptionContextAttribute attribute so that
	/// the methods can take part in automatic exception handling.
	/// </summary>
	[AttributeUsage(AttributeTargets.Method)]
	public class ExceptionMethodContextAttribute : Attribute
	{
		protected Object _ExceptionReturnValue = null;

		/// <summary>
		/// Internal variables that store the properties associated with the method that
		/// this class attributes.
		/// </summary>
		protected Boolean _SwallowException = false;

		protected Boolean _WriteToEventLog = false;

		/// <summary>
		/// SwallowException should be set to true to avoid having an exception thrown back
		/// to the client.  The default value is false.
		/// </summary>
		public Boolean SwallowException
		{
			get { return _SwallowException; }
			set { _SwallowException = value; }
		}

		/// <summary>
		/// WriteToEventLog should be set to true when it is necessary to log all exceptions
		/// generated on the server-side to the NT event log.  The default value is false.
		/// </summary>
		public Boolean WriteToEventLog
		{
			get { return _WriteToEventLog; }
			set { _WriteToEventLog = value; }
		}

		/// <summary>
		/// ExceptionReturnValue is only used when an exception is swallowed but a value must be 
		/// returned to the client.  The default value is null.
		/// </summary>
		public Object ExceptionReturnValue
		{
			get { return _ExceptionReturnValue; }
			set { _ExceptionReturnValue = value; }
		}
	}
}