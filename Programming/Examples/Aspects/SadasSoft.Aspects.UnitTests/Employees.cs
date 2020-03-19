using System;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Runtime.Serialization;
using System.Xml;
using System.Xml.Schema;

namespace SadasSoft.Aspects.UnitTests
{
	[Serializable, DesignerCategory("code"), DebuggerStepThrough, ToolboxItem(true)]
	public class Employees : DataSet
	{
		// Fields

		#region Delegates

		public delegate void DsEmployeesRowChangeEventHandler(object sender, DsEmployeesRowChangeEvent e);

		#endregion

		private DsEmployeesDataTable tableDsEmployees;

		// Methods
		public Employees()
		{
			InitClass();
			CollectionChangeEventHandler handler = new CollectionChangeEventHandler(SchemaChanged);
			base.Tables.CollectionChanged += handler;
			base.Relations.CollectionChanged += handler;
		}

		protected Employees(SerializationInfo info, StreamingContext context)
		{
			string s = (string) info.GetValue("XmlSchema", typeof (string));
			if (s != null)
			{
				DataSet dataSet = new DataSet();
				dataSet.ReadXmlSchema(new XmlTextReader(new StringReader(s)));
				if (dataSet.Tables["DsEmployees"] != null)
				{
					base.Tables.Add(new DsEmployeesDataTable(dataSet.Tables["DsEmployees"]));
				}
				base.DataSetName = dataSet.DataSetName;
				base.Prefix = dataSet.Prefix;
				base.Namespace = dataSet.Namespace;
				base.Locale = dataSet.Locale;
				base.CaseSensitive = dataSet.CaseSensitive;
				base.EnforceConstraints = dataSet.EnforceConstraints;
				base.Merge(dataSet, false, MissingSchemaAction.Add);
				InitVars();
			}
			else
			{
				InitClass();
			}
			base.GetSerializationData(info, context);
			CollectionChangeEventHandler handler = new CollectionChangeEventHandler(SchemaChanged);
			base.Tables.CollectionChanged += handler;
			base.Relations.CollectionChanged += handler;
		}

		[DesignerSerializationVisibility(DesignerSerializationVisibility.Content), Browsable(false)]
		public DsEmployeesDataTable DsEmployees
		{
			get { return tableDsEmployees; }
		}

		public override DataSet Clone()
		{
			Employees employees = (Employees) base.Clone();
			employees.InitVars();
			return employees;
		}

		protected override XmlSchema GetSchemaSerializable()
		{
			MemoryStream w = new MemoryStream();
			base.WriteXmlSchema(new XmlTextWriter(w, null));
			w.Position = 0L;
			return XmlSchema.Read(new XmlTextReader(w), null);
		}

		private void InitClass()
		{
			base.DataSetName = "Employees";
			base.Prefix = "";
			base.Namespace = "http://tempuri.org/Employees.xsd";
			base.Locale = new CultureInfo("en-US");
			base.CaseSensitive = false;
			base.EnforceConstraints = true;
			tableDsEmployees = new DsEmployeesDataTable();
			base.Tables.Add(tableDsEmployees);
		}

		internal void InitVars()
		{
			tableDsEmployees = (DsEmployeesDataTable) base.Tables["DsEmployees"];
			if (tableDsEmployees != null)
			{
				tableDsEmployees.InitVars();
			}
		}

		protected override void ReadXmlSerializable(XmlReader reader)
		{
			Reset();
			DataSet dataSet = new DataSet();
			dataSet.ReadXml(reader);
			if (dataSet.Tables["DsEmployees"] != null)
			{
				base.Tables.Add(new DsEmployeesDataTable(dataSet.Tables["DsEmployees"]));
			}
			base.DataSetName = dataSet.DataSetName;
			base.Prefix = dataSet.Prefix;
			base.Namespace = dataSet.Namespace;
			base.Locale = dataSet.Locale;
			base.CaseSensitive = dataSet.CaseSensitive;
			base.EnforceConstraints = dataSet.EnforceConstraints;
			base.Merge(dataSet, false, MissingSchemaAction.Add);
			InitVars();
		}

		private void SchemaChanged(object sender, CollectionChangeEventArgs e)
		{
			if (e.Action == CollectionChangeAction.Remove)
			{
				InitVars();
			}
		}

		private bool ShouldSerializeDsEmployees()
		{
			return false;
		}

		protected override bool ShouldSerializeRelations()
		{
			return false;
		}

		protected override bool ShouldSerializeTables()
		{
			return false;
		}

		// Properties

		// Nested Types

		#region Nested type: DsEmployeesDataTable

		[DebuggerStepThrough]
		public class DsEmployeesDataTable : DataTable, IEnumerable
		{
			// Fields
			private DataColumn columnEmail;
			private DataColumn columnEmployeeId;
			private DataColumn columnExternal;
			private DataColumn columnFirstName;
			private DataColumn columnLastName;

			internal DsEmployeesDataTable()
				: base("DsEmployees")
			{
				InitClass();
			}

			internal DsEmployeesDataTable(DataTable table)
				: base(table.TableName)
			{
				if (table.CaseSensitive != table.DataSet.CaseSensitive)
				{
					base.CaseSensitive = table.CaseSensitive;
				}
				if (table.Locale.ToString() != table.DataSet.Locale.ToString())
				{
					base.Locale = table.Locale;
				}
				if (table.Namespace != table.DataSet.Namespace)
				{
					base.Namespace = table.Namespace;
				}
				base.Prefix = table.Prefix;
				base.MinimumCapacity = table.MinimumCapacity;
				base.DisplayExpression = table.DisplayExpression;
			}

			[Browsable(false)]
			public int Count
			{
				get { return base.Rows.Count; }
			}

			internal DataColumn EmailColumn
			{
				get { return columnEmail; }
			}

			internal DataColumn EmployeeIdColumn
			{
				get { return columnEmployeeId; }
			}

			internal DataColumn ExternalColumn
			{
				get { return columnExternal; }
			}

			internal DataColumn FirstNameColumn
			{
				get { return columnFirstName; }
			}

			public DsEmployeesRow this[int index]
			{
				get { return (DsEmployeesRow) base.Rows[index]; }
			}

			internal DataColumn LastNameColumn
			{
				get { return columnLastName; }
			}

			#region IEnumerable Members

			public IEnumerator GetEnumerator()
			{
				return base.Rows.GetEnumerator();
			}

			#endregion

			// Events
			public event DsEmployeesRowChangeEventHandler DsEmployeesRowChanged;

			public event DsEmployeesRowChangeEventHandler DsEmployeesRowChanging;

			public event DsEmployeesRowChangeEventHandler DsEmployeesRowDeleted;

			public event DsEmployeesRowChangeEventHandler DsEmployeesRowDeleting;

			// Methods

			public void AddDsEmployeesRow(DsEmployeesRow row)
			{
				base.Rows.Add(row);
			}

			public DsEmployeesRow AddDsEmployeesRow(string EmployeeId, string FirstName, string LastName, string Email,
			                                        bool External)
			{
				DsEmployeesRow row = (DsEmployeesRow) base.NewRow();
				row.ItemArray = new object[] {EmployeeId, FirstName, LastName, Email, External};
				base.Rows.Add(row);
				return row;
			}

			public override DataTable Clone()
			{
				DsEmployeesDataTable table = (DsEmployeesDataTable) base.Clone();
				table.InitVars();
				return table;
			}

			protected override DataTable CreateInstance()
			{
				return new DsEmployeesDataTable();
			}

			protected override Type GetRowType()
			{
				return typeof (DsEmployeesRow);
			}

			private void InitClass()
			{
				columnEmployeeId = new DataColumn("EmployeeId", typeof (string), null, MappingType.Element);
				base.Columns.Add(columnEmployeeId);
				columnFirstName = new DataColumn("FirstName", typeof (string), null, MappingType.Element);
				base.Columns.Add(columnFirstName);
				columnLastName = new DataColumn("LastName", typeof (string), null, MappingType.Element);
				base.Columns.Add(columnLastName);
				columnEmail = new DataColumn("Email", typeof (string), null, MappingType.Element);
				base.Columns.Add(columnEmail);
				columnExternal = new DataColumn("External", typeof (bool), null, MappingType.Element);
				base.Columns.Add(columnExternal);
				base.Constraints.Add(new UniqueConstraint("EmployeesKey1", new DataColumn[] {columnEmployeeId}, false));
				columnEmployeeId.AllowDBNull = false;
				columnEmployeeId.Unique = true;
			}

			internal void InitVars()
			{
				columnEmployeeId = base.Columns["EmployeeId"];
				columnFirstName = base.Columns["FirstName"];
				columnLastName = base.Columns["LastName"];
				columnEmail = base.Columns["Email"];
				columnExternal = base.Columns["External"];
			}

			public DsEmployeesRow NewDsEmployeesRow()
			{
				return (DsEmployeesRow) base.NewRow();
			}

			protected override DataRow NewRowFromBuilder(DataRowBuilder builder)
			{
				return new DsEmployeesRow(builder);
			}

			protected override void OnRowChanged(DataRowChangeEventArgs e)
			{
				base.OnRowChanged(e);
				if (DsEmployeesRowChanged != null)
				{
					DsEmployeesRowChanged(this, new DsEmployeesRowChangeEvent((DsEmployeesRow) e.Row, e.Action));
				}
			}

			protected override void OnRowChanging(DataRowChangeEventArgs e)
			{
				base.OnRowChanging(e);
				if (DsEmployeesRowChanging != null)
				{
					DsEmployeesRowChanging(this, new DsEmployeesRowChangeEvent((DsEmployeesRow) e.Row, e.Action));
				}
			}

			protected override void OnRowDeleted(DataRowChangeEventArgs e)
			{
				base.OnRowDeleted(e);
				if (DsEmployeesRowDeleted != null)
				{
					DsEmployeesRowDeleted(this, new DsEmployeesRowChangeEvent((DsEmployeesRow) e.Row, e.Action));
				}
			}

			protected override void OnRowDeleting(DataRowChangeEventArgs e)
			{
				base.OnRowDeleting(e);
				if (DsEmployeesRowDeleting != null)
				{
					DsEmployeesRowDeleting(this, new DsEmployeesRowChangeEvent((DsEmployeesRow) e.Row, e.Action));
				}
			}

			public void RemoveDsEmployeesRow(DsEmployeesRow row)
			{
				base.Rows.Remove(row);
			}

			// Properties
		}

		#endregion

		#region Nested type: DsEmployeesRow

		[DebuggerStepThrough]
		public class DsEmployeesRow : DataRow
		{
			// Fields
			private DsEmployeesDataTable tableDsEmployees;

			// Methods
			internal DsEmployeesRow(DataRowBuilder rb)
				: base(rb)
			{
				tableDsEmployees = (DsEmployeesDataTable) base.Table;
			}

			public string Email
			{
				get
				{
					string str;
					try
					{
						str = (string) base[tableDsEmployees.EmailColumn];
					}
					catch (InvalidCastException exception)
					{
						throw new StrongTypingException("Cannot get value because it is DBNull.", exception);
					}
					return str;
				}
				set { base[tableDsEmployees.EmailColumn] = value; }
			}

			public string EmployeeId
			{
				get { return (string) base[tableDsEmployees.EmployeeIdColumn]; }
				set { base[tableDsEmployees.EmployeeIdColumn] = value; }
			}

			public bool External
			{
				get
				{
					bool flag;
					try
					{
						flag = (bool) base[tableDsEmployees.ExternalColumn];
					}
					catch (InvalidCastException exception)
					{
						throw new StrongTypingException("Cannot get value because it is DBNull.", exception);
					}
					return flag;
				}
				set { base[tableDsEmployees.ExternalColumn] = value; }
			}

			public string FirstName
			{
				get
				{
					string str;
					try
					{
						str = (string) base[tableDsEmployees.FirstNameColumn];
					}
					catch (InvalidCastException exception)
					{
						throw new StrongTypingException("Cannot get value because it is DBNull.", exception);
					}
					return str;
				}
				set { base[tableDsEmployees.FirstNameColumn] = value; }
			}

			public string LastName
			{
				get
				{
					string str;
					try
					{
						str = (string) base[tableDsEmployees.LastNameColumn];
					}
					catch (InvalidCastException exception)
					{
						throw new StrongTypingException("Cannot get value because it is DBNull.", exception);
					}
					return str;
				}
				set { base[tableDsEmployees.LastNameColumn] = value; }
			}

			public bool IsEmailNull()
			{
				return base.IsNull(tableDsEmployees.EmailColumn);
			}

			public bool IsExternalNull()
			{
				return base.IsNull(tableDsEmployees.ExternalColumn);
			}

			public bool IsFirstNameNull()
			{
				return base.IsNull(tableDsEmployees.FirstNameColumn);
			}

			public bool IsLastNameNull()
			{
				return base.IsNull(tableDsEmployees.LastNameColumn);
			}

			public void SetEmailNull()
			{
				base[tableDsEmployees.EmailColumn] = Convert.DBNull;
			}

			public void SetExternalNull()
			{
				base[tableDsEmployees.ExternalColumn] = Convert.DBNull;
			}

			public void SetFirstNameNull()
			{
				base[tableDsEmployees.FirstNameColumn] = Convert.DBNull;
			}

			public void SetLastNameNull()
			{
				base[tableDsEmployees.LastNameColumn] = Convert.DBNull;
			}

			// Properties
		}

		#endregion

		#region Nested type: DsEmployeesRowChangeEvent

		[DebuggerStepThrough]
		public class DsEmployeesRowChangeEvent : EventArgs
		{
			// Fields
			private DataRowAction eventAction;
			private DsEmployeesRow eventRow;

			// Methods
			public DsEmployeesRowChangeEvent(DsEmployeesRow row, DataRowAction action)
			{
				eventRow = row;
				eventAction = action;
			}

			// Properties
			public DataRowAction Action
			{
				get { return eventAction; }
			}

			public DsEmployeesRow Row
			{
				get { return eventRow; }
			}
		}

		#endregion
	}
}