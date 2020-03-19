using System;
using System.Linq;

namespace ConsoleApplication1
{
	public class Level10
	{
		public void Execute()
		{
			{ int i = 1; }
			var s = new Integer();
			int v = s;
			{
				var i = new Integer(3);
				if (s == v + i)
				{
					var q = (from e in Enumerable.Repeat(i, s)
					         where i >= v
					         select new { e }).ToList();
					q.ForEach(_ => Console.Write(_.e));
				}
				else
				{
					var r = Enumerable.Range(v, i).ToArray();
					Array.ForEach(r, Console.Write);
				}
			}
			Console.ReadLine();
		}
	}

	public struct Integer
	{
		static int _x;
		public Integer(int value)
		{
			_x = value;
		}
		private int x
		{
			get { return _x; }
		}
		public static implicit operator int(Integer i)
		{
			return i.x;
		}
	}
}