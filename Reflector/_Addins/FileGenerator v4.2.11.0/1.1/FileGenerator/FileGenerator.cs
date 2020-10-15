using Reflector;
using Reflector.CodeModel;
using System;
using System.IO;
using System.Threading;

namespace Viktor.AddIn.FileGenerator
{
	internal abstract class FileGenerator : IFileGenerator
	{
		public abstract event FileCreatedEventHandler FileCreated;

		private const string ErrorInvalidActiveItem = "The active item is not supported for file generation.";
		public const int EventWaitTime = 1;

		protected ManualResetEvent cancelEvent;
		protected string directory = string.Empty;
        protected ILanguage language;
        protected int typeCount;
        protected IVisitor visitor;

		protected FileGenerator() : base() {}

		protected FileGenerator(string directory, IVisitor visitor, ILanguage language) : base()
		{
			if(directory == null)
			{
				throw new ArgumentNullException("directory");
			}
			
			if(Directory.Exists(directory) == false)
			{
				throw new DirectoryNotFoundException(string.Format("{0} cannot be found.", directory));
			}

			if(visitor == null)
			{
				throw new ArgumentNullException("visitor");
			}

			if(language == null)
			{
				throw new ArgumentNullException("language");
			}

			this.directory = directory;
			this.visitor = visitor;
			this.language = language;
		}

		protected FileGenerator(string directory, IVisitor visitor, ILanguage language, ManualResetEvent cancelEvent) : 
			this(directory, visitor, language)
		{
			if(cancelEvent == null)
			{
				throw new ArgumentNullException("cancelEvent");
			}

			this.cancelEvent = cancelEvent;
		}

		public static IFileGenerator Create(object activeItem, string directory, IVisitor visitor, ILanguage language)
		{
			IFileGenerator generator;

			if(activeItem is IAssembly)
			{
				generator = new AssemblyFileGenerator(directory, 
					(IAssembly)activeItem, visitor, language);
			}
			else if(activeItem is IModule)
			{
				generator = new ModuleFileGenerator(directory, 
					(IModule)activeItem, visitor, language);
			}
            else if(activeItem is INamespace)
            {
                generator = new NamespaceFileGenerator(directory, 
                    (INamespace)activeItem, visitor, language);
            }
            else if(activeItem is ITypeDeclaration)
			{
				generator = new TypeFileGenerator(directory, 
					(ITypeDeclaration)activeItem, visitor, language);
			}
			else
			{
				throw new ArgumentException(ErrorInvalidActiveItem, "activeItem");
			}

			return generator;
		}

		public static IFileGenerator Create(object activeItem, string directory, IVisitor visitor, ILanguage language, ManualResetEvent cancelEvent)
		{
			IFileGenerator generator;

			if(activeItem is IAssembly)
			{
				generator = new AssemblyFileGenerator(directory, 
					(IAssembly)activeItem, visitor, language, cancelEvent);
			}
			else if (activeItem is IModule)
			{
				generator = new ModuleFileGenerator(directory, 
					(IModule)activeItem, visitor, language, cancelEvent);
			}
            else if(activeItem is INamespace)
            {
                generator = new NamespaceFileGenerator(directory, 
                    (INamespace)activeItem, visitor, language, cancelEvent);
            }
            else if(activeItem is ITypeDeclaration)
			{
				generator = new TypeFileGenerator(directory, 
					(ITypeDeclaration)activeItem, visitor, language);
			}
			else
			{
				throw new ArgumentException(ErrorInvalidActiveItem, "activeItem");
			}

			return generator;
		}

		public abstract FileGenerationResultCollection Generate();

		public int TypeCount
		{
			get
			{
				return this.typeCount;
			}
		}
	}
}
