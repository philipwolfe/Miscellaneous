// Windows Forms CommandBar controls for .NET.
// Copyright (C) 2001-2002 Lutz Roeder. All rights reserved.
// http://www.aisto.com/roeder
// ******@aisto.com

using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Windows.Forms;

class Example : Form
{
	[STAThread()]
	public static void Main(String[] args)
	{
		Application.Run(new Example());
	}

	ReBar reBar = new ReBar();
	CommandBar menuBar = new CommandBar(CommandBarStyle.Menu);	
	CommandBar toolBar = new CommandBar(CommandBarStyle.ToolBar);
	
	CommandBarItem enabledItem;
	CommandBarItem visibleItem;

	public Example()
	{
		Icon = SystemIcons.Application;
		Text = "Example";
		Size = new Size(400, 350);
		Controls.Add(new StatusBar());

		// Menu and toolbar
		CommandBarItem newItem = new CommandBarItem(Images.New, "&New", null, Keys.Control | Keys.N);
		CommandBarItem openItem = new CommandBarItem(Images.Open, "&Open...", null, Keys.Control | Keys.O);
		CommandBarItem saveItem = new CommandBarItem(Images.Save, "&Save", null, Keys.Control | Keys.S);

		toolBar.Items.Add(newItem);
		toolBar.Items.Add(openItem);
		toolBar.Items.Add(saveItem);
		toolBar.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));

		CommandBarItem cutItem = new CommandBarItem(Images.Cut, "Cu&t", null, Keys.Control | Keys.X);
		CommandBarItem copyItem = new CommandBarItem(Images.Copy, "&Copy", null, Keys.Control | Keys.C);
		CommandBarItem pasteItem = new CommandBarItem(Images.Paste, "&Paste", null, Keys.Control | Keys.V);
		CommandBarItem deleteItem = new CommandBarItem(Images.Delete, "&Delete", null, Keys.Delete);

		toolBar.Items.Add(cutItem);
		toolBar.Items.Add(copyItem);
		toolBar.Items.Add(pasteItem);
		toolBar.Items.Add(deleteItem);
		toolBar.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));

		CommandBarItem undoItem = new CommandBarItem(Images.Undo, "&Undo", null, Keys.Control | Keys.Z);
		CommandBarItem redoItem = new CommandBarItem(Images.Redo, "&Redo", null, Keys.Control | Keys.Y);
		
		toolBar.Items.Add(undoItem);
		toolBar.Items.Add(redoItem);
		toolBar.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));

		CommandBarItem fileItem = new CommandBarItem("&File");
		menuBar.Items.Add(fileItem);
		fileItem.Style = CommandBarItemStyle.DropDown;
		fileItem.Items.Add(newItem);
		fileItem.Items.Add(openItem);
		fileItem.Items.Add(saveItem);
		fileItem.Items.Add(new CommandBarItem("&Save As...", null));
		fileItem.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));
		fileItem.Items.Add(new CommandBarItem(Images.Preview, "Print Pre&view", null));
		fileItem.Items.Add(new CommandBarItem(Images.Print, "&Print", null, Keys.Control | Keys.P));
		fileItem.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));
		fileItem.Items.Add(new CommandBarItem("E&xit", new EventHandler(Exit_Click)));
	
		CommandBarItem editItem = new CommandBarItem("&Edit");
		menuBar.Items.Add(editItem);
		editItem.Items.Add(undoItem);
		editItem.Items.Add(redoItem);
		editItem.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));
		editItem.Items.Add(cutItem);
		editItem.Items.Add(copyItem);
		editItem.Items.Add(pasteItem);
		editItem.Items.Add(deleteItem);
		editItem.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));
		editItem.Items.Add(new CommandBarItem("Select &All", null, Keys.Control | Keys.A));
		
		CommandBarItem viewItem = new CommandBarItem("&View");
		CommandBarItem goToItem = new CommandBarItem("&Go To");
		goToItem.Items.Add(new CommandBarItem(Images.Back, "&Back", null, Keys.Alt | Keys.Left));
		goToItem.Items.Add(new CommandBarItem(Images.Forward, "&Forward", null, Keys.Alt | Keys.Right));
		goToItem.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));
		goToItem.Items.Add(new CommandBarItem(Images.Home, "&Home", null));
		viewItem.Items.Add(goToItem);

		viewItem.Items.Add(new CommandBarItem(Images.Stop, "&Stop", null, Keys.Escape));
		viewItem.Items.Add(new CommandBarItem(Images.Refresh, "&Refresh", null, Keys.F5));
		menuBar.Items.Add(viewItem);

		enabledItem = new CommandBarItem(Images.Tiles, "&Enabled", null);
		enabledItem.Enabled = false;
		visibleItem = new CommandBarItem(Images.Icons, "&Visible", null);
		visibleItem.Visible = false;
		CommandBarItem checkedPlainItem = new CommandBarItem("&Checked Plain", new EventHandler(ToggleCheck_Click));
		checkedPlainItem.Checked = true;
		CommandBarItem checkedBitmapItem = new CommandBarItem(Images.List, "&Checked Bitmap", new EventHandler(ToggleCheck_Click));
		checkedBitmapItem.Checked = true;

		toolBar.Items.Add(enabledItem);
		toolBar.Items.Add(visibleItem);
		toolBar.Items.Add(checkedPlainItem);
		toolBar.Items.Add(checkedBitmapItem);

		CommandBarItem testItem = new CommandBarItem("&Test");
		menuBar.Items.Add(testItem);
		testItem.Items.Add(new CommandBarItem("&Enabled On/Off", new EventHandler(ToggleEnabled_Click)));
		testItem.Items.Add(enabledItem);
		testItem.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));
		testItem.Items.Add(new CommandBarItem("&Visible On/Off", new EventHandler(ToggleVisible_Click)));
		testItem.Items.Add(visibleItem);
		testItem.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));		
		testItem.Items.Add(checkedPlainItem);
		testItem.Items.Add(checkedBitmapItem);
		testItem.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));				
		testItem.Items.Add(new CommandBarItem("Change Font", new EventHandler(ChangeFont_Click)));

		CommandBarItem helpItem = new CommandBarItem("&Help");
		menuBar.Items.Add(helpItem);
		helpItem.Items.Add(new CommandBarItem(Images.Mail, "&Your Feedback", null));
		helpItem.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));
		helpItem.Items.Add(new CommandBarItem("&About", null));

		reBar.Bands.Add(menuBar);
		reBar.Bands.Add(toolBar);
		Controls.Add(reBar);
		
		// Context menu
		CommandContextMenu contextMenu = new CommandContextMenu();
		contextMenu.Items.Add(undoItem);
		contextMenu.Items.Add(redoItem);
		contextMenu.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator));
		contextMenu.Items.Add(cutItem);
		contextMenu.Items.Add(copyItem);
		contextMenu.Items.Add(pasteItem);
		contextMenu.Items.Add(deleteItem);
		contextMenu.Items = contextMenu.Items; // $TODO triggers update.
		ContextMenu = contextMenu;
	}

	void Exit_Click(Object s, EventArgs e)
	{
		Close();
	}

	void ToggleEnabled_Click(Object s, EventArgs e)
	{
		enabledItem.Enabled = !enabledItem.Enabled;
	}

	void ToggleVisible_Click(Object s, EventArgs e)
	{
		visibleItem.Visible = !visibleItem.Visible;
	}

	void ToggleCheck_Click(Object s, EventArgs e)
	{
		CommandBarItem item = (s as CommandBarItem);
		item.Checked = !item.Checked;
	}
	
	void ChangeFont_Click(Object s, EventArgs e)
	{
		FontDialog dialog = new FontDialog();
		dialog.Font = menuBar.Font;
		
		if (dialog.ShowDialog() == DialogResult.OK)
		{
			menuBar.Font = dialog.Font;
			toolBar.Font = dialog.Font;
		}
	}

	class Images
	{
		static Image[] images = null;

		// ImageList.Images[int index] does not preserve alpha channel.
		static Images()
		{
			// TODO alpha channel PNG loader is not working on .NET Service RC1
			Bitmap bitmap = new Bitmap("Example16.tif");
			int count = (int) (bitmap.Width / bitmap.Height);
			images = new Image[count];
			Rectangle rectangle = new Rectangle(0, 0, bitmap.Height, bitmap.Height);
			for (int i = 0; i < count; i++)
			{
				images[i] = bitmap.Clone(rectangle, bitmap.PixelFormat);
				rectangle.X += bitmap.Height;
			}
		}	

		public static Image New               { get { return images[0];  } }
		public static Image Open              { get { return images[1];  } }
		public static Image Save              { get { return images[2];  } }
		public static Image Cut               { get { return images[3];  } }
		public static Image Copy              { get { return images[4];  } }
		public static Image Paste             { get { return images[5];  } }
		public static Image Delete            { get { return images[6];  } }
		public static Image Properties        { get { return images[7];  } }
		public static Image Undo              { get { return images[8];  } }
		public static Image Redo              { get { return images[9];  } }
		public static Image Preview           { get { return images[10]; } }
		public static Image Print             { get { return images[11]; } }
		public static Image Search            { get { return images[12]; } }
		public static Image ReSearch          { get { return images[13]; } }
		public static Image Help              { get { return images[14]; } }
		public static Image ZoomIn            { get { return images[15]; } }
		public static Image ZoomOut           { get { return images[16]; } }
		public static Image Back              { get { return images[17]; } }
		public static Image Forward           { get { return images[18]; } }
		public static Image Favorites         { get { return images[19]; } }
		public static Image AddToFavorites    { get { return images[20]; } }
		public static Image Stop              { get { return images[21]; } }
		public static Image Refresh           { get { return images[22]; } }
		public static Image Home              { get { return images[23]; } }
		public static Image Edit              { get { return images[24]; } }
		public static Image Tools             { get { return images[25]; } }
		public static Image Tiles             { get { return images[26]; } }
		public static Image Icons             { get { return images[27]; } }
		public static Image List              { get { return images[28]; } }
		public static Image Details           { get { return images[29]; } }
		public static Image Pane              { get { return images[30]; } }
		public static Image Culture           { get { return images[31]; } }
		public static Image Languages         { get { return images[32]; } }
		public static Image History           { get { return images[33]; } }
		public static Image Mail              { get { return images[34]; } }
		public static Image Parent            { get { return images[35]; } }
		public static Image FolderProperties  { get { return images[36]; } }
	}
}
