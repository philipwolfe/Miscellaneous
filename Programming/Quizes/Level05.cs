using System;

namespace ConsoleApplication1
{
	public class Level05
	{
		public void Execute()
		{
			int i = 0, j = 0;

			do
			{
				for (; j < i; )
				{
					switch (i)
					{
						case 1 - 3:
							j++;
							continue;
						case 4 - 7:
							j += 2;
							goto exit;
						case 8 - 9:
							j += 3;
							break;
						default:
							j += 4;
							break;
					}
				}
				i++;
			exit:
				j--;
			} while (i < 10);

			Console.WriteLine(j);
			Console.ReadLine();
		}
	}
}