using Reflector;
using Reflector.CodeModel;
using System;
using System.Threading;

namespace Viktor.AddIn.FileGenerator
{
	internal sealed class AssemblyFileGenerator : FileGenerator
	{
		public override event FileCreatedEventHandler FileCreated;

		private IAssembly baseAssembly;

		private AssemblyFileGenerator() : base() {}

		public AssemblyFileGenerator(string directory, IAssembly baseAssembly, IVisitor visitor, ILanguage language) : 
			base(directory, visitor, language)
		{
			this.CheckAssembly(baseAssembly);
		}

		public AssemblyFileGenerator(string directory, IAssembly baseAssembly, IVisitor visitor, ILanguage language, ManualResetEvent cancelEvent) : 
			base(directory, visitor, language, cancelEvent)
		{
			this.CheckAssembly(baseAssembly);
		}

		private void CheckAssembly(IAssembly baseAssembly)
		{
			if(baseAssembly == null)
			{
				throw new ArgumentNullException("baseAssembly");
			}

			this.baseAssembly = baseAssembly;

			foreach(IModule module in this.baseAssembly.Modules)
			{
				this.typeCount += module.Types.Count;
			}
		}

		override public FileGenerationResultCollection Generate()
		{
			FileGenerationResultCollection results = new FileGenerationResultCollection();

			foreach(IModule module in this.baseAssembly.Modules)
			{
				IFileGenerator moduleGenerator;

				if(this.cancelEvent != null)
				{
					moduleGenerator = new ModuleFileGenerator(this.directory, module, this.visitor, this.language, this.cancelEvent); 
				}
				else
				{
					moduleGenerator = new ModuleFileGenerator(this.directory, module, this.visitor, this.language); 
				}

				FileCreatedEventHandler fileCreatedHandler = new FileCreatedEventHandler(this.OnFileGenerated);

				try
				{
					moduleGenerator.FileCreated += fileCreatedHandler;
					results.Add(moduleGenerator.Generate());
				}
				finally
				{
					moduleGenerator.FileCreated -= fileCreatedHandler;
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
