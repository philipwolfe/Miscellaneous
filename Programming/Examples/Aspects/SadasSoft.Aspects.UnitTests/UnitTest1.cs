using Microsoft.VisualStudio.TestTools.UnitTesting;
using SadasSof.Aspects;
using SadasSof.Aspects.Attributes;

namespace SadasSoft.Aspects.UnitTests
{
	/// <summary>
	/// Summary description for UnitTest1
	/// </summary>
	[TestClass]
	public class UnitTest1
	{
		[TestCleanup]
		public void TestCleanup()
		{
			CountingCalls.Clear("GetEmployees");
		}

		[TestMethod]
		public void ExternalFilterTest()
		{
			IBussinesLogicEmployees iBLExternal = null;
			iBLExternal = (IBussinesLogicEmployees)CodeInjection.Create(new BussinesLogicEmployees(),typeof(IBussinesLogicEmployeesExternalFilter));

			Employees dsE = null;

			dsE = iBLExternal.GetEmployees(BussinesLogicEmployees.Delegation.Madrid);

			Assert.IsNotNull(dsE);

			Assert.AreEqual(1, CountingCalls.Calls("GetEmployees"));

			try
			{
				dsE = iBLExternal.GetEmployees(BussinesLogicEmployees.Delegation.Paris);
			}
			catch
			{
				dsE = null;
			}

			Assert.IsNull(dsE);

			Assert.AreEqual(2, CountingCalls.Calls("GetEmployees"));

			dsE = iBLExternal.GetEmployees(BussinesLogicEmployees.Delegation.London);

			Assert.IsNotNull(dsE);

			Assert.AreEqual(3, CountingCalls.Calls("GetEmployees"));

		}

		[TestMethod]
		public void AllTest()
		{
			IBussinesLogicEmployees iBLExternal = null;
			iBLExternal = (IBussinesLogicEmployees)CodeInjection.Create(
				new BussinesLogicEmployees(),
				typeof(IBussinesLogicEmployeesAll));

			Employees dsE = null;

			dsE = iBLExternal.GetEmployees(BussinesLogicEmployees.Delegation.Madrid);

			Assert.IsNotNull(dsE);

			Assert.AreEqual(1, CountingCalls.Calls("GetEmployees"));

			try
			{
				dsE = iBLExternal.GetEmployees(BussinesLogicEmployees.Delegation.Paris);
			}
			catch
			{
				dsE = null;
			}

			Assert.IsNull(dsE);

			Assert.AreEqual(2, CountingCalls.Calls("GetEmployees"));

			dsE = iBLExternal.GetEmployees(BussinesLogicEmployees.Delegation.London);

			Assert.IsNotNull(dsE);

			Assert.AreEqual(3, CountingCalls.Calls("GetEmployees"));

		}
	}
}
