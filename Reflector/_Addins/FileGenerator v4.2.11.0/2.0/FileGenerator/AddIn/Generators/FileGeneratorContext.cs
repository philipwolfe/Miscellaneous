using Reflector;
using Reflector.CodeModel;
using System;
using SI = System.IO;
using System.Threading;

namespace FileGenerator.AddIn.Generators
{
	internal sealed class FileGeneratorContext<T>
	{
		private ManualResetEvent cancel;
		private bool createSubdirectories;
		private bool createVsNetProject;
		private string directory;
		private bool isRoot;
		private T item;
		private ILanguage language;
		private ITranslator translator;

		public FileGeneratorContext(T item, string directory, ILanguage language, ITranslator translator, ManualResetEvent cancel, bool createSubdirectories, bool createVsNetProject)
			: this(item, directory, language, translator, cancel, createSubdirectories, createVsNetProject, false) { }

		public FileGeneratorContext(T item, string directory, ILanguage language, ITranslator translator, ManualResetEvent cancel, bool createSubdirectories, bool createVsNetProject, bool isRoot)
		{
			if (directory == null)
			{
				throw new ArgumentNullException("directory");
			}

			if (!SI.Directory.Exists(directory))
			{
				throw new SI.DirectoryNotFoundException(directory + " cannot be found.");
			}

			if (translator == null)
			{
				throw new ArgumentNullException("translator");
			}

			if (language == null)
			{
				throw new ArgumentNullException("language");
			}

			if (cancel == null)
			{
				throw new ArgumentNullException("cancel");
			}

			if (item == null)
			{
				throw new ArgumentNullException("item");
			}

			this.isRoot = isRoot;
			this.item = item;
			this.createSubdirectories = createSubdirectories;
			this.createVsNetProject = createVsNetProject;

			string separator = new string(SI.Path.DirectorySeparatorChar, 1);
			if (directory.EndsWith(separator))
			{
				directory = directory.Substring(0, directory.Length - 1);
			}

			this.directory = directory;
			this.translator = translator;
			this.language = language;
			this.cancel = cancel;
		}

		internal ManualResetEvent Cancel
		{
			get
			{
				return this.cancel;
			}
		}

		internal bool CreateSubdirectories
		{
			get
			{
				return this.createSubdirectories;
			}
		}

		internal bool CreateVsNetProject
		{
			get
			{
				return this.createVsNetProject;
			}
		}

		internal string Directory
		{
			get
			{
				return this.directory;
			}
		}

		internal bool IsRoot
		{
			get
			{
				return this.isRoot;
			}
		}

		internal T Item
		{
			get
			{
				return this.item;
			}
			set
			{
				this.item = value;
			}
		}

		internal ILanguage Language
		{
			get
			{
				return this.language;
			}
		}

		internal ITranslator Translator
		{
			get
			{
				return this.translator;
			}
		}
	}
}
