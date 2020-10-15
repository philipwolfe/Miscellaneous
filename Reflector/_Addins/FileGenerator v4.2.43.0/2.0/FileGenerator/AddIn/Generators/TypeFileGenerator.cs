using Reflector;
using Reflector.CodeModel;
using Reflector.CodeModel.Memory;
using System;
using System.Collections.Generic;
using System.IO;

namespace FileGenerator.AddIn.Generators
{
	internal sealed class TypeFileGenerator : FileGenerator<ITypeDeclaration>
	{
		public override event FileCreatedEventHandler FileCreated;

		private string fullTypeName = string.Empty;

		internal TypeFileGenerator(FileGeneratorContext<ITypeDeclaration> context)
			: base(context)
		{
			this.fullTypeName = this.context.Item.Namespace + "." + this.context.Item.Name;
			this.typeCount = 1;
		}

		private string RemoveInvalidCharacters(string data)
		{
			// TODO - 1/14/2006 - This feels awkward - is there a better way to 
			// cleanse a file path with bad characters?
			return data.Replace('/', '_').Replace('\\', '_').Replace(':', '_')
				 .Replace('*', '_').Replace('?', '_').Replace('"', '_')
				 .Replace('<', '_').Replace('>', '_').Replace('|', '_');
		}

		private void CreateFile(IFormatter formatter)
		{
			// TODO - 1/17/2006 - If the file exists...do we overwrite it, or 
			// create a new file? The issue deals with obfuscation and type names
			// being the same, yet...is that an old file, or one created before with the
			// same name? Maybe type handles could be used...

			string fileName = this.RemoveInvalidCharacters(
					this.fullTypeName);

			if (fileName.StartsWith("."))
			{
				fileName = fileName.Substring(1);
			}

			if (this.context.CreateSubdirectories)
			{
				fileName = fileName.Replace('.', '\\');
			}

			fileName = Path.Combine(this.context.Directory,
				string.Format("{0}{1}", fileName,
				this.context.Language.FileExtension));

			string filePath = Path.GetDirectoryName(fileName);

			if (Directory.Exists(filePath) == false)
			{
				Directory.CreateDirectory(filePath);
			}

			try
			{
				using (StreamWriter typeFile = new StreamWriter(fileName))
				{
					typeFile.Write(formatter.ToString());

					if (this.context.CreateVsNetProject)
					{
						base.AddGeneratedFileToCompileElement(fileName);
					}

					if (FileCreated != null)
					{
						FileCreated(this, new FileGeneratedEventArgs(fileName));
					}
				}
			}
			catch (Exception fileException)
			{
				throw new FileGenerationException(
					string.Format("Could not generate a file for type {0}",
					this.fullTypeName), fileException);
			}
		}

		private IFormatter GetFormatter()
		{
			IFormatter formatter = null;

			try
			{
				formatter = new TextFormatter();
				ILanguageWriterConfiguration languageWriterConfiguration =
						  new LanguageWriterConfiguration();
				ILanguageWriter writer = this.context.Language.GetWriter(
						  formatter, languageWriterConfiguration);

				this.context.Item = this.context.Translator.TranslateTypeDeclaration(
					this.context.Item);

				// NOTE - 1/18/2006 - This is done to ensure all of the
				// type information is written, esp. if namespace information is present.
				if (this.context.Item.Namespace != null && this.context.Item.Namespace.Length > 0)
				{
					INamespace typeNamespace = new Namespace();
					typeNamespace.Name = this.context.Item.Namespace;

					typeNamespace.Types.Add(this.context.Item);
					writer.WriteNamespace(typeNamespace);
				}
				else
				{
					writer.WriteTypeDeclaration(this.context.Item);
				}
			}
			catch (Exception fileException)
			{
				throw new FileGenerationException(
					string.Format("Could not generate a file for type {0}",
					this.fullTypeName), fileException);
			}

			return formatter;
		}

		public override List<Exception> Generate()
		{
			List<Exception> results = new List<Exception>();
			IAssembly assembly = ((IModule)this.context.Item.Owner).Assembly;

			base.InitializeProject(assembly);

			try
			{
				IFormatter formatter = this.GetFormatter();
				this.CreateFile(formatter);
			}
			catch (Exception exception)
			{
				results.Add(exception);
			}

			base.SaveProject(this.context.Item.Name);

			return results;
		}
	}
}
