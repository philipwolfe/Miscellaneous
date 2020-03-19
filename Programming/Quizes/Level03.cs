using System;

namespace ConsoleApplication1
{
	public class Level03Base
	{
		public Level03Base()
		{
			Write("Hello,");
		}

		public Level03Base(string m1) : this()
		{
			Write(m1);
		}
		
		protected virtual void Write(string message)
		{
			Console.Write(message);
		}
	}

	public class Level03 : Level03Base
	{
		public Level03() : this("Hello")
		{
			Write("!");
		}

		public Level03(string m1) : this(m1 + ", ", "World!")
		{
			Write(m1);
		}

		public Level03(string m1, string m2) : base(m1 + m2)
		{
			Write(m1);
			Write(m2);
		}

		protected override void Write(string message)
		{
			Console.WriteLine(message);
		}

		public void Execute()
		{
			Console.ReadLine();
		}
	}
}