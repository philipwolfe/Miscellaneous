
using System;
using System.Collections;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Printing;
using System.IO;
using System.Runtime.CompilerServices;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Runtime.Serialization.Formatters.Soap;
using System.Reflection;
using System.Threading;
using System.Windows.Forms;

[assembly: AssemblyVersion("1.0.2901.5")]

namespace Netron
{

	////////////////////////////////////////////////////////////////////////////////
	// class Entity

	public abstract class Entity
	{
		public abstract void Delete();
		public abstract Boolean Hit(RectangleF r);
		public abstract void Invalidate();
		public abstract void Paint(Graphics g);
		public abstract Cursor Cursor(PointF p);

		public virtual Boolean Select 
		{
			set { Invalidate(); select = value; Invalidate(); }
			get { return select; }
		}

		public virtual Boolean Hover
		{
			set { Invalidate(); hover = value; Invalidate(); }
			get { return hover; }
		}

		private Boolean select = false;
		private Boolean hover = false;
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Connector

	public class Connector : Entity
	{
		public Boolean Flexible;     // only 1 connection allowed if false.
		public string Description;   // relation type.
		public Object Object;        // object this connector belongs to.
		public ArrayList Connection; // connections attached to this connector.
		public ArrayList Send;
		public ArrayList Receive;

		public Connector(Object o, string d, Boolean f) : base()
		{
			Object = o;
			Description = d;
			Connection = new ArrayList();
			Send = new ArrayList();
			Receive = new ArrayList();
			Flexible = f;
			// Object.Connector.Add(this);
		}

		public override void Delete()
		{
		}

		public override Boolean Hit(RectangleF r)
		{
			if ((r.Width == 0) && (r.Height == 0))
				return ConnectionGrip().Contains(r.Location);

			return r.Contains(ConnectionGrip());
		}

		public override void Paint(Graphics g)
		{
			Rectangle r = Rectangle.Round(ConnectionGrip());

			Color Line = Color.White;
			if (Hover) Line = Color.Black;
      
			Color Fill = Color.FromArgb(49, 69, 107); // dark blue
			if (Hover)
			{
				Fill = Color.FromArgb(255, 0, 0); // red
				if ((Flexible) || (Connection.Count != 1))
					Fill = Color.FromArgb(0, 192, 0); // medium green
			}

			g.FillRectangle(new SolidBrush(Fill), r);
			g.DrawRectangle(new Pen(Line, 1), r);

			if (Hover)
			{
				Font f = new Font("Tahoma", 8.25f);
				Size s = g.MeasureString(Description, f).ToSize();
				Rectangle a = new Rectangle(r.X - (s.Width / 2), r.Y + s.Height + 6, s.Width, s.Height + 1);
				Rectangle b = a;
				a.Inflate(+3, +2);
      
				g.FillRectangle(new SolidBrush(Color.FromArgb(255, 255, 231)), a);
				g.DrawRectangle(new Pen(Color.Black, 1), a);
				g.DrawString(Description, f, new SolidBrush(Color.Black), b.Location);
			}
		}

		public override void Invalidate()
		{
			if (Object == null) return;
			Control c = Object.ControlSite();
			if (c == null) return;
			RectangleF r = ConnectionGrip();
			if (Hover) r.Inflate(+100, +100); // HACK HACK
			c.Invalidate(Rectangle.Round(r));
		}

		public override Cursor Cursor(PointF p)
		{
			return MouseCursors.Grip;
		}

		public RectangleF ConnectionGrip()
		{
			PointF p = Object.ConnectionPoint(this);
			RectangleF r = new RectangleF(p.X, p.Y, 0, 0);
			r.Inflate(+3, +3);
			return r;
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Object

	public class Object : Entity
	{
		// persistent
		public Abstract Parent = null;
		public Boolean Resizable = true;
		private ArrayList connector = new ArrayList();
		private RectangleF rectangle = new RectangleF();
		public Tracker Tracker = null;

		public Control ControlSite()
		{
			// may or may not be a good idea to do it that way?
			return MainFrame.Form.Document;
		}

		public void Insert(Abstract p)
		{
			Parent = p;
			Parent.Structure.Add(this);
			Invalidate();
		}

		public override void Delete()
		{
			Invalidate();
    	
			// throw the connections away
			foreach (Connector c in Connector)
				foreach (Connection n in c.Connection)
					n.Delete();
      
			if (Parent.Structure.Contains(this))
				Parent.Structure.Remove(this);

			Parent = null;
		}

		public override Boolean Hit(RectangleF r)
		{
			if ((r.Width == 0) && (r.Height == 0))
			{      
				if (Rectangle.Contains(r.Location)) return true;

				if (Tracker != null)
				{
					Point h = Tracker.Hit(r.Location);
					if ((h.X >= -1) && (h.X <= +1) && (h.Y >= -1) && (h.Y <= +1)) return true;
				}

				foreach (Connector c in Connector)
					if (c.Hit(r)) return true;

				return false;
			}

			return r.Contains(Rectangle);
		}

		public virtual PointF ConnectionPoint(Connector c)
		{
			return new PointF();
		}

		public override void Paint(Graphics g)
		{
			if (Select)
				Tracker.Paint(g);
		}

		public override void Invalidate()
		{
			if (ControlSite() == null) return;
			if (Connector == null) return;

			RectangleF r = Rectangle;
			r.Inflate(+3, +3); // padding for selection frame.
			ControlSite().Invalidate(System.Drawing.Rectangle.Round(r));

			foreach (Connector c in Connector)
			{
				c.Invalidate();

				if (Tracker != null)
					foreach (Connection n in c.Connection)
						n.Invalidate();
			}

			if (Tracker != null)
			{
				RectangleF a = Tracker.Grip(new Point(-1, -1));
				RectangleF b = Tracker.Grip(new Point(+1, +1));
				ControlSite().Invalidate(System.Drawing.Rectangle.Round(RectangleF.Union(a, b)));
			}
		}

		public override Cursor Cursor(PointF p)
		{
			if (Tracker != null)
			{
				Cursor c = Tracker.Cursor(p);
				if (c != Cursors.No) return c;
			}

			if (Control.ModifierKeys == Keys.Shift)
				return MouseCursors.Add;

			return MouseCursors.Select;
		}

		public override Boolean Select 
		{
			set
			{
				base.Select = value;

				if (value)
				{
					Tracker = new Tracker(Rectangle, Resizable);
					Invalidate();
				}
				else
				{
					Invalidate();
					Tracker = null;
				}
			}
			get
			{
				return base.Select;
			}
		}

		public RectangleF Rectangle
		{
			set 
			{
				Invalidate();
				rectangle = value;
				if (Tracker != null) Tracker.Rectangle = rectangle;
				Invalidate();
			}
			get
			{
				return (Tracker != null) && (Tracker.Track) ? Tracker.Rectangle : rectangle;
			}
		}

		public ArrayList Connector
		{
			get { return connector; }
		}

		public virtual void Transmit()
		{
			foreach (Connector c in Connector)
			{
				foreach (Connection n in c.Connection)
					n.Transmit();
				c.Send.Clear();
			}
		}

		public virtual void Update()
		{
			foreach (Connector c in Connector) c.Receive.Clear();
		}

		public virtual void Properties()
		{
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Connection

	public class Connection : Entity
	{
		public Connector From;
		public Connector To;
		public PointF ToPoint;

		public Connection()
		{
			From = null;
			To = null;
		}

		public override Boolean Hit(RectangleF r)
		{
			if ((From == null) || (To == null)) return false;

			PointF p1 = From.Object.ConnectionPoint(From);
			PointF p2 = To.Object.ConnectionPoint(To);

			if ((r.Width == 0) && (r.Height == 0))
			{
				PointF p = r.Location;

				// p1 must be the leftmost point.
				if (p1.X > p2.X) { PointF s = p2; p2 = p1; p1 = s; }

				RectangleF r1 = new RectangleF(p1.X, p1.Y, 0, 0);
				RectangleF r2 = new RectangleF(p2.X, p2.Y, 0, 0);
				r1.Inflate(3, 3);
				r2.Inflate(3, 3);

				if (RectangleF.Union(r1, r2).Contains(p))
				{
					if (p1.Y < p2.Y)
					{
						float o = r1.Left + (((r2.Left - r1.Left) * (p.Y - r1.Bottom)) / (r2.Bottom - r1.Bottom));
						float u = r1.Right + (((r2.Right - r1.Right) * (p.Y - r1.Top)) / (r2.Top - r1.Top));
						return ((p.X > o) && (p.X < u));
					}
					else
					{
						float o = r1.Left + (((r2.Left - r1.Left) * (p.Y - r1.Top)) / (r2.Top - r1.Top));
						float u = r1.Right + (((r2.Right - r1.Right) * (p.Y - r1.Bottom)) / (r2.Bottom - r1.Bottom));
						return ((p.X > o) && (p.X < u));
					}
				}

				return false; 
			}

			return (r.Contains(p1) && r.Contains(p2));
		}

		public override void Paint(Graphics g)
		{
			if (!Hover)
			{
				Pen p = new Pen(Color.Black, 1);
				if (Select) p.DashStyle = DashStyle.Dash;
				PaintPolyline(g, p);
			}
			else
			{
				Pen p = new Pen(Color.Black, 2);
				if (Select) p.DashStyle = DashStyle.Dash;
				PaintPolyline(g, p);
			}
		}

		public void PaintTrack(Graphics g)
		{
			Pen p = new Pen(Color.Black, 1);
			p.DashStyle = DashStyle.Dash;
			PaintPolyline(g, p);
		}

		public void PaintPolyline(Graphics g, Pen p)
		{
			if (From == null) return;
			PointF s = From.Object.ConnectionPoint(From);
			PointF e = (To != null) ? To.Object.ConnectionPoint(To) : ToPoint;
			SmoothingMode m = g.SmoothingMode;
			g.SmoothingMode = SmoothingMode.AntiAlias;
			if ((s.X != e.X) || (s.Y != e.Y)) g.DrawLine(p, s, e);
			g.SmoothingMode = m;    	
		}

		public override void Invalidate()
		{
			if (From != null)
			{
				PointF s = From.Object.ConnectionPoint(From);
				PointF e = (To != null) ? To.Object.ConnectionPoint(To) : ToPoint;
				RectangleF sr = new RectangleF(s.X, s.Y, 0, 0);
				RectangleF er = new RectangleF(e.X, e.Y, 0, 0);
				sr.Inflate(+4, +4);
				er.Inflate(+4, +4);

				if ((From.Object != null) && (From.Object.ControlSite() != null))
					From.Object.ControlSite().Invalidate(Rectangle.Round(RectangleF.Union(sr, er)));

				From.Invalidate();
				if (To != null) To.Invalidate();
			}
		}

		public void Insert(Connector f, Connector t)
		{
			From = f;
			To = t;
			From.Connection.Add(this);
			From.Invalidate();
			To.Connection.Add(this);
			To.Invalidate();
			Invalidate();
		}

		public override void Delete()
		{
			Invalidate();
			if ((From != null) && (From.Connection.Contains(this))) From.Connection.Remove(this);
			if ((To != null) && (To.Connection.Contains(this))) To.Connection.Remove(this);
			From = null;
			To = null;
		}

		public override Cursor Cursor(PointF p)
		{
			if (Control.ModifierKeys == Keys.Shift) return MouseCursors.Add;
			return MouseCursors.Select;
		}

		public override Boolean Select 
		{
			set { base.Select = value; Invalidate(); }
			get { return base.Select; }
		}

		public virtual void Transmit()
		{
			if ((From == null) || (To == null)) return;
   	
			foreach (object o in To.Send)
				From.Receive.Add(o);
			foreach (object o in From.Send)
				To.Receive.Add(o);
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Abstract

	public class Abstract : Object
	{
		public ArrayList Structure = new ArrayList();
		public History History = new History();

		public override void Paint(Graphics g)
		{
			ArrayList a = new ArrayList();

			foreach (Object o in Structure)
				foreach (Connector c in o.Connector)
					foreach (Connection n in c.Connection)
						if (!a.Contains(n))
						{
							n.Paint(g);
							a.Add(n);
						}

			foreach (Object o in Structure)
				o.Paint(g);

			foreach (Object o in Structure)
				foreach (Connector c in o.Connector)
					if ((o.Hover) || (c.Hover))
						c.Paint(g);
		}

		public void Insert(Object o)
		{
			Modify m = new Modify();
			m.AddInsertObject(o, this);
			History.Do(m);
		}

		public override void Delete()
		{
			Modify m = new Modify();
    
			foreach (Object o in Structure)
			{
				if (o.Select) m.AddDeleteObject(o);
      
				foreach (Connector c in o.Connector)
					foreach (Connection n in c.Connection)
						if ((n.Select) || (o.Select)) m.AddDeleteConnection(n);
			}

			History.Do(m);
		}

		public override void Transmit()
		{
			foreach (Object o in Structure) o.Transmit();
			base.Transmit();
		}

		public override void Update()
		{
			foreach (Object o in Structure) o.Update();
			base.Update();
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Canvas (double-buffering)

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

	////////////////////////////////////////////////////////////////////////////////
	// class Document

	public class Document : Panel
	{
		public string FileName = null;                // current filename.
		private Abstract Abstract = null;             // abstract object behind currenct view.
		private Object Object = null;                 // volatile object not connected to abstract structure.
		private Connection Connection = null;         // volatile connection.
		private Entity Hover = null;                  // Entity with current mouse focus.
		private Selector Selector = null;             // for tracking selection state.
		private Boolean DoTrack = false;              // indicates track mode.
		private Hashtable Module = new Hashtable();   // module collection.
		private MenuItem ActiveModule = null;         // active module.
		private System.Windows.Forms.Timer Timer = new System.Windows.Forms.Timer();
		public ArrayList ModuleMenu = new ArrayList();

		public Document() : base()
		{
			Initialize();

			ContextMenu = new ContextMenu();
			foreach (MenuItem m in ModuleMenu) ContextMenu.MenuItems.Add(m);
			ContextMenu.MenuItems.Add("-");
			ContextMenu.MenuItems.Add(new MenuItem("&Delete", new EventHandler(OnDelete)));

			BorderStyle = BorderStyle.Fixed3D;
			Dock = DockStyle.Fill;
    
			AutoScroll = true;

			Abstract = new Abstract();

			Timer.Interval = 5;
			Timer.Tick += new EventHandler(OnTimer);
			Timer.Start();
		}

		private void Initialize()
		{
			foreach (String fileName in Directory.GetFiles(".", "*.dll"))
			{
				Assembly a = Assembly.LoadFrom(fileName);
				foreach (Type t in a.GetTypes()) 
				{
					if (t.IsSubclassOf(typeof(Object)))
					{
						String s = t.Name;
						DescriptionAttribute c = (DescriptionAttribute) TypeDescriptor.GetAttributes(t)[typeof(DescriptionAttribute)];
						if (c != DescriptionAttribute.Default) s = c.Description;
						MenuItem i = new MenuItem(s, new EventHandler(OnInsert));
						Module.Add(i, t);

						if (t.Namespace == null)
							ModuleMenu.Add(i);
						else
						{
							MenuItem m = null;
							foreach (MenuItem n in ModuleMenu)
								if (n.Text == t.Namespace)
									m = n;

							if (m == null)
							{
								m = new MenuItem(t.Namespace);
								ModuleMenu.Add(m);
							}

							m.MenuItems.Add(i);
						}
					}
				}
			}
		}

		private Entity HitEntity(PointF p)
		{
			RectangleF r = new RectangleF(p.X, p.Y, 0, 0);

			foreach (Object o in Abstract.Structure)
				foreach (Connector c in o.Connector)
					if (c.Hit(r))
					{
						String s = "\"" + c.Description + "\" connector of \"" + c.Object.GetType().FullName + "\" object.";
						MainFrame.StatusBar.Text = s;
						return c;
					}

			foreach (Object o in Abstract.Structure)
				if (o.Hit(r))
				{
					MainFrame.StatusBar.Text = "\"" + o.GetType().FullName + "\" object.";
					return o;
				}

			foreach (Object o in Abstract.Structure)
				foreach (Connector c in o.Connector)
					foreach (Connection n in c.Connection)
						if (n.Hit(r))
						{
							MainFrame.StatusBar.Text = "Connection.";
							return n;
						}

			return null;
		}

		private void HitHover(PointF p)
		{
			Entity Hit = HitEntity(p);
			if (Hit != Hover)
			{
				if (Hover != null) Hover.Hover = false;
				Hover = Hit;
				if (Hover != null)
				{
					Hover.Hover = true;
				}
			}
		}

		public void Deselect(Select s)
		{
			foreach (Object o in Abstract.Structure)
			{
				s.Add(o, false);

				foreach (Connector c in o.Connector)
					foreach (Connection n in c.Connection)
						s.Add(n, false);
			}
		}

		private void SetCursor(PointF p)
		{
			if (Connection != null)
			{
				if ((Hover != null) && (typeof(Connector).IsInstanceOfType(Hover)))
					Cursor = Hover.Cursor(p);
				else
					Cursor = MouseCursors.Cross;
			}
			else
			{
				if (Hover != null)
					Cursor = Hover.Cursor(p);
				else
					Cursor = Cursors.Arrow;
			}
		}

		protected override void OnMouseDown(MouseEventArgs e)
		{
			PointF p = new PointF(e.X, e.Y);

			if ((e.Button == MouseButtons.Left) && (e.Clicks == 2))
			{
				HitHover(p);
				if ((Hover != null) && (typeof(Object).IsInstanceOfType(Hover)))
				{
					// TODO: HACK: undo?
					((Object) Hover).Properties();
					Update();
					return;
				}
			}

			if ((e.Button == MouseButtons.Left) && (e.Clicks == 1))
			{
				// Alt+Click allows fast creation of elements
				if ((Object == null) && (ModifierKeys == Keys.Alt))
					Object = (Object) Activator.CreateInstance((Type) Module[ActiveModule]);        	          	

				if (Object != null)
				{
					Object.Invalidate();
					RectangleF r = Object.Rectangle;
					Object.Rectangle = new RectangleF(p.X, p.Y, r.Width, r.Height);
					Object.Invalidate();

					Abstract.Insert(Object);
					Object = null;
					return;
				}

				Selector = null;

				HitHover(p);

				if (Hover != null)
				{
					if (typeof(Connector).IsInstanceOfType(Hover))  
					{
						Connection = new Connection();
						Connection.From = (Connector) Hover;
						Connection.ToPoint = p;
						Hover.Invalidate();
						Capture = true;
						Update();
						return;
					}

					// select object.
					if (!Hover.Select)
					{
						Select s = new Select();
						if (ModifierKeys != Keys.Shift) Deselect(s);
						s.Add(Hover, true);
						Abstract.History.Do(s);
						Update();
					}

					// search tracking handle
					Point h = new Point(0, 0);
					if (Abstract.Structure.Contains(Hover))
					{
						Object o = (Object) Hover;
						h = o.Tracker.Hit(p);
					}

					foreach (Object j in Abstract.Structure)
					{
						if (j.Tracker != null)
							j.Tracker.Start(p, h);
					}

					DoTrack = true;
					Capture = true;
					SetCursor(p);
					return;
				}

				Selector = new Selector(p);
			}

			if (e.Button == MouseButtons.Right)
			{
				if (Hover != null)
				{
					if (!Hover.Select)
					{
						Select s = new Select();
						Deselect(s);
						s.Add(Hover, true);
						Abstract.History.Do(s);
						Update();
					}
				}
			}
		}

		protected override void OnMouseUp(MouseEventArgs e)
		{
			base.OnMouseUp(e);

			PointF p = new PointF(e.X, e.Y);

			if (Selector != null) Selector.Paint(this);

			if (e.Button == MouseButtons.Left)
			{
				if (Connection != null)
				{
					HitHover(p);

					Connection.Invalidate();

					if ((Hover != null) && (typeof(Connector).IsInstanceOfType(Hover)))
						if (!Hover.Equals(Connection.From))
						{
							Modify m = new Modify();
							m.AddInsertConnection(Connection, Connection.From, (Connector) Hover);
							Abstract.History.Do(m);
						}

					Connection = null;
					Capture = false;
				}

				if (Selector != null)
				{
					Select s = new Select();

					RectangleF r = Selector.Rectangle;

					if ((Hover == null) || (Hover.Select == false))
						if (ModifierKeys != Keys.Shift) Deselect(s);

					if ((r.Width != 0) || (r.Height != 0))
					{  
						foreach (Object o in Abstract.Structure)
						{
							if (o.Hit(r)) { s.Add(o, true); }

							foreach (Connector c in o.Connector)
								foreach (Connection n in c.Connection)
								{
									if (n.Hit(r)) 
									{
										s.Add(n, true);
										c.Invalidate();
									}
								}
						}
					}

					Abstract.History.Do(s);
					Selector = null;
					Capture = false;        
				}

				if (DoTrack)
				{
					Transform t = new Transform();

					foreach (Object o in Abstract.Structure)
						if (o.Tracker != null)
						{
							o.Tracker.End();
							o.Invalidate();
							t.Add(o, o.Tracker.Rectangle);
						}

					Abstract.History.Do(t);

					DoTrack = false;
					Capture = false;
					HitHover(p);
				}
			}

			Update();
			SetCursor(p);
		}

		protected override void OnMouseMove(MouseEventArgs e)
		{
			base.OnMouseMove(e);
			PointF p = new PointF(e.X, e.Y);

			if (Selector != null) Selector.Paint(this);

			if (Object != null)
			{
				Object.Invalidate();            // invalidate previous rendering.
				RectangleF r = Object.Rectangle;
				Object.Rectangle = new RectangleF(p.X, p.Y, r.Width, r.Height);
				Object.Invalidate();            // invalidate next rendering.
			}

			if (DoTrack)
			{
				foreach (Object o in Abstract.Structure)
					if (o.Tracker != null)
					{
						o.Invalidate();
						o.Tracker.Move(p);
						o.Invalidate();
					}
			}
 
			if (Connection != null)
			{
				Connection.Invalidate();
				Connection.ToPoint = p;
				Connection.Invalidate();
			}

			HitHover(p);

			Update();

			if (Selector != null)
			{
				Selector.Update(p);
				Selector.Paint(this);
			}

			SetCursor(p);
		}

		protected override void OnKeyDown(KeyEventArgs e)
		{
			if (e.KeyCode == Keys.Escape)
			{
				DoTrack = false;
			}

			PointF p = PointToClient(MousePosition);
			SetCursor(p);
		}

		protected override void OnKeyUp(KeyEventArgs e)
		{
			PointF p = PointToClient(MousePosition);
			SetCursor(p);
		}

		private void OnHScroll(object Sender, ScrollEventArgs e)
		{
			Console.WriteLine("OnHScroll {0}", e.NewValue);
		}

		private void OnVScroll(object Sender, ScrollEventArgs e)
		{
			Console.WriteLine("OnVScroll {0}", e.NewValue);    	
		}

		protected override void OnPaint(PaintEventArgs e)
		{
			Rectangle b = ClientRectangle;
			b.Inflate(+10000, +10000);
			AutoScrollMinSize = b.Size;
			//Console.WriteLine("AutoScrollPosition {0} {1}", AutoScrollPosition.X, 	 AutoScrollPosition.Y);
			//Console.WriteLine("AutoScrollMinSize  {0} {1}", AutoScrollMinSize.Width, AutoScrollMinSize.Height);
			//Console.WriteLine("AutoScrollMargin   {0} {1}", AutoScrollMargin.Width, AutoScrollMargin.Height);
    	
			GC.Collect();
			//Console.WriteLine("{0} Bytes", GC.TotalMemory);

			if (Selector != null)
				if ((Selector.Rectangle.Width != 0) || (Selector.Rectangle.Height != 0))
					return;

			Rectangle r = e.ClipRectangle;
			//Console.Write("Document.OnPaint"); Console.Write(" {0} {1}", r.X, r.Y); Console.WriteLine(" {0} {1}", r.Width, r.Height);

			Canvas v = new Canvas(e);
			if (v.Empty) return;
			Graphics g = v.Graphics;

			g.FillRectangle(new SolidBrush(Color.White), r);
			Abstract.Paint(g);
			if (Object != null) Object.Paint(g);
			if (Connection != null) Connection.PaintTrack(g);
    
			v.Flush();
		}

		public void OnPrintPage(object Sender, PrintPageEventArgs e)
		{
			Graphics g = e.Graphics;
			Abstract.Paint(g);
		}

		protected override void OnPaintBackground(PaintEventArgs e)
		{
		}

		public void OnTimer(object Sender, EventArgs e)
		{
			Abstract.Transmit();
			Abstract.Update();
    
			// only repaint when no operation is runniNg.
			if ((Selector != null) || (Connection != null) || (!DoTrack)) Update();
		}

		public void OnInsert(object Sender, EventArgs e)
		{
			if (ActiveModule != null) ActiveModule.Checked = false;
			ActiveModule = (MenuItem) Sender;
			ActiveModule.Checked = true;    
    	
			Object = (Object) Activator.CreateInstance((Type) Module[ActiveModule]);
		}

		public void OnUndo(object Sender, EventArgs e)
		{
			Abstract.History.Undo();
			Update();
		}

		public void OnRedo(object Sender, EventArgs e)
		{
			Abstract.History.Redo();
			Update();
		}

		public void OnDelete(object Sender, EventArgs e)
		{
			Abstract.Delete();
			Update();	
		}

		public void OnSelectAll(object Sender, EventArgs e)
		{
			Select s = new Select();

			foreach (Object o in Abstract.Structure)
			{
				s.Add(o, true);

				foreach (Connector c in o.Connector)
					foreach (Connection n in c.Connection)
						s.Add(n, true);
			}

			Abstract.History.Do(s);
			Update();
		}

		public void SaveAs(string FileName)
		{
			Stream s = File.Create(FileName);
			// BinaryFormatter f = new BinaryFormatter();
			SoapFormatter f = new SoapFormatter();
			f.Serialize(s, Abstract);
			s.Close();

			this.FileName = FileName;
		}

		public void Open(String FileName)
		{
			Stream s = File.OpenRead(FileName);
			BinaryFormatter f = new BinaryFormatter();
			Abstract = (Abstract) f.Deserialize(s);
			s.Close();

			this.FileName = FileName;
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class MouseCursors

	public class MouseCursors
	{
		public static Cursor Add = null;
		public static Cursor Cross = null;
		public static Cursor Grip = null;
		public static Cursor Move = null;
		public static Cursor Select = null;  
	}

	////////////////////////////////////////////////////////////////////////////////
	// class MainFrame

	public class MainFrame : Form
	{ 
		public static MainFrame Form = null;
		public static StatusBar StatusBar = new StatusBar();
		public Document Document = null;
		private MenuItem File;
		private MenuItem Edit;
		private MenuItem System;

		public static void Main(string[] args)
		{
			Thread.CurrentThread.ApartmentState = ApartmentState.STA;
			Form = new MainFrame();
			Application.Run(Form);
		}

		public MainFrame()
		{
			Assembly a = GetType().Module.Assembly;
			Icon = new Icon(a.GetManifestResourceStream("Application.ico"));

			MouseCursors.Add = new Cursor(a.GetManifestResourceStream("Add.cur"));
			MouseCursors.Cross = new Cursor(a.GetManifestResourceStream("Cross.cur"));
			MouseCursors.Grip = new Cursor(a.GetManifestResourceStream("Grip.cur"));
			MouseCursors.Move = new Cursor(a.GetManifestResourceStream("Move.cur"));
			MouseCursors.Select = new Cursor(a.GetManifestResourceStream("Select.cur"));

			ClientSize = new Size(610, 510);
			Font = new Font("Tahoma", 11f, FontStyle.Regular, GraphicsUnit.World);

			StatusBar.Text = "OK.";
			Controls.Add(StatusBar);

			Menu = new MainMenu();
			File = Menu.MenuItems.Add("&File");
			File.MenuItems.Add(new MenuItem("&New", new EventHandler(OnNew), Shortcut.CtrlN));
			File.MenuItems.Add(new MenuItem("&Open...", new EventHandler(OnOpen), Shortcut.CtrlO));
			File.MenuItems.Add(new MenuItem("&Save", new EventHandler(OnSave), Shortcut.CtrlS));
			File.MenuItems.Add(new MenuItem("&Save As...", new EventHandler(OnSaveAs)));
			File.MenuItems.Add("-");
			File.MenuItems.Add(new MenuItem("Page Set&up...", new EventHandler(OnPageSetup)));
			File.MenuItems.Add(new MenuItem("&Print...", new EventHandler(OnPrint), Shortcut.CtrlP));
			File.MenuItems.Add("-");    
			File.MenuItems.Add(new MenuItem("&Exit", new EventHandler(OnExit)));
			Edit = Menu.MenuItems.Add("&Edit");
			Edit.MenuItems.Add(new MenuItem("&Undo", new EventHandler(OnUndo), Shortcut.CtrlZ));
			Edit.MenuItems.Add(new MenuItem("&Redo", new EventHandler(OnRedo), Shortcut.CtrlY));
			Edit.MenuItems.Add("-");
			Edit.MenuItems.Add(new MenuItem("&Cut", new EventHandler(OnCut), Shortcut.CtrlX));
			Edit.MenuItems.Add(new MenuItem("C&opy", new EventHandler(OnCopy), Shortcut.CtrlC));
			Edit.MenuItems.Add(new MenuItem("&Paste", new EventHandler(OnPaste), Shortcut.CtrlV));
			Edit.MenuItems.Add(new MenuItem("&Delete", new EventHandler(OnDelete), Shortcut.Del));
			Edit.MenuItems.Add("-");
			Edit.MenuItems.Add(new MenuItem("&Select All", new EventHandler(OnSelectAll), Shortcut.CtrlA));
			System = Menu.MenuItems.Add("&System");
			MenuItem Help = Menu.MenuItems.Add("&Help");
			Help.MenuItems.Add(new MenuItem("&Help", new EventHandler(OnHelp), Shortcut.F1));
			Help.MenuItems.Add("-");
			Help.MenuItems.Add(new MenuItem("&About", new EventHandler(OnAbout)));

			New();
		}

		public void Title()
		{
			Text = "Netron";
			if (Document.FileName != null)
				Text += " - [" + Document.FileName + "]";

			Document.Focus();
		}
    
		public void New()
		{
			if (Document != null)
			{
				Controls.Remove(Document);
			}
			Document = new Document();
			Controls.Add(Document);
			Title();    
			Refresh();
		}
    
		public void OnNew(object Sender, EventArgs e)
		{
			New();
		}

		public void OnOpen(object Sender, EventArgs e)
		{
			OpenFileDialog OpenFileDialog = new OpenFileDialog();
			OpenFileDialog.Filter = "All Files (*.*)|*.*";
			OpenFileDialog.Title = "Open";
			if (OpenFileDialog.ShowDialog() == DialogResult.OK)
			{
				New();
				Document.Open(OpenFileDialog.FileName);
				Title();
				Refresh();
			}
		}

		public void OnSave(object Sender, EventArgs e)
		{
			if (Document.FileName != null)
				Document.SaveAs(Document.FileName);
			else
				OnSaveAs(Sender, e);
		}

		public void OnSaveAs(object Sender, EventArgs e)
		{
			SaveFileDialog SaveFileDialog = new SaveFileDialog();
			SaveFileDialog.Filter = "All Files (*.*)|*.*";
			SaveFileDialog.Title = "Save As";
			if (SaveFileDialog.ShowDialog() == DialogResult.OK)
			{
				Document.SaveAs(SaveFileDialog.FileName);
				Title();
			}
		}

		public void OnPageSetup(object Sender, EventArgs e)
		{
			PageSetupDialog d = new PageSetupDialog();
			d.PageSettings = new PageSettings();
			d.ShowDialog();
		}

		public void OnPrint(object Sender, EventArgs e)
		{
			PrintDocument p = new PrintDocument();
			p.PrintPage += new PrintPageEventHandler(Document.OnPrintPage);
    	
			PrintDialog d = new PrintDialog();
			d.Document = p;
			if (d.ShowDialog() == DialogResult.OK)
			{
				p.Print();
			}
		}

		public void OnExit(object Sender, EventArgs e)
		{
			Close();
		}

		public void OnUndo(object Sender, EventArgs e)
		{
			Document.OnUndo(Sender, e);
		}

		public void OnRedo(object Sender, EventArgs e)
		{
			Document.OnRedo(Sender, e);
		}

		public void OnCut(object Sender, EventArgs e)
		{
		}

		public void OnCopy(object Sender, EventArgs e)
		{
		}

		public void OnPaste(object Sender, EventArgs e)
		{
		}

		public void OnDelete(object Sender, EventArgs e)
		{
			Document.OnDelete(Sender, e);
		}

		public void OnSelectAll(object Sender, EventArgs e)
		{
			Document.OnSelectAll(Sender, e);
		}

		public void OnHelp(object Sender, EventArgs e)
		{
			Help.ShowHelp(this, "help.chm");
		}

		public void OnAbout(object Sender, EventArgs e)
		{
			AboutDialog d = new AboutDialog();
			d.ShowDialog(this);
		}

		protected override void OnPaintBackground(PaintEventArgs e)
		{
		}

		protected override void OnGotFocus(EventArgs e)
		{
			base.OnGotFocus(e);
			Document.Focus();
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class AboutDialog

	public class AboutDialog : Form
	{
		private PictureBox Picture = new PictureBox();
		private Label Application = new Label();
		private Label Copyright = new Label();
		private LinkLabel Link = new LinkLabel();
		private Button Accept = new Button();

		public AboutDialog()
		{
			Text = "About";    	
			ClientSize = new Size(310, 200);
			AcceptButton = Accept;
			CancelButton = Accept;
			Font = new Font("Tahoma", 8.25f);
			FormBorderStyle = FormBorderStyle.FixedDialog;
			MaximizeBox = false;
			MinimizeBox = false;
			ControlBox = false;
			ShowInTaskbar = false;
			StartPosition = FormStartPosition.CenterParent;
			Picture.Location = new Point(5, 5);
			Picture.Size = new Size(304, 88);
			Picture.Image = new Bitmap(GetType().Module.Assembly.GetManifestResourceStream("Netron.png"));
			Application.Text = "Netron Structure Editor, Version 0.2";
			Application.Location = new Point(20,100);
			Application.Size = new Size(250, 16);
			Application.Font = Font;
			Copyright.Text = "Copyright © 2000 Lutz Roeder.\nAll rights reserved.";
			Copyright.Location = new Point(20,118);
			Copyright.Size = new Size(200, 32);
			Copyright.Font = Font;
			Link.Text = "http://www.aisto.com/roeder";
			Link.LinkArea = new LinkArea(0, Link.Text.Length);
			Link.Location = new Point(20, 150);
			Link.Size = new Size(200, 16);
			Link.Font = Font;
			Link.Click += new EventHandler(Link_Click);
			Accept.Location = new Point(230, 170);
			Accept.Text = "OK";
			Accept.Size = new Size(75, 23);
			Accept.Font = Font;
			Accept.TabIndex = 0;
			Accept.DialogResult = DialogResult.OK;
			Controls.Add(Picture);
			Controls.Add(Application);
			Controls.Add(Copyright);
			Controls.Add(Link);
			Controls.Add(Accept);
		}

		private void Link_Click(object Sender, EventArgs e)
		{
			LinkLabel l = (LinkLabel) Sender;
			Process.Start(l.Text);
			Link.LinkVisited = true ;
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Selector

	public class Selector
	{
		private PointF Start;
		private PointF Current;

		public Selector(PointF p)
		{
			Start = p;
			Current = p;
		}

		public void Update(PointF p)
		{
			Current = p;
		}

		public void Paint(Control c)
		{
			Rectangle r = c.RectangleToScreen(System.Drawing.Rectangle.Round(Rectangle));
			ControlPaint.DrawReversibleFrame(r, Color.Black, FrameStyle.Dashed);
		}

		public RectangleF Rectangle
		{
			get
			{
				RectangleF r = new RectangleF();
				r.X = (Start.X <= Current.X) ? Start.X : Current.X;
				r.Y = (Start.Y <= Current.Y) ? Start.Y : Current.Y;
				r.Width = Current.X - Start.X;
				if (r.Width < 0) r.Width *= -1.0f;
				r.Height = Current.Y - Start.Y;
				if (r.Height < 0) r.Height *= -1.0f;
				return r;
			}
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Tracker

	public class Tracker 
	{
		public RectangleF Rectangle;
		public Boolean Resizable;
		public Boolean Track;
		private Point Handle;
		private PointF Current;

		public Tracker(RectangleF r, Boolean s)
		{
			Rectangle = r;
			Resizable = s;
			Track = false;
		}

		public Point Hit(PointF p)
		{
			// (0, 0) Canvas, (-1, -1) TopLeft, (+1, +1) BottomRight

			if (Resizable)
				for (int x = -1; x <= +1; x++)
					for (int y = -1; y <= +1; y++)
						if ((x != 0) || (y != 0))
						{
							Point h = new Point(x, y);
							if (Grip(h).Contains(p)) return h;
						}

			if (Rectangle.Contains(p)) return new Point(0, 0);

			return new Point(-2, -2);
		}

		public Cursor Cursor(PointF p)
		{
			Point h = Hit(p);
			if ((h.X < -1) || (h.X > +1) || (h.Y < -1) || (h.Y > +1)) return Cursors.No;

			if (Track)
			{
				return (h == new Point(0, 0)) ? MouseCursors.Move : MouseCursors.Cross;
			}    
			else
			{
				if (Resizable)
				{
					if ((h == new Point(-1, -1)) || (h == new Point(+1, +1))) return Cursors.SizeNWSE;
					if ((h == new Point(-1, +1)) || (h == new Point(+1, -1))) return Cursors.SizeNESW;
					if ((h == new Point(-1,  0)) || (h == new Point(+1,  0))) return Cursors.SizeWE;
					if ((h == new Point( 0, +1)) || (h == new Point( 0, -1))) return Cursors.SizeNS;
				}
				if (h == new Point(0, 0)) return MouseCursors.Select;
			}

			return Cursors.No;
		}

		public void Start(PointF p, Point h)
		{
			if ((h.X < -1) || (h.X > +1) || (h.Y < -1) || (h.Y > +1)) return;

			Handle = h;
			Current = p;
			Track = true;
		}

		public void End()
		{
			Track = false;
		}

		public void Move(PointF p)
		{
			Point h = Handle;

			PointF a = new PointF(0, 0);
			PointF b = new PointF(0, 0);

			if ((h.X == -1) || ((h.X == 0) && (h.Y == 0))) a.X = p.X - Current.X;
			if ((h.Y == -1) || ((h.X == 0) && (h.Y == 0))) a.Y = p.Y - Current.Y;
			if ((h.X == +1) || ((h.X == 0) && (h.Y == 0))) b.X = p.X - Current.X;
			if ((h.Y == +1) || ((h.X == 0) && (h.Y == 0))) b.Y = p.Y - Current.Y;

			PointF tl = new PointF(Rectangle.Left, Rectangle.Top);
			PointF br = new PointF(Rectangle.Right, Rectangle.Bottom);

			tl.X += a.X;
			tl.Y += a.Y;
			br.X += b.X;
			br.Y += b.Y;

			Rectangle.X = tl.X;
			Rectangle.Y = tl.Y;
			Rectangle.Width = br.X - tl.X;
			Rectangle.Height = br.Y - tl.Y;

			// check minimum sizes

			Current = p;
		}

		public void Paint(Graphics g)
		{
			if (!Resizable) return;

			Point p = new Point();
			for (p.X = -1; p.X <= +1; p.X++)
				for (p.Y = -1; p.Y <= +1; p.Y++)
				{
					if ((p.X != 0) || (p.Y != 0))
					{
						RectangleF r = Grip(p);
						g.FillRectangle(new SolidBrush(Color.White), r.X, r.Y, r.Width - 1, r.Height - 1);
						g.DrawRectangle(new Pen(Color.Black, 1), r.X, r.Y, r.Width - 1, r.Height - 1);
					}
				}
		}

		public RectangleF Grip(Point p)
		{
			RectangleF r = new RectangleF(0, 0, 7, 7);

			if (p.X < 0)  r.X = Rectangle.X - 8;
			if (p.X == 0) r.X = Rectangle.X + (float) Math.Round(Rectangle.Width / 2) - 3;
			if (p.X > 0)  r.X = Rectangle.X + Rectangle.Width + 1;
			if (p.Y < 0)  r.Y = Rectangle.Y - 8;
			if (p.Y == 0) r.Y = Rectangle.Y + (float) Math.Round(Rectangle.Height / 2) - 3;
			if (p.Y > 0)  r.Y = Rectangle.Y + Rectangle.Height + 1;

			return r;
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class History

	public class History
	{
		private ArrayList Edit = new ArrayList();
		private int Position = 0;
		public int Limit = 32;

		public void Do(ICommand c)
		{
			if (c.Empty) return;
			for (int i = (Edit.Count - 1); i >= Position; i--)
				Edit.RemoveAt(i);
			Edit.Add(c);
			Redo();
		}

		public void Undo()
		{
			if (Position == 0) return;
			Position = Position - 1;
			ICommand c = (ICommand) Edit[Position];
			c.Undo();
		}

		public void Redo()
		{
			if (Edit.Count == 0) return;
			if (Position >= Edit.Count) return;
			ICommand c = (ICommand) Edit[Position];
			c.Redo();
			Position = Position + 1;
		}
	}


	////////////////////////////////////////////////////////////////////////////////
	// class ICommand

	public interface ICommand
	{
		void Undo();
		void Redo();
		Boolean Empty { get; }
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Modify

	internal class Modify : ICommand
	{
		internal class InsertObject : ICommand
		{
			private Object Object;
			private Abstract Abstract;

			public InsertObject(Object o, Abstract a)
			{
				Object = o;
				Abstract = a;
			}

			public void Undo()
			{
				Object.Delete();
			}

			public void Redo()
			{
				Object.Insert(Abstract);
			}

			public Boolean Empty
			{
				get { return false; }
			}
		}

		internal class DeleteObject : ICommand
		{
			private Object Object;
			private Abstract Abstract;

			public DeleteObject(Object o)
			{
				Object = o;
				Abstract = o.Parent;
			}

			public void Undo()
			{
				Object.Insert(Abstract);
			}

			public void Redo()
			{
				Object.Delete();
			}

			public Boolean Empty
			{
				get { return false; }
			}
		}

		internal class InsertConnection : ICommand
		{
			private Connection Connection;
			private Connector From;
			private Connector To;

			public InsertConnection(Connection c, Connector f, Connector t)
			{
				Connection = c;
				From = f;
				To = t;
			}

			public void Undo()
			{
				Connection.Delete();
			}

			public void Redo()
			{
				Connection.Insert(From, To);
			}

			public Boolean Empty
			{
				get { return false; }
			}
		}

		internal class DeleteConnection : ICommand
		{
			private Connection Connection;
			private Connector From;
			private Connector To;

			public DeleteConnection(Connection c)
			{
				Connection = c;
				From = c.From;
				To = c.To;
			}

			public void Undo()
			{
				Connection.Insert(From, To);
			}

			public void Redo()
			{
				Connection.Delete();
			}

			public Boolean Empty
			{
				get { return false; }
			}
		}
  	
		private ArrayList Edit = new ArrayList();
    
		public void AddInsertObject(Object o, Abstract a)
		{
			Edit.Add(new InsertObject(o, a));
		}

		public void AddDeleteObject(Object o)
		{
			Edit.Add(new DeleteObject(o));
		}

		public void AddInsertConnection(Connection c, Connector f, Connector t)
		{
			Edit.Add(new InsertConnection(c, f, t));
		}

		public void AddDeleteConnection(Connection c)
		{
			Edit.Add(new DeleteConnection(c));
		}

		public void Undo()
		{
			foreach (ICommand c in Edit)
				c.Undo();
		}

		public void Redo()
		{
			foreach (ICommand c in Edit)
				c.Redo();
		}

		public Boolean Empty
		{
			get { return (Edit.Count == 0); }
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Transform

	internal class Transform : ICommand
	{
		internal class State
		{
			public Object Object;
			public RectangleF Undo;
			public RectangleF Redo;
    
			public State(Object o, RectangleF u, RectangleF r)
			{
				Object = o;
				Undo = u;
				Redo = r;
			}
		}  

		private ArrayList Edit = new ArrayList();

		public void Add(Object o, RectangleF r)
		{
			foreach (State s in Edit)
				if (s.Object == o)
				{
					Edit.Remove(s);
					break;
				}

			if (!o.Rectangle.Equals(r))
				Edit.Add(new State(o, o.Rectangle, r));
		}

		public void Undo()
		{
			foreach (State s in Edit) s.Object.Rectangle = s.Undo;
		}

		public void Redo()
		{
			foreach (State s in Edit) s.Object.Rectangle = s.Redo;
		}

		public Boolean Empty
		{
			get { return (Edit.Count == 0); }
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Select

	public class Select : ICommand
	{
		public class State
		{
			public Entity Entity;
			public Boolean Undo;
			public Boolean Redo;
    
			public State(Entity e, Boolean u, Boolean r)
			{
				Entity = e;
				Undo = u;
				Redo = r;
			}
		}  

		private ArrayList Edit = new ArrayList();

		public void Add(Entity e, Boolean r)
		{
			foreach (State s in Edit)
				if (s.Entity == e)
				{
					Edit.Remove(s);
					break;
				}
        
			if (e.Select != r)
				Edit.Add(new State(e, e.Select, r));
		}

		public void Undo()
		{
			foreach (State s in Edit) s.Entity.Select = s.Undo;
		}

		public void Redo()
		{
			foreach (State s in Edit) s.Entity.Select = s.Redo;
		}

		public Boolean Empty
		{
			get { return (Edit.Count == 0); }
		}
	}
}

// Todo:
// Print
// Cut
// Copy
// Paste
// Scrollbars
// Zoom
// Abstract
// Serialize
// Control
// Units
// Plugsin/Insert
// Layer
// Connections
