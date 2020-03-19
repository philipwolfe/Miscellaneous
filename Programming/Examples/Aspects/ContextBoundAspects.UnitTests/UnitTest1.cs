using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ContextBoundAspects.UnitTests
{
	/// <summary>
	/// Summary description for UnitTest1
	/// </summary>
	[TestClass]
	public class UnitTest1
	{

		[TestMethod]
		public void NoCatchTest()
		{
			String resultMessage = String.Empty;

			try
			{
				String returnValue = new SampleObj().NoCatch();
				resultMessage = String.Format("Returned value: {0}", returnValue);
			}
			catch (ArgumentException ae)
			{
				resultMessage = String.Format("Caught server side error: {0}", ae.Message.ToString());
			}
			catch (Exception ex)
			{
				resultMessage = String.Format("Caught client side error: {0}", ex.Message.ToString());
			}
			finally
			{
				Assert.AreEqual("Caught server side error: Cannot catch me!!", resultMessage);
			}
		}
		[TestMethod]
		public void ShallowTest()
		{
			String resultMessage = String.Empty;

			try
			{
				String returnValue = new SampleObj().SwallowException();
				resultMessage = String.Format("Returned value: {0}", returnValue);
			}
			catch (ArgumentException ae)
			{
				resultMessage = String.Format("Caught server side error: {0}", ae.Message.ToString());
			}
			catch (Exception ex)
			{
				resultMessage = String.Format("Caught client side error: {0}", ex.Message.ToString());
			}
			finally
			{
				Assert.AreEqual("Returned value: Free your mind.", resultMessage);
			}

		}
		[TestMethod]
		public void WriteExceptionTest()
		{
			String resultMessage = String.Empty;

			try
			{
				String returnValue = new SampleObj().WriteException();
				resultMessage = String.Format("Returned value: {0}", returnValue);
			}
			catch (ArgumentException ae)
			{
				resultMessage = String.Format("Caught server side error: {0}", ae.Message.ToString());
			}
			catch (Exception ex)
			{
				resultMessage = String.Format("Caught client side error: {0}", ex.Message.ToString());
			}
			finally
			{
				Assert.AreEqual("Caught server side error: You've got me?!?!  Who's got you?!?!", resultMessage);
			}

		}
		[TestMethod]
		public void BothTest()
		{
			String resultMessage = String.Empty;

			try
			{
				String returnValue = new SampleObj().Both();
				resultMessage = String.Format("Returned value: {0}", returnValue);
			}
			catch (ArgumentException ae)
			{
				resultMessage = String.Format("Caught server side error: {0}", ae.Message.ToString());
			}
			catch (Exception ex)
			{
				resultMessage = String.Format("Caught client side error: {0}", ex.Message.ToString());
			}
			finally
			{
				Assert.AreEqual("Returned value: What? Me Worry?", resultMessage);
			}

		}
	}
}
