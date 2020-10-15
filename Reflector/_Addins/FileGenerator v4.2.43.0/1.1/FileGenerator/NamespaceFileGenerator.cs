using Reflector;
using Reflector.CodeModel;
using System;
using System.Threading;

namespace Viktor.AddIn.FileGenerator
{
    internal sealed class NamespaceFileGenerator : FileGenerator
	{
        public override event FileCreatedEventHandler FileCreated;
        
        private INamespace baseNamespace;

        private NamespaceFileGenerator() : base() {}

        public NamespaceFileGenerator(string directory, INamespace baseNamespace, IVisitor visitor, ILanguage language) : 
            base(directory, visitor, language)
        {
            this.CheckNamespace(baseNamespace);
        }

        public NamespaceFileGenerator(string directory, INamespace baseNamespace, IVisitor visitor, ILanguage language, ManualResetEvent cancelEvent) : 
            base(directory, visitor, language, cancelEvent)
        {
            this.CheckNamespace(baseNamespace);
        }

        private void CheckNamespace(INamespace baseNamespace)
        {
            if(baseNamespace == null)
            {
                throw new ArgumentNullException("baseNamespace");
            }

            this.baseNamespace = baseNamespace;
            this.typeCount = baseNamespace.Types.Count;
        }

        public override FileGenerationResultCollection Generate()
        {
            FileGenerationResultCollection results = new FileGenerationResultCollection();

            foreach(ITypeDeclaration typeDeclaration in this.baseNamespace.Types)
            {
                IFileGenerator typeGenerator = new TypeFileGenerator(this.directory, typeDeclaration, this.visitor, this.language); 
                FileCreatedEventHandler fileCreatedHandler = new FileCreatedEventHandler(this.OnFileGenerated);

                try
                {
                    typeGenerator.FileCreated += fileCreatedHandler;
                    results.Add(typeGenerator.Generate());
                }
                finally
                {
                    typeGenerator.FileCreated -= fileCreatedHandler;
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
