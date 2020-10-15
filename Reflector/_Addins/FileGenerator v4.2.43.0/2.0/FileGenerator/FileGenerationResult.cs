using System;

namespace Viktor.AddIn.FileGenerator
{
	internal sealed class FileGenerationResult
	{
		private const string ErrorEmptyMessage = "The message must contain information.";
		private const string ErrorEmptyMethodSource = "The method source must contain information.";
		private const string ErrorEmptyTypeName = "The type name must contain information.";

        private string message;
        private string methodSource;
        private string typeName;

		internal FileGenerationResult(string typeName, string message, string methodSource) : base()
		{
			if(typeName == null)
			{
				throw new ArgumentNullException("typeName");
			}
			else if(typeName.Trim().Length == 0)
			{
				throw new ArgumentException(ErrorEmptyTypeName, "typeName");
			}

			if(message == null)
			{
				throw new ArgumentNullException("message");
			}
			else if(message.Trim().Length == 0)
			{
				throw new ArgumentException(ErrorEmptyMessage, "message");
			}
		
			if(methodSource == null)
			{
				throw new ArgumentNullException("methodSource");
			}
			else if(methodSource.Trim().Length == 0)
			{
				throw new ArgumentException(ErrorEmptyMethodSource, "methodSource");
			}

			this.typeName = typeName;
			this.message = message;
			this.methodSource = methodSource;
		}

		public string Message
		{
			get
			{
				return this.message;
			}
		}
	
		public string MethodSource
		{
			get
			{
				return this.methodSource;
			}
		}

        public string TypeName
        {
            get
            {
                return this.typeName;
            }
        }
    }
}
