// Config.cs
//
// Copyright 2000 Microsoft

namespace Collide
{
using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;
using Collide;

/// <summary>
/// The main configuration dialog
/// </summary>

public class Config : System.Windows.Forms.Form
{
	private System.ComponentModel.IContainer components;
	
	private System.Windows.Forms.ToolTip toolTip1;
	private System.Windows.Forms.TextBox Name;
	private System.Windows.Forms.Label label9;
	
	
	private System.Windows.Forms.RadioButton Inverse;
	private System.Windows.Forms.RadioButton Squared;
	private System.Windows.Forms.RadioButton Linear;
	private System.Windows.Forms.GroupBox groupBox3;
	private System.Windows.Forms.CheckBox EraseScreen;
	
	private System.Windows.Forms.TextBox BallSizeMax;
	private System.Windows.Forms.TextBox BallSizeMin;
	
	
	
	private System.Windows.Forms.TextBox WallElasticity;
	private System.Windows.Forms.Label label8;
	private System.Windows.Forms.Label label4;
	
	
	
	private System.Windows.Forms.Label label12;
	
	
	
	
	
	private System.Windows.Forms.CheckBox BallErase;
	private System.Windows.Forms.CheckBox BallCollisions;
	private System.Windows.Forms.TextBox BallGravity;
	private System.Windows.Forms.TextBox BallGhost;
	private System.Windows.Forms.TextBox BallVelocity;
	private System.Windows.Forms.TextBox BallElasticity;
	private System.Windows.Forms.TextBox BallCount;
	private System.Windows.Forms.Button button2;
	private System.Windows.Forms.Button button1;
	private System.Windows.Forms.Label label7;
	
	private System.Windows.Forms.Label label3;
	
	private System.Windows.Forms.Label label5;
	
	private System.Windows.Forms.Label label6;
	
	
	
	
	private System.Windows.Forms.Label label1;
	private System.Windows.Forms.GroupBox groupBox2;
	
	private System.Windows.Forms.GroupBox groupBox1;
	private System.Windows.Forms.Label label2;
	
	
	BounceWnd	bounceWnd;
	private System.Windows.Forms.Label label10;
	private System.Windows.Forms.TextBox Title;
	private System.Windows.Forms.Button SetFont;
	Setup	setup;
	public string strFont;
	public Color fontColor;
	public float titleSize;

    public Config(BounceWnd bounceWnd, Setup setup)
    {
        //
        // Required for Win Form Designer support
        //
        InitializeComponent();

		this.bounceWnd = bounceWnd;
		this.setup = setup;

		CopyData(true);

        //
        // TODO: Add any constructor code after InitializeComponent call
        //
		toolTip1.SetToolTip(BallCount, "Number of balls");
		toolTip1.SetToolTip(Name, "Name to use for this setting");
		toolTip1.SetToolTip(Inverse, "More big balls than small balls");
		toolTip1.SetToolTip(Squared, "More small balls than big balls");
		toolTip1.SetToolTip(Linear, "Equal numbers of small and big balls");
		toolTip1.SetToolTip(EraseScreen, "Screen erased at start");
		toolTip1.SetToolTip(BallSizeMin, "Size of the smallest ball");
		toolTip1.SetToolTip(BallSizeMax, "Size of the largest ball");
		toolTip1.SetToolTip(WallElasticity, "Elasticity of the wall. 1.0 means no energy lost, 0.0 means all energy lost");
		toolTip1.SetToolTip(BallErase, "Old positions are erased");
		toolTip1.SetToolTip(BallCollisions, "Balls collide with each other");
		toolTip1.SetToolTip(BallGravity, "Gravity between balls");
		toolTip1.SetToolTip(BallGhost, "Number of positions to show before erase");
		toolTip1.SetToolTip(BallVelocity, "Initial speed of balls");
		toolTip1.SetToolTip(BallElasticity, "Elasticity of collisions between balls. 1.0 means no energy lost, 0.0 means all energy lost");
    }

	void CopyData(bool toForm)
	{
		if (toForm)
		{
			this.BallCount.Text = setup.ballCount.ToString();
			this.BallCollisions.Checked = setup.collisions;
			this.BallElasticity.Text = setup.elasticityBall.ToString();
			this.BallErase.Checked = setup.eraseBalls;
			this.BallGhost.Text = setup.ghost.ToString();
			this.BallGravity.Text = setup.gravityBall.ToString();
			this.BallVelocity.Text = setup.velocity.ToString();
			this.EraseScreen.Checked = setup.erase;
			this.WallElasticity.Text = setup.elasticityWall.ToString();
			this.BallSizeMin.Text = setup.sizeMin.ToString();
			this.BallSizeMax.Text = setup.sizeMax.ToString();
			this.Name.Text = setup.name;

			switch (setup.distribution)
			{
			case Distribute.Distributions.Linear:
				this.Linear.Checked = true;
				break;
			case Distribute.Distributions.Squared:
				this.Squared.Checked = true;
				break;
			case Distribute.Distributions.Inverse:
				this.Inverse.Checked = true;
				break;
			}
			this.Title.Text = setup.strTitle;

			this.strFont = setup.strFont;
			this.fontColor = setup.fontColor;
			this.titleSize = setup.titleSize;
		}
		else
		{
			setup.ballCount =  Convert.ToInt32(this.BallCount.Text);
			setup.collisions = this.BallCollisions.Checked;
			setup.elasticityBall = Convert.ToSingle(this.BallElasticity.Text);
			setup.eraseBalls = this.BallErase.Checked;
			setup.ghost =  Convert.ToInt32(this.BallGhost.Text);
			setup.gravityBall =  Convert.ToSingle(this.BallGravity.Text);
			setup.velocity =  Convert.ToSingle(this.BallVelocity.Text);
			setup.erase = this.EraseScreen.Checked;
			setup.elasticityWall =  Convert.ToSingle(this.WallElasticity.Text);
			setup.sizeMin =  Convert.ToInt32(this.BallSizeMin.Text);
			setup.sizeMax =  Convert.ToInt32(this.BallSizeMax.Text);
			setup.name = this.Name.Text;

			if (Linear.Checked)
				setup.distribution = Distribute.Distributions.Linear;

			if (Squared.Checked)
				setup.distribution = Distribute.Distributions.Squared;

			if (Inverse.Checked)
				setup.distribution = Distribute.Distributions.Inverse;

			setup.strTitle = this.Title.Text;
			setup.strFont = strFont;
			setup.fontColor = fontColor;
			setup.titleSize = titleSize;
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
		this.BallSizeMax = new System.Windows.Forms.TextBox();
		this.BallGhost = new System.Windows.Forms.TextBox();
		this.BallElasticity = new System.Windows.Forms.TextBox();
		this.BallCount = new System.Windows.Forms.TextBox();
		this.label8 = new System.Windows.Forms.Label();
		this.BallGravity = new System.Windows.Forms.TextBox();
		this.SetFont = new System.Windows.Forms.Button();
		this.BallVelocity = new System.Windows.Forms.TextBox();
		this.Inverse = new System.Windows.Forms.RadioButton();
		this.label10 = new System.Windows.Forms.Label();
		this.label12 = new System.Windows.Forms.Label();
		this.WallElasticity = new System.Windows.Forms.TextBox();
		this.Linear = new System.Windows.Forms.RadioButton();
		this.label9 = new System.Windows.Forms.Label();
		this.BallSizeMin = new System.Windows.Forms.TextBox();
		this.label5 = new System.Windows.Forms.Label();
		this.label6 = new System.Windows.Forms.Label();
		this.label7 = new System.Windows.Forms.Label();
		this.label1 = new System.Windows.Forms.Label();
		this.label2 = new System.Windows.Forms.Label();
		this.label3 = new System.Windows.Forms.Label();
		this.EraseScreen = new System.Windows.Forms.CheckBox();
		this.BallCollisions = new System.Windows.Forms.CheckBox();
		this.BallErase = new System.Windows.Forms.CheckBox();
		this.toolTip1 = new System.Windows.Forms.ToolTip(this.components);
		this.Name = new System.Windows.Forms.TextBox();
		this.button1 = new System.Windows.Forms.Button();
		this.button2 = new System.Windows.Forms.Button();
		this.groupBox1 = new System.Windows.Forms.GroupBox();
		this.Squared = new System.Windows.Forms.RadioButton();
		this.groupBox3 = new System.Windows.Forms.GroupBox();
		this.label4 = new System.Windows.Forms.Label();
		this.groupBox2 = new System.Windows.Forms.GroupBox();
		this.Title = new System.Windows.Forms.TextBox();
		this.BallSizeMax.Location = new System.Drawing.Point(48, 56);
		this.BallSizeMax.Size = new System.Drawing.Size(48, 20);
		this.BallSizeMax.TabIndex = 1;
		this.BallSizeMax.Text = "textBox3";
		this.BallGhost.Location = new System.Drawing.Point(80, 104);
		this.BallGhost.TabIndex = 1;
		this.BallGhost.Text = "textBox2";
		this.BallElasticity.Location = new System.Drawing.Point(72, 48);
		this.BallElasticity.TabIndex = 1;
		this.BallElasticity.Text = "textBox2";
		this.BallCount.Location = new System.Drawing.Point(72, 24);
		this.BallCount.TabIndex = 0;
		this.BallCount.Text = "BallCount";
		this.label8.Location = new System.Drawing.Point(8, 56);
		this.label8.Size = new System.Drawing.Size(32, 16);
		this.label8.TabIndex = 16;
		this.label8.Text = "Max";
		this.BallGravity.Location = new System.Drawing.Point(80, 128);
		this.BallGravity.TabIndex = 2;
		this.BallGravity.Text = "textBox3";
		this.SetFont.Location = new System.Drawing.Point(288, 200);
		this.SetFont.Size = new System.Drawing.Size(56, 24);
		this.SetFont.TabIndex = 22;
		this.SetFont.Text = "Font";
		this.SetFont.Click += new System.EventHandler(this.SetFont_Click);
		this.BallVelocity.Location = new System.Drawing.Point(80, 80);
		this.BallVelocity.TabIndex = 0;
		this.BallVelocity.Text = "textBox2";
		this.Inverse.Location = new System.Drawing.Point(16, 72);
		this.Inverse.Size = new System.Drawing.Size(64, 16);
		this.Inverse.TabIndex = 2;
		this.Inverse.Text = "Inverse";
		this.label10.Location = new System.Drawing.Point(288, 168);
		this.label10.Size = new System.Drawing.Size(32, 16);
		this.label10.TabIndex = 20;
		this.label10.Text = "Title";
		this.label12.Location = new System.Drawing.Point(288, 136);
		this.label12.Size = new System.Drawing.Size(80, 16);
		this.label12.TabIndex = 14;
		this.label12.Text = "Wall Elasticity";
		this.WallElasticity.Location = new System.Drawing.Point(376, 136);
		this.WallElasticity.TabIndex = 5;
		this.WallElasticity.Text = "textBox1";
		this.Linear.Location = new System.Drawing.Point(16, 24);
		this.Linear.Size = new System.Drawing.Size(64, 16);
		this.Linear.TabIndex = 0;
		this.Linear.Text = "Linear";
		this.label9.Location = new System.Drawing.Point(288, 64);
		this.label9.Size = new System.Drawing.Size(40, 16);
		this.label9.TabIndex = 19;
		this.label9.Text = "Name";
		this.BallSizeMin.Location = new System.Drawing.Point(48, 24);
		this.BallSizeMin.Size = new System.Drawing.Size(48, 20);
		this.BallSizeMin.TabIndex = 0;
		this.BallSizeMin.Text = "textBox4";
		this.label5.Location = new System.Drawing.Point(16, 120);
		this.label5.Size = new System.Drawing.Size(40, 16);
		this.label5.TabIndex = 6;
		this.label5.Text = "Gravity";
		this.label6.Location = new System.Drawing.Point(16, 96);
		this.label6.Size = new System.Drawing.Size(40, 16);
		this.label6.TabIndex = 7;
		this.label6.Text = "Ghost";
		this.label7.Location = new System.Drawing.Point(17, 48);
		this.label7.Size = new System.Drawing.Size(64, 16);
		this.label7.TabIndex = 8;
		this.label7.Text = "Elasticity";
		this.label1.Location = new System.Drawing.Point(16, 24);
		this.label1.Size = new System.Drawing.Size(56, 16);
		this.label1.TabIndex = 5;
		this.label1.Text = "Number";
		this.label2.Location = new System.Drawing.Point(584, 320);
		this.label2.Size = new System.Drawing.Size(0, 0);
		this.label2.TabIndex = 2;
		this.label2.Text = "label2";
		this.label3.Location = new System.Drawing.Point(16, 72);
		this.label3.Size = new System.Drawing.Size(56, 16);
		this.label3.TabIndex = 4;
		this.label3.Text = "Velocity";
		this.EraseScreen.AccessibleRole = System.Windows.Forms.AccessibleRole.CheckButton;
		this.EraseScreen.Location = new System.Drawing.Point(288, 112);
		this.EraseScreen.Size = new System.Drawing.Size(96, 24);
		this.EraseScreen.TabIndex = 4;
		this.EraseScreen.Text = "Erase Screen";
		this.BallCollisions.AccessibleRole = System.Windows.Forms.AccessibleRole.CheckButton;
		this.BallCollisions.Location = new System.Drawing.Point(192, 24);
		this.BallCollisions.Size = new System.Drawing.Size(72, 24);
		this.BallCollisions.TabIndex = 2;
		this.BallCollisions.Text = "Collisions";
		this.BallErase.AccessibleRole = System.Windows.Forms.AccessibleRole.CheckButton;
		this.BallErase.Location = new System.Drawing.Point(192, 56);
		this.BallErase.Size = new System.Drawing.Size(56, 24);
		this.BallErase.TabIndex = 3;
		this.BallErase.Text = "Erase";
		this.toolTip1.ShowAlways = true;
		this.Name.Location = new System.Drawing.Point(288, 88);
		this.Name.Size = new System.Drawing.Size(208, 20);
		this.Name.TabIndex = 3;
		this.Name.Text = "textBox1";
		this.button1.Location = new System.Drawing.Point(416, 8);
		this.button1.TabIndex = 8;
		this.button1.Text = "OK";
		this.button1.Click += new System.EventHandler(this.button1_Click);
		this.button2.Location = new System.Drawing.Point(416, 40);
		this.button2.TabIndex = 7;
		this.button2.Text = "Cancel";
		this.button2.Click += new System.EventHandler(this.button2_Click);
		this.groupBox1.Controls.AddRange(new System.Windows.Forms.Control[] {this.BallErase,
																				this.BallCollisions,
																				this.BallElasticity,
																				this.BallCount,
																				this.label1,
																				this.groupBox2,
																				this.label6,
																				this.label5,
																				this.label3,
																				this.label7});
		this.groupBox1.Location = new System.Drawing.Point(8, 8);
		this.groupBox1.Size = new System.Drawing.Size(272, 296);
		this.groupBox1.TabIndex = 3;
		this.groupBox1.TabStop = false;
		this.groupBox1.Text = "Balls";
		this.Squared.Location = new System.Drawing.Point(16, 48);
		this.Squared.Size = new System.Drawing.Size(72, 16);
		this.Squared.TabIndex = 1;
		this.Squared.Text = "Squared";
		this.groupBox3.Controls.AddRange(new System.Windows.Forms.Control[] {this.Inverse,
																				this.Squared,
																				this.Linear});
		this.groupBox3.Location = new System.Drawing.Point(112, 24);
		this.groupBox3.Size = new System.Drawing.Size(96, 96);
		this.groupBox3.TabIndex = 19;
		this.groupBox3.TabStop = false;
		this.groupBox3.Text = "Distribution";
		this.label4.Location = new System.Drawing.Point(8, 24);
		this.label4.Size = new System.Drawing.Size(32, 16);
		this.label4.TabIndex = 15;
		this.label4.Text = "Min";
		this.groupBox2.Controls.AddRange(new System.Windows.Forms.Control[] {this.groupBox3,
																				this.label4,
																				this.label8,
																				this.BallSizeMin,
																				this.BallSizeMax});
		this.groupBox2.Location = new System.Drawing.Point(16, 152);
		this.groupBox2.Size = new System.Drawing.Size(216, 128);
		this.groupBox2.TabIndex = 4;
		this.groupBox2.TabStop = false;
		this.groupBox2.Text = "Size";
		this.Title.Location = new System.Drawing.Point(320, 168);
		this.Title.Size = new System.Drawing.Size(168, 20);
		this.Title.TabIndex = 21;
		this.Title.Text = "textBox1";
		this.AutoScaleBaseSize = new System.Drawing.Size(5, 13);
		this.ClientSize = new System.Drawing.Size(504, 309);
		this.Controls.AddRange(new System.Windows.Forms.Control[] {this.SetFont,
																	  this.Title,
																	  this.label10,
																	  this.Name,
																	  this.label9,
																	  this.EraseScreen,
																	  this.WallElasticity,
																	  this.label12,
																	  this.BallGravity,
																	  this.BallGhost,
																	  this.BallVelocity,
																	  this.button2,
																	  this.button1,
																	  this.groupBox1,
																	  this.label2});
		this.Text = "Config";

	}
	protected void button2_Click(object sender, System.EventArgs e)
	{
		DialogResult = DialogResult.Cancel;
		Close();
	}
	protected void button1_Click(object sender, System.EventArgs e)
	{
		CopyData(false);
		bounceWnd.SaveSetupToFile();
		DialogResult = DialogResult.OK;
		Close();
	}

	private void label10_Click(object sender, System.EventArgs e)
	{

	}

	private void SetFont_Click(object sender, System.EventArgs e)
	{
		FontDialog dlg = new FontDialog();
		if (strFont == null)
			strFont = "Arial";
		if (titleSize <= 3.0f)
			titleSize = 24f;

		Console.WriteLine("Font, size: {0} {1}", strFont, titleSize);
		dlg.Font = new Font(strFont, titleSize);
		dlg.Color = fontColor;
		dlg.ShowColor = true;

		if (dlg.ShowDialog() == DialogResult.OK)
		{
			strFont = dlg.Font.FontFamily.Name;
			titleSize = dlg.Font.Size;
			fontColor = dlg.Color;
		}
	}
}
}
