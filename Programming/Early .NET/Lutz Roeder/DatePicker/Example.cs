// DatePicker Example for .NET by Lutz Roeder, December 2000
// http://www.aisto.com/roeder/dotnet
//

using System;
using System.Drawing;
using System.Windows.Forms;

////////////////////////////////////////////////////////////////////////////////
// class MainFrame

class MainFrame : Form
{
	DatePicker DatePicker = new DatePicker();

	public static void Main(String[] args)
	{
		Application.Run(new MainFrame());
	}

	public MainFrame()
	{
		this.Icon = SystemIcons.Application;
		this.Text = "Date Picker Example";
		
		DatePicker.Location = new Point(10, 10);
		DatePicker.Value = new DateTime(1789, 7, 14);
		DatePicker.DateChanged += new EventHandler(DateChangedHandler);
		Controls.Add(DatePicker);
	}

	public void DateChangedHandler(object Sender, EventArgs e)
	{
		DateTime Value = DatePicker.Value; 
		String s = (Value == DateTime.MinValue) ? "None" : DatePicker.Value.ToString("D", null);
		Console.WriteLine(s);
	}
}
