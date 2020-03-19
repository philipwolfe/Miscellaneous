// Vector.cs
//
// Copyright 2000 Microsoft

namespace Collide
{
using System;

/// <summary>
/// An integer vector
/// </summary>
/// This is a simple vector value class, that stores an integer vector. 
///

public struct Vector
{
		public Vector(int x, int y)
		{
			this.x = x;
			this.y = y;
		}

		public override string ToString()
		{
			return String.Format("({0} {1})", x, y);
		}

		public double Length 
		{
			get
			{
				return(Math.Sqrt(x * x + y * y));
			}
		}
		/// <summary>
		/// Multiply a vector by a scalar. 
		/// </summary>
		/// <param name="v">The vector</param>
		/// <param name="mult">Scalar to multiply by</param>
		public static Vector operator*(Vector v, double mult)
		{
			Vector	result;
			result.x = (int) Math.Round(v.x * mult);
			result.y = (int) Math.Round(v.y * mult);

			return(result);
		}

		/// <summary>
		/// Subtract one vector from another
		/// </summary>
		/// <param name="v">Vector</param>
		/// <param name="sub">Vector to subtract from the first vector</param>
		public static Vector operator-(Vector v, Vector sub)
		{
			return(new Vector(v.x - sub.x, v.y - sub.y));
		}

		/// <summary>
		/// Add one vector to another
		/// </summary>
		/// <param name="v1">Vector</param>
		/// <param name="v2">Vector to add to the first vector</param>
		public static Vector operator+(Vector v1, Vector v2)
		{
			return(new Vector(v1.x + v2.x, v1.y + v2.y));
		}

		/// <summary>
		/// Dot Product of two vectors. Not divided to be a unit vector.
		/// </summary>
		/// <param name="v1">Vector 1</param>
		/// <param name="v2">Vector 2</param>
		public static double operator*(Vector v1, Vector v2)
		{
			return(v1.x * v2.x + v1.y * v2.y);
		}

			// Take the upper 16 bigt of the int, and move them down to the lower 16 bits.
		public Vector MakeSmall()
		{
			return new Vector(x >> 16, y >> 16);
		}

			// Take the lower 16 bits, and move them to the upper 16 bits.
		public Vector MakeBig()
		{
			return new Vector(x * 65536, y * 65536);
		}

			// create new values in the upper 16 bits. 
		public static Vector MakeBig(int x, int y)
		{
			return new Vector(x * 65536, y * 65536);
		}

		public int	x;
		public int	y;	
}

}
