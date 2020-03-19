using System;

namespace ConsoleApplication1
{
	public class Level06Base : IDisposable
	{
		~Level06Base()
		{
			Dispose(true);
		}

		public void Dispose()
		{
			Dispose(true);
		}

		private bool _disposed;
		protected virtual void Dispose(bool disposing)
		{
			if(!_disposed)
			{
				_disposed = true;
			}
		}
	}

	public class Level06 : Level06Base
	{
		private object _singleUse;
		public Level06()
		{
			_singleUse = new object();
			Initialize(null);
		}

		private void Initialize(object dataSource)
		{
			if(dataSource == null)throw new ArgumentNullException("dataSource");
		}

		private bool _disposed;
		protected override void Dispose(bool disposing)
		{
			if(!_disposed)
			{
				_singleUse = null;
				_disposed = true;
			}
			base.Dispose(disposing);
		}
	}
}