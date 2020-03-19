// Distrib.cs
//
// Copyright 2000 Microsoft

namespace Collide
{
using System;

/// <summary>
/// These classes implement different distributions
/// DistFunc is the abstract base class
/// DistFuncLinear, DistFuncSquared, and DistFuncInverse return different distributions
/// </summary>
public abstract class DistFunc
{
		public DistFunc() {}
		public DistFunc(int count) 
		{
			this.count = count;
		}

		public abstract float Value(int index);

		protected int	count = 0;
};

public class DistFuncLinear: DistFunc
{
		public DistFuncLinear(int count): base(count) {}

		public override float Value(int index)
		{
			return(1.0f / (float) count);
		}
};

public class DistFuncSquared: DistFunc
{
		public DistFuncSquared(int count): base(count) {}

		public override float Value(int index)
		{
			float denom = index + 2.0f;
			return(1.0f / (denom * denom));
		}
};

public class DistFuncInverse: DistFunc
{
		public DistFuncInverse(int count): base(count) {}

		public override float Value(int index)
		{
			float denom = count + 1.0f - index;
			return(1.0f / (denom * denom));
		}
};

public class Distribute
{
	public enum Distributions
	{
		Linear,
		Squared,
		Inverse
	}

	/// <summary>
	/// Create the basic distribution table for balls
	/// </summary>
	/// <remarks>
	/// </remarks>
	/// <param name="sizeMin">Minimum size to include</param>
	/// <param name="sizeMax">Maximum size to include</param>
	/// <param name="number">Number of entries there will be</param>
	public Distribute(int sizeMin, int sizeMax, Distributions dist)
	{
		// This is a bit involved. For each possible size, the distribution function
		//	will return a float that indicates how likely (in a relative sense) that
		//	size is to be created. We sum these values up, and then normalize them
		//	so that their sum will be one. We then place them in a threshold array,
		//	which will be searched to find the proper value.
		DistFunc	distFunc = null;
		int			count = sizeMax - sizeMin + 1;

		this.sizeMin = sizeMin;
		this.sizeMax = sizeMax;

		rand = new Random();

		switch (dist)
		{
		case Distributions.Linear:
			distFunc = new DistFuncLinear(count);
			break;	
	
		case Distributions.Squared:
			distFunc = new DistFuncSquared(count);
			break;	
	
		case Distributions.Inverse:
			distFunc = new DistFuncInverse(count);
			break;	
		}

			/*
			 * Add up all the values to figure out the normalization factor.
			 */
		float	total = 0.0f;
		for (int index = 0; index < count; index++)
		{
			total += distFunc.Value(index);
		}

			/*
			 * Go through again to get the real values, normalizing so they add to 1.0.
			 */
		values = new float[count];
		float	threshold = 0.0f;
		for (int index = 0; index < count; index++)
		{
			threshold += distFunc.Value(index) / total;
			values[index] = threshold;
		}
	}

	/// <summary>
	/// Return the size of the next ball given the current distribution
	/// </summary>
	public int GetNextSize()
	{
		// Discussion:	Generate a random number, and then search through the threshold array
		// until we find the index that corresponds to the random value. This tells
		// us which size to return.
		int count = sizeMax - sizeMin + 1;

		double value = rand.NextDouble();

			/*
			 * Search through until an entry exceeds our value. That means the value fit in the
			 * previous slot.
			 */
		int index;
		for (index = 0; index < count; index++)
		{
			if (values[index] > value)
				break;
		}

		return(sizeMin + index);
	}	

	float[]	values;
	int sizeMin;
	int	sizeMax;
	Random	rand;
}

}
