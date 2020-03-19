// Form1.cs - The main form
//
// This class implements the main form for the application. It containbs the timer that fires off
// to do the rendering, and the handlers for the user actions (click and keypress)
//
// Copyright 2000 Microsoft

namespace Collide
{
using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;
using System.Data;
using System.Runtime.InteropServices;

[StructLayout(LayoutKind.Sequential)]
struct Win32RECT
{
	public int left;
	public int top;
	public int right;
	public int bottom;

	[DllImport("user32.dll", EntryPoint="GetWindowRect")]
	static extern bool GetWindowRectNative(int hwnd, ref Win32RECT corners);

	public void GetWindowRect(int hwnd)
	{
		GetWindowRectNative(hwnd, ref this);
	}

	public int Width
	{
		get
		{
			return(right - left);
		}
	}

	public int Height
	{
		get
		{
			return(bottom - top);
		}
	}

	public override string ToString()
	{
		return(String.Format("top, left,bottom, right: {0} {1} {2} {3}", top, left, bottom, right));	
	}
}

/// <summary>
///    Summary description for Form1.
/// </summary>
public class Form1 : System.Windows.Forms.Form
{
    /// <summary> 
    ///    Required designer variable
    /// </summary>
    private System.ComponentModel.Container components;
	
	private System.Windows.Forms.Timer timer1;

	BounceWnd	bounceWnd = null;
	bool		firstPaint = true;
	bool		fullScreen = false;

    public Form1(string[] args)
    {
        //
        // Required for Win Form Designer support
        //
        InitializeComponent();

		CommandLine commandLine = new CommandLine(args);

		if (commandLine.SlashParams["/p"] != null)
		{
			string handleString = (string) commandLine.SlashParams["/p"];
			int handle = Int32.Parse(handleString);
			bounceWnd = new BounceWnd(this, (IntPtr) handle, true);
			Visible = false;

			try 
			{
				Win32RECT corners = new Win32RECT();
				corners.GetWindowRect(handle);
				Console.WriteLine("Corners: {0}", corners);

				this.Height = corners.Height;
				this.Width = corners.Width;
				Console.WriteLine("height, width: {0} {1}", 
					corners.Height, corners.Width);
			}
			catch (Exception e)
			{
				Console.WriteLine("Exception: {0}", e);
			}
		}
		else if (commandLine.SlashParams["/c"] != null)
		{
			firstPaint = false;
		}
		else
		{
			bounceWnd = new BounceWnd(this, this.Handle, false);

				// if it's full screen, change the size and the border...
			SetFullScreen();
			Visible = true;
		}
	}

	public void SetFullScreen()
	{
		if (fullScreen == bounceWnd.FullScreen)
			return;

		fullScreen = bounceWnd.FullScreen;

		if (fullScreen)
		{
			this.Bounds = Screen.GetBounds(this);
			BorderStyle = FormBorderStyle.None;
		}
		else
		{
			this.Bounds = new Rectangle(100, 100, 500, 500);
			BorderStyle = FormBorderStyle.Sizable;
		}
	}

    /// <summary>
    ///    Clean up any resources being used
    /// </summary>
    public override void Dispose()
    {
        base.Dispose();
        components.Dispose();
    }

    /// <summary>
    ///    Required method for Designer support - do not modify
    ///    the contents of this method with the code editor
    /// </summary>
    private void InitializeComponent()
	{
		this.components = new System.ComponentModel.Container();
		this.timer1 = new System.Windows.Forms.Timer(components);
		
		timer1.Interval = 3;
		timer1.Enabled = true;
		//@design timer1.SetLocation(new System.Drawing.Point(7, 7));
		timer1.Tick += new System.EventHandler(timer1_Timer);
		
		this.AutoScaleBaseSize = new System.Drawing.Size(5, 13);
		this.Text = "Collide";
		//@design this.TrayLargeIcon = true;
		//@design this.TrayHeight = 93;
		this.BackColor = System.Drawing.Color.Black;
		this.ClientSize = new System.Drawing.Size(720, 429);
		KeyPress += new System.Windows.Forms.KeyPressEventHandler(Form_KeyPress);
		DoubleClick += new System.EventHandler(Form1_DoubleClick);
		Resize += new System.EventHandler(Form_Resize);
		MouseUp += new System.Windows.Forms.MouseEventHandler(Form_MouseUp);
		
		
	}
	protected void Form_KeyPress(object sender, KeyPressEventArgs e)
	{
		Close();
	}
	protected void Form1_DoubleClick(object sender, System.EventArgs e)
	{
		Config config = new Config(bounceWnd, bounceWnd.Setup);

		DialogResult dr = config.ShowDialog();
		bounceWnd.DoSetup();
		SetFullScreen();
	}
	protected void timer1_Timer(object sender, System.EventArgs e)
	{
		if (bounceWnd != null)
			bounceWnd.Render();
	}
    /*
     * The main entry point for the application.
     *
     */
    public static void Main(string[] args) 
    {
		Form1 form = new Form1(args);

		if (form.Visible)
		{
	        Application.Run(form);
		}
		else
		{
			Console.WriteLine("Main");
			//form.bounceWnd.DoSetup();
	        Application.Run();
		}
    }

	protected override void OnPaint(PaintEventArgs pe)
	{
			// this check is a workaround for a bug present in the PDC release of 
			// the .NET SDK. In it, Windows.Forms send spurious paint events. If we allowed
			// them through, it would result in a reset of the animation, which would
			// cause it to jerk.
		if (firstPaint)
		{
			Console.WriteLine("FirstPaint");
			bounceWnd.DoSetup();
			firstPaint = false;
		}
	}

	protected void Form_Resize(object sender, EventArgs e)
	{
		if (bounceWnd != null)
		{
			Console.WriteLine("Form_Resize");
			bounceWnd.DoSetup();
		}
	}

		// Set up the context menu. In it, we present the options to add a new varset,
		// save the current one, or choose from one of the existing varsets...
	protected void Form_MouseUp(object sender, MouseEventArgs e)
	{
		if (e.Button != MouseButtons.Right)
			return;

		ContextMenu cm = new ContextMenu();
		cm.MenuItems.Add(new MenuItem("New Varset", new EventHandler(context_click)));
		cm.MenuItems.Add(new MenuItem("Save Varset", new EventHandler(context_click)));

		cm.MenuItems.Add(new MenuItem("-"));
		cm.MenuItems.Add(new MenuItem("Global Config", new EventHandler(context_global_config)));

		cm.MenuItems.Add(new MenuItem("-"));

		bounceWnd.AddContextMenuChoices(cm, new EventHandler(context_click_item));

		cm.MenuItems.Add(new MenuItem("-"));
		cm.MenuItems.Add(new MenuItem("About", new EventHandler(context_about)));

		cm.Show(this, new Point(e.X, e.Y));
	}

	protected void context_click(object sender, System.EventArgs e)
	{
		MenuItem item = (MenuItem) sender;

		switch (item.Index)
		{
		case 0:			// new varset
			bounceWnd.NewSetup();
			break;
		case 1:			// save varset
			bounceWnd.AddSetup();
			break;
		}
	}
	protected void context_click_item(object sender, System.EventArgs e)
	{
		MenuItem item = (MenuItem) sender;

		bounceWnd.SetCurrentConfig(item.Index - 5);
		bounceWnd.DoSetup();

	}

		// configure the global settings...
	protected void context_global_config(object sender, System.EventArgs e)
	{
		GlobalConfig globalConfig = 
			new GlobalConfig(bounceWnd);

		DialogResult dr = globalConfig.ShowDialog();
		bounceWnd.DoSetup();
		SetFullScreen();
	}

	protected void context_about(object sender, System.EventArgs e)
	{
		About about = new About();
		about.ShowDialog();
	}
}
}
