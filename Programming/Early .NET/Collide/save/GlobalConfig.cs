// GlobalConfig.cs - The global configuration dialog
//
// Copyright 2000 Microsoft

namespace Collide
{
using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;

/// <summary>
///    Summary description for GlobalConfig.
/// </summary>
public class GlobalConfig : System.Windows.Forms.Form
{
	private System.ComponentModel.IContainer components;
	private System.Windows.Forms.ToolTip toolTip1;
	private System.Windows.Forms.Button button1;
	private System.Windows.Forms.Button Cancel;
	private System.Windows.Forms.Button OK;
	
	private System.Windows.Forms.CheckBox RandomOnStartup;
	
	
	private System.Windows.Forms.Label label11;
	
	
	private System.Windows.Forms.TextBox RestartCount;
	
	private System.Windows.Forms.CheckBox FullScreen;

	BounceWnd	bounceWnd;	

    public GlobalConfig(BounceWnd bounceWnd)
    {
        //
        // Required for Win Form Designer support
        //
        InitializeComponent();

		this.bounceWnd = bounceWnd;
		CopyData(true);

		toolTip1.SetToolTip(RestartCount, "# of frames to wait before restart (0 = never)");
		toolTip1.SetToolTip(RandomOnStartup, "Choose a random varset on startup or restart");
		toolTip1.SetToolTip(FullScreen, "Run the simulation full-screen");
    }

	void CopyData(bool toForm)
	{
		if (toForm)
		{
			this.FullScreen.Checked = bounceWnd.FullScreen;
			this.RandomOnStartup.Checked = bounceWnd.RandomOnStartup;
			this.RestartCount.Text = bounceWnd.RestartCount.ToString();
		}
		else
		{
			bounceWnd.FullScreen = FullScreen.Checked;
			bounceWnd.RandomOnStartup = RandomOnStartup.Checked;
			bounceWnd.RestartCount = Convert.ToInt32(RestartCount.Text);
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
		this.RestartCount = new System.Windows.Forms.TextBox();
		this.FullScreen = new System.Windows.Forms.CheckBox();
		this.label11 = new System.Windows.Forms.Label();
		this.toolTip1 = new System.Windows.Forms.ToolTip(this.components);
		this.Cancel = new System.Windows.Forms.Button();
		this.RandomOnStartup = new System.Windows.Forms.CheckBox();
		this.button1 = new System.Windows.Forms.Button();
		this.OK = new System.Windows.Forms.Button();
		this.RestartCount.Location = new System.Drawing.Point(104, 72);
		this.RestartCount.TabIndex = 2;
		this.RestartCount.Text = "textBox2";
		this.FullScreen.AccessibleRole = System.Windows.Forms.AccessibleRole.CheckButton;
		this.FullScreen.Location = new System.Drawing.Point(16, 16);
		this.FullScreen.Size = new System.Drawing.Size(80, 16);
		this.FullScreen.TabIndex = 0;
		this.FullScreen.Text = "Full Screen";
		this.label11.Location = new System.Drawing.Point(16, 72);
		this.label11.Size = new System.Drawing.Size(80, 16);
		this.label11.TabIndex = 5;
		this.label11.Text = "Restart Count";
		this.Cancel.Location = new System.Drawing.Point(240, 48);
		this.Cancel.TabIndex = 8;
		this.Cancel.Text = "Cancel";
		this.Cancel.Click += new System.EventHandler(this.Cancel_Click);
		this.RandomOnStartup.AccessibleRole = System.Windows.Forms.AccessibleRole.CheckButton;
		this.RandomOnStartup.Location = new System.Drawing.Point(16, 40);
		this.RandomOnStartup.Size = new System.Drawing.Size(128, 16);
		this.RandomOnStartup.TabIndex = 6;
		this.RandomOnStartup.Text = "Random On Startup";
		this.button1.Location = new System.Drawing.Point(256, 200);
		this.button1.Size = new System.Drawing.Size(0, 0);
		this.button1.TabIndex = 9;
		this.button1.Text = "button1";
		this.OK.Location = new System.Drawing.Point(240, 8);
		this.OK.TabIndex = 7;
		this.OK.Text = "OK";
		this.OK.Click += new System.EventHandler(this.OK_Click);
		this.AutoScaleBaseSize = new System.Drawing.Size(5, 13);
		this.ClientSize = new System.Drawing.Size(336, 109);
		this.Controls.AddRange(new System.Windows.Forms.Control[] {this.button1,
																	  this.Cancel,
																	  this.OK,
																	  this.RandomOnStartup,
																	  this.RestartCount,
																	  this.label11,
																	  this.FullScreen});
		this.Text = "Global Configuration";

	}
	protected void Cancel_Click(object sender, System.EventArgs e)
	{
		DialogResult = DialogResult.Cancel;
		Close();
	}
	protected void OK_Click(object sender, System.EventArgs e)
	{
		CopyData(false);
		DialogResult = DialogResult.OK;
		Close();
	}
}
}
