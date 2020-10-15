using System;

namespace Viktor.AddIn.FileGenerator
{
	internal sealed class FileGenerationResult
	{
        private string message;
        private string methodSource;
        private string typeName;

		private FileGenerationResult() : base() {}

		public FileGenerationResult(string typeName, string message, string methodSource) : this()
		{
			if(typeName == null)
			{
				throw new ArgumentNullException("typeName");
			}
			else if(typeName.Trim().Length == 0)
			{
				throw new ArgumentException("The type name must contain information.", "typeName");
			}

			if(message == null)
			{
				throw new ArgumentNullException("message");
			}
			else if(message.Trim().Length == 0)
			{
				throw new ArgumentException("The message must contain information.", "message");
			}
		
			if(methodSource == null)
			{
				throw new ArgumentNullException("methodSource");
			}
			else if(methodSource.Trim().Length == 0)
			{
				throw new ArgumentException("The method source must contain information.", "methodSource");
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
