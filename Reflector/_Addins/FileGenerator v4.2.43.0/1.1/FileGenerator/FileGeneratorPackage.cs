using Reflector;
using Reflector.CodeModel;
using System;
using System.Drawing;
using System.Reflection;
using System.Windows.Forms;
using Viktor.AddIn.FileGenerator.Controls;

namespace Viktor.AddIn.FileGenerator
{
	public class FileGeneratorPackage : IPackage
	{
		private const Keys MenuKeys = Keys.Control | Keys.Shift | Keys.G;
		private const string ToolsCommandBar = "Tools";
		private const string ToolsTitile = "&Generate File(s)...";
		private const string WindowID = "FileGeneratorWindow";
		private const string WindowTitle = "Generate Files";

		private ICommandBarButton fileGeneratorCommandBarButton;
		private ICommandBarSeparator fileGeneratorCommandBarSeparator;
        private IWindow fileGeneratorWindow;
        private IServiceProvider serviceProvider;
		private IWindowManager windowManager;

		public FileGeneratorPackage() : base() {}

        public void Load(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;

            FileGeneratorControl fileGeneratorControl = new FileGeneratorControl(this.serviceProvider);

            this.windowManager =
                (IWindowManager)this.serviceProvider.GetService(typeof(IWindowManager));
            this.windowManager.Windows.Add(WindowID, fileGeneratorControl, WindowTitle);

            this.fileGeneratorWindow = this.windowManager.Windows[WindowID];
            this.fileGeneratorWindow.Content.Dock = DockStyle.Fill;

            ICommandBarManager commandBarManager =
                (ICommandBarManager)this.serviceProvider.GetService(typeof(ICommandBarManager));
            ICommandBarItemCollection commandToolItems = commandBarManager.CommandBars[ToolsCommandBar].Items;
            this.fileGeneratorCommandBarSeparator = commandToolItems.AddSeparator();
            this.fileGeneratorCommandBarButton = commandToolItems.AddButton(
                ToolsTitile, new EventHandler(this.OnFileGeneratorButtonClick), MenuKeys);
        }

        public void OnFileGeneratorButtonClick(object sender, EventArgs e)
		{
			this.fileGeneratorWindow.Visible = true;
		}

		public void Unload()
		{
			ICommandBarManager commandBarManager = 
				(ICommandBarManager)this.serviceProvider.GetService(typeof(ICommandBarManager));
			ICommandBarItemCollection commandToolItems = commandBarManager.CommandBars[ToolsCommandBar].Items;

			commandToolItems.Remove(this.fileGeneratorCommandBarButton);
			commandToolItems.Remove(this.fileGeneratorCommandBarSeparator);
		}
	}
}