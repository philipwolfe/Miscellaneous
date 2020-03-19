using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ConsoleApplication1
{
	public class Level09
	{
		public void Execute()
		{
			var i = 0;
			var c = new[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' };
			var v = new[] {0, 4, 8, 14, 20};

			Action a = () => i++;
			Action<char> b = Console.WriteLine;
			Action<char, bool> d = (c1, b1) => { if (b1) b(c1); };
			//Predicate<char> h = c1 => { return Array.Find() };
			Func<char> e = () => { var o = c[i]; a(); return o; };
			//Func<char, bool> g = (c1, b1) => { return Array.Find(c, h); };
//d(e(c1), g(c1));
			//var f = Array.Find(c, Process);

			//Array.ForEach(c, Process);

			//Process(f, null);

			//var j = Array.IndexOf(c, f);

			//Array.ForEach(c, Process);
			//Process(Console.WriteLine);

			//var write = a => { Console.WriteLine(a); };

			//	Proces(write);
		}

		private bool Process(char c)
		{
			return c > 'd';
		}

		//private void Process(char c)
		//{

		//}

		private void Proces(Action a)
		{ }
		private void Proces<T>(T t, Action<T> a)
		{ }
		private void Proces<T>(T t, Action<T, bool> a)
		{ }
		private void Proces(Func<bool> f)
		{ }
		private void Proces<T>(T t, Func<T, bool> f)
		{ }
		private void Proces<T>(Predicate<T> p)
		{ }

	}
}
