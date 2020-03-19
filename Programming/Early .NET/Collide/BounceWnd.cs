namespace Collide
{
using System;
using System.Windows.Forms;
using System.Drawing;
using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Soap;
using System.Collections;

/// <summary>
///    Summary description for BounceWnd.
/// </summary>
public class BounceWnd
{
    public BounceWnd(Form form, IntPtr handle, bool preview)
    {
		penCache = new PenCache();

		graphics = Graphics.FromHwnd((IntPtr) handle);
		this.form = form;
		this.handle = handle;
		ReadSetupFromFile();

			// if we're in preview mode, make things really simple
		if (preview)
		{
			this.setup = new Setup(true);
		}
    }

		// Description:	The meat of the action. For each of the balls that we're tracking, erase
		//				the ball, calculate the new position (including collisions and gravity),
		//				and draw the new one...
	public void Render()
	{
		if (init)
		{
			if (setup.erase)
			{
				graphics.FillRectangle(
						new SolidBrush(Color.Black), 
						0, 0, form.Width, form.Height);
			}
			init = false;
		}
			
			// Update the positions of all the balls, and draw them in the new positions
		for (int index = 0; index < setup.ballCount; index++)
		{
			Ball ball = balls[index];

			ball.UpdateEraseDraw();

			if (titleDraw)
				titleBlock.BounceOffTitle(ball);
		}

			// now handle gravity and collisions. We do this here so that all the balls
			// have been updated; if we did it earlier, we might calculate a collision
			// between a ball that had been moved and one that hadn't.
		for (int index = 0; index < setup.ballCount; index++)
		{
			Ball ball = balls[index];
			for (int check = index + 1; check < setup.ballCount; check++)
			{
				ball.GravityCollide(balls[check]);
			}
		}

		if (titleDraw)
			titleBlock.Render(graphics);	

			/*
			 * If there's a restart threshold, check to see if we're there. If we are, choose
			 * a new setup randomly (if desired), and then create the new setup.
			 */
		if (restartCount != 0)
		{
			cycleCount++;
			if (cycleCount == restartCount)
			{
				if (randomOnStartup)
				{
					currentSetup = rand.Next(setups.Count);
					setup = (Setup) setups[currentSetup];
				}

				DoSetup();
			}
		}
	}


		// Description:	Given the current settings in the global setup dialog objects, creates
		//				the items to run the server with the current settings.
	public void DoSetup()
	{

		byte [,] colors =  {{255, 0, 0}, {0, 255, 0}, {0, 0, 255},
							{255, 255, 0}, {255, 0, 255}, {0, 255, 255},
							{0, 128, 255}, {0, 255, 128}, {255, 0, 128}, 
							{128, 0, 255}, {255, 128, 0}, {128, 255, 0}};

		if (graphics != null)
			graphics.Dispose();

		graphics = Graphics.FromHwnd((IntPtr) handle);
		Ball.SetWindow(graphics, setup);
		Ball.TheForm = form;

			/*
			 * Figure out the size (& mass) distribution of the balls...
			 */
		Distribute	distribute = new Distribute(	setup.sizeMin,
													setup.sizeMax,
													setup.distribution);
		balls = new Ball[setup.ballCount];
		float perColor = (float) setup.ballCount / (float)colors.GetLength(0); 
	
		for (int index = 0; index < setup.ballCount; index++)
		{
			int	color = (int) ((float) index / perColor);
			balls[index] = new Ball(distribute.GetNextSize(),
									colors[color, 0],
									colors[color, 1],
									colors[color, 2]);
		}

		init = true;
		cycleCount = 0;

		titleDraw = false;
		if (setup.strTitle == null)
			return;
		if (setup.strTitle == "")
			return;
		if (setup.strFont == null)
			return;

		if (titleBlock != null)
			titleBlock.Dispose();

		titleBlock = 
			new TitleBlock(	setup.strTitle,
							setup.strFont,
							setup.titleSize,
							setup.fontColor,
							form.Size,
							graphics);
							
		titleDraw = true;
			
			// make sure the balls aren't inside...
		for (int index = 0; index < setup.ballCount; index++)
		{
			Ball ball = balls[index];

			while (titleBlock.IsInside(ball.Position, setup.sizeMax + titleBlock.TextPad))
			{
				ball.RandLoc();
			}
		}
	}

	public Random Rand
	{
		get { return(rand);}
	}

	public Setup Setup
	{
		get
		{
			return(setup);
		}
	}

	public bool FullScreen
	{
		get
		{
			return(fullScreen);
		}
		set
		{
			if (fullScreen != value)
			{
				fullScreen = value;
				SaveSetupToFile();
			}
		}
	}

	public bool RandomOnStartup
	{
		get
		{
			return(randomOnStartup);
		}
		set
		{
			if (randomOnStartup != value)
			{
				randomOnStartup = value;
				SaveSetupToFile();
			}
		}
	}

	public int RestartCount
	{
		get
		{
			return(restartCount);
		}
		set
		{
			if (restartCount != value)
			{
				restartCount = value;
				SaveSetupToFile();
			}
		}
	}

	public void SaveSetupToFile()
	{
		Stream streamWrite = File.Create("Collide.XML");
		SoapFormatter soapWrite = new SoapFormatter();
		soapWrite.Serialize(streamWrite, currentSetup);
		soapWrite.Serialize(streamWrite, setups);
		soapWrite.Serialize(streamWrite, fullScreen);
		soapWrite.Serialize(streamWrite, randomOnStartup);
		soapWrite.Serialize(streamWrite, restartCount);
		streamWrite.Close();
	}

	public void ReadSetupFromFile()
	{
		Stream streamRead = null;
		try
		{
			streamRead = File.OpenRead("Collide.XML");
			SoapFormatter soapRead = new SoapFormatter();
			currentSetup = (int) soapRead.Deserialize(streamRead);
			setups = (ArrayList) soapRead.Deserialize(streamRead);
			fullScreen = (bool) soapRead.Deserialize(streamRead);
			randomOnStartup = (bool) soapRead.Deserialize(streamRead);
			restartCount = (int) soapRead.Deserialize(streamRead);
			streamRead.Close();

			if (randomOnStartup)
				currentSetup = rand.Next(setups.Count);

			setup = (Setup) setups[currentSetup];
		}
		catch (FileNotFoundException)
		{
			Console.WriteLine("Config file not found");
			return;		// okay if it's not there, just return
		}
		catch 
		{
			setups.Add(setup);
			return;
		}
	}

		// add a new configuration, so we don't modify the current one...
	public void NewSetup()
	{
		setup = new Setup(false);
		DoSetup();
	}

		// add the setup to the list of ones we save, and save them out...
	public void AddSetup()
	{
		setups.Add(setup);
		currentSetup = setups.Count - 1;
		SaveSetupToFile();
	}

	public void	AddContextMenuChoices(ContextMenu cm, EventHandler onClick)
	{
		for (int index = 0; index < setups.Count; index++)
		{
			Setup s = (Setup) setups[index];
			MenuItem mi = new MenuItem(s.name, onClick);
			if (s == setup)
				mi.Checked = true;
			cm.MenuItems.Add(mi);
		}
	}

	public void SetCurrentConfig(int index)
	{
		currentSetup = index;
		SaveSetupToFile();						// save the current setup...
		setup = (Setup) setups[index];
	}

	Form		form;
	IntPtr handle;

	Graphics	graphics = null;
	Ball[] balls;
	bool init = true;
	int cycleCount = 0;
	PenCache penCache;
	Random rand = new Random(DateTime.Now.Millisecond);
	ArrayList setups = new ArrayList();	// list of different setups...
	int currentSetup = 0;				// index of the setup we're using...
	bool fullScreen = false;			// full screen value
	bool randomOnStartup = false;		// random at startup value
	int restartCount = 0;					// frames to reset after...
	Setup setup = new Setup(false);
	bool titleDraw = false;
	TitleBlock titleBlock = null;
}
}

