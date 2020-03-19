
namespace Invest
{

	using System;
	using System.Drawing;

	public class Currency
	{
		public double Ammount;
		public string Type;

		public Currency()
		{
			Ammount = 0;
			Type = "";
		}

		public Currency(double a, string t)
		{
			Ammount = a;
			Type = t;
		}
	}

	public class Invest : Netron.Object
	{
		protected string Title;

		public Invest() : base()
		{
			Rectangle = new RectangleF(0, 0, 120, 60);
		}

		public override void Paint(Graphics g)
		{
			RectangleF r = Rectangle;

			Color Background = Select ? Color.FromArgb(210, 210, 226) : Color.White;
			g.FillRectangle(new SolidBrush(Background), r.X, r.Y + 16, r.Width + 1, r.Height - 16 + 1);

			Color Frame = Color.FromArgb(49, 69, 107);
			g.DrawRectangle(new Pen(Frame, 2), r.X, r.Y, r.Width + 1, r.Height + 1);
			g.FillRectangle(new SolidBrush(Frame), r.X, r.Y, r.Width + 1, 16);

			Font f = new Font("Tahoma", 8.25f, FontStyle.Bold);
			g.DrawString(Title, f, new SolidBrush(Color.White), r.X + 2, r.Y);

			base.Paint(g);
		}
	}

	public class Account : Invest
	{
		public Netron.Connector Balance;
		public Netron.Connector Transaction;
		private Currency __Balance;

		public Account() : base()
		{
			Title = "Account";    
			Balance = new Netron.Connector(this, "Balance", true);
			Connector.Add(Balance);
			Transaction = new Netron.Connector(this, "Transaction", true);
			Connector.Add(Transaction);
			__Balance = new Currency(1000, "EUR");
		}

		public override PointF ConnectionPoint(Netron.Connector c)
		{
			RectangleF r = Rectangle;
			if (c == Transaction) return new PointF(r.Right, r.Top + 25);
			if (c == Balance) return new PointF(r.Left, r.Top + 25);
			return new PointF(0, 0);
		}

		public override void Update()
		{
			__Balance.Ammount += 10;
			Balance.Send.Add(__Balance);
		}
	}

	public class Transfer : Invest
	{
		Netron.Connector Source;
		Netron.Connector Target;

		public Transfer() : base()
		{
			Title = "Transfer";    
			Source = new Netron.Connector(this, "Source", false);
			Connector.Add(Source);
			Target = new Netron.Connector(this, "Target", false);
			Connector.Add(Target);
		}

		public override PointF ConnectionPoint(Netron.Connector c)
		{
			RectangleF r = Rectangle;
			if (c == Source) return new PointF(r.Left, r.Top + 25);
			if (c == Target) return new PointF(r.Left, r.Top + 40);
			return new PointF(0, 0);
		}
	}

	public class Inspect : Invest
	{
		public Netron.Connector Value;
		private Currency __Value;

		public Inspect() : base()
		{
			Title = "Inspect";
			Rectangle = new RectangleF(0, 0, 120, 40);
			Resizable = false;
			Value = new Netron.Connector(this, "Value", false);
			Connector.Add(Value);
			__Value = new Currency();
		}

		public override PointF ConnectionPoint(Netron.Connector c)
		{
			RectangleF r = Rectangle;
			if (c == Value) return new PointF(r.Right, r.Top + 25);
			return new PointF(0, 0);
		}

		public override void Paint(Graphics g)
		{
			base.Paint(g);
			RectangleF r = Rectangle;
			String s = String.Format("{0:0.00} ", __Value.Ammount);
			s = s + __Value.Type;
			Font f = new Font("Tahoma", 8.25f);
			g.DrawString(s , f, new SolidBrush(Color.Black), r.X + 5, r.Y + 20);
		}

		public override void Update()
		{
			__Value = new Currency();

			if (Value.Receive.Count == 1)
			{
				__Value = (Currency) Value.Receive[0];
				Invalidate();      
			}

			Value.Receive.Clear();
		}
	}

}