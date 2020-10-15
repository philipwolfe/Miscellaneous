using Reflector;
using Reflector.CodeModel;
using System;
using System.Collections;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace Viktor.AddIn.FileGenerator.Controls
{
    public class FileGeneratorControl : System.Windows.Forms.UserControl
    {
        private delegate void FileGenerationCompleteHandler();
        private delegate void FileGeneratedHandler(FileGeneratedEventArgs fileInfo);
        private delegate void SetTargetInformationHandler(object activeItem);
        private delegate void SetupProgressBarHandler(int typeCount);

        private const string FolderDialogDescription = "Select the folder that will contain the code files.";

        private System.Windows.Forms.Label outputDirectoryLabel;
        private System.Windows.Forms.TextBox outputDirectoryText;
        private System.Windows.Forms.Button browseDirectoriesButton;
        private System.Windows.Forms.TextBox fileGenerationStatusText;
        private System.Windows.Forms.ProgressBar fileGenerationProgress;
        private System.ComponentModel.Container components = null;
        private System.Windows.Forms.Button generateFilesButton;
        private System.Windows.Forms.Button cancelGenerationButton;
        private IAssemblyBrowser assemblyBrowser;
        private IServiceProvider serviceProvider;
        private ManualResetEvent cancelEvent;
        private ManualResetEvent completeEvent;
        private int typeCount = 0;
        private int typesGenerated = 0;
        private System.Windows.Forms.Label targetLabel;
        private FileGenerationResultCollection errors;

        public FileGeneratorControl(IServiceProvider serviceProvider) : this()
        {
            this.serviceProvider = serviceProvider;
            this.assemblyBrowser = (IAssemblyBrowser)this.serviceProvider.GetService(typeof(IAssemblyBrowser));
            this.assemblyBrowser.ActiveItemChanged += new EventHandler(OnAssemblyBrowserActiveItemChanged);
        }

        public FileGeneratorControl() : base()
        {
            this.InitializeComponent();
            cancelGenerationButton.Enabled = false;

            try
            {
                using(FolderBrowserDialog folderDialog = new FolderBrowserDialog()) {}
            }
            catch(TypeLoadException)
            {
                this.browseDirectoriesButton.Visible = false;
            }
        }

        protected override void Dispose( bool disposing )
        {
            this.CancelFileGeneration();

            if( disposing )
            {
                if(components != null)
                {
                    components.Dispose();
                }
            }
            base.Dispose( disposing );
        }

        #region Component Designer generated code
        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.outputDirectoryLabel = new System.Windows.Forms.Label();
            this.outputDirectoryText = new System.Windows.Forms.TextBox();
            this.browseDirectoriesButton = new System.Windows.Forms.Button();
            this.fileGenerationStatusText = new System.Windows.Forms.TextBox();
            this.fileGenerationProgress = new System.Windows.Forms.ProgressBar();
            this.generateFilesButton = new System.Windows.Forms.Button();
            this.cancelGenerationButton = new System.Windows.Forms.Button();
            this.targetLabel = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // outputDirectoryLabel
            // 
            this.outputDirectoryLabel.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.outputDirectoryLabel.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((System.Byte)(0)));
            this.outputDirectoryLabel.Location = new System.Drawing.Point(8, 12);
            this.outputDirectoryLabel.Name = "outputDirectoryLabel";
            this.outputDirectoryLabel.Size = new System.Drawing.Size(88, 16);
            this.outputDirectoryLabel.TabIndex = 0;
            this.outputDirectoryLabel.Text = "Output Directory:";
            this.outputDirectoryLabel.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // outputDirectoryText
            // 
            this.outputDirectoryText.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
                | System.Windows.Forms.AnchorStyles.Right)));
            this.outputDirectoryText.Location = new System.Drawing.Point(96, 8);
            this.outputDirectoryText.Name = "outputDirectoryText";
            this.outputDirectoryText.Size = new System.Drawing.Size(224, 21);
            this.outputDirectoryText.TabIndex = 1;
            this.outputDirectoryText.Text = "";
            // 
            // browseDirectoriesButton
            // 
            this.browseDirectoriesButton.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.browseDirectoriesButton.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.browseDirectoriesButton.Location = new System.Drawing.Point(328, 8);
            this.browseDirectoriesButton.Name = "browseDirectoriesButton";
            this.browseDirectoriesButton.TabIndex = 2;
            this.browseDirectoriesButton.Text = "Browse...";
            this.browseDirectoriesButton.Click += new System.EventHandler(this.OnBrowseDirectoriesButtonClick);
            // 
            // fileGenerationStatusText
            // 
            this.fileGenerationStatusText.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
                | System.Windows.Forms.AnchorStyles.Left) 
                | System.Windows.Forms.AnchorStyles.Right)));
            this.fileGenerationStatusText.Location = new System.Drawing.Point(8, 96);
            this.fileGenerationStatusText.MaxLength = 0;
            this.fileGenerationStatusText.Multiline = true;
            this.fileGenerationStatusText.Name = "fileGenerationStatusText";
            this.fileGenerationStatusText.ReadOnly = true;
            this.fileGenerationStatusText.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.fileGenerationStatusText.Size = new System.Drawing.Size(392, 32);
            this.fileGenerationStatusText.TabIndex = 5;
            this.fileGenerationStatusText.Text = "";
            // 
            // fileGenerationProgress
            // 
            this.fileGenerationProgress.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left) 
                | System.Windows.Forms.AnchorStyles.Right)));
            this.fileGenerationProgress.Location = new System.Drawing.Point(8, 136);
            this.fileGenerationProgress.Name = "fileGenerationProgress";
            this.fileGenerationProgress.Size = new System.Drawing.Size(392, 23);
            this.fileGenerationProgress.TabIndex = 6;
            // 
            // generateFilesButton
            // 
            this.generateFilesButton.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.generateFilesButton.Location = new System.Drawing.Point(8, 40);
            this.generateFilesButton.Name = "generateFilesButton";
            this.generateFilesButton.Size = new System.Drawing.Size(88, 23);
            this.generateFilesButton.TabIndex = 3;
            this.generateFilesButton.Text = "Generate Files";
            this.generateFilesButton.Click += new System.EventHandler(this.OnGenerateFilesButtonClick);
            // 
            // cancelGenerationButton
            // 
            this.cancelGenerationButton.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.cancelGenerationButton.Location = new System.Drawing.Point(104, 40);
            this.cancelGenerationButton.Name = "cancelGenerationButton";
            this.cancelGenerationButton.Size = new System.Drawing.Size(88, 23);
            this.cancelGenerationButton.TabIndex = 4;
            this.cancelGenerationButton.Text = "Cancel";
            this.cancelGenerationButton.Click += new System.EventHandler(this.OnCancelGenerationButtonClick);
            // 
            // targetLabel
            // 
            this.targetLabel.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
                | System.Windows.Forms.AnchorStyles.Right)));
            this.targetLabel.Location = new System.Drawing.Point(8, 72);
            this.targetLabel.Name = "targetLabel";
            this.targetLabel.Size = new System.Drawing.Size(392, 16);
            this.targetLabel.TabIndex = 7;
            // 
            // FileGeneratorControl
            // 
            this.Controls.Add(this.targetLabel);
            this.Controls.Add(this.cancelGenerationButton);
            this.Controls.Add(this.generateFilesButton);
            this.Controls.Add(this.fileGenerationProgress);
            this.Controls.Add(this.fileGenerationStatusText);
            this.Controls.Add(this.browseDirectoriesButton);
            this.Controls.Add(this.outputDirectoryText);
            this.Controls.Add(this.outputDirectoryLabel);
            this.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((System.Byte)(0)));
            this.Name = "FileGeneratorControl";
            this.Size = new System.Drawing.Size(408, 168);
            this.ResumeLayout(false);

        }
        #endregion

        private void OnBrowseDirectoriesButtonClick(object sender, System.EventArgs e)
        {
            using(FolderBrowserDialog folderDialog = new FolderBrowserDialog())
            {
                folderDialog.Description = FolderDialogDescription;
                folderDialog.ShowNewFolderButton = true;
				
                if(Directory.Exists(this.outputDirectoryText.Text) == true)
                {
                    folderDialog.SelectedPath = this.outputDirectoryText.Text;
                }
                else
                {
                    folderDialog.RootFolder = Environment.SpecialFolder.MyComputer;
                }

                DialogResult folderResult = folderDialog.ShowDialog(this.ParentForm);

                if(folderResult == DialogResult.OK)
                {
                    this.outputDirectoryText.Text = folderDialog.SelectedPath;
                }
            }
        }

        private void OnGenerateFilesButtonClick(object sender, System.EventArgs e)
        {
            if(this.outputDirectoryText.Text != null && this.outputDirectoryText.Text.Trim().Length > 0)
            {
                if(Directory.Exists(this.outputDirectoryText.Text) == false)
                {
                    Directory.CreateDirectory(this.outputDirectoryText.Text);
                }

                Cursor currentCursor = this.Parent.Cursor;

                try
                {
                    this.Parent.Cursor = Cursors.WaitCursor;
	
                    IAssemblyBrowser assemblyBrowser = (IAssemblyBrowser)this.serviceProvider.GetService(typeof(IAssemblyBrowser));

                    if(assemblyBrowser.ActiveItem != null)
                    {
                        object resolvedObject = this.Resolve(assemblyBrowser.ActiveItem);

                        if(resolvedObject != null)
                        {
                            if(ThreadPool.QueueUserWorkItem(new WaitCallback(this.GenerateFiles), assemblyBrowser.ActiveItem))
                            {
                                generateFilesButton.Enabled = false;
                                cancelGenerationButton.Enabled = true;
                            }
                        }
                        else
                        {
                            this.fileGenerationStatusText.Text = string.Format("Could not resolve the active item type {0}.", 
                                assemblyBrowser.ActiveItem.GetType().FullName);
                            this.fileGenerationStatusText.SelectionStart = 0;
                            this.fileGenerationStatusText.SelectionLength = 0;
                        }
                    }
                }
                finally
                {
                    this.Parent.Cursor = currentCursor;
                }
            }
        }

        private void SetTargetInformation(object activeItem)
        {
            if(activeItem is IAssembly)
            {
                targetLabel.Text = string.Format("Assembly: {0}", ((IAssembly)activeItem).Name);
            }
            else if(activeItem is IModule)
            {
                targetLabel.Text = string.Format("Module: {0}", ((IModule)activeItem).Name);
            }
            else if(activeItem is INamespace)
            {
                this.targetLabel.Text = string.Format("Namespace: {0}", ((INamespace)activeItem).Name);
            }
            else if(activeItem is ITypeDeclaration)
            {
                ITypeDeclaration type = (ITypeDeclaration)activeItem;
                targetLabel.Text = string.Format("Type: {0}", (new TypeInformation(type)).NameWithResolutionScope);
            }
        }

        private void GenerateFiles(object data)
        {
            this.cancelEvent = new ManualResetEvent(false);
            this.completeEvent = new ManualResetEvent(false);
            this.errors = new FileGenerationResultCollection();
            this.typesGenerated = 0;
            IFileGenerator fileGenerator = null;
			
            try
            {
                ILanguageManager languageManager = (ILanguageManager)this.serviceProvider.GetService(typeof(ILanguageManager));
                ILanguage language = languageManager.ActiveLanguage;
                IVisitorManager visitorManager = (IVisitorManager)this.serviceProvider.GetService(typeof(IVisitorManager));
                IVisitor visitor = visitorManager.ActiveVisitor;

                if(this.cancelEvent != null)
                {
                    fileGenerator = FileGenerator.Create(data, this.outputDirectoryText.Text, visitor, language, this.cancelEvent);
                }
                else
                {
                    fileGenerator = FileGenerator.Create(data, this.outputDirectoryText.Text, visitor, language);
                }

                if(this.InvokeRequired == true)
                {
                    this.Invoke(new SetTargetInformationHandler(this.SetTargetInformation), 
                        new object[] {data});
                }
                else
                {
                    this.SetTargetInformation(data);
                }

                this.typeCount = fileGenerator.TypeCount;

                if(fileGenerator != null)
                {
                    fileGenerator.FileCreated += new FileCreatedEventHandler(OnFileGenerated);

                    if(this.InvokeRequired == true)
                    {
                        this.Invoke(new SetupProgressBarHandler(this.SetupProgressBar), 
                            new object[] {fileGenerator.TypeCount});
                    }
                    else
                    {
                        this.SetupProgressBar(fileGenerator.TypeCount);
                    }

                    this.errors.Add(fileGenerator.Generate());
                }
            }
            finally
            {
                this.completeEvent.Set();

                if(this.InvokeRequired == true)
                {
                    this.Invoke(new FileGenerationCompleteHandler(this.FileGenerationComplete));
                }
                else
                {
                    this.FileGenerationComplete();
                }
            }		
        }

        private object Resolve(object activeItem)
        {
            IAssembly assemblyToResolve = null;
            bool allAreResolved = true;

            try
            {
                if(activeItem is IAssembly)
                {
                    assemblyToResolve = (IAssembly)activeItem;
                }
                else if(activeItem is IModule)
                {
                    assemblyToResolve = ((IModule)activeItem).Assembly;
                }
                else if(activeItem is INamespace)
                {
                    INamespace namespaceActiveItem = ((INamespace)activeItem);
                    
                    if(namespaceActiveItem.Types != null && namespaceActiveItem.Types.Count > 0)
                    {
                        assemblyToResolve = ((IModule)namespaceActiveItem.Types[0].Owner).Assembly;
                    }
                }
                else if(activeItem is ITypeDeclaration)
                {
                    ITypeDeclaration td = ((ITypeDeclaration)activeItem);
                    assemblyToResolve = ((IModule)td.Owner).Assembly;
                }

                if(assemblyToResolve != null)
                {
                    foreach(IModule module in assemblyToResolve.Modules)
                    {
                        foreach(IAssemblyName assemblyReferenceName in module.AssemblyReferences)
                        {
                            IAssembly resolvedAssembly = assemblyReferenceName.Resolve();

                            if(resolvedAssembly == null)
                            {
                                allAreResolved = false;
                                break;
                            }
                        }
                    }
                }
            }
            catch
            {
                allAreResolved = false;
            }

            if(allAreResolved == false)
            {
                assemblyToResolve = null;
            }

            return assemblyToResolve;
        }

        private void FileGenerationComplete()
        {
            cancelGenerationButton.Enabled = false;	

            StringBuilder results = new StringBuilder();

            results.Append(string.Format("Total number of types: {0}", this.typeCount)).Append(Environment.NewLine);
            results.Append(string.Format("Total number of generated types: {0}", this.typesGenerated)).Append(Environment.NewLine);
            results.Append(string.Format("Total number of errors: {0}", this.errors.Count));

            if(this.errors.Count > 0)
            {
                results.Append(Environment.NewLine);

                foreach(FileGenerationResult error in this.errors)
                {
                    results.Append(string.Format("Error in type {0}", error.TypeName)).Append(Environment.NewLine);
                    results.Append("\t").Append(string.Format("Message: {0}", error.Message)).Append(Environment.NewLine);
                    results.Append("\t").Append(string.Format("Method Source: {0}", error.MethodSource)).Append(Environment.NewLine);
                }
            }

            this.fileGenerationStatusText.Text = results.ToString();
            this.fileGenerationStatusText.SelectionStart = 0;
            this.fileGenerationStatusText.SelectionLength = 0;
            this.UpdateEnabledStateOnGenerateButton();
        }

        private void SetupProgressBar(int typeCount)
        {
            fileGenerationProgress.Minimum = 0;
            fileGenerationProgress.Maximum = typeCount;
            fileGenerationProgress.Value = 0;
        }

        private void OnFileGenerated(object sender, FileGeneratedEventArgs fileInfo)
        {
            if(this.InvokeRequired == true)
            {
                this.Invoke(new FileGeneratedHandler(this.FileGenerated), new object[] {fileInfo});
            }
            else
            {
                this.FileGenerated(fileInfo);
            }
        }

        private void FileGenerated(FileGeneratedEventArgs fileInfo)
        {
            this.typesGenerated++;
            fileGenerationProgress.Increment(1);
            fileGenerationProgress.Refresh();

            this.fileGenerationStatusText.Text = string.Format("{0} is generated.", fileInfo.FileName);
            this.fileGenerationStatusText.Refresh();
        }

        private void OnAssemblyBrowserActiveItemChanged(object sender, EventArgs e)
        {
            this.UpdateEnabledStateOnGenerateButton();
        }

        private void UpdateEnabledStateOnGenerateButton()
        {
            if(this.completeEvent != null && this.completeEvent.WaitOne(FileGenerator.EventWaitTime, false) == false)
            {
                generateFilesButton.Enabled = false;
            }
            else
            {
                if(this.Visible == true)
                {
                    generateFilesButton.Enabled = 
                        (this.assemblyBrowser.ActiveItem is IModule || 
                        this.assemblyBrowser.ActiveItem is ITypeDeclaration ||
                        this.assemblyBrowser.ActiveItem is IAssembly ||
                        this.assemblyBrowser.ActiveItem is INamespace);
                }
            }
        }

        private void CancelFileGeneration()
        {
            if(this.cancelEvent != null && this.completeEvent != null)
            {
                this.cancelEvent.Set();

                bool finished = false;

                do
                {
                    finished = this.completeEvent.WaitOne(FileGenerator.EventWaitTime, false);
                    System.Windows.Forms.Application.DoEvents();
                } while(finished == false);
            }
        }

        private void OnCancelGenerationButtonClick(object sender, System.EventArgs e)
        {
            Cursor currentCursor = this.Parent.Cursor;

            try
            {
                this.Parent.Cursor = Cursors.WaitCursor;
                this.CancelFileGeneration();
                this.FileGenerationComplete();
            }
            finally
            {
                this.Parent.Cursor = currentCursor;
            }
        }
    }
}
