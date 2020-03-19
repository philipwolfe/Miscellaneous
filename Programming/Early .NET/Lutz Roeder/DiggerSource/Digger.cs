
// Digger for .NET by Lutz Roeder, June 2000.
// Graphics and Levels taken from the original version by Alexander Lang and Jan Fricke.
//
// http://www.aisto.com/roeder
//

using System;
using System.IO;
using System.Collections;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Windows.Forms;

namespace Digger
{

	class Font
	{
		Point position = new Point(0, 0);
		Size size;
		Bitmap[] characters = new Bitmap[59];

		public Font(Bitmap bitmap, Size size)
		{
			this.size = size;
			Rectangle cursor = new Rectangle(0, 0, size.Width, size.Height);
			for (int i = 0; i < 59; i++)
			{
				characters[i] = bitmap.Clone(cursor, PixelFormat.Format24bppRgb);
				characters[i].MakeTransparent(Color.FromArgb(0, 0, 0));
				cursor.Y += cursor.Height;
			}
		}

		public void Reset()
		{
			position = new Point(0, 0);
		}

		public void Write(Graphics g, string str)
		{
			for (int i = 0; i < str.Length; i++) 
			{
				g.DrawImageUnscaled(characters[(byte) (str[i] - 32)], position.X, position.Y);
				position.X += size.Width;
			}
		}

		public void Newline()
		{
			position.X = 0;
			position.Y += size.Height;
		}
	}

	public class MainPanel : Panel
	{ 
		int magnification = 2;
		Bitmap[] sprites = new Bitmap[34];
		Font font;
		Timer timer;
		int tick = 0;
		Level level = new Level();
		int lives = 20;
		Boolean[] keysRelease = new Boolean[4];
		Boolean[] keysDelay = new Boolean[4];  
  
		public MainPanel()
		{
			ClientSize = MagnifyRectangle(0, 0, 320, 256).Size;
			BorderStyle = BorderStyle.FixedSingle;

			font = new Font(MagnifyBitmap(new Bitmap(GetType().Assembly.GetManifestResourceStream("Font.png"))), MagnifyRectangle(0, 0, 8, 8).Size);

			Bitmap sprites = MagnifyBitmap(new Bitmap(GetType().Assembly.GetManifestResourceStream("Sprite.png")));
			Rectangle cursor = MagnifyRectangle(0, 0, 16, 16);
			for (int i = 0; i < 34; i++)
			{
				this.sprites[i] = sprites.Clone(cursor, PixelFormat.Format32bppArgb);
				cursor.X += cursor.Width;
			}

			level.Load();

			timer = new Timer();
			timer.Interval = 40;
			timer.Tick += new EventHandler(OnTimer);
			timer.Start();
		}

		protected override void OnKeyDown(KeyEventArgs e)
		{
			if (e.KeyCode == Keys.Left) { level.Digger.Keys[0] = true; keysDelay[0] = false; }
			if (e.KeyCode == Keys.Right) { level.Digger.Keys[1] = true; keysDelay[1] = false; }    
			if (e.KeyCode == Keys.Up) { level.Digger.Keys[2] = true; keysDelay[2] = false; }
			if (e.KeyCode == Keys.Down) { level.Digger.Keys[3] = true; keysDelay[3] = false; }        
			if ((e.KeyCode == Keys.Escape) && (lives > 0)) { lives--; level.Load(); }
			if ((e.KeyCode == Keys.Home) && (level.Number < 29)) { level.Number++; level.Load(); }
		}

		protected override void OnKeyUp(KeyEventArgs e)
		{
			if (e.KeyCode == Keys.Left) 
				if (keysDelay[0]) level.Digger.Keys[0] = false; else keysRelease[0] = true;
			if (e.KeyCode == Keys.Right) 
				if (keysDelay[1]) level.Digger.Keys[1] = false; else keysRelease[1] = true;
			if (e.KeyCode == Keys.Up) 
				if (keysDelay[2]) level.Digger.Keys[2] = false; else keysRelease[2] = true;
			if (e.KeyCode == Keys.Down) 
				if (keysDelay[3]) level.Digger.Keys[3] = false; else keysRelease[3] = true;
		}

		void OnTimer(object sender, EventArgs pe)
		{
			tick++;
			level.Tick1();    
			if ((tick % 2) == 0)
			{
				if (keysRelease[0]) { level.Digger.Keys[0] = keysRelease[0] = false; }
				if (keysRelease[1]) { level.Digger.Keys[1] = keysRelease[1] = false; }
				if (keysRelease[2]) { level.Digger.Keys[2] = keysRelease[2] = false; }
				if (keysRelease[3]) { level.Digger.Keys[3] = keysRelease[3] = false; }                  
				level.Tick4();
			}

			Invalidate(MagnifyRectangle(0, 8, 320, 16));
			for (int y = 0; y < 14; y++)
				for (int x = 0; x < 20; x++)
				{
					Sprite Sprite = level.GetSprite(x, y);
					if (Sprite.Invalidate)
					{
						Rectangle r = MagnifyRectangle(x * 16, y * 16 + 32, 16, 16);
						Invalidate(r);
						Sprite.Invalidate = false;
					}
				}
			Update();
		}

		protected override void OnPaintBackground(PaintEventArgs e) { }

		protected override void OnPaint(PaintEventArgs e)
		{
			Rectangle r = e.ClipRectangle;
			if ((r.Width == 0) || (r.Height == 0)) return;

			Bitmap Canvas = new Bitmap(r.Width, r.Height, e.Graphics);
			Graphics g = Graphics.FromImage(Canvas);
			g.TranslateTransform(-r.X, -r.Y);
			g.SetClip(r);

			SolidBrush Blue = new SolidBrush(Color.FromArgb(0x04, 0x02, 0x8F));
			g.FillRectangle(Blue, MagnifyRectangle(0, 0, 320, 8));
			g.FillRectangle(Blue, MagnifyRectangle(0, 24, 320, 8));
			SolidBrush Cyan = new SolidBrush(Color.FromArgb(0x2D, 0xE7, 0xC0));
			g.FillRectangle(Cyan, MagnifyRectangle(0, 2, 320, 4));
			g.FillRectangle(Cyan, MagnifyRectangle(0, 26, 320, 4));
			SolidBrush Red = new SolidBrush(Color.FromArgb(0x92, 0x02, 0x05));
			g.FillRectangle(Red, MagnifyRectangle(0, 8, 320, 16));

			font.Reset();
			font.Newline();
			font.Write(g, "  CAVE:  " + (level.Number + 1).ToString("D2") + " TIME:  " + level.Time.ToString("D5") + " DIAMONDS:  " + level.Diamonds.ToString("D2"));
			font.Newline();
			font.Write(g, "  LIVES: " + lives.ToString("D2") + " SCORE: " + level.Score.ToString("D5") + " COLLECTED: " + level.Collected.ToString("D2"));
			font.Newline();

			for (int y = 0; y < 14; y++)
				for (int x = 0; x < 20; x++)
				{
					Rectangle s = MagnifyRectangle(x * 16, y * 16 + 32, 16, 16);
					if (r.IntersectsWith(s)) g.DrawImageUnscaled(sprites[level.GetSprite(x, y).GetBitmap()], s.X, s.Y);
				}

			g.Dispose();
			e.Graphics.DrawImageUnscaled(Canvas, r.X, r.Y);
			Canvas.Dispose();
		}

		Rectangle MagnifyRectangle(int x, int y, int dx, int dy)
		{
			return new Rectangle(x * magnification, y * magnification, dx * magnification, dy * magnification);
		}

		Bitmap MagnifyBitmap(Bitmap source)
		{
			Bitmap target = new Bitmap(source.Width * magnification, source.Height * magnification);
			for (int x = 0; x < source.Width; x++)
				for (int y = 0; y < source.Height; y++)
					for (int ix = 0; ix < magnification; ix++)
						for (int iy = 0; iy < magnification; iy++)
							target.SetPixel(x * magnification + ix, y * magnification + iy, source.GetPixel(x, y));
			return target;
		}

		enum Directions { Left, Right, Up, Down, None }
  
		class Position
		{
			public int x, y;
  
			public Position() { x = 0; y = 0; }
			public Position(int x, int y) { this.x = x; this.y = y; }
			public Position(Position p) { this.x = p.x; this.y = p.y; }
			public bool Equal(Position p) { return ((this.x == p.x) && (this.y == p.y)); }
		}
  
		class Sprite 
		{
			public bool Invalidate = true;
			public virtual int GetBitmap() { return 0; }
		}
  
		class Ground : Sprite
		{ 
			public override int GetBitmap() { return 2; }
		}
  
		class Ghost : Sprite 
		{
			public Directions Direction = Directions.None;
			public bool Death = false;
  
			public override int GetBitmap()
			{
				if (Direction == Directions.Left) return 4;
				if (Direction == Directions.Right) return 5;
				if (Direction == Directions.Up) return 6;
				if (Direction == Directions.Down) return 3;
				return 3;
			}
  
			public virtual void Move(Level l) { }
  
			public void Die()
			{
				Death = true;
			}
  
			public void Blast(Level l)
			{
				if (Death) return;
  
				Position p = l.GetSpritePosition(this);
  
				for (int y = p.y - 1; y <= p.y + 1; y++)
					for (int x = p.x - 1; x <= p.x + 1; x++)
					{
						if ((x > 0) && (x < 19) && (y > 0) && (y < 13))
						{
							if (l.GetSprite(x, y).GetType() == typeof(Digger))
							{
								Digger d = (Digger) l.GetSprite(x, y);
								l.Digger.Die();
							}
							else
							{
								if (l.GetSprite(x, y).GetType().BaseType == typeof(Ghost))
								{
									Ghost g = (Ghost) l.GetSprite(x, y);
									g.Die();
									l.Score += 99;
								}
  
								l.SetSprite(x, y, new Nothing());
							}
						}
					}
  
				Die();
			}
		}
  
		class Ghost180 : Ghost
		{
			public override void Move(Level l)
			{
				if (Death) return;
  
				Position p = l.GetSpritePosition(this);
				Position[] w = { new Position(p), new Position(p), new Position(p), new Position(p) };
  
				if (Direction == Directions.Left)  { w[0].x--; w[1].x++; }
				if (Direction == Directions.Right) { w[0].x++; w[1].x--; }
				if (Direction == Directions.Up)    { w[0].y--; w[1].y++; }
				if (Direction == Directions.Down)  { w[0].y++; w[1].y--; }
  
				for (int i = 0; i < 4; i++)
				{
					if (!p.Equal(w[i]))
					{
						Position d = new Position(w[i]);
        
						// Digger
						if (l.GetSprite(d.x, d.y).GetType() == typeof(Digger)) l.Digger.Die();
  
						// Nothing
						if (l.GetSprite(d.x, d.y).GetType() == typeof(Nothing))
						{
							if (d.x < p.x) Direction = Directions.Left;
							if (d.x > p.x) Direction = Directions.Right;
							if (d.y < p.y) Direction = Directions.Up;
							if (d.y > p.y) Direction = Directions.Down;
          
							l.SetSprite(d.x, d.y, this);
							l.SetSprite(p.x, p.y, new Nothing());
  
							return;
						}
					}
				}
			}
		}
  
		class Ghost90L : Ghost
		{
			public override void Move(Level l)
			{
				if (Death) return;
  
				Position p = l.GetSpritePosition(this);
				Position[] w = { new Position(p), new Position(p), new Position(p), new Position(p) };
  
				if (Direction == Directions.Left)  { w[0].x--; w[1].y++; w[2].y--; w[3].x++; }
				if (Direction == Directions.Right) { w[0].x++; w[1].y--; w[2].y++; w[3].x--; }
				if (Direction == Directions.Up)    { w[0].y--; w[1].x--; w[2].x++; w[3].y++; }
				if (Direction == Directions.Down)  { w[0].y++; w[1].x++; w[2].x--; w[3].y--; }
  
				for (int i = 0; i < 4; i++)
				{
					if (!p.Equal(w[i]))
					{
						Position d = new Position(w[i]);
        
						// Digger
						if (l.GetSprite(d.x, d.y).GetType() == typeof(Digger)) l.Digger.Die();
  
						// Nothing
						if (l.GetSprite(d.x, d.y).GetType() == typeof(Nothing))
						{
							if (d.x < p.x) Direction = Directions.Left;
							if (d.x > p.x) Direction = Directions.Right;
							if (d.y < p.y) Direction = Directions.Up;
							if (d.y > p.y) Direction = Directions.Down;
							l.SetSprite(d.x, d.y, this);
							l.SetSprite(p.x, p.y, new Nothing());
							return;
						}
					}
				}
			}
		}
  
		class Ghost90LR : Ghost
		{
			public Directions Lastturn = Directions.None;
  
			public override void Move(Level l)
			{
  
				if (Death) return;
  
				Position p = l.GetSpritePosition(this);
				Position[] w = { new Position(p), new Position(p), new Position(p), new Position(p) };
  
				if (Direction == Directions.Left)
				{
					w[0].x--; w[3].x++;
					if (Lastturn == Directions.Left) { w[1].y--; w[2].y++; } 
					else { w[1].y++; w[2].y--; };
				}
  
				if (Direction == Directions.Right)
				{
					w[0].x++; w[3].x--;
					if (Lastturn == Directions.Left) { w[1].y++; w[2].y--; } 
					else { w[1].y--; w[2].y++; };
				}
  
				if (Direction == Directions.Up)
				{
					w[0].y--; w[3].y++;
					if (Lastturn == Directions.Left) { w[1].x++; w[2].x--; } 
					else { w[1].x--; w[2].x++; };
				}
  
				if (Direction == Directions.Down)
				{
					w[0].y++; w[3].y--;
					if (Lastturn == Directions.Left) { w[1].x--; w[2].x++; } 
					else { w[1].x++; w[2].x--; };
				}
     
				for (int i = 0; i < 4; i++)
				{
					if (!p.Equal(w[i]))
					{
						Position d = new Position(w[i]);
        
						// Digger
						if (l.GetSprite(d.x, d.y).GetType() == typeof(Digger)) l.Digger.Die();
  
						// Nothing
						if (l.GetSprite(d.x, d.y).GetType() == typeof(Nothing))
						{
							Directions LastDirection = Direction;
  
							if (d.x < p.x) Direction = Directions.Left;
							if (d.x > p.x) Direction = Directions.Right;
							if (d.y < p.y) Direction = Directions.Up;
							if (d.y > p.y) Direction = Directions.Down;
  
							switch (LastDirection)
							{
								case Directions.Left:
									if (Direction == Directions.Down)  Lastturn = Directions.Left; 
									if (Direction == Directions.Up)    Lastturn = Directions.Right;
									break;
								case Directions.Right:
									if (Direction == Directions.Down)  Lastturn = Directions.Right; 
									if (Direction == Directions.Up)    Lastturn = Directions.Left;
									break;
								case Directions.Up:
									if (Direction == Directions.Left)  Lastturn = Directions.Left; 
									if (Direction == Directions.Right) Lastturn = Directions.Right;
									break;
								case Directions.Down:
									if (Direction == Directions.Left)  Lastturn = Directions.Right; 
									if (Direction == Directions.Right) Lastturn = Directions.Left;
									break;
							}        
  
							l.SetSprite(d.x, d.y, this);
							l.SetSprite(p.x, p.y, new Nothing());
  
							return;
						}
					}
				}
			}
		}
  
		class Ghost90R : Ghost
		{
			public override void Move(Level l)
			{
				if (Death) return;
  
				Position p = l.GetSpritePosition(this);
				Position[] w = { new Position(p), new Position(p), new Position(p), new Position(p) };
  
				if (Direction == Directions.Left)  { w[0].x--; w[1].y--; w[2].y++; w[3].x++; }
				if (Direction == Directions.Right) { w[0].x++; w[1].y++; w[2].y--; w[3].x--; }
				if (Direction == Directions.Up)    { w[0].y--; w[1].x++; w[2].x--; w[3].y++; }
				if (Direction == Directions.Down)  { w[0].y++; w[1].x--; w[2].x++; w[3].y--; }
  
				for (int i = 0; i < 4; i++)
				{
					if (!p.Equal(w[i]))
					{
						Position d = new Position(w[i]);
        
						// Digger
						if (l.GetSprite(d.x, d.y).GetType() == typeof(Digger))
							l.Digger.Die();
  
						// Nothing
						if (l.GetSprite(d.x, d.y).GetType() == typeof(Nothing))
						{
							if (d.x < p.x) Direction = Directions.Left;
							if (d.x > p.x) Direction = Directions.Right;
							if (d.y < p.y) Direction = Directions.Up;
							if (d.y > p.y) Direction = Directions.Down;
          
							l.SetSprite(d.x, d.y, this);
							l.SetSprite(p.x, p.y, new Nothing());
  
							return;
						}
					}
				}
			}
		}
  
		class Wall : Sprite 
		{
			public override int GetBitmap() { return 14; }
		}
  
		class Digger : Sprite 
		{
			public Boolean[] Keys = new Boolean[4];
			Directions direction = Directions.None;
			int step = 0;
			Boolean dead = false;
			Boolean[] stone = new Boolean[2];
  
			public override int GetBitmap()
			{
				if (dead) return 31;
				int[] left = { 16, 17, 18, 19, 18, 17 };
				int[] right = { 20, 21, 22, 23, 22, 21 };
				int[] up = { 24, 25 };
				int[] down = { 26, 27 };
				int[] center = { 15, 15, 15, 15, 15, 15, 15, 15, 28, 28, 15, 15, 28, 28, 15, 15, 15, 15, 15, 15, 29, 29, 30, 30, 29, 29, 15, 15, 15, 15 };
				if ((direction == Directions.Left) && (step <= 5)) return left[step];
				if ((direction == Directions.Right) && (step <= 5)) return right[step];
				if ((direction == Directions.Up) && (step <= 1)) return up[step];
				if ((direction == Directions.Down) && (step <= 1)) return down[step];
				return center[step];
			}
  
			public void Animate(Level l, int x, int y)
			{
				if (dead) return;
  
				switch (direction)
				{
					case Directions.Left:
						step++;
						if (step >= 6) step = 0;
						l.Digger.Invalidate = true;
						break;
  
					case Directions.Right:
						step++;
						if (step >= 6) step = 0;
						l.Digger.Invalidate = true;
						break;
  
					case Directions.Up:
						step++;
						if (step >= 2) step = 0;
						l.Digger.Invalidate = true;
						break;
  
					case Directions.Down:
						step++;
						if (step >= 2) step = 0;
						l.Digger.Invalidate = true;
						break;
  
					case Directions.None:
						step++;
						if (step >= 30) step = 0;
						l.Digger.Invalidate = true;
						break;
				}
			}
  
			public void Move(Level l)
			{
				if (dead) return;
  
				Position p = l.GetSpritePosition(this);
				Position d = new Position(p);
				Position z = new Position(d);
  
				direction = Directions.None;
				if (Keys[0])
				{
					z.x--; direction = Directions.Left;
				} 
				else
				{
					stone[0] = false;
					if (Keys[1])
					{
						z.x++; direction = Directions.Right;
					}
					else
					{
						stone[1] = false;
						if (Keys[2])
						{
							z.y--; direction = Directions.Up;
						}
						else 
						{
							if (Keys[3])
							{ 
								z.y++; direction = Directions.Down;
							}
						}
					} 
				}
  
				if (!d.Equal(z))
				{
					// Nothing
					if (l.GetSprite(z.x, z.y).GetType() == typeof(Nothing))
						l.SetSprite(d.x, d.y, this);
  
					// Diamond
					if (l.GetSprite(z.x, z.y).GetType() == typeof(Diamond))
					{
						l.Collected += 1;
						l.Score += 3;
					}
  
					// Stone
					if (l.GetSprite(z.x, z.y).GetType() == typeof(Stone))
					{
						if ((z.x > d.x) && (l.GetSprite(z.x + 1, z.y).GetType() == typeof(Nothing)))
						{
							if (stone[1])
							{
								l.SetSprite(d.x + 2, d.y, l.GetSprite(d.x + 1, d.y));
								l.SetSprite(d.x + 1, d.y, new Nothing());
							}
							stone[1] = !stone[1];
						}
  
						if ((z.x < d.x) && (l.GetSprite(z.x - 1, z.y).GetType() == typeof(Nothing)))
						{
							if (stone[0])
							{
								l.SetSprite(d.x - 2, d.y, l.GetSprite(d.x - 1, d.y));
								l.SetSprite(d.x - 1, d.y, new Nothing());
							}
							stone[0] = !stone[0];
						}
					}
  
					// Ground
					if (l.GetSprite(z.x, z.y).GetType() == typeof(Nothing) ||
						l.GetSprite(z.x, z.y).GetType() == typeof(Ground) ||
						l.GetSprite(z.x, z.y).GetType() == typeof(Diamond))
					{
						l.SetSprite(z.x, z.y, this);
						l.SetSprite(d.x, d.y, new Buffer());
					}
  
					// Exit
					if (l.GetSprite(z.x, z.y).GetType() == typeof(Exit)) l.Exit();
  
					// Ghost
					if (l.GetSprite(z.x, z.y).GetType().BaseType == typeof(Ghost)) l.Digger.Die();
				}
  
				Animate(l, z.x, z.y);
			}
  
			public void Die()
			{
				dead = true;
				Invalidate = true;
			}
		}
  
		class Exit : Sprite 
		{
			public override int GetBitmap() { return 32; }
		}
  
		class Changer : Sprite
		{
			public override int GetBitmap() { return 33; }
		};
  
		class Gravitation : Sprite
		{
			public void Simulate(Level l, int x, int y)
			{
				int dx = x;
				int dy = y;
  
				// Nothing
				if (l.GetSprite(x, y + 1).GetType() == typeof(Nothing))
				{
					dy = y + 1;
				}
				else
				{
					// Stone or diamond
					if ((l.GetSprite(x, y + 1).GetType() == typeof(Stone)) || (l.GetSprite(x, y + 1).GetType() == typeof(Diamond)))
					{
						if (l.GetSprite(x - 1, y + 1).GetType() == typeof(Nothing) && l.GetSprite(x - 1, y).GetType() == typeof(Nothing))
						{
							dx = x - 1;
							dy = y + 1;
						}
						else
						{
							if (l.GetSprite(x + 1, y + 1).GetType() == typeof(Nothing) && l.GetSprite(x + 1, y).GetType() == typeof(Nothing))
							{
								dx = x + 1;
								dy = y + 1;
							}
						}
					}
  
					// Changer
					if ((l.GetSprite(x, y + 1).GetType() == typeof(Changer)) && (l.GetSprite(x, y).GetType() == typeof(Stone)) && (l.GetSprite(x, y + 2).GetType() == typeof(Nothing)))
						dy = y + 2;
				}
  
				// Mark
				if ((dx != x) || (dy != y)) l.SetSprite(dx, dy, new Marker());
			}
  
			public void Move(Level l, int x, int y)
			{
				int dx = x;
				int dy = y;
  
				// Follow gravitation
				if (l.GetSprite(x, y + 1).GetType() == typeof(Marker))
				{
					dy = y + 1;
				}
				else
				{
					// Falls to the left or to the right
					if (l.GetSprite(x, y + 1).GetType() == typeof(Stone) || l.GetSprite(x, y + 1).GetType() == typeof(Diamond) || l.GetSprite(x, y + 1).GetType() == typeof(Nothing))
					{
						if (l.GetSprite(x - 1, y + 1).GetType() == typeof(Marker) && (l.GetSprite(x - 1, y).GetType() == typeof(Nothing) || l.GetSprite(x - 1, y).GetType() == typeof(Marker)))
						{
							dx = x - 1;
							dy = y + 1;
						}
						else
						{
							if (l.GetSprite(x + 1, y + 1).GetType() == typeof(Marker) && (l.GetSprite(x + 1, y).GetType() == typeof(Nothing) || l.GetSprite(x + 1, y).GetType() == typeof(Marker)))
							{
								dx = x + 1;
								dy = y + 1;
							}
						}
					}
  
					// Changer
					if (l.GetSprite(x, y + 1).GetType() == typeof(Changer) && l.GetSprite(x, y).GetType() == typeof(Stone) && l.GetSprite(x, y + 2).GetType() == typeof(Marker)) dy = y + 2;
				}
  
				// Move
				if ((dx != x) || (dy != y))
				{
					if ((dy - y) == 2)
					{
						// changer
						l.SetSprite(dx, dy, new Diamond());
					}
					else
					{
						l.SetSprite(dx, dy, l.GetSprite(x, y));
						if (l.GetSprite(dx, dy).GetType() == typeof(UvStone))
							l.SetSprite(dx, dy, new Stone());
					}
  
					l.SetSprite(x, y, new Nothing());      
  
					// Kill digger if necessary
					if (l.GetSprite(dx, dy + 1).GetType() == typeof(Digger)) l.Digger.Die();
  
					if (l.GetSprite(dx, dy + 1).GetType().BaseType == typeof(Ghost))
					{
						Ghost g = (Ghost) l.GetSprite(dx, dy + 1);
						g.Blast(l);
					}
				}
			}
		}
  
		class Marker : Gravitation
		{
			public override int GetBitmap() { return 31; }
		}
  
		class Stone : Gravitation
		{
			public override int GetBitmap() { return 1; }
		};
  
		class Diamond : Gravitation
		{
			int counter = 0;
  
			public void Blink()
			{
				counter++;
				if (counter == 6) counter = 0;
				Invalidate = true;
			}
  
			public override int GetBitmap()
			{
				return (13 - ((counter + 4 * 1) % 6));
			}
		};
  
		class Nothing : Sprite { }
		class Buffer : Sprite { }
		class UvStone : Gravitation { }
  
		class Level
		{
			Byte[] data;
			Sprite[,] map = new Sprite[20, 14];
			Ghost[] ghosts = new Ghost[16];
			public Digger Digger;
			public int Number;
			public int Diamonds;
			public int Collected;
			public int Time;
			public int Score = 0;
  
			public Level()
			{
				Stream stream = GetType().Assembly.GetManifestResourceStream("Level.bin");
				data = new Byte[stream.Length];
				stream.Read(data, 0, (int) stream.Length);
  
				Number = 0;
			}
  
			public void Load()
			{
				Byte[] level = new Byte[156];
				for (int i = 0; i < 156; i++)
					level[i] = data[Number * 156 + i];
      
				for (int y = 0; y < 14; y++)
					for (int x = 0; x < 10; x++)
					{
						CreateSprite(x * 2, y , (byte) (level[y * 10 + x] >> 4));
						CreateSprite(x * 2 + 1, y , (byte) (level[y * 10 + x] & 0x0F));
					}
  
				Digger = (Digger) map[level[145], level[146]-2];
  
				for (int g = 0; g < 16; g++) ghosts[g] = null;
				int Ghost = 0;
				for (int y = 0; y < 14; y++)
					for (int x = 0; x < 20; x++)
					{
						if (GetSprite(x, y).GetType().BaseType == typeof(Ghost))
						{
							Ghost g = (Ghost) GetSprite(x, y);
							ghosts[Ghost] = g;
							int GhostInfo = level[0x94 + (Ghost >> 1)];
							if ((Ghost & 1) != 0)
							{
								GhostInfo = GhostInfo & 0x0F;
								if (g.GetType() == typeof(Ghost90LR)) ((Ghost90LR) g).Lastturn = Directions.Right;
							}
							else
							{
								GhostInfo = GhostInfo >> 4;
								if (g.GetType() == typeof(Ghost90LR)) ((Ghost90LR) g).Lastturn = Directions.Left;
							}
							Directions[] d = { Directions.Down, Directions.Up, Directions.Right, Directions.Left };
							g.Direction = d[GhostInfo];
							Ghost++;
						}
					}
  
				Diamonds = (level[147] / 0x10) * 10 + (level[147] % 0x10);
				Collected = 0;
				Time = 5000;
			}
  
			public void Exit()
			{ 
				if (Collected < Diamonds) return;
				if (Number >= 29) return;
				Number++;
				Load();
			}
  
			public void CreateSprite(int x, int y, int id)
			{
				Type[] t = { typeof(Nothing), typeof(Stone), typeof(Ground), typeof(Ghost180), null, typeof(Diamond), typeof(Wall), typeof(Ghost90L), null, typeof(UvStone), typeof(Digger), typeof(Ghost90LR), typeof(Exit), null, typeof(Changer), typeof(Ghost90R) };
				SetSprite(x, y, (Sprite) Activator.CreateInstance(t[id]));
			} 
  
			public void SetSprite(int x, int y, Sprite s)
			{
				map[x, y] = s;
				s.Invalidate = true;
			}
  
			public Sprite GetSprite(int x, int y)
			{
				return map[x, y];
			}
  
			public Position GetSpritePosition(Sprite s)
			{
				for (int x = 0; x < 20; x++)
					for (int y = 0; y < 14; y++)
						if (GetSprite(x, y) == s)
							return new Position(x, y);
				return new Position();
			}
  
			public void Tick1()
			{
				for (int y = 0; y < 14; y++)
					for (int x = 0; x < 20; x++)
						if (GetSprite(x, y).GetType() == typeof(Diamond))
							((Diamond) GetSprite(x, y)).Blink();
			}
  
			public void Tick4()
			{
				// Turn buffers into nothing
				for (int y = 13; y >= 0; y--)
					for (int x = 19; x >= 0; x--)
						if (map[x, y].GetType() == typeof(Buffer))
							SetSprite(x, y, new Nothing());
  
				// Digger
				Digger.Move(this);
  
				// Stones and Diamonds (UVStones?)
				for (int y = 13; y >= 0; y--)
					for (int x = 19; x >= 0; x--)
						if (map[x, y].GetType() == typeof(Stone) || map[x, y].GetType() == typeof(Diamond) || map[x, y].GetType() == typeof(UvStone))
						{
							Gravitation g = (Gravitation) map[x, y];
							g.Simulate(this, x, y);
						}
  
				for (int y = 13; y >= 0; y--)
					for (int x = 19; x >= 0; x--)
						if (map[x, y].GetType() == typeof(Stone) || map[x, y].GetType() == typeof(Diamond) || map[x, y].GetType() == typeof(UvStone))
						{
							Gravitation g = (Gravitation) map[x, y];
							g.Move(this, x, y);
						}
  
				for (int g = 0; g < 16; g++)
					if (ghosts[g] != null) ghosts[g].Move(this);
  
				if (Time > 0) Time--;
				if (Time == 0) Digger.Die();
			}
		}
	}

	public class MainFrame : Form
	{
		MainPanel panel = new MainPanel();  

		public MainFrame() 
		{
			Icon = new Icon(GetType().Assembly.GetManifestResourceStream("Digger.ico"));
			Text = "Lutz Roeder's .NET Digger";
			FormBorderStyle = FormBorderStyle.FixedDialog;
			MaximizeBox = false;    
			Controls.Add(panel);
			ClientSize = panel.ClientSize;
		}

		protected override void OnGotFocus(EventArgs e)
		{
			base.OnGotFocus(e);
			panel.Focus();
		}

		protected override void OnPaintBackground(PaintEventArgs e) 
		{
		}

		public static void Main(string[] args)
		{
			Application.Run(new MainFrame());
		}
	}

}
