namespace Collide
{
    using System;
	using System.Collections;

    /// <summary>
    ///    Summary description for CommandLine.
    /// </summary>
    public class CommandLine
    {
		Hashtable slashParams = new Hashtable();
		string[] normalParams = null;

		public Hashtable SlashParams
		{
			get
			{
				return(slashParams);
			}
		}
		public string[] NormalParams
		{
			get
			{
				return(normalParams);
			}
		}
		
		public CommandLine(string[] args)
        {
			bool inSlash = false;
			string slashString = "";
			ArrayList normalParamsList = new ArrayList();

			for (int index = 0; index < args.Length; index++)
			{
				string s = args[index];

				if (s.IndexOf("/") == 0)
				{
					if (inSlash)
					{
						slashParams[slashString] = "";
					}
					inSlash = true;
					slashString = s;
				}
				else
					// this param doesn't start with a slash. If we had
					// a slash before this one, we'll add this in 
				{
					if (inSlash)
					{
						slashParams[slashString] = s;
						inSlash = false;
					}				
					else
					{
						normalParamsList.Add(s);
					}
				}
			}

				// if we were in a slash, add it to the list...
			if (inSlash)
			{
				slashParams[slashString] = "";
			}

				// convert the list of params to a string array...
			normalParams = new string[normalParamsList.Count];
			int i = 0;
			foreach (string s in normalParamsList)
			{
				normalParams[i] = s;
				i++;
			}
        }
    }
}
