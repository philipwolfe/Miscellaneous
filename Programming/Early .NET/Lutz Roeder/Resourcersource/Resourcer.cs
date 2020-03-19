// Resourcer for .NET by Lutz Roeder, August 2000.
// http://www.aisto.com/roeder/dotnet
//

using System;
using System.Collections;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.Serialization.Formatters.Binary;
using System.Resources;
using System.Threading;
using System.Windows.Forms;

[assembly: AssemblyVersion("2.0.50.0")]

namespace Resourcer.Application
{

	class MainFrame : Form
	{
		public static StatusBar StatusBar = new StatusBar();
		private int WindowCounter = 1;

		[STAThread()]
		public static void Main(string[] args)
		{
			System.Windows.Forms.Application.Run(new MainFrame());
		}

		public MainFrame()
		{
			Icon = new Icon(GetType().Module.Assembly.GetManifestResourceStream("Resourcer.ico"));
			Text = "Lutz Roeder's .NET Resourcer";
			Font = new Font("Tahoma", 8.25f);
			StartPosition = FormStartPosition.WindowsDefaultBounds;
    
			AllowDrop = true;
			DragEnter += new DragEventHandler(Me_DragEnter);
			DragDrop += new DragEventHandler(Me_DragDrop);

			IsMdiContainer = true;

			Menu = new MainMenu();
			MenuItem File = Menu.MenuItems.Add("&File");
			File.MergeType = MenuMerge.MergeItems;
			File.MergeOrder = 0;
			MenuItem FileNew = File.MenuItems.Add("&New", new EventHandler(New_Click));
			FileNew.Shortcut = Shortcut.CtrlN;
			FileNew.MergeOrder = 10;
			MenuItem FileOpen = File.MenuItems.Add("&Open...", new EventHandler(Open_Click));
			FileOpen.Shortcut = Shortcut.CtrlO;
			FileOpen.MergeOrder = 20;
			MenuItem FileSeparator = File.MenuItems.Add("-");
			FileSeparator.MergeOrder = 30;
			MenuItem FileExit = File.MenuItems.Add("E&xit", new EventHandler(Exit_Click));
			FileExit.MergeOrder = 40;
			MenuItem Window = Menu.MenuItems.Add("&Window");
			Window.MergeOrder = 300;
			Window.MdiList = true;
			MenuItem Help = Menu.MenuItems.Add("&Help");
			Help.MergeOrder = 400;    
			Help.MenuItems.Add("&About .NET Resourcer", new EventHandler(About_Click));

			StatusBar.Text = "OK.";
			Controls.Add(StatusBar);
			New_Click(this, null);
		}

		private void New_Click(Object s, EventArgs e)
		{
			Document d = new Document();
			d.MdiParent = this;
			d.Show();
			d.Text = "Noname" + WindowCounter;
			WindowCounter++;
		}

		private void Open_Click(Object sender, EventArgs e)
		{
			OpenFileDialog o = new OpenFileDialog();
			o.Filter = "Resources files (*.resources)|*.resources|ResX files (*.resX)|*.resX|Executable files (*.exe)|*.exe|Library files (*.dll)|*.dll|All files (*.*)|*.*";
			o.Title = "Open";
			if (o.ShowDialog() == DialogResult.OK)
				LoadResourceFile(o.FileName);
		}

		private void Exit_Click(Object s, EventArgs e)
		{
			Close();
		}

		private void About_Click(Object s, EventArgs e)
		{
			AboutDialog d = new AboutDialog();
			d.ShowDialog(this);
		}

		protected void Me_DragDrop(Object s, DragEventArgs e)
		{
			if (e.Data.GetDataPresent("FileDrop"))
				foreach (String FileName in (String[]) e.Data.GetData("FileDrop"))
					LoadResourceFile(FileName);
		}

		protected void Me_DragEnter(Object s, DragEventArgs e)
		{
			e.Effect = DragDropEffects.All;
		}

		private void LoadResourceFile(String FileName)
		{
			String Extension = Path.GetExtension(FileName);
			if ((String.Compare(Extension, ".exe", true) == 0) || (String.Compare(Extension, ".dll", true) == 0))
			{
				try
				{
					Assembly m = Assembly.LoadFrom(FileName);
					foreach (String s in m.GetManifestResourceNames())
					{
						Stream t = m.GetManifestResourceStream(s);
						if (t != null)
						{
							Document d = new Document();
							try
							{
								d.LoadResourceStream(t);
								d.MdiParent = this;
								d.Show();
								d.Text = FileName + " (" + s + ")";
							}
							catch
							{
							}

							t.Close();
						}
					}
				}
				catch (Exception x)
				{
					MessageBox.Show(x.Message, ".NET Resourcer", MessageBoxButtons.OK);
				}
			}
			else
			{
				Document d = new Document();
				d.MdiParent = this;
				d.Show();
				d.LoadResourceFile(FileName);
			}
		}
	}

	class Document : Form
	{
		private String FileName = null;
		private ListView List = new ListView();
		private Hashtable Resource = new Hashtable();

		public Document()
		{
			Icon = new Icon(GetType().Module.Assembly.GetManifestResourceStream("Resourcer.ico"));
			ClientSize = new Size(600, 400);
    
			List.Location = new Point(96, 8);
			List.Dock = DockStyle.Fill;
			List.View = View.Details;
			List.FullRowSelect = true;
			List.HeaderStyle = ColumnHeaderStyle.Nonclickable;
			List.AllowColumnReorder = true;
			List.Font= new Font("Tahoma", 8);

			ColumnHeader nameHeader = new ColumnHeader();
			nameHeader.Text = "Name";
			nameHeader.Width = (ClientSize.Width - 10) / 3;
			nameHeader.TextAlign = HorizontalAlignment.Left;
			List.Columns.Add(nameHeader);

			ColumnHeader typeHeader = new ColumnHeader();
			typeHeader.Text = "Type";
			typeHeader.Width = (ClientSize.Width - 10) / 3;
			typeHeader.TextAlign = HorizontalAlignment.Left;
			List.Columns.Add(typeHeader);

			ColumnHeader valueHeader = new ColumnHeader();
			valueHeader.Text = "Value";
			valueHeader.Width = (ClientSize.Width - 10) / 3;
			valueHeader.TextAlign = HorizontalAlignment.Left;
			List.Columns.Add(valueHeader);

			List.Sorting = SortOrder.Ascending;
			List.ItemActivate += new EventHandler(List_ItemActivate);
			Controls.Add(List);

			Menu = new MainMenu();
			MenuItem File = Menu.MenuItems.Add("&File");
			File.MergeType = MenuMerge.MergeItems;    
			File.MergeOrder = 0;
			MenuItem FileSave = new MenuItem("&Save", new EventHandler(Save_Click), Shortcut.CtrlS);
			FileSave.MergeOrder = 21;
			File.MenuItems.Add(FileSave);
			MenuItem FileSaveAs = File.MenuItems.Add("Save &As...", new EventHandler(SaveAs_Click));
			FileSaveAs.MergeOrder = 22;
			MenuItem Edit = Menu.MenuItems.Add("&Edit");
			Edit.MergeOrder = 100;
			Edit.MenuItems.Add(new MenuItem("Cu&t", new EventHandler(Cut_Click), Shortcut.CtrlX));
			Edit.MenuItems.Add(new MenuItem("&Copy", new EventHandler(Copy_Click), Shortcut.CtrlC));
			Edit.MenuItems.Add(new MenuItem("&Paste", new EventHandler(Paste_Click), Shortcut.CtrlV));
			Edit.MenuItems.Add(new MenuItem("&Delete", new EventHandler(Delete_Click), Shortcut.Del));
			Edit.MenuItems.Add("-");
			Edit.MenuItems.Add(new MenuItem("&Rename...", new EventHandler(Rename_Click), Shortcut.CtrlR));
			Edit.MenuItems.Add("-");
			Edit.MenuItems.Add(new MenuItem("Select &All", new EventHandler(SelectAll_Click), Shortcut.CtrlA));
			MenuItem Add = Menu.MenuItems.Add("&Add");
			Add.MergeOrder = 200;
			Add.MenuItems.Add(new MenuItem("Add &String...", new EventHandler(AddString_Click), Shortcut.CtrlT));
			Add.MenuItems.Add(new MenuItem("Add &File...", new EventHandler(AddFile_Click), Shortcut.CtrlF));    
			Add.MenuItems.Add(new MenuItem("Add &Multiple Files...", new EventHandler(AddMultipleFiles_Click), Shortcut.CtrlM));
		}

		private void Initialize()
		{
			if (FileName != null) this.Text = FileName;
    
			List.Items.Clear();
			foreach (DictionaryEntry e in Resource)
			{
				String t = (e.Value.GetType() == typeof(String)) ? e.Value.ToString() : "";
				List.Items.Add(new ListViewItem(new String[] { (String) e.Key, e.Value.GetType().FullName, t }, 0));
			}
		}

		public void LoadResourceFile(String FileName)
		{
			this.FileName = FileName;
			String x = Path.GetExtension(FileName);
			if ((String.Compare(x, ".xml", true) == 0) || (String.Compare(x, ".resX", true) == 0))
			{
				ResXResourceReader r = new ResXResourceReader(FileName);	
				IDictionaryEnumerator n = r.GetEnumerator();
				while (n.MoveNext()) 
					if (!Resource.ContainsKey(n.Key))
						Resource.Add(n.Key, n.Value);
				r.Close();
				Initialize();
			}
			else
			{
				FileStream s = new FileStream(FileName, FileMode.Open);
				LoadResourceStream(s);
				s.Close();
			}
		}

		public void LoadResourceStream(Stream Stream)
		{
			ResourceReader r = new ResourceReader(Stream);
			IDictionaryEnumerator n = r.GetEnumerator();
			while (n.MoveNext())
				if (!Resource.ContainsKey(n.Key))
					Resource.Add(n.Key, n.Value);
			r.Close();
			Initialize();
		}
    
		public void SaveResourceFile(String FileName)
		{
			this.FileName = FileName;
			String x = Path.GetExtension(FileName);
			if ((String.Compare(x, ".xml", true) == 0) || (String.Compare(x, ".resX", true) == 0))
			{
				ResXResourceWriter r = new ResXResourceWriter(FileName);
				IDictionaryEnumerator n = Resource.GetEnumerator();
				while (n.MoveNext()) r.AddResource((string) n.Key, (object) n.Value);
				r.Generate();
				r.Close();
			}
			else
			{
				ResourceWriter r = new ResourceWriter(FileName);
				IDictionaryEnumerator n = Resource.GetEnumerator();
				while (n.MoveNext()) r.AddResource((string) n.Key, (object) n.Value);
				r.Generate();
				r.Close();
			}
		}

		private void List_ItemActivate(object Sender, EventArgs e)
		{
			if (List.SelectedItems.Count != 1) return;
			String Key = List.SelectedItems[0].Text;
			if (Key == null) return;

			object Value = Resource[Key];
    
			if (Value.GetType() == typeof(Icon))
			{
				Icon i = (Icon) Value;
				BitmapForm b = new BitmapForm(Text + " [" + Key + "]", i.ToBitmap());
				b.MdiParent = this.MdiParent;
				b.Show();
				return;
			}

			if (Value.GetType() == typeof(Bitmap))
			{
				BitmapForm b = new BitmapForm(Text + " [" + Key + "]", (Bitmap) Value);
				b.MdiParent = this.MdiParent;
				b.Show();
				return;
			}

			if (Value.GetType() == typeof(String))
			{
				TextBoxDialog d = new TextBoxDialog("Edit String", new String[] { "Name:", "Value:" } );
				d.TextBox[0].Text = Key;
				d.TextBox[1].Text = (String) Value;
				if (d.ShowDialog(this) == DialogResult.OK)
					if (d.TextBox[0].Text != "")
					{
						Resource.Remove(Key);
						Resource.Add(d.TextBox[0].Text, d.TextBox[1].Text);
						Initialize();
					}
				return;      	
			}

			if (Value.GetType() == typeof(Cursor))
			{
				Cursor c = (Cursor) Value;
				Bitmap a = new Bitmap(c.Size.Width, c.Size.Height);
				Graphics g = Graphics.FromImage(a);
				g.FillRectangle(new SolidBrush(Color.DarkCyan), 0, 0, a.Width, a.Height);
				c.Draw(g, new Rectangle(0, 0, a.Width, a.Height));
				BitmapForm b = new BitmapForm(Text + " [" + Key + "]", a);
				b.MdiParent = this.MdiParent;
				b.Show();
				return;
			}
		}

		private void Save_Click(object Sender, EventArgs e)
		{
			if (FileName != null)
				SaveResourceFile(FileName);
			else
				SaveAs_Click(this, null);
		}

		private void SaveAs_Click(object Sender, EventArgs e)
		{
			SaveFileDialog s = new SaveFileDialog();
			s.Title = "Save As";
			s.Filter = "Resources files (*.resources)|*.resources|ResX files (*.resX)|*.resX|All files (*.*)|*.*";
			if (s.ShowDialog() == DialogResult.OK)
			{
				Text = FileName = s.FileName;
				SaveResourceFile(FileName);
			}
		}

		private void Cut_Click(object Sender, EventArgs e)
		{
			if (List.SelectedItems.Count < 1) return;    	
			Hashtable h = new Hashtable();
			foreach (ListViewItem i in List.SelectedItems)
			{
				try
				{
					h.Add(i.Text, Resource[i.Text]);
					Resource.Remove(i.Text);
				}
				catch { }
			}
			Initialize();
			Clipboard.SetDataObject(h);
			MainFrame.StatusBar.Text = h.Count + " object(s) copied to clipboard.";
		}

		private void Copy_Click(object Sender, EventArgs e)
		{
			if (List.SelectedItems.Count < 1) return;    	
			Hashtable h = new Hashtable();
			foreach (ListViewItem i in List.SelectedItems)
			{
				try
				{
					ICloneable Value = (ICloneable) Resource[i.Text];
					h.Add(i.Text, Value.Clone());
				}
				catch { }
			}
			Clipboard.SetDataObject(h);
			MainFrame.StatusBar.Text = h.Count + " object(s) copied to clipboard.";
		}

		private void Paste_Click(object Sender, EventArgs e)
		{
			IDataObject d = Clipboard.GetDataObject();
			if (d.GetDataPresent(typeof(Hashtable).FullName))
			{
				Hashtable h = (Hashtable) d.GetData(typeof(Hashtable));
				MainFrame.StatusBar.Text = h.Count + " object(s) added from clipboard.";
				foreach (DictionaryEntry n in h)
				{
					if (!Resource.ContainsKey(n.Key))
					{
						ICloneable c = (ICloneable) n.Value;
						object o = c.Clone();
						Resource.Add(n.Key, o);
					}
					else
					{
						MainFrame.StatusBar.Text = "Paste partially failed. Resource name already exists.";
					}
				}
				Initialize();
			}
		}

		private void Delete_Click(object Sender, EventArgs e)
		{
			foreach (ListViewItem l in List.SelectedItems)
				if (l.Text != null)
					Resource.Remove(l.Text);
			MainFrame.StatusBar.Text = List.SelectedItems.Count + " object(s) deleted.";
			Initialize();
		}

		private void SelectAll_Click(object Sender, EventArgs e)
		{
			foreach (ListViewItem i in List.Items) i.Selected = true;
		}

		private void Rename_Click(object Sender, EventArgs e)
		{
			if (List.SelectedItems.Count != 1) return;
			String Key = List.SelectedItems[0].Text;
			if (Key == null) return;

			TextBoxDialog d = new TextBoxDialog("Rename Resource", new String[] { "Name:" });
			d.TextBox[0].Text = Key;
			if (d.ShowDialog(this) == DialogResult.OK)
			{
				object value = Resource[Key];
				Resource.Remove(Key);
				Resource.Add(d.TextBox[0].Text, value);
				Initialize();
			}
		}

		private void AddString_Click(object Sender, EventArgs e)
		{
			TextBoxDialog d = new TextBoxDialog("Add String", new String[] { "Name:", "Value:" });
			if (d.ShowDialog(this) == DialogResult.OK)
				if ((d.TextBox[0].Text != "") && (!Resource.ContainsKey(d.TextBox[0].Text)))
				{
					Resource.Add(d.TextBox[0].Text, d.TextBox[1].Text);
					Initialize();
				}
		}

		private void AddFile_Click(object Sender, EventArgs e)
		{
			FileDialog d = new FileDialog();
			d.Text = "Add File";
			if (d.ShowDialog() == DialogResult.OK)
				if ((d.DialogName.Text != "") && (!Resource.ContainsKey(d.DialogName.Text)))
				{
					object o = LoadResource(d.FileName.Text);
					if (o != null)
					{
						Resource.Add(d.DialogName.Text, o);
						Initialize();
					}
				}    	
		}

		private void AddMultipleFiles_Click(object Sender, EventArgs e)
		{
			OpenFileDialog d = new OpenFileDialog();
			d.Filter = "All files (*.*)|*.*";
			d.Title = "Add Multiple Files";
			d.Multiselect = true;
			if (d.ShowDialog() == DialogResult.OK)
			{
				foreach (String FileName in d.FileNames)
				{
					String k = Path.ChangeExtension(FileName, null);
					if ((k != "") && (!Resource.ContainsKey(k)))
					{
						object o = LoadResource(FileName);
						if (o != null) Resource.Add(k, o);
					}    	
				}
				Initialize();
			}
		}
    
		public object LoadResource(String FileName)
		{
			String x = Path.GetExtension(FileName);

			if (String.Compare(x, ".cur", true) == 0) return new Cursor(FileName);
			if (String.Compare(x, ".ico", true) == 0) return new Icon(FileName);

			try { return new Bitmap(FileName); } 
			catch { }
    
			try
			{
				Stream r = File.Open(FileName, FileMode.Open);
				try
				{
					BinaryFormatter c = new BinaryFormatter();
					object o = c.Deserialize(r);
					r.Close();
					return o;
				}
				catch { r.Close(); }
			}
			catch { }
    
			try
			{
				FileStream s = new FileStream(FileName, FileMode.Open, FileAccess.Read);
				BinaryReader r = new BinaryReader(s);
				Byte[] d = new Byte[(int) s.Length];
				d = r.ReadBytes((int) s.Length);
				s.Close();
				return d;
			}
			catch (Exception e) { MessageBox.Show(e.Message, ".NET Resourcer", MessageBoxButtons.OK); }

			return null;
		}
	}

	class BitmapForm : Form
	{
		private Bitmap Bitmap;

		public BitmapForm(String Text, Bitmap Bitmap)
		{
			Icon = new Icon(GetType().Module.Assembly.GetManifestResourceStream("Resourcer.ico"));
			Font = new Font("Tahoma", 8);    
			this.Text = Text;
			this.Bitmap = Bitmap;
			ClientSize = new Size(Bitmap.Size.Width + 110, Bitmap.Size.Height + 10);
		}

		protected override void OnResize(EventArgs e)
		{
			Refresh();
		}

		protected override void OnPaintBackground(PaintEventArgs e)
		{
		}

		protected override void OnPaint(PaintEventArgs e)
		{
			Canvas v = new Canvas(e);
			if (v.Empty) return;
			Graphics g = v.Graphics;
			g.FillRectangle(new SolidBrush(Color.White), e.ClipRectangle);
			Point p = new Point((ClientSize.Width - 100 - Bitmap.Width) / 2, (ClientSize.Height - Bitmap.Height) / 2);
			g.FillRectangle(new SolidBrush(Color.DarkCyan), p.X - 1, p.Y - 1, Bitmap.Width + 2, Bitmap.Height + 2);
			g.DrawImage(Bitmap, p.X, p.Y, Bitmap.Width, Bitmap.Height);
			g.DrawRectangle(new Pen(Color.Black, 1), p.X - 1, p.Y - 1, Bitmap.Width + 1, Bitmap.Height + 1);
			String s = "(" + Bitmap.Width + " x " + Bitmap.Height + ")";
			g.DrawString("Size: " + s, Font, new SolidBrush(Color.Black), p.X + Bitmap.Width + 10, p.Y);
			v.Flush();
		}
	}

	class Canvas
	{
		public static Boolean Enable = true;
		public Graphics Graphics = null;
		public Boolean Empty = false;
		private Graphics Target = null;
		private Rectangle ClipRectangle = new Rectangle(0, 0, 0, 0);
		private Bitmap Bitmap = null;
  
		public Canvas(PaintEventArgs e)
		{
			Graphics = e.Graphics;
			ClipRectangle = e.ClipRectangle;
			Target = Graphics;
    
			if (!Enable) return;
    
			if ((ClipRectangle.Width == 0) || (ClipRectangle.Height == 0))
			{
				Empty = true;
				return;
			} 

			Bitmap = new Bitmap(ClipRectangle.Width, ClipRectangle.Height, Target);
			Graphics = Graphics.FromImage(Bitmap);
			Graphics.TranslateTransform(-ClipRectangle.X, -ClipRectangle.Y);
			Graphics.SetClip(ClipRectangle);
		}

		public void Flush()
		{
			if ((!Enable) || (Empty) || (Target == null) || (Bitmap == null)) return;
    
			Graphics.Dispose();
			Target.DrawImageUnscaled(Bitmap, ClipRectangle.X, ClipRectangle.Y);
			Bitmap.Dispose();
		}
	}

	class TextBoxDialog : Form
	{
		public TextBox[] TextBox;
  
		public TextBoxDialog(String Text, String[] Label)
		{
			this.Text = Text;
			Icon = null;
			FormBorderStyle = FormBorderStyle.FixedDialog;
			Font = new Font("Tahoma", 8);
			ControlBox = true;
			MaximizeBox = false;
			MinimizeBox = false;
			ShowInTaskbar = false;
			StartPosition = FormStartPosition.CenterParent;      
			int n = Label.GetLength(0);
			TextBox = new TextBox[n];
			ClientSize = new Size(338, 32 * n + 55);
			for (int i = 0; i < n; i++)
			{
				Label l = new Label();
				l.FlatStyle = FlatStyle.System;
				l.Location = new Point(16, 32 * i + 16 + 3);
				l.Size = new Size(40, 16);
				l.Font = Font;
				l.Text = Label[i];
				Controls.Add(l);
				TextBox[i] = new TextBox();
				TextBox[i].Location = new Point(59, 32 * i + 16);
				TextBox[i].Size = new Size(264, 16);
				TextBox[i].Font = Font;
				Controls.Add(TextBox[i]);      
			}
			Button Accept = new Button();
			Accept.FlatStyle = FlatStyle.System;
			Accept.Location = new Point(168, 32 * n + 16);
			Accept.Size = new Size(75, 23);
			Accept.Font = Font;
			Accept.Text = "OK";
			Accept.DialogResult = DialogResult.OK;
			Controls.Add(Accept);
			AcceptButton = Accept;
			Button Cancel = new Button();
			Cancel.FlatStyle = FlatStyle.System;
			Cancel.Location = new Point(248, 32 * n + 16);
			Cancel.Size = new Size(75, 23);    
			Cancel.Font = Font;    
			Cancel.Text = "Cancel";
			Cancel.DialogResult = DialogResult.Cancel;
			CancelButton = Cancel;
			Controls.Add(Cancel);
		}
	}

	class FileDialog : Form
	{
		public TextBox DialogName = new TextBox();
		public TextBox FileName = new TextBox();
  	
		public FileDialog()
		{
			Icon = null;
			FormBorderStyle = FormBorderStyle.FixedDialog;
			ControlBox = true;
			Font = new Font("Tahoma", 8);
			MaximizeBox = false;
			MinimizeBox = false;
			ClientSize = new Size(338, 119);
			ShowInTaskbar = false;    
			StartPosition = FormStartPosition.CenterParent;
			Button Accept = new Button();
			Accept.FlatStyle = FlatStyle.System;
			Accept.Location = new Point(168, 80);
			Accept.Size = new Size (75, 23);
			Accept.TabIndex = 2;
			Accept.Text = "OK";
			Accept.DialogResult = DialogResult.OK;
			Controls.Add(Accept);
			AcceptButton = Accept;
			Button Cancel = new Button();
			Cancel.FlatStyle = FlatStyle.System;
			Cancel.Location = new Point(248, 80);
			Cancel.Size = new Size(75, 23);
			Cancel.TabIndex = 3;
			Cancel.Text = "Cancel";
			Cancel.DialogResult = DialogResult.Cancel;
			Controls.Add(Cancel);
			CancelButton = Cancel;
			Button Browse = new Button();
			Browse.FlatStyle = FlatStyle.System;
			Browse.Location = new Point(297, 48);
			Browse.Size = new Size(25, 20);
			Browse.TabIndex = 4;
			Browse.Text = "...";
			Browse.Click += new EventHandler(Browse_Click);
			Controls.Add(Browse);
			Label NameLabel = new Label();
			NameLabel.FlatStyle = FlatStyle.System;
			NameLabel.Location = new Point(16, 16 + 3);
			NameLabel.Text = "Name:";
			NameLabel.Size = new Size(40, 16);
			Controls.Add(NameLabel);
			DialogName.Location = new Point(59, 16);
			DialogName.TabIndex = 0;
			DialogName.Size = new Size(264, 20);
			Controls.Add (DialogName);
			Label FileLabel = new Label();
			FileLabel.FlatStyle = FlatStyle.System;
			FileLabel.Location = new Point(16, 48 + 3);
			FileLabel.Text = "File:";
			FileLabel.Size = new Size(40, 16);
			Controls.Add(FileLabel);    
			FileName.Location = new Point(59, 48);
			FileName.TabIndex = 1;
			FileName.Size = new Size(230, 20);
			Controls.Add(FileName);
		}

		public void Browse_Click(object Sender, EventArgs e)
		{
			OpenFileDialog d = new OpenFileDialog();
			d.Filter = "All Files (*.*)|*.*";
			d.Title = "Open";
			d.FileName = FileName.Text;
			if (d.ShowDialog() == DialogResult.OK)
			{
				FileName.Text = d.FileName;
				if (DialogName.Text == "") DialogName.Text = Path.GetFileName(d.FileName);
			}
		}
	}

	class AboutDialog : Form
	{
		public AboutDialog()
		{
			Icon = null;
			Text = "About";    	
			ClientSize = new Size(310, 200);
			Font = new Font("Tahoma", 8.25f);
			FormBorderStyle = FormBorderStyle.FixedDialog;
			MaximizeBox = false;
			MinimizeBox = false;
			ControlBox = true;
			ShowInTaskbar = false;
			StartPosition = FormStartPosition.CenterParent;
			PictureBox Picture = new PictureBox();
			Picture.Location = new Point(5, 5);
			Picture.Size = new Size(304, 88);
			Picture.Image = new Bitmap(GetType().Module.Assembly.GetManifestResourceStream("Resourcer.png"));
			Controls.Add(Picture);
			Label Application = new Label();
			Application.Text = "Resource Editor for .NET, Version " + GetType().Module.Assembly.GetName().Version;
			Application.FlatStyle = FlatStyle.System;
			Application.Location = new Point(20,100);
			Application.Size = new Size(250, 16);
			Application.Font = Font;
			Label Copyright = new Label();
			Controls.Add(Application);
			Copyright.Text = "Copyright © 2000-2002 Lutz Roeder.\nAll rights reserved.";
			Copyright.FlatStyle = FlatStyle.System;
			Copyright.Location = new Point(20,118);
			Copyright.Size = new Size(200, 32);
			Copyright.Font = Font;
			Controls.Add(Copyright);
			LinkLabel Link = new LinkLabel();
			Link.FlatStyle = FlatStyle.System;
			Link.Text = "http://www.aisto.com/roeder/dotnet";
			Link.LinkArea = new LinkArea(0, Link.Text.Length);
			Link.Location = new Point(20, 150);
			Link.Size = new Size(200, 16);
			Link.Font = Font;
			Link.Click += new EventHandler(Link_Click);
			Controls.Add(Link);
			Button Accept = new Button();
			Accept.FlatStyle = FlatStyle.System;
			Accept.Location = new Point(230, 170);
			Accept.Text = "OK";
			Accept.Size = new Size(75, 23);
			Accept.Font = Font;
			Accept.TabIndex = 0;
			Accept.DialogResult = DialogResult.OK;
			Controls.Add(Accept);
			AcceptButton = Accept;
			CancelButton = Accept;
		}

		private void Link_Click(object Sender, EventArgs e)
		{
			LinkLabel l = (LinkLabel) Sender;
			Process.Start(l.Text);
			l.LinkVisited = true ;
		}
	}

}