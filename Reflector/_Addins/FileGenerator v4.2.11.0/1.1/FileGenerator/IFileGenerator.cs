using System;

namespace Viktor.AddIn.FileGenerator
{
	internal delegate void FileCreatedEventHandler(object sender, FileGeneratedEventArgs e);

	internal interface IFileGenerator
	{
		event FileCreatedEventHandler FileCreated;

		FileGenerationResultCollection Generate();
		
        int TypeCount
		{
			get;
		}
	}
}
