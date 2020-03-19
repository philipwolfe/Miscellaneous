using System;
using System.Diagnostics;
using System.Messaging;

namespace MessageQueues
{
	public abstract class MessageQueueProcessor : IDisposable
	{
		private readonly MessageQueue _queue;
		private MessageQueue _errorQueue;
		private readonly object _lockObject = new object();
		private bool _disposed = false;
		TraceSource _traceSource = new TraceSource("MessageQueueProcessor");

		protected MessageQueueProcessor(string queueName)
		{
			_traceSource.TraceInformation("Connecting to Queue: " + queueName);
			try
			{
				_queue = new MessageQueue(queueName);
				_traceSource.TraceInformation("Connection Successful: " + queueName);
			}
			catch
			{
				_traceSource.TraceInformation("Queue Unavailable: " + queueName);
				throw new ArgumentException("Queue name does not point to a valid queue.", "queueName");
			}
		}

		public MessageQueueProcessor(string queueName, string errorQueueName)
			: this(queueName)
		{
			_traceSource.TraceInformation("Connecting to Queue: " + errorQueueName);
			try
			{
				_errorQueue = new MessageQueue(errorQueueName);
				_traceSource.TraceInformation("Connection Successful: " + errorQueueName);
			}
			catch
			{
				_traceSource.TraceInformation("Queue Unavailable: " + errorQueueName);
				throw new ArgumentException("Queue name does not point to a valid queue.", "errorQueueName");
			}
		}

		protected void Start()
		{
			if (_queue == null)
				throw new InvalidOperationException("Queue is not configured correctly.");

			_traceSource.TraceInformation("Starting queue polling of queue: " + _queue.Path);

			bool isTransactional = false;

			try
			{
				isTransactional = _queue.Transactional;
			}
			catch
			{
			}

			if (isTransactional)
			{
				_traceSource.TraceInformation("Queue is Transactional.");
				//set up an event listner for when a message comes in
				_queue.PeekCompleted += SourceQueuePeekCompleted;

				//start listening
				_queue.BeginPeek();
			}
			else
			{
				_traceSource.TraceInformation("Queue is not Transactional.");

				//set up an event listner for when a message comes in
				_queue.ReceiveCompleted += SourceQueueReceiveCompleted;

				// start listening
				_queue.BeginReceive();
			}

			_traceSource.TraceInformation("Listening to queue: " + _queue.Path);
		}

		protected void Stop()
		{
			if (_queue == null)
				throw new InvalidOperationException("Queue is not configured correctly.");

			_traceSource.TraceInformation("Closing queue: " + _queue.Path);
			_queue.Close();
		}

		protected abstract bool ProcessMessage(Message message);

		private void SourceQueuePeekCompleted(object sender, PeekCompletedEventArgs e)
		{
			lock (_lockObject)
			{
				MessageQueueTransaction trans = new MessageQueueTransaction();
				trans.Begin();
				Message message = _queue.Receive(trans);

				_traceSource.TraceInformation("Message Received: " + message.Label);

				try
				{
					ProcessMessage(message);
				}
				catch
				{
					if (_errorQueue != null)
					{
						_errorQueue.Send(message, trans);
					}
				}

				trans.Commit();
			}

			_queue.BeginPeek();
		}

		private void SourceQueueReceiveCompleted(object sender, ReceiveCompletedEventArgs e)
		{
			lock (_lockObject)
			{
				_traceSource.TraceInformation("Message Received: " + e.Message.Label);

				bool success = false;
				try
				{
					success = ProcessMessage(e.Message);
				}
				finally
				{
					if (!success && _errorQueue != null)
					{
						_errorQueue.Send(e.Message);
					}
				}
			}

			//listen for next message
			_queue.BeginReceive();
		}

		#region IDisposable Implementation

		~MessageQueueProcessor()
		{
			Dispose(false);
		}

		public void Dispose()
		{
			Dispose(true);
			GC.SuppressFinalize(this);
		}

		protected virtual void Dispose(bool disposing)
		{
			if (!_disposed)
			{
				if (disposing)
				{
					_queue.Dispose();

					if (_errorQueue != null)
						_errorQueue.Dispose();
				}


				_disposed = true;
			}
		}
		#endregion
	}
}