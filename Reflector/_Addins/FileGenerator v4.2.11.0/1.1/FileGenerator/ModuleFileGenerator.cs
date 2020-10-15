using Reflector;
using Reflector.CodeModel;
using System;
using System.Threading;

namespace Viktor.AddIn.FileGenerator
{
	internal sealed class ModuleFileGenerator : FileGenerator
	{
		public override event FileCreatedEventHandler FileCreated;

		private IModule baseModule;

		private ModuleFileGenerator() : base() {}

		public ModuleFileGenerator(string directory, IModule baseModule, IVisitor visitor, ILanguage language) : 
			base(directory, visitor, language)
		{
			this.CheckModule(baseModule);
		}

		public ModuleFileGenerator(string directory, IModule baseModule, IVisitor visitor, ILanguage language, ManualResetEvent cancelEvent) : 
			base(directory, visitor, language, cancelEvent)
		{
			this.CheckModule(baseModule);
		}

		private void CheckModule(IModule baseModule)
		{
			if(baseModule == null)
			{
				throw new ArgumentNullException("baseModule");
			}

			this.baseModule = baseModule;
			this.typeCount = baseModule.Types.Count;
		}

		override public FileGenerationResultCollection Generate()
		{
			FileGenerationResultCollection results = new FileGenerationResultCollection();

			foreach(ITypeDeclaration typeDeclaration in this.baseModule.Types)
			{
				IFileGenerator typeGenerator = new TypeFileGenerator(this.directory, typeDeclaration, this.visitor, this.language); 
				FileCreatedEventHandler fileCreatedHandler = new FileCreatedEventHandler(this.OnFileGenerated);

				try
				{
					typeGenerator.FileCreated += fileCreatedHandler;
					results.Add(typeGenerator.Generate());
				}
				finally
				{
					typeGenerator.FileCreated -= fileCreatedHandler;
				}

				if(this.cancelEvent != null && this.cancelEvent.WaitOne(FileGenerator.EventWaitTime, false) == true)
				{
					break;
				}
			}

			return results;
		}

        private void OnFileGenerated(object sender, FileGeneratedEventArgs e)
        {
            if(this.FileCreated != null)
            {
                this.FileCreated(this, e);
            }		
        }
	}
}
