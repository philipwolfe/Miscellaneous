// Ball.cs - handle moving, drawing, and colliding balls. 
//
// Copyright 2000 Microsoft


namespace Collide
{
using System;
using System.Drawing;
using System.Windows.Forms;

/// <summary>
/// Ball class for the collide application
/// </summary>
/// 
/// This class implements the balls, and handles collisions between balls and other balls.
/// Balls are implemented using integer math for location and velocity by using the old
/// arcade trick of keeping track of position as a 32 bit value, but only using the upper
/// 16 bits as the real location. That allows the lower 16 bits to be fractional values.
/// This is mostly because the code is really old, and ran on machines without great
/// floating point support.
public class Ball
{
    public Ball()
    {
			// create velocities in the range (-16383, 16383)
		velocity.x = (int) (setup.velocity * (16383 - (int)(rand.NextDouble() * 32767)));
		velocity.y = (int) (setup.velocity * (16383 - (int)(rand.NextDouble() * 32767)));

			/*
			 * Size and mass changed later if desired...
			 */
		size = 1;
		mass = 1;

		ghostCount = setup.ghost;
		drawIndex = 0;

		CreateShapes();
    }

	public Ball(int size, byte red, byte green, byte blue)
	{
			// create velocities in the range (-16383, 16383)
		velocity.x = (int) (setup.velocity * (16383 - (int)(rand.NextDouble() * 32767)));
		velocity.y = (int) (setup.velocity * (16383 - (int)(rand.NextDouble() * 32767)));

		ghostCount = setup.ghost;
		drawIndex = 0;

		penIndex = penCache.GetPenIndex(red, green, blue);
		
		this.size = size;
		mass = size * size;
		CreateShapes();

		RandLoc();
	}

		// Description:	Given the current setup configuration, create all of the shapes that will
		//				be needed to draw this ball. 
	void CreateShapes()
	{
		shapes = new Circle[ghostCount];
	
		for (int shape = 0; shape < ghostCount; shape++)
			shapes[shape] = new Circle(size);
	}

		// Description:	Place the ball randomly within the window (but not too close to the edge)
	public void RandLoc()
	{
		int height = TheForm.ClientSize.Height;
		int width = TheForm.ClientSize.Width;
Console.WriteLine("height, width: {0} {1}", height, width);
		position = Vector.MakeBig(
						(int) (size * 2 + (width - size * 4) * rand.NextDouble()),
						(int) (size * 2 + (height - size * 4) * rand.NextDouble()));
		positionSmall = position.MakeSmall();

		topLeft = Vector.MakeBig(size, size);
		bottomRight = Vector.MakeBig(width - size, height - size);
	}

		// Description:	Update the ball's current position, then erase the old one and draw the
		// new one...
	public void UpdateEraseDraw()
	{
		position += velocity;

		if ((position.x > bottomRight.x) ||
			(position.x < topLeft.x))
		{
			velocity.x = (int)(-velocity.x * setup.elasticityWall);
			position.x += velocity.x;
		}

		if ((position.y > bottomRight.y) ||
			(position.y < topLeft.y))
		{
			velocity.y = (int)(-velocity.y * setup.elasticityWall);
			position.y += velocity.y;
		}
		positionSmall = position.MakeSmall();
		//Console.WriteLine("Position: {0}", positionSmall);

			/*
			 * Now erase the old one
			 */
		Circle current = shapes[drawIndex];
		if (setup.eraseBalls)
		{
			current.Draw(graphics, penBlack);
		}

			/*
			 * Now draw the new one...
			 */
		current.SetOrigin(positionSmall);
		current.Draw(graphics, penCache[penIndex]);

		drawIndex++;
		if (drawIndex == ghostCount)
			drawIndex = 0;
	}

		// Description:	Handle gravity and collisions between the current ball and another
	public void GravityCollide(Ball	ball2)
	{
			/* 
			 * If we're doing gravity, the calculations can be reused for collisions (if enabled)
			 * If we're doing collisions only, we have some short-circuit cases...
			 */	
		if (setup.gravityBall != 0)
		{
			int	distx = positionSmall.x - ball2.positionSmall.x;
			int	disty = positionSmall.y - ball2.positionSmall.y;
			int	distSq = distx * distx + disty * disty;
	
				/*
				 * Collision (no short-circuit - already have distance squared)
				 */
			if (setup.collisions)
			{
				int	centerDistance = size + ball2.size;
				int	centerDistanceSq = centerDistance * centerDistance;

				if (distSq <= centerDistanceSq)
				{
					Collide(ball2);
					distSq = 0;			// set to zero to disable gravity for this iteration
				}
			}

			if (distSq != 0)
			{
				int	distCu = (int) Math.Sqrt(distSq) * distSq;
				int	sx = (int) (setup.gravityBall * gval * distx);
				int	sy = (int) (setup.gravityBall * gval * disty);
				velocity.x -= (sx * ball2.mass) / distCu;
				velocity.y -= (sy * ball2.mass) / distCu;
				ball2.velocity.x += (sx * mass) / distCu;
				ball2.velocity.y += (sy * mass) / distCu;
			}
		
		}
		else
		{
				/*
				 * No gravity, optimize collision
				 */	
			if (!setup.collisions)
				return;

				/*
				 * Trivial rejection...
				 */	
			int	centerDistance = size + ball2.size;

			int	distx = Math.Abs(positionSmall.x - ball2.positionSmall.x);

			if (distx > centerDistance)
				return;

			int	disty = Math.Abs(positionSmall.y - ball2.positionSmall.y);

			if (disty > centerDistance)
				return;

				/*
				 * Passed trivial reject. Are we really close enough?
				 * We factor out sqrt() operation to speed things up, and to gain precision
				 */
	
			int	centerDistanceSq = centerDistance * centerDistance;
			int	distSq = distx * distx + disty * disty;

			if (distSq > centerDistanceSq)
				return;

				/*
				 * Do the collision!
				 */
			Collide(ball2);
		}
	}


		// Description:	Perform a collision between two balls. 
		//
		// Note: This code doesn't give great results at high velocities, because the
		// collision isn't detected until after the balls are closer than their minimum
		// distance. A better version would take their current position and backtrack by
		// part of the last increment of each ball to find the spot where they were when
		// they actually collided.
	void Collide(Ball	ball2)
	{
		Vector	pos1 = new Vector(positionSmall.x, positionSmall.y);
		Vector	pos2 = new Vector(ball2.positionSmall.x, ball2.positionSmall.y); 
			/*
			 * Figure out the center vector. We would normally use a unit vector, but we can't
			 * do that easily in integers, so we remember that the dot product of a unit vector
			 * with another vector is the same as the dot product of the non-unit vector with the
			 * vector divided by the length of the non-unit vector. Basically, wherever we want to
			 * use the unit vector, we have to use the center vector and remember the length factor.
			 */

		Vector	c = pos1 - pos2;

		double	t = c.Length;
		if (t == 0.0)
			t = 0.01;

			/*
			 * Figure out the projections of the velocity vectors on the center vector. The dot
			 * products give us a signed length of the velocity vectors aint the line of impact.
			 * We then compute the new final velocities using conservation of momentum and the
			 * velocity relation (velocity of recession = velocity of approach)
			 * Momentum:
			 *  m1v1f + m2v2f = m1v1i + m2v2i
			 * Velocity:
			 *  v2f - v1f = -(v2i - v1i)
			 *
			 * Solving for v2f, we get (after a few manipulations)
			 *  V2f = 2M1V1i + (M2 - M1)V2i
			 *        ---------------------
			 *               M1 + M2
			 *
			 * Note that this simplifies in the equal mass case to V2f = v1i
			 *
			 * We then use the velocity relation to determine V1f:
			 * V1f = V2f + V2i - V1i
			 */
		double	v1i = (velocity * c) / (t * t);
		double	v2i = (ball2.velocity * c) / (t * t);
	
		double	v2f = (2 * mass * v1i + (ball2.mass - mass) * v2i) / 
							(mass + ball2.mass);
		double	v1f = v2f + v2i - v1i;
	
			/*
			 * Scale the final velocities by the elasticity factor. This probably isn't rigorous,
			 * but the references I have don't do much with this, other than mention that the
			 * solution is non-trivial.
			 * All balls are currently equally elastic. This could be changed later by adding a
			 * separate factor, and multiplying the factors together.
			 */
		v2f *= setup.elasticityBall;
		v1f *= setup.elasticityBall;
	
		Vector	c1 = c * v1i;
		Vector	c2 = c * v2i;
	
			/*
			 * Weed out some antisocial behavior - the balls may be moving towards each other. If
			 * we don't, we may have already calculated this collision. Anyway, if the dot product
			 * of c and c1 > 0 (they point in the same direction), the balls are travelling
			 * towards each other, and we should continue.
			 * NOTE: I'm not sure how well this works...
			 */
		if (c * c1 > 0)
		{
			if (c * c2 < 0) return;
			if (c1.Length > c2.Length) return;
		}
		else
		{
			if (c * c2 < 0) {
				if (c1.Length < c2.Length) return;
			}
		}
	
			/*
			 * Figure out the perpendicular vectors, so we can deal with the velocities along the
			 * center axis only.
			 */
		Vector	p1 = velocity - c1;
		Vector	p2 = ball2.velocity - c2;
	
	
		Vector f1 = c * v1f;
		Vector f2 = c * v2f;
	
			/*
			 * Finally, add back in the perpendicular velocities to get the final results...
			 */
		velocity = f1 + p1;
		ball2.velocity = f2 + p2;
	}

		// Description:	Set the size of the ball. The mass is set to the square of the size, and
		//              all the shapes are recreated for the new size.
	public void SetSize(int size)
	{
		this.size = size;
		mass = size * size;
		CreateShapes();
	}

	int RandVel()
	{
		return(16383 - (int)(rand.NextDouble() * 32767));
	}

	public static void SetWindow(Graphics graphics, Setup setup)
	{
		Ball.graphics = graphics;
		Ball.setup = setup;
	}

	public static Form TheForm
	{
		get
		{
			return(theForm);
		}
		set
		{
			theForm = value;
		}
	}

	public Vector Position
	{
		get
		{
			return(positionSmall);
		}
	}

	public Vector Velocity
	{
		get
		{
			return(velocity);
		}
		set
		{
			velocity = value;
		}
	}

	public int Size
	{
		get
		{
			return(size);
		}
	}

	Vector		position;		// position of the ball...
	Vector		positionSmall;		// SMALL(position)...
	Vector		velocity;		// velocity of the ball...
	int		size;			// size
	int		mass;			// mass of the ball...
	int		penIndex;		// index of pen...


	int		ghostCount;
	Circle[]	shapes;

	Vector	topLeft;
	Vector	bottomRight;

	int		drawIndex;

	static int gval = 4000;
	static Setup setup;

	static PenCache	penCache = new PenCache();
	static Graphics	graphics = null;
	static Pen penBlack = new Pen(Color.Black);

	static Form theForm = null;		// the form we're using...
	static Random rand = new Random();
}
}


