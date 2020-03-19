
namespace Family
{

	using System;
	using System.Drawing;
	using System.Windows.Forms;

	public class Person : Netron.Object
	{
		private Netron.Connector Father;
		private Netron.Connector Mother;
		private Netron.Connector Children;
		private string FirstName = "";
		private string LastName = "";
		private DateTime Born = DateTime.Now;
		private DateTime Dead = DateTime.MinValue;
   
		public Person() : base()
		{
			Rectangle = new RectangleF(0, 0, 120, 40);
			Father = new Netron.Connector(this, "Father", false);
			Connector.Add(Father);
			Mother = new Netron.Connector(this, "Mother", false);
			Connector.Add(Mother);
			Children = new Netron.Connector(this, "Children", false);
			Connector.Add(Children);
		}

		public override void Paint(Graphics g)
		{
			RectangleF r = Rectangle;

			Color Background = Select ? Color.FromArgb(230, 230, 230) : Color.FromArgb(255, 255, 255);
			g.FillRectangle(new SolidBrush(Background), r.X, r.Y, r.Width + 1, r.Height + 1);

			Color Frame = Color.FromArgb(120, 120, 120);
			g.DrawRectangle(new Pen(Frame, 2), r.X, r.Y, r.Width + 1, r.Height + 1);
			g.FillRectangle(new SolidBrush(Frame), r.X, r.Y + 4, r.Width + 1, 16);

			StringFormat sf = new StringFormat();
			sf.Alignment = StringAlignment.Center;
			Font f = new Font("Tahoma", 8.25f, FontStyle.Bold);
			g.DrawString(FirstName + " " + LastName, f, new SolidBrush(Color.White), r.X + (r.Width / 2), r.Y + 5, sf);

			Font f2 = new Font("Tahoma", 8.25f);
			String From = Born.Year.ToString();
			String To = (Dead == DateTime.MinValue) ? "" : Dead.Year.ToString();
			String s = "(" + From + "-" + To + ")";
			g.DrawString(s, f2, new SolidBrush(Color.FromArgb(80, 80, 80)), r.X + (r.Width / 2), r.Y + 22, sf);

			base.Paint(g);
		}

		public override PointF ConnectionPoint(Netron.Connector c)
		{
			RectangleF r = Rectangle;
			if (c == Father) return new PointF(r.Left + (r.Width * 1/3), r.Top);
			if (c == Mother) return new PointF(r.Left + (r.Width * 2/3), r.Top);
			if (c == Children) return new PointF(r.Left + (r.Width / 2), r.Bottom);
			return new PointF(0, 0);
		}

		public override void Properties()
		{
			PersonDialog d = new PersonDialog();
			d.FirstName.Text = FirstName;
			d.LastName.Text = LastName;
			d.Born.Value = Born;
			d.Dead.Value = Dead;
    
			if (d.ShowDialog() == DialogResult.OK)
			{
				FirstName = d.FirstName.Text;
				LastName = d.LastName.Text;
				Born = d.Born.Value;
				Dead = d.Dead.Value;
			}
		}
	}

	public class PersonDialog : Form
	{
		public Label label7 = new Label();
		public TextBox textBox5 = new TextBox();
		public Button Cancel = new Button();
		public Button Accept = new Button();
		public TextBox textBox4 = new TextBox();
		public Label label6 = new Label();
		public Label label5 = new Label();
		public DatePicker Dead = new DatePicker();
		public TextBox textBox2 = new TextBox();
		public Label label4 = new Label();
		public Label label2 = new Label();
		public TextBox LastName = new TextBox();
		public Label label3 = new Label();
		public TextBox FirstName = new TextBox();
		public Label label1 = new Label();
		public DatePicker Born = new DatePicker();
  	
		public PersonDialog()
		{
			Font = new Font("Tahoma", 8.25f);
			Text = "Person";
			FormBorderStyle = FormBorderStyle.FixedDialog;
			MaximizeBox = false;
			MinimizeBox = false;
			ControlBox = false;
			ShowInTaskbar = false;
			StartPosition = FormStartPosition.CenterParent;
    
			Font = new Font ("Tahoma", 8);
			ClientSize = new Size (424, 389);
    
    
			textBox4.Location = new Point (232, 112);
			textBox4.Font = new Font ("Tahoma", 8);
			textBox4.TabIndex = 13;
			textBox4.Size = new Size (168, 20);
			textBox5.Location = new Point (96, 168);
			textBox5.Text = "textBox5";
			textBox5.Multiline = true;
			textBox5.TabIndex = 16;
			textBox5.Size = new Size (304, 176);
			FirstName.Location = new Point (96, 16);
			FirstName.Font = new Font ("Tahoma", 8);
			FirstName.TabIndex = 2;
			FirstName.Size = new Size (304, 20);
			Born.Location = new Point (96, 80);
			Born.TabIndex = 0;
			Dead.Location = new Point (96, 112);
			Dead.TabIndex = 10;
			label2.Location = new Point (16, 80);
			label2.Text = "Born:";
			label2.Size = new Size (72, 16);
			label2.TabIndex = 7;
			Accept.Location = new Point (240, 352);
			Accept.Size = new Size (75, 23);
			Accept.TabIndex = 14;
			Accept.Text = "OK";
			Accept.DialogResult = DialogResult.OK;			
			Cancel.Location = new Point (320, 352);
			Cancel.Size = new Size (75, 23);
			Cancel.TabIndex = 15;
			Cancel.Text = "Cancel";
			Cancel.DialogResult = DialogResult.Cancel;
			label5.Location = new Point (16, 112);
			label5.Text = "Died:";
			label5.Size = new Size (72, 16);
			label5.TabIndex = 11;
			label6.Location = new Point (200, 112);
			label6.Text = "In:";
			label6.Size = new Size (72, 16);
			label6.TabIndex = 12;
			LastName.Location = new Point (96, 48);
			LastName.Font = new Font ("Tahoma", 8);
			LastName.TabIndex = 6;
			LastName.Size = new Size (304, 20);
			label4.Location = new Point (200, 80);
			label4.Text = "In:";
			label4.Size = new Size (72, 16);
			label4.TabIndex = 8;
			label7.Location = new Point (16, 168);
			label7.Text = "Information:";
			label7.Size = new Size (72, 16);
			label7.TabIndex = 17;
			label3.Location = new Point (16, 48);
			label3.Text = "Last Name:";
			label3.Size = new Size (72, 16);
			label3.TabIndex = 5;
			textBox2.Location = new Point (232, 80);
			textBox2.Font = new Font ("Tahoma", 8);
			textBox2.TabIndex = 9;
			textBox2.Size = new Size (168, 20);
			label1.Location = new Point (16, 16);
			label1.Text = "First Name:";
			label1.Size = new Size (72, 16);
			label1.TabIndex = 1;
			Controls.Add(label7);
			Controls.Add(textBox5);
			Controls.Add(textBox4);
			Controls.Add(label6);
			Controls.Add(label5);
			Controls.Add(Dead);
			Controls.Add(textBox2);
			Controls.Add(label4);
			Controls.Add(label2);
			Controls.Add(LastName);
			Controls.Add(label3);
			Controls.Add(FirstName);
			Controls.Add(label1);
			Controls.Add(Born);    	
			Controls.Add(Accept);
			Controls.Add(Cancel);
		}
	}
}
