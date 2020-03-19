using System;
using System.Drawing;

namespace Collide
{
	/// <summary>
	/// Summary description for Segment.
	/// </summary>
	public class Segment
	{
		MyPointF p1;
		MyPointF p2;
		Vector vUnit;
		Ball collideBall = new Ball();	// ball used for collisions

		public Segment(MyPointF p1, MyPointF p2)
		{
			this.p1 = p1;
			this.p2 = p2;
			vUnit = new Vector(p2.X - p1.X, p2.Y - p1.Y).MakeUnit();;
		}

		public Segment(float x1, float y1, float x2, float y2)
		{
			this.p1.X = x1;
			this.p1.Y = y1;
			this.p2.X = x2;
			this.p2.Y = y2;
			vUnit = new Vector(p2.X - p1.X, p2.Y - p1.Y).MakeUnit();;
		}

		public override string ToString()
		{
			return String.Format("Segment: {0} to {1}", p1, p2);
		}

		// collide a ball with this segment.
		public bool CollideBall(Ball ball)
		{
			// Figure out vectors from segment
			// ends to the point
			Vector w1 = new Vector(ball.Position - p1);
			Vector w2 = new Vector(ball.Position - p2);

			//
			// The first step is to figure out the
			// distance of the ball from the segment.
			// If it's beyond the ends, we figure out the
			// distance from the endpoint. 
			// If we're within the size of the ball, we
			// have a collision. To do the collision, we
			// set our captive ball to the same size, 
			// set the appropriate position and velocity vector,
			// and then let the normal collision code do its stuff...
			//
			bool doCollide = false;
			float dot1 = Vector.DotProduct(w1, vUnit);
			float dot2 = Vector.DotProduct(w2, vUnit);
			Vector vPerp;
			if (dot1 <= 0.0f)
			{
				vPerp = new Vector(ball.Position, p1);
				if (vPerp.Length < ball.Size) 
				{
					//Console.WriteLine("beyond end 1: {0}", vPerp.Length);
					doCollide = true;
				}
			}

				// If this dot product >= 0, it means
				// the point is beyond point2
			else if (dot2 >= 0.0f)
			{
				vPerp = new Vector(ball.Position, p2);
				if (vPerp.Length < ball.Size)
				{
					doCollide = true;
					//Console.WriteLine("beyond end 2: {0}", vPerp.Length);
				}
			}
				// We're not past the end, so we figure
				// out the perpendicular vector, and
				// return its length.
			else
			{
				vPerp = w1 - (vUnit * dot1);
				//vPerp = vPerp * -1;
				if (vPerp.Length < ball.Size)
				{
					doCollide = true;
					//Console.WriteLine("Middle: {0}", vPerp.Length);
				}
			}

			if (doCollide)
			{
				//Console.WriteLine("Collide");
				// Set position of our ball so that it's 
				// double the distance from the ball to 
				// the line, on the perpendicular vector
				collideBall.Position = ball.Position + vPerp * 2.0f;
				collideBall.Size = ball.Size;
				collideBall.Mass = ball.Mass;

				// figure out the velocity here. 
				// What is needed is a identical vector towards the
				// colliding ball as this ball has towards the segment
				// point...
				// The dot product between the velocity and perpendicular
				// vector tells us the velocity towards our ball; we reverse
				// it to get the backwards velocity.

					// Get the unit vector of the velocity
				Vector velocityUnit = ball.Velocity.MakeUnit();
				Vector perpUnit = vPerp.MakeUnit();
				//Console.WriteLine("vPerp: {0}", vPerp);
				//Console.WriteLine("vUnit: {0}", velocityUnit);
				
				Vector velocityPerp = perpUnit * Vector.DotProduct(perpUnit, ball.Velocity);
				//Console.WriteLine("velPerp: {0}", velocityPerp);
				collideBall.Velocity = ball.Velocity - velocityPerp * 2.0f;
				//Console.WriteLine(this);
				//Console.WriteLine("Ball: {0}", ball);
				//Console.WriteLine("Coll: {0}", collideBall);
				ball.Collide(collideBall, false);
				//Console.WriteLine("Ball After: {0}", ball);
				//Console.WriteLine("");
				return(true);
			}
			return false;
		}

		public void Render(Graphics graphics, Pen pen)
		{
			graphics.DrawLine(pen, p1, p2);
		}
	}
}
