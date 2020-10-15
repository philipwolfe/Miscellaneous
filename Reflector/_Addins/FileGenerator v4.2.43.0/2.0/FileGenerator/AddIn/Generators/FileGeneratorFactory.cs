using Reflector;
using Reflector.CodeModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;

namespace FileGenerator.AddIn.Generators
{
	internal static class FileGeneratorFactory
	{
		private const string ErrorInvalidActiveItem = "The active item is not supported for file generation.";
		internal const int EventWaitTime = 1;

		internal static IFileGenerator Create(object activeItem, string directory, ITranslator visitor, ILanguage language, ManualResetEvent cancel, bool createSubdirectories, bool createVsNetProject)
		{
			IFileGenerator generator;

			if (activeItem is IAssembly)
			{
				generator = new AssemblyFileGenerator(
					new FileGeneratorContext<IAssembly>(
					(IAssembly)activeItem, directory, language, 
					visitor, cancel, createSubdirectories, createVsNetProject, true));
			}
			else if (activeItem is IModule)
			{
				generator = new ModuleFileGenerator(
					new FileGeneratorContext<IModule>(
					(IModule)activeItem, directory, language,
					visitor, cancel, createSubdirectories, createVsNetProject, true));
			}
			else if (activeItem is INamespace)
			{
				generator = new NamespaceFileGenerator(
					new FileGeneratorContext<INamespace>(
					(INamespace)activeItem, directory, language,
					visitor, cancel, createSubdirectories, createVsNetProject, true));
			}
			else if (activeItem is ITypeDeclaration)
			{
				generator = new TypeFileGenerator(
					new FileGeneratorContext<ITypeDeclaration>(
					(ITypeDeclaration)activeItem, directory, language,
					visitor, cancel, createSubdirectories, createVsNetProject, true));
			}
			else
			{
				throw new ArgumentException(ErrorInvalidActiveItem, "activeItem");
			}

			return generator;
		}
	}
}
