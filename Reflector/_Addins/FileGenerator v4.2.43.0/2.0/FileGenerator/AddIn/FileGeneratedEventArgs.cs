using System;

namespace FileGenerator.AddIn
{
	internal sealed class FileGeneratedEventArgs : EventArgs
	{
		private const string ErrorEmptyFileName = "The given file name must contain information.";

		private string fileName = string.Empty;

		internal FileGeneratedEventArgs(string fileName) : base()
		{
			if(fileName == null)
			{
				throw new ArgumentNullException("fileName");
			}
			
			if(fileName.Length == 0)
			{
				throw new ArgumentException(ErrorEmptyFileName, "fileName");
			}

			this.fileName = fileName;
		}

		public string FileName
		{
			get
			{
				return this.fileName;
			}
		}
	}
}
