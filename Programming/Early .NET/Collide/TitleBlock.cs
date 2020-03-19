using System;
using System.Drawing;
using System.Collections;

namespace Collide
{
	/// <summary>
	/// Summary description for TitleBlock.
	/// </summary>
	public class TitleBlock: IDisposable
	{
		string title;
		float size;
		string fontName;
		Color color;
		Size formSize;
		ArrayList segments = new ArrayList();
		Font font;
		Brush brush;
		Pen pen;
		Rectangle titleRectangle;
		MyPointF titleDrawSpot;
		Vector velocity;

		static float textPad = 30f;

		public TitleBlock(string title, string fontName, float size, Color color, Size formSize, Graphics graphics)
		{
			this.title = title;
			this.fontName = fontName;
			this.size = size;
			this.color = color;
			this.formSize = formSize;

			font = new Font(fontName, size);
			brush = new SolidBrush(color);
			pen = new Pen(brush);

			SizeF stringSize = graphics.MeasureString(title, font);

			PointF location = new PointF(formSize.Width / 2 - stringSize.Width / 2,
				formSize.Height / 2 - stringSize.Height / 2);

			titleRectangle = new Rectangle(
				(int) (formSize.Width / 2 - stringSize.Width / 2),
				(int) (formSize.Height / 2 - stringSize.Height / 2),
				(int) stringSize.Width,
				(int) stringSize.Height);
			titleDrawSpot = new MyPointF(titleRectangle.X, titleRectangle.Y);

			float x1 = titleRectangle.X - textPad;
			float y1 = titleRectangle.Y - textPad;
			float x2 = titleRectangle.X + titleRectangle.Width + textPad;
			float y2 = titleRectangle.Y + titleRectangle.Height + textPad;

#if fred
			segments.Add(new Segment(x1, y1, x1, y2));
			segments.Add(new Segment(x1, y2, x2, y2));
			segments.Add(new Segment(x2, y2, x2, y1));
			segments.Add(new Segment(x2, y1, x1, y1));
#endif
			MyPointF p1 = new MyPointF(x1 + textPad, y1);
			MyPointF p2 = new MyPointF(x2 - textPad, y1);
			MyPointF p3 = new MyPointF(x2, y1 + textPad);
			MyPointF p4 = new MyPointF(x2, y2 - textPad);
			MyPointF p5 = new MyPointF(x2 - textPad, y2);
			MyPointF p6 = new MyPointF(x1 + textPad, y2);
			MyPointF p7 = new MyPointF(x1, y2 - textPad);
			MyPointF p8 = new MyPointF(x1, y1 + textPad);

			segments.Add(new Segment(p1, p2));
			segments.Add(new Segment(p2, p3));
			segments.Add(new Segment(p3, p4));
			segments.Add(new Segment(p4, p5));
			segments.Add(new Segment(p5, p6));
			segments.Add(new Segment(p6, p7));
			segments.Add(new Segment(p7, p8));
			segments.Add(new Segment(p8, p1));
		}

		~TitleBlock()
		{
			Dispose();
		}

		public void Dispose()
		{
			font.Dispose();
			brush.Dispose();
			pen.Dispose();

			GC.SuppressFinalize(this);
		}

		public float TextPad
		{
			get
			{
				return textPad;
			}
		}

		public void Render(Graphics graphics)
		{
			graphics.DrawString(title, font, brush, titleDrawSpot);
			foreach (Segment segment in segments)
			{
				segment.Render(graphics, pen);
			}
			//graphics.DrawRectangle(pen, titleRectangle);
		}

		public void BounceOffTitle(Ball ball)
		{
			foreach (Segment segment in segments)
			{
				Vector velocityReturn;
				if (segment.CollideBall(ball))
					break;
			}
		}
			
			// is the point inside of the rectangle?
		public bool IsInside(MyPointF point, float maxSize)
		{
			if ((point.X > titleRectangle.X - maxSize) &&
				(point.X < titleRectangle.X + titleRectangle.Width + maxSize) &&
				(point.Y > titleRectangle.Y - maxSize) &&
				(point.Y < titleRectangle.Y + titleRectangle.Height + maxSize))
				return true;
			else
				return false;
		}
	}
}
