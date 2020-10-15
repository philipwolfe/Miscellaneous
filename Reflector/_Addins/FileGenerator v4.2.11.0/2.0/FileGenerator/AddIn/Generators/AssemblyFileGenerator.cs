using Microsoft.Build.BuildEngine;
using Reflector;
using Reflector.CodeModel;
using Reflector.CodeModel.Memory;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;

namespace FileGenerator.AddIn.Generators
{
	internal sealed class AssemblyFileGenerator : FileGenerator<IAssembly>
	{
		public override event FileCreatedEventHandler FileCreated;

		internal AssemblyFileGenerator(FileGeneratorContext<IAssembly> context)
			: base(context)
		{
			foreach (IModule module in this.context.Item.Modules)
			{
				this.typeCount += module.Types.Count;
			}
		}

		private void AddResourceToBuild(IResource resource, string resourceFileName, BuildItemGroup resources)
		{
			BuildItem resourceItem = resources.AddNewItem(
				"EmbeddedResource", resourceFileName);

			if (resource.Visibility == ResourceVisibility.Private)
			{
				resourceItem.SetMetadata("Visible", "false");
			}

		}

		private void SaveEmbeddedResource(EmbeddedResource resource, BuildItemGroup resources)
		{
			try
			{
				string resourceFileName = Path.Combine(
					this.context.Directory, resource.Name);

				using (BinaryWriter resourceFile = new BinaryWriter(
					File.Create(resourceFileName)))
				{
					resourceFile.Write(resource.Value);
					this.AddResourceToBuild(resource, resourceFileName, resources);

					if (FileCreated != null)
					{
						FileCreated(this, new FileGeneratedEventArgs(resourceFileName));
					}
				}
			}
			catch (Exception fileException)
			{
				throw new FileGenerationException(
					string.Format("Could not generate an embedded resource file for resource {0}",
					resource.Name), fileException);
			}
		}

		private void SaveFileResource(FileResource resource, BuildItemGroup resources)
		{
			try
			{
				IFormatter formatter = new TextFormatter();
				ILanguageWriterConfiguration languageWriterConfiguration =
						  new LanguageWriterConfiguration();
				ILanguageWriter writer = this.context.Language.GetWriter(
						  formatter, languageWriterConfiguration);
				writer.WriteResource(resource);

				string resourceFileName = Path.Combine(
					this.context.Directory, resource.Name);

				using (StreamWriter resourceFile = new StreamWriter(resourceFileName))
				{
					resourceFile.Write(formatter.ToString());
					this.AddResourceToBuild(resource, resourceFileName, resources);

					if (FileCreated != null)
					{
						FileCreated(this, new FileGeneratedEventArgs(resourceFileName));
					}
				}
			}
			catch (Exception fileException)
			{
				throw new FileGenerationException(
					string.Format("Could not generate a file resource file for resource {0}",
					resource.Name), fileException);
			}
		}

		private void InitializeEmbeddedResourcesGroup(List<Exception> results)
		{
			if (this.context.Item.Resources != null && this.context.Item.Resources.Count > 0)
			{
				BuildItemGroup embeddedResources = this.project.AddNewItemGroup();

				foreach (IResource resource in this.context.Item.Resources)
				{
					try
					{
						if (resource is FileResource)
						{
							this.SaveFileResource((FileResource)resource, embeddedResources);
						}
						else if (resource is EmbeddedResource)
						{
							this.SaveEmbeddedResource((EmbeddedResource)resource, embeddedResources);
						}
					}
					catch (FileGenerationException exception)
					{
						results.Add(exception);
					}
				}
			}
		}

		private void GenerateAssemblyAttributesFile()
		{
			if (this.context.Item.Attributes.Count > 0)
			{
				IFormatter formatter = null;

				try
				{
					formatter = new TextFormatter();
					ILanguageWriterConfiguration languageWriterConfiguration =
							  new LanguageWriterConfiguration();
					ILanguageWriter writer = this.context.Language.GetWriter(
							  formatter, languageWriterConfiguration);
					writer.WriteAssembly(this.context.Item);

					string attributesFileName = Path.Combine(
						this.context.Directory, "GeneratedAssemblyInfo" +
						this.context.Language.FileExtension);

					using (StreamWriter attributesFile = new StreamWriter(attributesFileName))
					{
						attributesFile.Write(formatter.ToString());
						this.AddGeneratedFileToCompileElement(attributesFileName);

						if (FileCreated != null)
						{
							FileCreated(this, new FileGeneratedEventArgs(attributesFileName));
						}
					}
				}
				catch (Exception fileException)
				{
					throw new FileGenerationException(
						string.Format("Could not generate an attributes file for assembly {0}",
						this.context.Item.Name), fileException);
				}
			}
		}

		public override List<Exception> Generate()
		{
			List<Exception> results = new List<Exception>();

			base.InitializeProject(this.context.Item);
			this.InitializeEmbeddedResourcesGroup(results);

			try
			{
				this.GenerateAssemblyAttributesFile();
			}
			catch (FileGenerationException exception)
			{
				results.Add(exception);
			}

			foreach (IModule module in this.context.Item.Modules)
			{
				IFileGenerator moduleGenerator = new ModuleFileGenerator(
					new FileGeneratorContext<IModule>(module,
					this.context.Directory, this.context.Language,
					this.context.Translator, this.context.Cancel,
					this.context.CreateSubdirectories, this.context.CreateVsNetProject));

				FileCreatedEventHandler fileCreatedHandler = new FileCreatedEventHandler(this.OnFileGenerated);

				try
				{
					moduleGenerator.FileCreated += fileCreatedHandler;
					results.AddRange(moduleGenerator.Generate());
				}
				finally
				{
					moduleGenerator.FileCreated -= fileCreatedHandler;
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
