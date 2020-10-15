using FileGenerator.AddIn.Generators;
using Reflector;
using Reflector.CodeModel;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace FileGenerator.AddIn.UI
{
	public class FileGeneratorControl : UserControl
	{
		private delegate void FileGenerationCompleteHandler();
		private delegate void FileGeneratedHandler(FileGeneratedEventArgs fileInfo);
		private delegate void SetTargetInformationHandler(object activeItem);
		private delegate void SetupProgressBarHandler(int typeCount);

		private const string FolderDialogDescription = "Select the folder that will contain the code files.";

		private System.Windows.Forms.Label outputDirectoryLabel;
		private System.Windows.Forms.TextBox outputDirectoryText;
		private System.Windows.Forms.Button browseDirectoriesButton;
		private System.Windows.Forms.ProgressBar fileGenerationProgress;
		private System.ComponentModel.Container components = null;
		private System.Windows.Forms.Button generateFilesButton;
		private System.Windows.Forms.Button cancelGenerationButton;
		private IAssemblyBrowser assemblyBrowser;
		private IServiceProvider serviceProvider;
		private ManualResetEvent cancel;
		private ManualResetEvent complete;
		private int typeCount = 0;
		private int typesGenerated = 0;
		private System.Windows.Forms.Label targetLabel;
		private SplitContainer resultsContainer;
		private TextBox fileGenerationStatusText;
		private ExceptionViews.ExceptionControl exceptions;
		private Button copyException;
		private CheckBox createSubDirectories;
		private CheckBox createVSNETProject;
		private List<Exception> errors;

		public FileGeneratorControl(IServiceProvider serviceProvider)
			: this()
		{
			this.serviceProvider = serviceProvider;
			this.assemblyBrowser = (IAssemblyBrowser)this.serviceProvider.GetService(typeof(IAssemblyBrowser));
			this.assemblyBrowser.ActiveItemChanged += new EventHandler(OnAssemblyBrowserActiveItemChanged);
		}

		public FileGeneratorControl()
			: base()
		{
			this.InitializeComponent();
			this.resultsContainer.Panel1Collapsed = false;
			this.resultsContainer.Panel2Collapsed = true;
			cancelGenerationButton.Enabled = false;
			copyException.Enabled = false;

			try
			{
				using (FolderBrowserDialog folderDialog = new FolderBrowserDialog()) { }
			}
			catch (TypeLoadException)
			{
				this.browseDirectoriesButton.Visible = false;
			}
		}

		protected override void Dispose(bool disposing)
		{
			this.CancelFileGeneration();

			if (disposing)
			{
				if (components != null)
				{
					components.Dispose();
				}
			}
			base.Dispose(disposing);
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
			this.fileGenerationProgress = new System.Windows.Forms.ProgressBar();
			this.generateFilesButton = new System.Windows.Forms.Button();
			this.cancelGenerationButton = new System.Windows.Forms.Button();
			this.targetLabel = new System.Windows.Forms.Label();
			this.resultsContainer = new System.Windows.Forms.SplitContainer();
			this.fileGenerationStatusText = new System.Windows.Forms.TextBox();
			this.exceptions = new ExceptionViews.ExceptionControl();
			this.copyException = new System.Windows.Forms.Button();
			this.createSubDirectories = new System.Windows.Forms.CheckBox();
			this.createVSNETProject = new System.Windows.Forms.CheckBox();
			this.resultsContainer.Panel1.SuspendLayout();
			this.resultsContainer.Panel2.SuspendLayout();
			this.resultsContainer.SuspendLayout();
			this.SuspendLayout();
			// 
			// outputDirectoryLabel
			// 
			this.outputDirectoryLabel.FlatStyle = System.Windows.Forms.FlatStyle.System;
			this.outputDirectoryLabel.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
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
			this.outputDirectoryText.Size = new System.Drawing.Size(464, 21);
			this.outputDirectoryText.TabIndex = 1;
			// 
			// browseDirectoriesButton
			// 
			this.browseDirectoriesButton.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
			this.browseDirectoriesButton.FlatStyle = System.Windows.Forms.FlatStyle.System;
			this.browseDirectoriesButton.Location = new System.Drawing.Point(568, 8);
			this.browseDirectoriesButton.Name = "browseDirectoriesButton";
			this.browseDirectoriesButton.Size = new System.Drawing.Size(75, 23);
			this.browseDirectoriesButton.TabIndex = 2;
			this.browseDirectoriesButton.Text = "Browse...";
			this.browseDirectoriesButton.Click += new System.EventHandler(this.OnBrowseDirectoriesButtonClick);
			// 
			// fileGenerationProgress
			// 
			this.fileGenerationProgress.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)
							| System.Windows.Forms.AnchorStyles.Right)));
			this.fileGenerationProgress.Location = new System.Drawing.Point(8, 478);
			this.fileGenerationProgress.Name = "fileGenerationProgress";
			this.fileGenerationProgress.Size = new System.Drawing.Size(632, 23);
			this.fileGenerationProgress.TabIndex = 9;
			// 
			// generateFilesButton
			// 
			this.generateFilesButton.FlatStyle = System.Windows.Forms.FlatStyle.System;
			this.generateFilesButton.Location = new System.Drawing.Point(8, 62);
			this.generateFilesButton.Name = "generateFilesButton";
			this.generateFilesButton.Size = new System.Drawing.Size(88, 23);
			this.generateFilesButton.TabIndex = 5;
			this.generateFilesButton.Text = "Generate Files";
			this.generateFilesButton.Click += new System.EventHandler(this.OnGenerateFilesButtonClick);
			// 
			// cancelGenerationButton
			// 
			this.cancelGenerationButton.FlatStyle = System.Windows.Forms.FlatStyle.System;
			this.cancelGenerationButton.Location = new System.Drawing.Point(104, 62);
			this.cancelGenerationButton.Name = "cancelGenerationButton";
			this.cancelGenerationButton.Size = new System.Drawing.Size(88, 23);
			this.cancelGenerationButton.TabIndex = 6;
			this.cancelGenerationButton.Text = "Cancel";
			this.cancelGenerationButton.Click += new System.EventHandler(this.OnCancelGenerationButtonClick);
			// 
			// targetLabel
			// 
			this.targetLabel.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left)
							| System.Windows.Forms.AnchorStyles.Right)));
			this.targetLabel.Location = new System.Drawing.Point(9, 93);
			this.targetLabel.Name = "targetLabel";
			this.targetLabel.Size = new System.Drawing.Size(632, 16);
			this.targetLabel.TabIndex = 8;
			// 
			// resultsContainer
			// 
			this.resultsContainer.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
							| System.Windows.Forms.AnchorStyles.Left)
							| System.Windows.Forms.AnchorStyles.Right)));
			this.resultsContainer.Location = new System.Drawing.Point(8, 115);
			this.resultsContainer.Name = "resultsContainer";
			this.resultsContainer.Orientation = System.Windows.Forms.Orientation.Horizontal;
			// 
			// resultsContainer.Panel1
			// 
			this.resultsContainer.Panel1.Controls.Add(this.fileGenerationStatusText);
			// 
			// resultsContainer.Panel2
			// 
			this.resultsContainer.Panel2.Controls.Add(this.exceptions);
			this.resultsContainer.Size = new System.Drawing.Size(632, 357);
			this.resultsContainer.SplitterDistance = 80;
			this.resultsContainer.TabIndex = 8;
			this.resultsContainer.Text = "splitContainer1";
			// 
			// fileGenerationStatusText
			// 
			this.fileGenerationStatusText.Dock = System.Windows.Forms.DockStyle.Fill;
			this.fileGenerationStatusText.Location = new System.Drawing.Point(0, 0);
			this.fileGenerationStatusText.MaxLength = 0;
			this.fileGenerationStatusText.Multiline = true;
			this.fileGenerationStatusText.Name = "fileGenerationStatusText";
			this.fileGenerationStatusText.ReadOnly = true;
			this.fileGenerationStatusText.ScrollBars = System.Windows.Forms.ScrollBars.Both;
			this.fileGenerationStatusText.Size = new System.Drawing.Size(632, 80);
			this.fileGenerationStatusText.TabIndex = 0;
			// 
			// exceptions
			// 
			this.exceptions.Dock = System.Windows.Forms.DockStyle.Fill;
			this.exceptions.Exceptions = null;
			this.exceptions.Location = new System.Drawing.Point(0, 0);
			this.exceptions.Name = "exceptions";
			this.exceptions.Size = new System.Drawing.Size(632, 273);
			this.exceptions.TabIndex = 0;
			// 
			// copyException
			// 
			this.copyException.FlatStyle = System.Windows.Forms.FlatStyle.System;
			this.copyException.Location = new System.Drawing.Point(198, 62);
			this.copyException.Name = "copyException";
			this.copyException.Size = new System.Drawing.Size(88, 23);
			this.copyException.TabIndex = 7;
			this.copyException.Text = "Copy Exception";
			this.copyException.Click += new System.EventHandler(this.OnCopyExceptionClick);
			// 
			// createSubDirectories
			// 
			this.createSubDirectories.AutoSize = true;
			this.createSubDirectories.Location = new System.Drawing.Point(8, 39);
			this.createSubDirectories.Name = "createSubDirectories";
			this.createSubDirectories.Size = new System.Drawing.Size(130, 17);
			this.createSubDirectories.TabIndex = 3;
			this.createSubDirectories.Text = "Create Subdirectories";
			this.createSubDirectories.UseVisualStyleBackColor = true;
			// 
			// createVSNETProject
			// 
			this.createVSNETProject.AutoSize = true;
			this.createVSNETProject.Location = new System.Drawing.Point(143, 39);
			this.createVSNETProject.Name = "createVSNETProject";
			this.createVSNETProject.Size = new System.Drawing.Size(164, 17);
			this.createVSNETProject.TabIndex = 4;
			this.createVSNETProject.Text = "Create VS .NET 2005 Project";
			this.createVSNETProject.UseVisualStyleBackColor = true;
			// 
			// FileGeneratorControl
			// 
			this.Controls.Add(this.createVSNETProject);
			this.Controls.Add(this.createSubDirectories);
			this.Controls.Add(this.copyException);
			this.Controls.Add(this.resultsContainer);
			this.Controls.Add(this.targetLabel);
			this.Controls.Add(this.cancelGenerationButton);
			this.Controls.Add(this.generateFilesButton);
			this.Controls.Add(this.fileGenerationProgress);
			this.Controls.Add(this.browseDirectoriesButton);
			this.Controls.Add(this.outputDirectoryText);
			this.Controls.Add(this.outputDirectoryLabel);
			this.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
			this.Name = "FileGeneratorControl";
			this.Size = new System.Drawing.Size(648, 510);
			this.resultsContainer.Panel1.ResumeLayout(false);
			this.resultsContainer.Panel1.PerformLayout();
			this.resultsContainer.Panel2.ResumeLayout(false);
			this.resultsContainer.ResumeLayout(false);
			this.ResumeLayout(false);
			this.PerformLayout();

		}
		#endregion

		private void OnBrowseDirectoriesButtonClick(object sender, System.EventArgs e)
		{
			using (FolderBrowserDialog folderDialog = new FolderBrowserDialog())
			{
				folderDialog.Description = FolderDialogDescription;
				folderDialog.ShowNewFolderButton = true;

				if (Directory.Exists(this.outputDirectoryText.Text) == true)
				{
					folderDialog.SelectedPath = this.outputDirectoryText.Text;
				}
				else
				{
					folderDialog.RootFolder = Environment.SpecialFolder.MyComputer;
				}

				DialogResult folderResult = folderDialog.ShowDialog(this.ParentForm);

				if (folderResult == DialogResult.OK)
				{
					this.outputDirectoryText.Text = folderDialog.SelectedPath;
				}
			}
		}

		private void OnGenerateFilesButtonClick(object sender, System.EventArgs e)
		{
			if (this.outputDirectoryText.Text != null && this.outputDirectoryText.Text.Trim().Length > 0)
			{
				if (Directory.Exists(this.outputDirectoryText.Text) == false)
				{
					Directory.CreateDirectory(this.outputDirectoryText.Text);
				}

				Cursor currentCursor = this.Parent.Cursor;

				try
				{
					this.Parent.Cursor = Cursors.WaitCursor;

					IAssemblyBrowser assemblyBrowser = (IAssemblyBrowser)this.serviceProvider.GetService(typeof(IAssemblyBrowser));

					if (assemblyBrowser.ActiveItem != null)
					{
						object resolvedObject = this.Resolve(assemblyBrowser.ActiveItem);

						if (resolvedObject != null)
						{
							this.resultsContainer.Panel1Collapsed = false;
							this.resultsContainer.Panel2Collapsed = true;
							this.copyException.Enabled = false;

							if (ThreadPool.QueueUserWorkItem(new WaitCallback(this.GenerateFiles), assemblyBrowser.ActiveItem))
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
			if (activeItem is IAssembly)
			{
				targetLabel.Text = string.Format("Assembly: {0}", ((IAssembly)activeItem).Name);
			}
			else if (activeItem is IModule)
			{
				targetLabel.Text = string.Format("Module: {0}", ((IModule)activeItem).Name);
			}
			else if (activeItem is INamespace)
			{
				this.targetLabel.Text = string.Format("Namespace: {0}", ((INamespace)activeItem).Name);
			}
			else if (activeItem is ITypeDeclaration)
			{
				ITypeDeclaration type = (ITypeDeclaration)activeItem;
				targetLabel.Text = string.Format("Type: {0}.{1}", type.Namespace, type.Name);
			}
		}

		private void GenerateFiles(object data)
		{
			this.cancel = new ManualResetEvent(false);
			this.complete = new ManualResetEvent(false);
			this.errors = new List<Exception>();
			this.typesGenerated = 0;

			try
			{
				ILanguageManager languageManager = (ILanguageManager)this.serviceProvider.GetService(typeof(ILanguageManager));
				ILanguage language = languageManager.ActiveLanguage;
				ITranslatorManager visitorManager = (ITranslatorManager)this.serviceProvider.GetService(typeof(ITranslatorManager));
				ITranslator visitor = visitorManager.Disassembler;
				IFileGenerator fileGenerator = FileGeneratorFactory.Create(
						  data, this.outputDirectoryText.Text, visitor,
						  language, this.cancel, this.createSubDirectories.Checked,
						  this.createVSNETProject.Checked);

				if (this.InvokeRequired == true)
				{
					this.Invoke(new SetTargetInformationHandler(this.SetTargetInformation),
						 new object[] { data });
				}
				else
				{
					this.SetTargetInformation(data);
				}

				this.typeCount = fileGenerator.TypeCount;

				if (fileGenerator != null)
				{
					fileGenerator.FileCreated += new FileCreatedEventHandler(OnFileGenerated);

					if (this.InvokeRequired == true)
					{
						this.Invoke(new SetupProgressBarHandler(this.SetupProgressBar),
							 new object[] { fileGenerator.TypeCount });
					}
					else
					{
						this.SetupProgressBar(fileGenerator.TypeCount);
					}

					this.errors.AddRange(fileGenerator.Generate().ToArray());
				}
			}
			finally
			{
				this.complete.Set();

				if (this.InvokeRequired == true)
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
				if (activeItem is IAssembly)
				{
					assemblyToResolve = (IAssembly)activeItem;
				}
				else if (activeItem is IModule)
				{
					assemblyToResolve = ((IModule)activeItem).Assembly;
				}
				else if (activeItem is INamespace)
				{
					INamespace namespaceActiveItem = ((INamespace)activeItem);

					if (namespaceActiveItem.Types != null && namespaceActiveItem.Types.Count > 0)
					{
						assemblyToResolve = ((IModule)namespaceActiveItem.Types[0].Owner).Assembly;
					}
				}
				else if (activeItem is ITypeDeclaration)
				{
					ITypeDeclaration td = ((ITypeDeclaration)activeItem);
					assemblyToResolve = ((IModule)td.Owner).Assembly;
				}

				if (assemblyToResolve != null)
				{
					foreach (IModule module in assemblyToResolve.Modules)
					{
						foreach (IAssemblyReference assemblyReferenceName in module.AssemblyReferences)
						{
							IAssembly resolvedAssembly = assemblyReferenceName.Resolve();

							if (resolvedAssembly == null)
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

			if (allAreResolved == false)
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

			if (this.errors.Count > 0)
			{
				// TODO (10/27/2005) - Need to figure out a way to allow the user to get the exception information.
				this.copyException.Enabled = false;
				this.resultsContainer.Panel2Collapsed = false;
				this.exceptions.Exceptions = this.errors;
			}

			this.fileGenerationStatusText.Text = results.ToString();
			this.fileGenerationStatusText.SelectionStart = 0;
			this.fileGenerationStatusText.SelectionLength = 0;
			this.UpdateUIState();
		}

		private void SetupProgressBar(int typeCount)
		{
			fileGenerationProgress.Minimum = 0;
			fileGenerationProgress.Maximum = typeCount;
			fileGenerationProgress.Value = 0;
		}

		private void OnFileGenerated(object sender, FileGeneratedEventArgs fileInfo)
		{
			if (this.InvokeRequired == true)
			{
				this.Invoke(new FileGeneratedHandler(this.FileGenerated), new object[] { fileInfo });
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
			this.UpdateUIState();
		}

		private void UpdateUIState()
		{
			if (this.complete != null && 
				this.complete.WaitOne(FileGeneratorFactory.EventWaitTime, false) == false)
			{
				this.generateFilesButton.Enabled = false;
				this.createVSNETProject.Enabled = false;
			}
			else
			{
				if (this.Visible == true)
				{
					this.generateFilesButton.Enabled =
						 (this.assemblyBrowser.ActiveItem is IModule ||
						 this.assemblyBrowser.ActiveItem is ITypeDeclaration ||
						 this.assemblyBrowser.ActiveItem is IAssembly ||
						 this.assemblyBrowser.ActiveItem is INamespace);
					this.createVSNETProject.Enabled = this.generateFilesButton.Enabled;
				}
			}
		}

		private void CancelFileGeneration()
		{
			if (this.cancel != null && this.complete != null)
			{
				this.cancel.Set();

				bool finished = false;

				do
				{
					finished = this.complete.WaitOne(FileGeneratorFactory.EventWaitTime, false);
					System.Windows.Forms.Application.DoEvents();
				} while (finished == false);
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
				this.copyException.Enabled = false;
			}
			finally
			{
				this.Parent.Cursor = currentCursor;
			}
		}

		private void OnCopyExceptionClick(object sender, EventArgs e)
		{
			this.exceptions.CopyExceptionDataToClipboard();
		}
	}
}
