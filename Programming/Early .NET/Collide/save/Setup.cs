namespace Collide
{
using System;
using System.Drawing;

/// <summary>
///    Summary description for Setup.
/// </summary>
/// 
[Serializable]
public class Setup
{
    public Setup(bool preview)
    {
		if (preview)
		{
			ballCount = 1;
			sizeMax = 5;
		}
    }

	public string name = "Unnamed";
	public int	ballCount = 24;
	public bool collisions = true;
	public float elasticityBall = 1.0f;
	public float elasticityWall = 1.0f;
	public bool erase = true;
	public int	ghost = 5;
	public float velocity = 1.0f;
	public float gravityBall = 5.0f;
	public bool eraseBalls = true;
	public int	sizeMax = 20;
	public int	sizeMin = 5;
	public string	strFilename;
	public Distribute.Distributions distribution = Distribute.Distributions.Linear;
	public string strTitle = "";
	public string strFont = "Arial";
	public Color fontColor = Color.Red;
	public float titleSize = 24.0f;
}
}
