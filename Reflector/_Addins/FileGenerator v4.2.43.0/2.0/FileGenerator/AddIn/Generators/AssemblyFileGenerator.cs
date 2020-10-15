using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.Build.BuildEngine;
using Reflector.CodeModel;
using Reflector.CodeModel.Memory;

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
				typeCount += module.Types.Count;
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
					context.Directory, resource.Name);

				using (BinaryWriter resourceFile = new BinaryWriter(
					File.Create(resourceFileName)))
				{
					resourceFile.Write(resource.Value);
					AddResourceToBuild(resource, resourceFileName, resources);

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
				ILanguageWriter writer = context.Language.GetWriter(
					formatter, languageWriterConfiguration);
				writer.WriteResource(resource);

				string resourceFileName = Path.Combine(
					context.Directory, resource.Name);

				using (StreamWriter resourceFile = new StreamWriter(resourceFileName))
				{
					resourceFile.Write(formatter.ToString());
					AddResourceToBuild(resource, resourceFileName, resources);

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
			if (context.Item.Resources != null && context.Item.Resources.Count > 0)
			{
				BuildItemGroup embeddedResources = project.AddNewItemGroup();

				foreach (IResource resource in context.Item.Resources)
				{
					try
					{
						if (resource is FileResource)
						{
							SaveFileResource((FileResource) resource, embeddedResources);
						}
						else if (resource is EmbeddedResource)
						{
							SaveEmbeddedResource((EmbeddedResource) resource, embeddedResources);
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
			if (context.Item.Attributes.Count > 0)
			{
				IFormatter formatter = null;

				try
				{
					formatter = new TextFormatter();
					ILanguageWriterConfiguration languageWriterConfiguration =
						new LanguageWriterConfiguration();
					ILanguageWriter writer = context.Language.GetWriter(
						formatter, languageWriterConfiguration);
					writer.WriteAssembly(context.Item);

					string attributesFileName = Path.Combine(
						context.Directory, "GeneratedAssemblyInfo" +
						                   context.Language.FileExtension);

					using (StreamWriter attributesFile = new StreamWriter(attributesFileName))
					{
						attributesFile.Write(formatter.ToString());
						AddGeneratedFileToCompileElement(attributesFileName);

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
						              context.Item.Name), fileException);
				}
			}
		}

		public override List<Exception> Generate()
		{
			List<Exception> results = new List<Exception>();

			base.InitializeProject(context.Item);
			InitializeEmbeddedResourcesGroup(results);

			try
			{
				GenerateAssemblyAttributesFile();
			}
			catch (FileGenerationException exception)
			{
				results.Add(exception);
			}

			foreach (IModule module in context.Item.Modules)
			{
				IFileGenerator moduleGenerator = new ModuleFileGenerator(
					new FileGeneratorContext<IModule>(module,
					                                  context.Directory, context.Language,
					                                  context.Translator, context.Cancel,
					                                  context.CreateSubdirectories, context.CreateVsNetProject));

				FileCreatedEventHandler fileCreatedHandler = new FileCreatedEventHandler(OnFileGenerated);

				try
				{
					moduleGenerator.FileCreated += fileCreatedHandler;
					results.AddRange(moduleGenerator.Generate());
				}
				finally
				{
					moduleGenerator.FileCreated -= fileCreatedHandler;
				}

				if (context.Cancel.WaitOne(FileGeneratorFactory.EventWaitTime, false) == true)
				{
					break;
				}
			}

			base.SaveProject(context.Item.Name);
			return results;
		}

		private void OnFileGenerated(object sender, FileGeneratedEventArgs e)
		{
			base.AddGeneratedFileToCompileElement(e.FileName);

			if (FileCreated != null)
			{
				FileCreated(this, e);
			}
		}
	}
}