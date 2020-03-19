namespace Collide
{
using System;
using System.Drawing;
using System.Collections;
using System.ComponentModel;
using System.Windows.Forms;

/// <summary>
///    Summary description for about.
/// </summary>
public class About : System.Windows.Forms.Form
{
    /// <summary> 
    ///    Required designer variable
    /// </summary>
    private System.ComponentModel.Container components;
	
	private System.Windows.Forms.Label label1;
	

    public About()
    {
        //
        // Required for Win Form Designer support
        //
        InitializeComponent();

		label1.Text = 
			"Collide - A physics simulation\n" +
			"EricGu@Microsoft.com\n\n" + "" +
			"Collide simulates the interactions of balls, either with or without gravity " +
			"between the balls. Balls come in different sizes, and their mass is proportional " +
			"to their size. These settings (and others) are controlled in the configuration " +
			"dialog, reached by double-clicking in the window.\n\n" +
			"Each configuration of these settings is known as a varset. You may create a new " +
			"varset through the context menu (right-click), and then save it by choosing save " +
			"from the context menu. This will add it to the context menu, and add it to all " +
			"the varsets saved in collide.xml.\n\n" +
			"The global configuration can be set through another dialog.";
        //
        // TODO: Add any constructor code after InitializeComponent call
        //
    }

    /// <summary>
    ///    Clean up any resources being used
    /// </summary>
/*    public override void Dispose()
    {
        base.Dispose();
        components.Dispose();
    }
*/
    /// <summary>
    ///    Required method for Designer support - do not modify
    ///    the contents of this method with the code editor
    /// </summary>
    private void InitializeComponent()
	{
		this.components = new System.ComponentModel.Container();
		this.label1 = new System.Windows.Forms.Label();
		
		label1.Location = new System.Drawing.Point(8, 8);
		label1.Text = "label1";
		label1.Size = new System.Drawing.Size(672, 352);
		label1.Font = new System.Drawing.Font("Times New Roman", 16f, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.World);
		label1.TabIndex = 0;
		
		this.AutoScaleBaseSize = new System.Drawing.Size(5, 13);
		this.Text = "About Collide";
		//@design this.TrayLargeIcon = true;
		//@design this.TrayHeight = 0;
		this.ClientSize = new System.Drawing.Size(720, 405);
		
		this.Controls.Add(label1);
		
	}
}
}
