using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using Microsoft.Build.BuildEngine;
using Reflector.CodeModel;

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
			if (context.IsRoot && context.CreateVsNetProject && context.CreateVsNetProject)
			{
				project = new Project(
					new Engine(RuntimeEnvironment.GetRuntimeDirectory()));
				project.DefaultTargets = "Build";
				CreatePropertyGroups();
				InitializeAssemblyReferencesGroup(baseAssembly);
				InitializeCompileGroup();
				CreateImportTargets();

				if (context.CreateSubdirectories)
				{
					subDirectories = new List<string>();
				}
			}
		}

		private void CreatePropertyGroups()
		{
			BuildPropertyGroup debugGroup = project.AddNewPropertyGroup(false);
			debugGroup.Condition = " '$(Configuration)|$(Platform)' == 'Debug|AnyCPU' ";
			debugGroup.AddNewProperty("DebugSymbols", "true");
			debugGroup.AddNewProperty("DebugType", "full");
			debugGroup.AddNewProperty("OutputPath", @"bin\Debug\");
			debugGroup.AddNewProperty("Optimize", "false");

			BuildPropertyGroup releaseGroup = project.AddNewPropertyGroup(false);
			releaseGroup.Condition = " '$(Configuration)|$(Platform)' == 'Release|AnyCPU' ";
			releaseGroup.AddNewProperty("DebugSymbols", "false");
			releaseGroup.AddNewProperty("DebugType", "pdbonly");
			releaseGroup.AddNewProperty("OutputPath", @"bin\Release\");
			releaseGroup.AddNewProperty("Optimize", "true");
		}

		private void CreateImportTargets()
		{
			string importProjectFile = @"$(MSBuildBinPath)\";

			if (context.Language.Name == "C#")
			{
				importProjectFile += "Microsoft.CSharp.targets";
			}
			else if (context.Language.Name == "Visual Basic")
			{
				importProjectFile += "Microsoft.VisualBasic.targets";
			}
			else
			{
				importProjectFile += "Microsoft.Common.targets";
			}

			project.AddNewImport(importProjectFile, string.Empty);
		}

		private void InitializeCompileGroup()
		{
			if (typeCount > 0)
			{
				compileFiles = project.AddNewItemGroup();
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
					BuildItemGroup references = project.AddNewItemGroup();

					foreach (IAssembly referencedAssembly in referencedAssemblies)
					{
						references.AddNewItem("Reference", referencedAssembly.Name);
					}
				}
			}
		}

		protected void AddGeneratedFileToCompileElement(string filePath)
		{
			if (context.IsRoot && context.CreateVsNetProject)
			{
				string codeFileName = Path.GetFileName(filePath);
				string codeDirectory = Path.GetDirectoryName(filePath) ?? string.Empty;
				codeDirectory = codeDirectory.Replace(
					context.Directory, string.Empty);

				if (codeDirectory.StartsWith(@"\"))
				{
					codeDirectory = codeDirectory.Substring(1);
				}

				if (codeDirectory.Length > 0)
				{
					codeDirectory += @"\";
				}

				if (context.CreateSubdirectories)
				{
					if (!subDirectories.Contains(codeDirectory))
					{
						subDirectories.Add(codeDirectory);
						compileFiles.AddNewItem("Compile", codeDirectory + "*" +
						                                   context.Language.FileExtension);
					}
				}
				else
				{
					compileFiles.AddNewItem("Compile", codeDirectory + codeFileName);
				}
			}
		}

		protected void SaveProject(string projectName)
		{
			if (context.IsRoot && context.CreateVsNetProject && project != null)
			{
				string projectExtension = string.Empty;

				if (context.Language.Name == "C#")
				{
					projectExtension = ".csproj";
				}
				else if (context.Language.Name == "Visual Basic")
				{
					projectExtension += ".vbproj";
				}
				else
				{
					projectExtension += ".msbuild";
				}

				string projectFileName = projectName + projectExtension;
				project.Save(Path.Combine(context.Directory, projectFileName));
			}
		}

		public int TypeCount
		{
			get { return typeCount; }
		}
	}
}