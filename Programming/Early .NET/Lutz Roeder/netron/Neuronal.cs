
namespace Neuronal
{

	using System;
	using System.ComponentModel;
	using System.Diagnostics;
	using System.IO;
	using System.Collections;
	using System.Drawing;
	using System.Drawing.Drawing2D;
	using System.Drawing.Imaging;
	using System.Windows.Forms;

	////////////////////////////////////////////////////////////////////////////////
	// class IAC

	[Description("IAC Unit")]
	public class IAC : Netron.Object
	{
		private Netron.Connector __Dentrides;
		private Netron.Connector __Activation;
		private float Activation;
  
		public IAC() : base()
		{
			Rectangle = new RectangleF(0, 0, 16, 16);
			Resizable = false;
			__Dentrides = new Netron.Connector(this, "Dentrides", true);
			Connector.Add(__Dentrides);
			__Activation = new Netron.Connector(this, "Activation", false);
			Connector.Add(__Activation);    

			Activation = 0.1f;
		}

		public override PointF ConnectionPoint(Netron.Connector c)
		{
			RectangleF r = Rectangle;
			if (c == __Dentrides) return new PointF(r.Left, r.Top + (r.Height / 2));
			if (c == __Activation) return new PointF(r.Right, r.Top + (r.Height / 2));
			return new PointF(0, 0);
		}

		public override void Paint(Graphics g)
		{
			RectangleF r = Rectangle;

			Color c = Color.White;
			if (Activation > 0.0f) c = Color.FromArgb(160, 32, 0);
			if (Activation < 0.0f) c = Color.FromArgb(0, 64, 160);

			float s = Activation;
			if (s < 0.0f) s *= -1.0f;
			if (s > 1.0f) s = 1.0f;
			RectangleF e = new RectangleF((r.Left + r.Right) / 2, (r.Top + r.Bottom) / 2, 0, 0);
			e.Inflate(s * 8.0f, s * 8.0f);

			SmoothingMode m = g.SmoothingMode;
			g.SmoothingMode = SmoothingMode.HighQuality;

			g.FillEllipse(new SolidBrush(c), e.X, e.Y, e.Width, e.Height);      	


			if (!Select)
			{
				Pen Pen = new Pen(Color.Black, 1);
				g.DrawEllipse(Pen, r.X, r.Y, r.Width, r.Height);
			}
			else
			{
				Pen Pen = new Pen(Color.Black, 3);
				g.DrawEllipse(Pen, r.X, r.Y, r.Width, r.Height);
			}

			g.SmoothingMode = m;

			base.Paint(g);
		}

		public override void Update()
		{
			Activation = 0;
       	
			foreach (float x in __Dentrides.Receive)
				Activation += x;	

			__Dentrides.Receive.Clear();

			__Activation.Send.Add(Activation);
    
			Invalidate();
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Synapse

	[Description("IAC Weight")]
	public class Synapse : Netron.Object
	{
		private Netron.Connector __Dentrides;
		private Netron.Connector __Axon;
		private Netron.Connector __Weight;
		private float Weight;

		public Synapse() : base()
		{
			Rectangle = new RectangleF(0, 0, 12, 12);
			Resizable = false;
			__Dentrides = new Netron.Connector(this, "Dentrides", true);
			Connector.Add(__Dentrides);
			__Axon = new Netron.Connector(this, "Axon", false);
			Connector.Add(__Axon);
			__Weight = new Netron.Connector(this, "Weight", true);
			Connector.Add(__Weight);
    
			Weight = 0.2f;
		}

		public override PointF ConnectionPoint(Netron.Connector c)
		{
			RectangleF r = Rectangle;
			if (c == __Dentrides) return new PointF(r.Right, r.Top + (r.Height / 2));
			if (c == __Axon) return new PointF(r.Left, r.Top + (r.Height / 2));
			if (c == __Weight) return new PointF(r.Left + (r.Width / 2), r.Top);
			return new PointF(0, 0);
		}

		public override void Paint(Graphics g)
		{
			RectangleF r = Rectangle;

			Color c = Color.White;
			if (Weight < 0) c = Color.Black;
			if (Weight > 0) c = Color.White;
			g.FillRectangle(new SolidBrush(c), r.X - 1, r.Y - 1, r.Width + 2, r.Height + 2);

			if (!Select)
			{
				Pen Pen = new Pen(Color.Black, 1);
				g.DrawRectangle(Pen, r.X - 1, r.Y - 1, r.Width + 2, r.Height + 2);
			}
			else
			{
				Pen Pen = new Pen(Color.Black, 3);
				g.DrawRectangle(Pen, r.X - 1, r.Y - 1, r.Width + 2, r.Height + 2);
			}

			base.Paint(g);
		}

		public override void Update()
		{
			if (__Axon.Receive.Count == 1)
			{
				float X = (float) __Axon.Receive[0];
				__Dentrides.Send.Add(X * Weight);
			}

			__Axon.Receive.Clear();
			__Weight.Send.Add(Weight);
			Invalidate();
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Matrix

	[Description("Input Matrix")]
	public class Matrix : Netron.Object
	{
		private Netron.Connector[][] Value;
		public int Width = 5;
		public int Height = 7;

		public Matrix() : base()
		{
			Rectangle = new RectangleF(0, 0, 120, 100);
			Resizable = true;

			Value = new Netron.Connector[Width][];
			for (int x = 0; x < Width; x++) Value[x] = new Netron.Connector[Height];

			for (int x = 0; x < Width; x++)
				for (int y = 0; y < Height; y++)
				{
					String sx = String.Format("{0}", x);
					String sy = String.Format("{0}", y);
					String s = "(" + sx + ", " + sy + ")";

					Value[x][y] = new Netron.Connector(this, s, true);
					Connector.Add(Value[x][y]);
				}
		}

		public override PointF ConnectionPoint(Netron.Connector c)
		{
			RectangleF r = Rectangle;
			for (int x = 0; x < Width; x++)
				for (int y = 0; y < Height; y++)
				{
					if (c == Value[x][y])
					{
						return new PointF(r.X + (x * 10) + 5 + 20, r.Y + (y * 10) + 5);
					}
				}
			return new PointF(0, 0);
		}

		public override void Paint(Graphics g)
		{
			RectangleF r = Rectangle;

			SmoothingMode m = g.SmoothingMode;
			g.SmoothingMode = SmoothingMode.HighQuality;

			if (!Select)
			{
				Pen p = new Pen(Color.Black, 1);
				g.DrawRectangle(p, r.X - 1, r.Y - 1, r.Width + 2, r.Height + 2);
			}
			else
			{
				Pen p = new Pen(Color.Black, 3);
				g.DrawRectangle(p, r.X - 1, r.Y - 1, r.Width + 2, r.Height + 2);
			}

			g.SmoothingMode = m;
  
			base.Paint(g);
		}
	}
  
	////////////////////////////////////////////////////////////////////////////////
	// class Inspect

	[Description("Inspect Value")]
	public class Inspect : Netron.Object
	{
		public Netron.Connector Value;
		private float __Value;

		public Inspect() : base()
		{
			Rectangle = new RectangleF(0, 0, 50, 16);
			Resizable = false;
			Value = new Netron.Connector(this, "Value", false);
			Connector.Add(Value);
    
			__Value = 0.0f;
		}

		public override PointF ConnectionPoint(Netron.Connector c)
		{
			RectangleF r = Rectangle;
			if (c == Value) return new PointF(r.Left, r.Top + (r.Height /2 ));
			return new PointF(0, 0);
		}

		public override void Paint(Graphics g)
		{
			RectangleF r = Rectangle;

			SmoothingMode m = g.SmoothingMode;
			g.SmoothingMode = SmoothingMode.HighQuality;

			if (!Select)
			{
				Pen Pen = new Pen(Color.Black, 1);
				g.DrawRectangle(Pen, r.X - 1, r.Y - 1, r.Width + 2, r.Height + 2);
			}
			else
			{
				Pen Pen = new Pen(Color.Black, 3);
				g.DrawRectangle(Pen, r.X - 1, r.Y - 1, r.Width + 2, r.Height + 2);
			}

			String s = String.Format("{0:0.0000}", __Value);
			Font f = new Font("Tahoma", 8.25f);
			g.DrawString(s , f, new SolidBrush(Color.Black), r.X + 3, r.Y + 1);

			g.SmoothingMode = m;
  
			base.Paint(g);
		}

		public override void Update()
		{
			__Value = 0;

			if (Value.Receive.Count == 1)
			{
				__Value = (float) Value.Receive[0];
				Invalidate();      
			}

			Value.Receive.Clear();
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	// class Inspect2

	[Description("Inspect Graph")]  
	public class Inspect2 : Netron.Object
	{
		private Netron.Connector __Value;
		private int Size;
		private float[] Value;
		private int Redraw;

		public Inspect2() : base()
		{
			Size = 100;
    	
			Rectangle = new RectangleF(0, 0, Size, 20);
			Resizable = false;
			__Value = new Netron.Connector(this, "Value", false);
			Connector.Add(__Value);
    
			Value = new float[Size];
			Redraw = 0;
		}

		public override PointF ConnectionPoint(Netron.Connector c)
		{
			RectangleF r = Rectangle;
			if (c == __Value) return new PointF(r.Left, r.Top + (r.Height /2 ));
			return new PointF(0, 0);
		}

		public override void Paint(Graphics g)
		{
			RectangleF r = Rectangle;

			Pen p = new Pen(Color.Black, 1);
			g.FillRectangle(new SolidBrush(Color.White), r.X - 1, r.Y - 1, r.Width + 2, r.Height + 2);
			for (int i = 1; i < Size; i++)
				g.DrawLine(p, r.X + i - 1, r.Y + (r.Height / 2) + (Value[i - 1] * 10),
					r.X + i,     r.Y + (r.Height / 2) + (Value[i] * 10));

			if (!Select)
			{
				Pen Pen = new Pen(Color.Black, 1);
				g.DrawRectangle(Pen, r.X - 1, r.Y - 1, r.Width + 2, r.Height + 2);
			}
			else
			{
				Pen Pen = new Pen(Color.Black, 3);
				g.DrawRectangle(Pen, r.X - 1, r.Y - 1, r.Width + 2, r.Height + 2);
			}

			base.Paint(g);
		}

		public override void Update()
		{

			if (Redraw == 0) 
			{
				Invalidate();
				Redraw = 1;
			}
			Redraw--;
    	
			for (int i = 1; i < Size; i++)
				Value[i - 1] = Value[i];

			Value[Size - 1] = 0;

			if (__Value.Receive.Count == 1)
			{
				Value[Size - 1] = (float) __Value.Receive[0];
			}

			__Value.Receive.Clear();
		}
	}
 
	////////////////////////////////////////////////////////////////////////////////
	// class Randomize

	[Description("Random Value Generator")]
	public class Randomize : Netron.Object
	{
		private Netron.Connector Value;
		private Random Random = new Random();
  
		public Randomize() : base()
		{
			Rectangle = new RectangleF(0, 0, 16, 16);
			Resizable = false;
			Value = new Netron.Connector(this, "Value", false);
			Connector.Add(Value);
		}

		public override PointF ConnectionPoint(Netron.Connector c)
		{
			RectangleF r = Rectangle;
			if (c == Value) return new PointF(r.Right, r.Top + (r.Height /2 ));
			return new PointF(0, 0);
		}

		public override void Paint(Graphics g)
		{
			RectangleF r = Rectangle;

			SmoothingMode m = g.SmoothingMode;
			g.SmoothingMode = SmoothingMode.HighQuality;

			if (!Select)
			{
				Pen Pen = new Pen(Color.Black, 1);
				g.DrawRectangle(Pen, r.X - 1, r.Y - 1, r.Width + 2, r.Height + 2);
			}
			else
			{
				Pen Pen = new Pen(Color.Black, 3);
				g.DrawRectangle(Pen, r.X - 1, r.Y - 1, r.Width + 2, r.Height + 2);
			}

			g.SmoothingMode = m;
  
			base.Paint(g);
		}

		public override void Update()
		{
			Value.Send.Add((float) (((float) Random.Next(2000) / 1000) - 1.0f));
		}
	}

}



// Unit
//   BackPropagation (LearningRate = 0.1, Momentum = 0.9, NetInput, Bias, Delta)
//   IAC (Max = 1.0, Min = -0.2, Decay = 0.1, Rest = -0.1)
//   Pi
//   Linear
//   SOM (NetInput = 0.0)

// Weight
//   BackPropagation (LearningRate = 0.1, Momentum = 0.9)
//   Hebbian (LearningRate = 1.0)
//   SOMInput (LearningRate = 1.0)
//   SOMMap