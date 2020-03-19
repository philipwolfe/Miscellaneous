// Circle.cs
//
// Copyright 2000 Microsoft

namespace Collide
{
using System;
using System.Collections;
using System.Drawing;

/// <summary>
/// A Circle
/// </summary>
///
/// This class implements the circle. Well, it's not actually a circle - it's really
/// a regular polygon, since most circle drawing packages are *really* slow. The number
/// of sides scales based on the size of the circle to make it look circle-ish.

public class Circle
{
	const int SizeModMax = 20;
	static readonly int[] numberOfSides = new int[] {	1, 4, 8, 8, 8, 
									8, 12, 12, 12, 12,
									12, 12, 12, 12, 16,
									16, 16, 16, 16, 16};

	private Circle()
	{
	}

	// First, we determine how many sizes it should have.
	// Next, we check the prototype list to see if there is already a matching prototype
	// If not, we create a new prototype shape and point to it from this shape.
	public Circle(int size, int sides)
	{
		this.size = size;
		this.sides = sides;

			/*
			 * If the number of sides in unspecified, we choose based upon the size of the circle
			 */
		if (sides == 0)
		{
			if (size > SizeModMax)
			{
				if (size < 40)
					this.sides = 16;
				else
					this.sides = 24;
			}
			else
				this.sides = numberOfSides[size - 1];
		}

		shape = new Point[this.sides + 1];
		proto = FindProto();

	}
	public Circle(int size) : this(size, 0)
	{
	}

	Circle FindProto()
	{
			/*
			 * Search through the prototype list to see if there is already a shape table with the
			 * proper number of sides. If there is, we set the reference to it, and we're done.
			 * If not, we have to create one...
			 */
		Console.WriteLine("FindProto: {0} {1}", size, sides);
		foreach (Circle c in prototypes)
		{
			if ((c.sides == sides) &&
				(c.size == size))
				return(c);
		}
		Console.WriteLine("FindProto2:");

			/*
			 * We didn't find an existing prototype. We'll have to create a new one...
			 */
		Circle proto = new Circle();

		proto.sides = sides;
		proto.size = size;
		proto.shape = new Point[sides + 1];

		Console.WriteLine("FindProto3:");

		double	inc;
		double	angle;

		inc = 3.14159 * 2.0 / sides;
		angle = inc / 2;
		for (int index = 0; index <= sides; index++)
		{
			//CODEGEN: Uncomment next line to hide problem.
			//Console.WriteLine("");
			double	dX = (double) size * Math.Cos(angle);
			double	dY = (double) size * Math.Sin(angle);

			proto.shape[index].X = (int) Math.Round(dX);
			proto.shape[index].Y = (int) Math.Round(dY);
			angle += inc;
		}
		Console.WriteLine("FindProto4:");

			/*
			 * Special case to handle the size 1 and 2 cases, which don't work with the above...
			 */
		if (size == 1)
		{
			proto.shape[0].X = 0;
			proto.shape[0].Y = 0;
		}
		else if (size == 2)
		{
			proto.shape[0].X = 0;
			proto.shape[0].Y = 0;
			proto.shape[1].X = 1;
			proto.shape[1].Y = 0;
			proto.shape[2].X = 1;
			proto.shape[2].Y = 1;
			proto.shape[3].X = 0;
			proto.shape[3].Y = 1;
			proto.shape[4].X = 0;
			proto.shape[4].Y = 0;
		}

		prototypes.Add(proto);
		return(proto);
	}

	public int Sides
	{
		get
		{
			return sides;
		}
	}
	public int Size
	{
		get
		{
			return size;
		}
	}

		// Create a version of the with the passed-in offset.
	public void SetOrigin(Vector origin)
	{
		for (int index = 0; index <= sides; index++)
		{
			shape[index].X = proto.shape[index].X + origin.x;
			shape[index].Y = proto.shape[index].Y + origin.y;
		}
	}
	
	public void Draw(Graphics g, Pen p)
	{
		g.DrawPolygon(p, shape);
	}

	int size;
	int sides;
	Circle	proto = null;		// reference to prototype shape.
	Point[]	shape = null;		// array for this shape.

	static ArrayList	prototypes = new ArrayList();			// array of prototypes
}

}
