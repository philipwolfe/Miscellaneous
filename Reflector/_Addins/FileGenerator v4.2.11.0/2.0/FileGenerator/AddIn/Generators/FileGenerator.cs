using Microsoft.Build.BuildEngine;
using Reflector;
using Reflector.CodeModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading;

namespace FileGenerator.AddIn.Generators
{
	internal abstract class FileGenerator<T> : IFileGenerator
	{
		public abstract event FileCreatedEventHandler FileCreated;

		protected BuildItemGroup compileFiles;
		protected Project project;
		protected List<string> subDirectories; 
		protected FileGeneratorContext<T> context;
		protected int typeCount;

		protected FileGenerator(FileGeneratorContext<T> context)
			: base() 
		{
			if (context == null)
			{
				throw new ArgumentNullException("context");
			}

			this.context = context;
		}

		public abstract List<Exception> Generate();

		protected void InitializeProject(IAssembly baseAssembly)
		{
			if (this.context.IsRoot && this.context.CreateVsNetProject && this.context.CreateVsNetProject)
			{
				this.project = new Project(
					new Engine(RuntimeEnvironment.GetRuntimeDirectory()));
				this.project.DefaultTargets = "Build";
				this.CreatePropertyGroups();
				this.InitializeAssemblyReferencesGroup(baseAssembly);
				this.InitializeCompileGroup();
				this.CreateImportTargets();

				if (this.context.CreateSubdirectories)
				{
					this.subDirectories = new List<string>();
				}
			}
		}

		private void CreatePropertyGroups()
		{
			BuildPropertyGroup debugGroup = this.project.AddNewPropertyGroup(false);
			debugGroup.Condition = " '$(Configuration)|$(Platform)' == 'Debug|AnyCPU' ";
			debugGroup.AddNewProperty("DebugSymbols", "true");
			debugGroup.AddNewProperty("DebugType", "full");
			debugGroup.AddNewProperty("OutputPath", @"bin\Debug\");
			debugGroup.AddNewProperty("Optimize", "false");

			BuildPropertyGroup releaseGroup = this.project.AddNewPropertyGroup(false);
			releaseGroup.Condition = " '$(Configuration)|$(Platform)' == 'Release|AnyCPU' ";
			releaseGroup.AddNewProperty("DebugSymbols", "false");
			releaseGroup.AddNewProperty("DebugType", "pdbonly");
			releaseGroup.AddNewProperty("OutputPath", @"bin\Release\");
			releaseGroup.AddNewProperty("Optimize", "true");
		}

		private void CreateImportTargets()
		{
			string importProjectFile = @"$(MSBuildBinPath)\";

			if (this.context.Language.Name == "C#")
			{
				importProjectFile += "Microsoft.CSharp.targets";
			}
			else if (this.context.Language.Name == "Visual Basic")
			{
				importProjectFile += "Microsoft.VisualBasic.targets";
			}
			else
			{
				importProjectFile += "Microsoft.Common.targets";
			}

			this.project.AddNewImport(importProjectFile, string.Empty);
		}

		private void InitializeCompileGroup()
		{
			if (this.typeCount > 0)
			{
				this.compileFiles = this.project.AddNewItemGroup();
			}
		}

		private void InitializeAssemblyReferencesGroup(IAssembly baseAssembly)
		{
			if (baseAssembly.AssemblyManager.Assemblies.Count > 0)
			{
				List<IAssembly> referencedAssemblies = new List<IAssembly>();

				foreach (IAssembly referencedAssembly in
					baseAssembly.AssemblyManager.Assemblies)
				{
					if (referencedAssembly != baseAssembly)
					{
						referencedAssemblies.Add(referencedAssembly);
					}
				}

				if (referencedAssemblies.Count > 0)
				{
					BuildItemGroup references = this.project.AddNewItemGroup();

					foreach (IAssembly referencedAssembly in referencedAssemblies)
					{
						references.AddNewItem("Reference", referencedAssembly.Name);
					}
				}
			}
		}

		protected void AddGeneratedFileToCompileElement(string filePath)
		{
			if (this.context.IsRoot && this.context.CreateVsNetProject)
			{
				string codeFileName = Path.GetFileName(filePath);
				string codeDirectory = Path.GetDirectoryName(filePath) ?? string.Empty;
				codeDirectory = codeDirectory.Replace(
					this.context.Directory, string.Empty);

				if (codeDirectory.StartsWith(@"\"))
				{
					codeDirectory = codeDirectory.Substring(1);
				}

				if (codeDirectory.Length > 0)
				{
					codeDirectory += @"\";
				}

				if (this.context.CreateSubdirectories)
				{
					if (!this.subDirectories.Contains(codeDirectory))
					{
						this.subDirectories.Add(codeDirectory);
						this.compileFiles.AddNewItem("Compile", codeDirectory + "*" +
							this.context.Language.FileExtension);
					}
				}
				else
				{
					this.compileFiles.AddNewItem("Compile", codeDirectory + codeFileName);
				}
			}
		}

		protected void SaveProject(string projectName)
		{
			if (this.context.IsRoot && this.context.CreateVsNetProject && this.project != null)
			{
				string projectExtension = string.Empty;

				if (this.context.Language.Name == "C#")
				{
					projectExtension = ".csproj";
				}
				else if (this.context.Language.Name == "Visual Basic")
				{
					projectExtension += ".vbproj";
				}
				else
				{
					projectExtension += ".msbuild";
				}

				string projectFileName = projectName + projectExtension;
				this.project.Save(Path.Combine(this.context.Directory, projectFileName));
			}
		}

		public int TypeCount
		{
			get
			{
				return this.typeCount;
			}
		}
	}
}
