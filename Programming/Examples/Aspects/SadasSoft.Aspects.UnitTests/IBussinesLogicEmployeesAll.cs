using SadasSof.Aspects.Attributes;

namespace SadasSoft.Aspects.UnitTests
{
	public interface IBussinesLogicEmployeesAll : IBussinesLogicEmployees
	{
		[CountingCalls]
		[LoggerExceptionToFile]
		new Employees GetEmployees(BussinesLogicEmployees.Delegation delegation);
	}
}
