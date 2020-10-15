using Reflector;
using Reflector.CodeModel;
using Reflector.CodeModel.Memory;
using System;
using System.IO;

namespace Viktor.AddIn.FileGenerator
{
	internal sealed class TypeFileGenerator : FileGenerator 
	{
		public override event FileCreatedEventHandler FileCreated;

		private const string CilLanguageName = "IL";

		private ITypeDeclaration baseType;
		private string fullTypeName = string.Empty;

		private TypeFileGenerator() : base() {}

		public TypeFileGenerator(string directory, ITypeDeclaration baseType, IVisitor visitor, ILanguage language) : 
			base(directory, visitor, language)
		{
			this.CheckType(baseType);
		}

		private void CheckType(ITypeDeclaration baseType)
		{
			if(baseType == null)
			{
				throw new ArgumentNullException("baseType");
			}

			this.baseType = baseType;
			this.typeCount = 1;
			this.fullTypeName = (new TypeInformation(this.baseType)).NameWithResolutionScope;
		}

		private void CreateFile(IFormatter formatter)
		{
			string typeFullFileName = string.Empty;
			string typeFileName = this.fullTypeName.Replace("<", string.Empty).Replace(">", string.Empty);

			try
			{
				typeFullFileName = Path.Combine(this.directory, 
					string.Format("{0}{1}", typeFileName, 
					this.language.FileExtension));
			}
			catch(ArgumentException)
			{
				typeFullFileName = Path.Combine(this.directory, 
					string.Format("{0}{1}", Guid.NewGuid().ToString("N"), 
					this.language.FileExtension));
			}

			try
			{
				using(StreamWriter typeFile = new StreamWriter(typeFullFileName))
				{
					typeFile.Write(formatter.ToString());
					if(FileCreated != null)
					{
						FileCreated(this, new FileGeneratedEventArgs(typeFullFileName));
					}		
				}
			}
			catch(Exception) {}
		}

        override public FileGenerationResultCollection Generate()
        {
            FileGenerationResultCollection results = new FileGenerationResultCollection();
            ILanguageConfiguration languageConfiguration = new LanguageConfiguration();
            IFormatter formatter = new TextFormatter();
            ILanguageWriter writer = this.language.GetWriter(formatter, languageConfiguration);

            try
            {
                if(this.language.Name != CilLanguageName)
                {
                    this.baseType = this.visitor.VisitTypeDeclaration(this.baseType);
                }

                if(this.baseType.Namespace != null && this.baseType.Namespace.Length > 0)
                {
                    INamespace typeNamespace = new Namespace();
                    typeNamespace.Name = this.baseType.Namespace;

                    typeNamespace.Types.Add(this.baseType);
                    writer.WriteNamespace(typeNamespace);
                }
                else
                {
                    writer.WriteTypeDeclaration(this.baseType);
                }

                this.CreateFile(formatter);
            }
            catch(Exception ex)
            {
                results.Add(new FileGenerationResult(this.fullTypeName, ex.Message, ex.TargetSite.ToString()));
            }

            return results;
        }

		private class LanguageConfiguration : ILanguageConfiguration
		{
			private IVisibilityConfiguration visibilityConfiguration;

			public LanguageConfiguration()
			{
				this.visibilityConfiguration = new VisibilityConfiguration();
			}

			public bool ShowNamespaceTypes
			{
				get
				{
					return true;
				}
			}

			public IVisibilityConfiguration Visibility
			{
				get
				{
					return this.visibilityConfiguration; 
				}
			}

			public bool ShowNamespaceImports
			{
				get
				{
					return true;
				}
			}

			public bool ShowMethodBodies
			{
				get
				{
					return true;
				}
			}

			public bool ShowTypeMembers
			{
				get
				{
					return true;
				}
			}

			public bool ShowCustomAttributes
			{
				get
				{
					return true;
				}
			}

			public bool SortAlphabetically
			{
				get
				{
					return true;
				}
			}

			private class VisibilityConfiguration : IVisibilityConfiguration
			{
				public VisibilityConfiguration()
				{
				}

				public bool Private
				{
					get
					{
						return true;
					}
				}

				public bool FamilyOrAssembly
				{
					get
					{
						return true;
					}
				}

				public bool Family
				{
					get
					{
						return true;
					}
				}

				public bool Assembly
				{
					get
					{
						return true;
					}
				}

				public bool FamilyAndAssembly
				{
					get
					{
						return true;
					}
				}

				public bool Public
				{
					get
					{
						return true;
					}
				}
			}
		}
	}
}
