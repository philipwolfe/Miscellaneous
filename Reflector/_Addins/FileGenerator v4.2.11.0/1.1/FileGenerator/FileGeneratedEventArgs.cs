using System;

namespace Viktor.AddIn.FileGenerator
{
	internal sealed class FileGeneratedEventArgs : EventArgs
	{
		private string fileName = string.Empty;

		private FileGeneratedEventArgs() : base() {}

		public FileGeneratedEventArgs(string fileName) : base()
		{
			if(fileName == null)
			{
				throw new ArgumentNullException("fileName");
			}
			
			if(fileName.Length == 0)
			{
				throw new ArgumentException("The given file name must contain information.", "fileName");
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
