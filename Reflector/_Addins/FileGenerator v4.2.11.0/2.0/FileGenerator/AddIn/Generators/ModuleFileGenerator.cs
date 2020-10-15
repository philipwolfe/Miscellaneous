using Reflector;
using Reflector.CodeModel;
using System;
using System.Collections.Generic;
using System.Threading;

namespace FileGenerator.AddIn.Generators
{
	internal sealed class ModuleFileGenerator : FileGenerator<IModule>
	{
		public override event FileCreatedEventHandler FileCreated;

		internal ModuleFileGenerator(FileGeneratorContext<IModule> context)
			: base(context)
		{
			this.typeCount = this.context.Item.Types.Count;
		}

		public override List<Exception> Generate()
		{
			List<Exception> results = new List<Exception>();
			base.InitializeProject(this.context.Item.Assembly);

			foreach (ITypeDeclaration typeDeclaration in this.context.Item.Types)
			{
				IFileGenerator typeGenerator = new TypeFileGenerator(
					new FileGeneratorContext<ITypeDeclaration>(
					typeDeclaration, this.context.Directory, this.context.Language,
					this.context.Translator, this.context.Cancel,
					this.context.CreateSubdirectories, this.context.CreateVsNetProject));
				FileCreatedEventHandler fileCreatedHandler = new FileCreatedEventHandler(this.OnFileGenerated);

				try
				{
					typeGenerator.FileCreated += fileCreatedHandler;
					results.AddRange(typeGenerator.Generate());
				}
				finally
				{
					typeGenerator.FileCreated -= fileCreatedHandler;
				}

				if (this.context.Cancel.WaitOne(FileGeneratorFactory.EventWaitTime, false) == true)
				{
					break;
				}
			}

			base.SaveProject(this.context.Item.Name);
			return results;
		}

		private void OnFileGenerated(object sender, FileGeneratedEventArgs e)
		{
			base.AddGeneratedFileToCompileElement(e.FileName);

			if (this.FileCreated != null)
			{
				this.FileCreated(this, e);
			}
		}
	}
}
