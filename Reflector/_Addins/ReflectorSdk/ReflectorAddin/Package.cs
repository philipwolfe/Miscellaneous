
[assembly: System.Reflection.AssemblyTitle(".NET Reflector Example Add-In")]
[assembly: System.Reflection.AssemblyVersion("2.8.5.0")]
[assembly: System.Reflection.AssemblyCopyright("Copyright (C) Matthias Bergmann, Brad Abrams, Lutz Roeder. All rights reserved.")]

namespace Reflector.AddIn
{
	using System;
	using System.Collections;
	using System.ComponentModel;
	using System.Reflection;
	using System.Windows.Forms;
	using Reflector.ComponentModel;

	// A Reflector Add-In is a .NET Assembly (usually same as a Windows DLL).
	// An Add-In is made out of multiple packages.
	// Each package implementes the IPackage interface.

	public class Package : IPackage
	{
		private IServiceProvider serviceProvider;
		private ILanguage delphi = new DelphiLanguage();
		private ICommand gacBrowser = new MyGacBrowserCommand();
		private ICommand myDisassembler = new MyDisassemblerCommand();
		private ICommand txRef = new MyTxRefCommand();
		
		public void Load(IServiceProvider serviceProvider)
		{
			this.serviceProvider = serviceProvider;
	
			ILanguageManager languageManager = (ILanguageManager) this.serviceProvider.GetService(typeof(ILanguageManager));
			languageManager.AddLanguage(this.delphi, "Delphi");
	
			ICommandManager commandManager = (ICommandManager) this.serviceProvider.GetService(typeof(ICommandManager));
			commandManager.AddCommand(this.gacBrowser, "GAC Browser", null, Keys.None);
			commandManager.AddCommand(this.myDisassembler, "My Disassembler", null, Keys.None);
			commandManager.AddCommand(this.txRef, "C# Text", null, Keys.None);
			
		}
		
		public void Unload()
		{
			ILanguageManager languageManager = (ILanguageManager) this.serviceProvider.GetService(typeof(ILanguageManager));
			languageManager.RemoveLanguage(this.delphi);
		
			ICommandManager commandManager = (ICommandManager) this.serviceProvider.GetService(typeof(ICommandManager));
			commandManager.RemoveCommand(this.gacBrowser);
			commandManager.RemoveCommand(this.myDisassembler);
			commandManager.RemoveCommand(this.txRef);
		}
	}
}