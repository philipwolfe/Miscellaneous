using Reflector;
using Reflector.CodeModel;
using System;
using System.Collections.Generic;
using System.Threading;

namespace FileGenerator.AddIn.Generators
{
	internal sealed class NamespaceFileGenerator : FileGenerator<INamespace>
	{
		public override event FileCreatedEventHandler FileCreated;

		internal NamespaceFileGenerator(FileGeneratorContext<INamespace> context)
			: base(context)
		{
			base.typeCount = this.context.Item.Types.Count;
		}

		public override List<Exception> Generate()
		{
			List<Exception> results = new List<Exception>();

			if (this.context.Item.Types != null && this.context.Item.Types.Count > 0)
			{
				IAssembly assembly = ((IModule)this.context.Item.Types[0].Owner).Assembly;
				base.InitializeProject(assembly);

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
			}

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
