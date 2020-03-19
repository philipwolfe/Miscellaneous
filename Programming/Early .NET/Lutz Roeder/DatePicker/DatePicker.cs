// DatePicker for .NET by Lutz Roeder, October 2000
// http://www.aisto.com/roeder/dotnet,
// ******@aisto.com
//

namespace System.Windows.Forms
{

	using System;
	using System.Drawing;
	using System.Drawing.Drawing2D;
	using System.Collections;
	using System.Globalization;
	using System.Windows.Forms;

	////////////////////////////////////////////////////////////////////////////////
	// class DatePicker

	public class DatePicker : Control
	{
		private TextBox TextBox = new TextBox();
		private DateTime value = DateTime.MinValue;
		private Calendar DropDown = new Calendar();
		private Boolean Drop = false;
		public event EventHandler DateChanged;
  
		public DatePicker()
		{
			Font = new Font("Tahoma", 8.25f);
			ClientSize = new Size(80, 20);
			TextBox.TextChanged += new EventHandler(OnTextChanged);
			Controls.Add(TextBox);
			DropDown.DatePicked += new EventHandler(DropDownDatePickedHandler);
			DropDown.Deactivated += new EventHandler(DropDownDeactivatedHandler);
			Value = DateTime.Today;
		}

		public DateTime Value
		{
			set { TextBox.Text = (value == DateTime.MinValue) ? "None" : value.ToString("d", null); this.value = value; }
			get { return value; }
		}

		public override Font Font
		{
			set { DropDown.Font = value; TextBox.Font = value; base.Font = value; }
			get { return base.Font; }
		}
  
		private void DropDownDeactivatedHandler(object Sender, EventArgs e)
		{
			DropDown.Visible = false;
		}
  
		private void DropDownDatePickedHandler(object Sender, EventArgs e)
		{
			Value = DropDown.Value;
			DropDown.Visible = false;
		}
    
		protected override void OnMouseDown(MouseEventArgs e)
		{
			Graphics g = CreateGraphics();
			Rectangle r = new Rectangle(ClientSize.Width - 16, 1, 16, 18);
			if (r.Contains(new Point(e.X, e.Y)))
			{
				Drop = true;
				Invalidate();
				Update();
      
				TextBox.Text = (value == DateTime.MinValue) ? "None" : value.ToString("d", null);
				DropDown.Value = Value;
				DropDown.Visible = true;
				DropDown.DesktopLocation = PointToScreen(new Point(r.Right - DropDown.Size.Width, r.Bottom + 2));
				DropDown.Activate();
			}
		}

		protected override void OnMouseUp(MouseEventArgs e)
		{
			Drop = false;
			Invalidate();
			Update();
		}

		protected override void OnResize(EventArgs e)
		{
			TextBox.Location = new Point(0, 0);
			TextBox.Size = new Size(ClientSize.Width - 16, 20);
		}

		protected override void OnPaint(PaintEventArgs e)
		{
			Graphics g = e.Graphics;
			Rectangle r = new Rectangle(ClientSize.Width - 16, 1, 16, 18);
			ControlPaint.DrawComboButton(g, r, Drop ? ButtonState.Pushed : ButtonState.Normal);
		}

		protected virtual void OnTextChanged(object Sender, EventArgs e)
		{
			DateTime v = DateTime.MinValue;
			if (TextBox.Text != "None")
			{
				try
				{
					v = DateTime.Parse(TextBox.Text);
				}
				catch { }
			}

			if (v != value)
			{
				value = v;
				if (IsHandleCreated)
					if (DateChanged != null) DateChanged(this, null);
			}
		}

		////////////////////////////////////////////////////////////////////////////////
		// class DatePicker.Calendar
  
		public class Calendar : Form
		{
			private DateTime value = DateTime.MinValue;
			private MonthYearPicker MonthYear = new MonthYearPicker();
			private Button Today = new Button();
			private Button None = new Button();
			public event EventHandler DatePicked;
			public event EventHandler Deactivated;
  
			public Calendar()
			{
				ShowInTaskbar = false;
				FormBorderStyle = FormBorderStyle.None;
				ClientSize = new Size(150, 162);
				Font = new Font("Tahoma", 8.25f);
				MonthYear.Location = new Point(3, 3);
				MonthYear.Changed += new EventHandler(MonthYearChangedHandler);
				Controls.Add(MonthYear);
				Today.Location = new Point(18, 132);
				Today.Size = new Size(47, 20);
				Today.Text = "Today";
				Today.Click += new EventHandler(TodayClickHandler);
				Controls.Add(Today);
				None.Location = new Point(81, 132);
				None.Size = new Size(47, 20);
				None.Text = "None";
				None.Click += new EventHandler(NoneClickHandler);
				Controls.Add(None);
				Value = DateTime.Today;
			}
  
			public DateTime Value
			{
				set 
				{ 
					if ((value >= new DateTime(1, 1, 1)) && (value <= new DateTime(9999, 12, 31)))
					{
						this.value = value;
						Boolean Shift = true;
						foreach (Entry n in Locate())
							if (n.Value == value) Shift = false;
						if (Shift) MonthYear.Value = new DateTime(value.Year, value.Month, 1);
						Invalidate();          
						Update();
					}
				}
				get { return value; }
			}
  
			public override Font Font
			{
				set { MonthYear.Font = value; None.Font = value; Today.Font = value; base.Font = value; }
				get { return base.Font; }
			}
  
			private Boolean Hit()
			{
				Point p = PointToClient(MousePosition);
  
				foreach (Entry n in Locate())
				{
					if (n.Rectangle.Contains(p))
					{
						Value = n.Value;
						Invalidate();
						Update();
						return true;
					}
				}
  
				return false;
			}

			private class Entry
			{
				public DateTime Value;
				public Rectangle Rectangle;
				public Boolean Active;	
			}
  
			private Entry[] Locate()
			{
				DateTimeFormatInfo Format = new DateTimeFormatInfo();
				DateTime d = MonthYear.Value;
				DateTime Current = new DateTime(d.Year, d.Month, 1);
  
				while ((Current.DayOfWeek - Format.FirstDayOfWeek) != 0)
				{
					if (Current == DateTime.MinValue) return new Entry[0];
					Current = Current.AddDays(-1.0);
				}
      
				Boolean Active = false;;
				Entry[] a = new Entry[42];
				Rectangle r = new Rectangle(14, 37, 17, 15);
				for (int i = 0; i < 6; i++)
				{
					r.X = 14;
        
					for (int j = 0; j < 7; j++)
					{
						if (Current.Day == 1) Active = !Active;
						Entry e = new Entry();
						e.Value = Current;
						e.Active = Active;
						e.Rectangle = r;
						r.X += 17;
						Current = Current.AddDays(1.0);
						a[i * 7 + j] = e;
					}
					r.Y += 15;
				}
				return a;
			}
  
			private void TodayClickHandler(object Sender, EventArgs e)
			{
				Value = DateTime.Today;
				DatePicked(this, null);
			}
  
			private void NoneClickHandler(object Sender, EventArgs e)
			{
				Value = DateTime.MinValue;
				DatePicked(this, null);
			}

			private void MonthYearChangedHandler(object Sender, EventArgs e)
			{
				Invalidate();
				Update();
			}
  
			protected override void OnDeactivate(EventArgs e)
			{
				if (!MonthYear.MonthList.Visible) Deactivated(this, null);
			}
  
			protected override void OnMouseDown(MouseEventArgs e)
			{
				Hit();
				base.OnMouseDown(e);
			}
  
			protected override void OnMouseUp(MouseEventArgs e)
			{
				if (Hit()) DatePicked(this, null);
				base.OnMouseUp(e);
			}
  
			protected override void OnMouseMove(MouseEventArgs e)
			{
				if (MouseButtons == MouseButtons.Left) Hit();
				base.OnMouseMove(e);
			}
  
			protected override void OnPaint(PaintEventArgs e)
			{
				Canvas v = new Canvas(e);
				if (v.Empty) return;
				Graphics g = v.Graphics;
  
				Rectangle r = ClientRectangle;
  
				// control frame
				g.FillRectangle(new SolidBrush(SystemColors.Window), r);
				g.DrawRectangle(new Pen(SystemColors.ControlDarkDark, 1), r);
				g.DrawRectangle(new Pen(SystemColors.ControlDark, 1), new Rectangle(r.Left, r.Top, r.Width - 1, r.Height - 1));
				g.DrawRectangle(new Pen(SystemColors.ControlLightLight, 1), new Rectangle(r.Left, r.Top, r.Width - 2, r.Height - 2));
				g.DrawRectangle(new Pen(SystemColors.Control, 1), new Rectangle(r.Left + 1, r.Top + 1, r.Width - 3, r.Height - 3));
				g.DrawLine(new Pen(SystemColors.ControlDark, 1), new Point(r.Left + 2, r.Top + 2), new Point(r.Right - 5 ,r.Top + 2));
				g.DrawLine(new Pen(SystemColors.ControlDark, 1), new Point(r.Left + 2, r.Top + 2), new Point(r.Left + 2 ,r.Bottom - 5));
  
				// calendar    
				g.DrawLine(new Pen(SystemColors.ControlDark, 1), 14, 35, 132, 35);
				g.DrawLine(new Pen(SystemColors.ControlDark, 1), 14, 127, 132, 127);
  
				// calendar headline
				StringFormat StringFormat = new StringFormat();    
				StringFormat.Alignment = StringAlignment.Far;
				StringFormat.LineAlignment = StringAlignment.Center;
				DateTimeFormatInfo Format = new DateTimeFormatInfo();
				String[] DayNames = Format.DayNames;
				for (int i = 0; i < DayNames.GetLength(0); i++)
				{
					Rectangle r1 = new Rectangle(14 + (17 * i), 20, 17, 15);
					g.DrawString(DayNames[i][0].ToString(), Font, new SolidBrush(Color.Black), r1, StringFormat);
				}
  
				// days
				foreach (Entry n in Locate())
				{
					Color c = n.Active ? Color.Black : SystemColors.ControlDark;
  
					if (n.Value == Value) 
					{
						g.FillRectangle(new SolidBrush(SystemColors.Control), n.Rectangle);
						c = SystemColors.ControlDark;
					}
  
					if (n.Value == DateTime.Today) 
						g.DrawRectangle(new Pen(Color.FromArgb(132, 0, 0), 1), n.Rectangle);
  
					g.DrawString(n.Value.Day.ToString(), Font, new SolidBrush(c), n.Rectangle, StringFormat);
				}
  
				v.Flush();
				base.OnPaint(e);
			}
  
			protected override void OnPaintBackground(PaintEventArgs e)
			{
			}
		}

		//////////////////////////////////////////////////////////////////////////////
		// class DatePicker.MonthYearPicker

		public class MonthYearPicker : Control
		{
			private DateTime value = DateTime.MinValue;
			private Timer Timer = new Timer();
			public ListPicker MonthList = new ListPicker();
			public event EventHandler Changed;

			public MonthYearPicker()
			{
				Font = new Font("Tahoma", 8.25f);
				ClientSize = new Size(143, 18);
				Timer.Interval = 250;
				Timer.Tick += new EventHandler(OnTimer);

				MonthList.Picked += new EventHandler(MonthListPickedHandler);
			}

			private void MonthListPickedHandler(object Sender, EventArgs e)
			{
				MonthList.Visible = false;
				if (MonthList.Selection != -1)
					Value = Value.AddMonths(MonthList.Selection - 5);
			}

			public DateTime Value
			{
				set 
				{ 
					if ((value >= DateTime.MinValue) && (value <= new DateTime(9999, 12, 31)))
					{
						this.value = value;
						Invalidate();
						Update();          
						if (IsHandleCreated) Changed(this, null);
					}
				}
				get { return value; }
			}

			protected override void OnMouseDown(MouseEventArgs e)
			{
				if (Scroll())
				{
					Timer.Start();
				}
				else
				{
					try
					{
						Value.AddMonths(+6); // catch
						DateTime d = Value.AddMonths(-5);

						MonthList.Clear();
						for (int i = -5; i < +6; i++)
						{
							String s = (d == DateTime.MinValue) ? "None" : d.ToString("Y", null); 	
							MonthList.Add(s);
							d = d.AddMonths(+1);
						}

						MonthList.Visible = true;
						MonthList.Center = PointToScreen(new Point(ClientSize.Width / 2, ClientSize.Height / 2));
						MonthList.Activate();
						Capture = false;
					}
					catch { }
				}

				base.OnMouseDown(e);
			}

			protected override void OnMouseUp(MouseEventArgs e)
			{
				Timer.Stop();
				base.OnMouseUp(e);      
			}

			public Boolean Scroll()
			{
				if (MouseButtons != MouseButtons.Left) return false;
				Point p = PointToClient(MousePosition);

				DateTime v = Value;
				Rectangle l = new Rectangle(0, 0, 20, ClientSize.Height);
				if (l.Contains(p)) { try { Value = Value.AddMonths(-1); } 
									 catch { }; return true; }
				Rectangle r = new Rectangle(ClientSize.Width - 20, 0, 20, ClientSize.Height);
				if (r.Contains(p))  { try { Value = Value.AddMonths(+1); } 
									  catch { }; return true; }
				return false;
			}

			private void OnTimer(Object Sender, EventArgs e)
			{
				Scroll();
			}

			protected override void OnPaint(PaintEventArgs e)
			{
				Canvas v = new Canvas(e);
				if (v.Empty) return;
				Graphics g = v.Graphics;      	

				Rectangle r = ClientRectangle;
    
				g.FillRectangle(new SolidBrush(SystemColors.Control), r);
				g.DrawLine(new Pen(SystemColors.ControlLightLight, 1), r.Left, r.Top, r.Right - 1, r.Top);
				g.DrawLine(new Pen(SystemColors.ControlLightLight, 1), r.Left, r.Top, r.Left, r.Bottom - 1);
				g.DrawLine(new Pen(SystemColors.ControlDark, 1), r.Left, r.Bottom - 1, r.Right - 1, r.Bottom - 1);
				g.DrawLine(new Pen(SystemColors.ControlDark, 1), r.Right - 1, r.Top, r.Right - 1, r.Bottom - 1);    

				StringFormat StringFormat = new StringFormat();
				StringFormat.Alignment = StringAlignment.Center;
				StringFormat.LineAlignment = StringAlignment.Center;
				String s = (Value == DateTime.MinValue) ? "None" : Value.ToString("Y", null);
				g.DrawString(s, Font, new SolidBrush(Color.Black), r.Left + (r.Width / 2), r.Top + (r.Height / 2), StringFormat);

				Point[] p0 = { new Point(6,  (ClientSize.Height / 2)), new Point(11, (ClientSize.Height / 2) + 5), new Point(11, (ClientSize.Height / 2) - 5) };
				g.FillPolygon(new SolidBrush(Color.Black), p0);
				Point[] p1 = { new Point(ClientSize.Width - 6,  (ClientSize.Height / 2)), new Point(ClientSize.Width - 11, (ClientSize.Height / 2) + 5), new Point(ClientSize.Width - 11, (ClientSize.Height / 2) - 5) };
				g.FillPolygon(new SolidBrush(Color.Black), p1);
    
				v.Flush();
			}	

			protected override void OnPaintBackground(PaintEventArgs e) { }
		}

		//////////////////////////////////////////////////////////////////////////////
		// class DatePicker.Button

		public class Button : Control
		{
			protected override void OnMouseDown(MouseEventArgs e)
			{
				Invalidate();
				Update();
			}

			protected override void OnMouseUp(MouseEventArgs e)
			{
				Invalidate();
				Update();

				if ((e.Button == MouseButtons.Left) && (ClientRectangle.Contains(PointToClient(MousePosition)))) OnClick(null);
			}

			protected override void OnMouseMove(MouseEventArgs e)
			{
				Invalidate();
				Update();
			}

			protected override void OnPaint(PaintEventArgs e)
			{
				Canvas v = new Canvas(e);
				if (v.Empty) return;
				Graphics g = v.Graphics;

				Rectangle r = ClientRectangle;

				g.FillRectangle(new SolidBrush(SystemColors.Control), r);

				Point TextPosition = new Point(r.Left + (r.Width / 2), r.Top + (r.Height /2));
      
				if ((MouseButtons == MouseButtons.Left) && (ClientRectangle.Contains(PointToClient(MousePosition))))
				{
					g.DrawLine(new Pen(SystemColors.ControlDarkDark, 1), r.Left, r.Top, r.Right - 2, r.Top);
					g.DrawLine(new Pen(SystemColors.ControlDarkDark, 1), r.Left, r.Top, r.Left, r.Bottom - 1);
					g.DrawLine(new Pen(SystemColors.Control, 1), r.Right - 2, r.Top + 1, r.Right - 1, r.Top);
        
					g.DrawLine(new Pen(Color.Black, 1), r.Left + 1, r.Top + 1, r.Right - 3, r.Top + 1);
					g.DrawLine(new Pen(Color.Black, 1), r.Left + 1, r.Top + 1, r.Left + 1, r.Bottom - 3);
        
					g.DrawLine(new Pen(SystemColors.ControlLightLight, 1), r.Left, r.Bottom - 1, r.Right - 1, r.Bottom - 1);
					g.DrawLine(new Pen(SystemColors.ControlLightLight, 1), r.Right - 1, r.Bottom - 1, r.Right - 1, r.Top + 1);

					TextPosition += new Size(1, 1);
				}
				else
				{
					g.DrawLine(new Pen(SystemColors.Control, 1), r.Left, r.Top, r.Right - 1, r.Top);
					g.DrawLine(new Pen(SystemColors.ControlLightLight, 1), r.Left + 1, r.Top + 1, r.Right - 2, r.Top + 1);
					g.DrawLine(new Pen(SystemColors.Control, 1), r.Right - 3, r.Top + 2, r.Right - 2, r.Top + 1);

					g.DrawLine(new Pen(SystemColors.Control, 1), r.Left, r.Top, r.Left, r.Bottom - 1);
					g.DrawLine(new Pen(SystemColors.ControlLightLight, 1), r.Left + 1, r.Top + 1, r.Left + 1, r.Bottom - 2);

					g.DrawLine(new Pen(Color.Black, 1), r.Left, r.Bottom - 1, r.Right - 1, r.Bottom - 1);
					g.DrawLine(new Pen(SystemColors.ControlDark, 1), r.Left + 1, r.Bottom - 2, r.Right - 1, r.Bottom - 2);

					g.DrawLine(new Pen(Color.Black, 1), r.Right - 1, r.Bottom - 1, r.Right - 1, r.Top + 1);
					g.DrawLine(new Pen(SystemColors.ControlDark, 1), r.Right - 2, r.Bottom - 2, r.Right - 2, r.Top + 2);
				}

				StringFormat StringFormat = new StringFormat();
				StringFormat.Alignment = StringAlignment.Center;
				StringFormat.LineAlignment = StringAlignment.Center;
				g.DrawString(Text, Font, new SolidBrush(Color.Black), TextPosition, StringFormat);

				v.Flush();
			}

			protected override void OnPaintBackground(PaintEventArgs e)
			{
			}
		}

		////////////////////////////////////////////////////////////////////////////////
		// class DatePicker.ListPicker
  
		public class ListPicker : Form
		{
			public int Selection = -1;
			private ArrayList list = new ArrayList();
			private Point center = new Point(0, 0);
			public event EventHandler Picked;
    	
			public ListPicker()
			{
				ShowInTaskbar = false;
				FormBorderStyle = FormBorderStyle.None;    	
				Font = new Font("Tahoma", 8.25f);
				Locate();
			}
  
			public Point Center
			{
				set
				{
					center = value;
					Locate();
				}
				get
				{
					return center;
				}	
			}
  
			public void Add(object o)
			{
				list.Add(o);
				Locate();
			}

			public void Clear()
			{
				list.Clear();
				Locate();
			}
  
			private void Locate()
			{
				Invalidate();
          	
				Graphics g = CreateGraphics();
				Size s = new Size(0, 0);
				foreach (String m in list)
				{
					SizeF f = g.MeasureString(m, Font);
					Size c = new Size((int) f.Width, (int) f.Height);
					if (s.Width < c.Width) s.Width = c.Width;
					if (s.Height < c.Height) s.Height = c.Height;
				}
  
				s.Width = (int) (s.Width * 1.5); // 150%
				s.Height = ((s.Height + 2) * list.Count) + 2;
				this.ClientSize = s;
				this.DesktopLocation = new Point(Center.X - (s.Width / 2), Center.Y - (s.Height / 2));
  
				Invalidate();
				Update();
			}
  
			private void Hit()
			{
				if (MouseButtons == MouseButtons.Left)
				{
					Rectangle r = new Rectangle(0, 1, ClientSize.Width, (ClientSize.Height - 2) / list.Count);    	
					Selection = -1;
					for (int i = 0; i < list.Count; i++)
					{
						if (r.Contains(PointToClient(MousePosition))) Selection = i;
						r.Y += ClientSize.Height / list.Count;        
					}
  
					Invalidate();
					Update();
				}
			}
  
			protected override void OnMouseDown(MouseEventArgs e)
			{
				Hit();
			}
  
			protected override void OnMouseUp(MouseEventArgs e)
			{
				Picked(this, null);
			}
  
			protected override void OnMouseMove(MouseEventArgs e)
			{
				Hit();    	
			}
  
			protected override void OnPaintBackground(PaintEventArgs e)
			{
			}
   
			protected override void OnPaint(PaintEventArgs e)
			{
				Canvas v = new Canvas(e);
				if (v.Empty) return;
				Graphics g = v.Graphics;

				Rectangle rect = ClientRectangle;
				rect.Width--;
				rect.Height--;  
				g.FillRectangle(new SolidBrush(SystemColors.Window), rect);
				g.DrawRectangle(new Pen(SystemColors.WindowFrame, 1), rect);
  
				StringFormat StringFormat = new StringFormat();    
				StringFormat.Alignment = StringAlignment.Center;
				StringFormat.LineAlignment = StringAlignment.Center;
  
				Rectangle r = new Rectangle(0, 1, ClientSize.Width, (ClientSize.Height - 2) / list.Count);    	
  
				for (int i = 0; i < list.Count; i++)
				{
					String s = (String) list[i];
        
					Color c = Color.Black;
					if (i == Selection)
					{
						g.FillRectangle(new SolidBrush(c), r);
						c = Color.White;
					}
  
					g.DrawString(s, Font, new SolidBrush(c), r, StringFormat);
					r.Y += ClientSize.Height / list.Count;
				}
  
				v.Flush();
			}
		}

		////////////////////////////////////////////////////////////////////////////////
		// class DatePicker.Canvas (double-buffering)
  
		public class Canvas
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
	}

}
