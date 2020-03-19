using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace SadasSoft.Aspects.UnitTests
{
	public class BussinesLogicEmployees
	{
		// Methods
		public DataSet GetEmployees(Delegation delagation)
		{
			Employees employees = new Employees();
			switch (delagation)
			{
				case Delegation.Madrid:
					employees.DsEmployees.AddDsEmployeesRow("C0001", "Nancy", "Davolio", "email1@empresatest.com", true);
					employees.DsEmployees.AddDsEmployeesRow("C0002", "Andrew", "Fuller", "email2@empresatest.com", false);
					employees.DsEmployees.AddDsEmployeesRow("C0003", "Janet", "Leverling", "email3@empresatest.com", false);
					employees.DsEmployees.AddDsEmployeesRow("C0004", "Margaret", "Margaret", "email4@empresatest.com", true);
					return employees;

				case Delegation.Paris:
					employees.DsEmployees.AddDsEmployeesRow("C0007", "Robert", "King", "email7@empresatest.com", true);
					employees.DsEmployees.AddDsEmployeesRow("C0008", "Laura", "Callahan", "email8@empresatest.com", false);
					employees.DsEmployees.AddDsEmployeesRow("C0009", "Anne", "Dodsworth", "email9@empresatest.com", false);
					throw new Exception("This is a TEST exception throw if delegation value is Paris. Can see generated log file in \"c:\\logExceptions.txt\" (default path).");

				case Delegation.London:
					employees.DsEmployees.AddDsEmployeesRow("C0005", "Steven", "Buchanan", "email5@empresatest.com", true);
					employees.DsEmployees.AddDsEmployeesRow("C0006", "Michael", "Suyama", "email6@empresatest.com", false);
					return employees;
			}
			return employees;
		}

		// Nested Types
		public enum Delegation
		{
			Madrid,
			Paris,
			London
		}
	}



}
