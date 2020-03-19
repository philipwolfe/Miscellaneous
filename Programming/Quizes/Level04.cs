using System;

namespace ConsoleApplication1
{
	public class Level04
	{
		public void Execute()
		{
			int i = 0, j = 0;

			for (; i < 10; )
				j = Add(i++, ++i);

			Console.WriteLine(j);
			Console.ReadLine();
		}

		private int Add(int n1, int n2)
		{
			return n1 + n2;
		}
	}
}