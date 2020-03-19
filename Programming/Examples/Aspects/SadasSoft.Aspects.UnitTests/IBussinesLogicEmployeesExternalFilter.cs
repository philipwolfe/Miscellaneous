using System;
using System.IO;
using SadasSof.Aspects.Attributes;

namespace SadasSoft.Aspects.UnitTests
{

	public interface IBussinesLogicEmployeesExternalFilter : IBussinesLogicEmployees
	{
		[CountingCalls]
		[ExternalFilter]
		[LoggerToFile]
		[LoggerExceptionToFile("exceptionfile.txt")]
		new Employees GetEmployees(BussinesLogicEmployees.Delegation delegation);
	}
}
