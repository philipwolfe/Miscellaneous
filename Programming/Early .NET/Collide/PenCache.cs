// PenCache.cs
//
// Copyright 2000 Microsoft 

namespace Collide
{
using System;
using System.Drawing;
using System.Collections;

public class PenRecord
{
	public PenRecord(int red, int green, int blue)
	{
		this.red = red;
		this.green = green;
		this.blue = blue;

		pen = new Pen(Color.FromArgb(red, green, blue));		
	}
	public bool Match(int red, int green, int blue)
	{
		if ((this.red == red) &&
			(this.green == green) &&
			(this.blue == blue))
			return(true);
		else
			return(false);
	}

	public Pen Pen
	{
		get
		{
			return(pen);
		}
	}

	Pen	pen;
	int red;
	int green;
	int blue;
}

/// <summary>
///    Summary description for PenCache.
/// </summary>
public class PenCache
{
    public PenCache()
    {
    }

	public Pen this[int index]
	{
		get
		{
			return ((PenRecord) pens[index]).Pen;
		}
	}

	public int GetPenIndex(int red, int green, int blue)
	{
			/*
			 * If we have an existing pen, we return the index to it. If not, 
			 */
		for (int index = 0; index < pens.Count; index++)
		{
			PenRecord pen = (PenRecord) pens[index];
			if (pen.Match(red, green, blue))
				return(index);
		}

		PenRecord thePen = new PenRecord(red, green, blue);
		pens.Add(thePen);
		return(pens.Count - 1);
	}

	ArrayList pens = new ArrayList();
}
}
