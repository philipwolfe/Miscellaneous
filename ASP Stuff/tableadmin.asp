<%OPTION EXPLICIT
'****************************************************************************************
'****      PAGE: tableadmin.asp (but not hardcoded in this page)
'****   AUTHORS: Philip Wolfe pwolfe@quilogy.com, Andrew ********* a*********@quilogy.com
'****   PURPOSE: To display any database table with paging and allow inserts, 
'****             updates, and deletes.
'****  FUNCTION: This page can be pointed to any database and it will be able to display 
'****             all the tables.  Users will be able to page through the results, addnew
'****             records, edit all or specified columns, and delete records.  To 
'****             customize the data the user can apply filters based on column data or 
'****             sort on multiple columns by clicking the title.  The page gets the data 
'****             using Quilogy's DataAccess component.  The component creates 3 custom 
'****             stored procedures on first use to gather table information.  There 
'****             are many functions to reuse code.  The page tries to accomodate for 
'****             both Netscape and Internet Explorer.  See notes at the end for a TODO.
'****       USE: The only configuration needed is in the config section directly below 
'****             the Declarations section.
'****************************************************************************************

'  So page isn't cached
Response.Expires = 0							'0 min
Response.ExpiresAbsolute = NOW() - 1			'Date and time
Response.AddHeader "Pragma", "no-cache"			'For client
Response.AddHeader "cache-control", "no-store"	'For Proxy

'  DECLARE VARIABLES:
'  OBJECTS-------------------------------------------------------------------------------
Dim objDASQL				'  Data Access Object that can do straight SQL
Dim objResultRS				'  Holds returns from checking if our Stored Procedures exist
Dim objTRS					'  Recordset that holds all the table names
Dim objPKRS					'  Recordset that holds the Primary Keys for this table
Dim objRS					'  Recordset that holds actual table data

'  BOOLEANS------------------------------------------------------------------------------
Dim blnAllowINSERT			'  initial setting for allowing INSERT on all tables
Dim blnAllowUPDATE			'  initial setting for allowing UPDATE on all tables
Dim blnAllowDELETE			'  initial setting for allowing DELETE on all tables
Dim blnNewTable				'  see if we switched tables each page change
Dim blnAllowPKEdits			'  see if we are allowed to edit the primary key
Dim blnWritten				'  see if a field has been written
Dim blnEditable				'  tell if a field is editable
Dim blnIsAPK				'  determine if a field is a primary key
Dim blnFoundUPK				'  show if we found a primary key
Dim blnfoundsort			'  
Dim blnAllowPAGING			'  initial setting for allowing PAGING on all tables
Dim blnDebug				'  Turn on or off Debug statements

'  STRINGS-------------------------------------------------------------------------------
Dim strTableFilter			'  filter string to remove tables
Dim strTableName			'  current table we are looking at
Dim strMsg					'  string to contain error messages
Dim strTableSort			'  string hold sort criteria
Dim strSQL					'  string to hold SQL statement to be executed
Dim strColFilter			'  column filter string
Dim strPKTag				'  String to designate Primary Key Form Fields
Dim strDBTag				'  String to designate Data Base Form Fields
Dim strNEWTag				'  String to designate New Form Fields
Dim strConn					'  Connection String

Dim strInsertNotice			'  Message displayed under a new row
Dim strDBDefault			'  Message displayed for database defaults
Dim strPrevious				'  Previous display text
Dim strNext					'  Next display text
Dim strNoPKeysNotice		'  Message displayed when their are not primary keys
Dim strNoEditAllowed		'  Message displayed when editing a protected table
Dim strNoDeleteAllowed		'  Message displayed when deleting from a protected table
Dim strNoInsertAllowed		'  Message displayed when insert in a protected table
Dim strFilterError			'  Message displayed when a filter causes an error
Dim strPageTitle			'  Prefix before the name of the table
Dim strCurrentActionNotice	'  Message displayed in config div during an edit or new
Dim strNoTablesError		'  Message displayed when there are no tables in the rs
Dim strGoToButton			'  GoTo button text
Dim strPageSizeButton		'  Page Size button text
Dim strAddFilterButton		'  Add Filter button text
Dim strRemoveFilterButton	'  Remove Filter button text
Dim strRemoveSortButton		'  Remove Sort button text
Dim strAddSorttxt			'  Message prompt for adding a sort

'  ENUMERATORS---------------------------------------------------------------------------
Dim RSfld					'  used to enumurate Recordset fields
Dim frmfld					'  used to enumurate Form fields
Dim arrItem					'  used to enumurate Array items

'  COUNTERS------------------------------------------------------------------------------
Dim i						'  
Dim arrCounter				'  counter to step through an array
Dim intPKCounter			'  counter to step through primary keys
Dim intColCount				'  # of columns with or without addnew col

'  ARRAYS--------------------------------------------------------------------------------
Dim arrSort					'  Array to hold the fields to sort on
Dim arrHiddenTables			'  Array to hold tables not to show in dropdown
Dim arrHiddenFields			'  Array to hold fields that should not be shown
Dim arrLockedFields			'  Array to hold fields users can't edit
Dim arrPasswordFields		'  Array to hold fields that should be treated as passwords
Dim arrPKEditsExceptions	'  Holds table names that are opposite of blnAllowPKEdits
Dim arrINSERTExceptions		'  Holds table names that are opposite of blnAllowINSERT
Dim arrUPDATEExceptions		'  Holds table names that are opposite of blnAllowUPDATE
Dim arrDELETEExceptions		'  Holds table names that are opposite of blnAllowDELETE
Dim arrPAGINGExceptions		'  Holds table names that are opposite of blnAllowPAGING

'  PAGING--------------------------------------------------------------------------------
Dim iPageSize				'  Initial page number
Dim iPageCount				'  The number of pages we get back
Dim iPageCurrent			'  The page we want to show
Dim iPageStep				'  Stepping for page numbers
Dim iRecordsShown			'  Counter to control number of records displayed
Dim iPageCounter			'  Counter to display page numbers

'  SESSION-------------------------------------------------------------------------------
REM Session("__strCurrentTable")	'  String to hold what table we are on now
REM Session("__strColFilter")		'  String to hold the column we are filtering on
REM Session("__arrSortArray")		'  Array to hold what columns we are sorting on
REM Session("__intPageSize")		'  Integer to hold how many records to display


'****************************************************************************************
'******************************         BEGIN CONFIG          ***************************
'****************************************************************************************
blnDebug = false '  Show or Hide Debug Information
strConn = "provider=sqloledb;Data Source=(local);initial catalog=northwind;uid=sa;password=sqlpassword"
iPageSize = 10 '  Initial number of records to display on a page
strPKTag = "PK_"
strDBTag = "DB_"
strNEWTag = "NEW_"
blnAllowPKEdits = false	'  Can users edit Primary keys of tables
blnAllowINSERT = false	'  Should ANY page be able to Add New Records
blnAllowUPDATE = false	'  Should ANY page be able to Edit Records
blnAllowDELETE = false	'  Should ANY page be able to Delete Records
blnAllowPAGING = true	'  Should ANY page be able to Page through Records
'  Tables that are opposite of blnAllowPKEdits
arrPKEditsExceptions = Array()
'  Tables that are opposite of blnAllowINSERT
arrINSERTExceptions = Array()
'  Tables that are opposite of blnAllowUPDATE
arrUPDATEExceptions = Array()
'  Tables that are opposite of blnAllowDELETE
arrDELETEExceptions = Array()
'  Tables that are opposite of blnAllowPAGING
arrPAGINGExceptions = Array()
'  Tables that should NEVER be shown
arrHiddenTables = Array()
'  Fields that should NEVER be shown
arrHiddenFields = Array()
'  Fields that should NEVER be edited
arrLockedFields = Array()
'  Fields that should be displayed using password input type
arrPasswordFields = Array("Pwd")						
						
strInsertNotice = "<font color=""red""><b>Your insert will only be successful if you" & _
	" enter appropriate data types!  Blanks will not be inserted.  NOTE: Insert " & _
	"position will be unknown.</b></font>"
strDBDefault = "(DB Supplied)"
strPrevious = "&lt;&lt;Previous"
strNext = "Next&gt;&gt;"
strNoPKeysNotice = "There were no primary key fields so an update could not be preformed."
strNoEditAllowed = "This table cannot be Updated."
strNoDeleteAllowed = "Records in this table are not allowed to be deleted."
strNoInsertAllowed = "Records cannot be inserted into this table."
strFilterError = "Your filter:  %1  was not applied.  It may contain errors.  Check " & _
	"that the column supports the datatype you provided."
strPageTitle = "HTML Table Viewer for "
strCurrentActionNotice = "You must procede with your current action."
strNoTablesError = "Cannot continue.  No valid tables."
strGoToButton = "Go to Page"
strPageSizeButton = "Set Page Size To"
strAddFilterButton = "Apply Filter"
strRemoveFilterButton = "Remove Filter"
strRemoveSortButton = "Remove Sort"
strAddSorttxt = "Click a column heading to apply a sort."
'****************************************************************************************
'******************************         END CONFIG            ***************************
'****************************************************************************************

'****************************************************************************************
'******************************         BEGIN FUNCTIONS       ***************************
'****************************************************************************************
function IsPasswordField(thefield)  '  determines whether or not this is a Password field
    IsPasswordField = false
	for each arrItem in arrPasswordFields
		if LCase(thefield.name) = LCase(arrItem) then IsPasswordField = true
	next
end function

function AllowEditOf(thefield) '  compares field with locked fields to allow editing
	AllowEditOf = true
	for each arrItem in arrLockedFields
		if LCase(thefield.name) = LCase(arrItem) then AllowEditOf = false
	next
end function

function AllowUPDATE(theTable) '  compares table with exceptions to allow UPDATES
	AllowUPDATE = blnAllowUPDATE
	for each arrItem in arrUPDATEExceptions
		if LCase(theTable) = LCase(arrItem) then AllowUPDATE = not blnAllowUPDATE
	next
	'  Tables with no primary keys can't be Updated!!!
	if objPKRS.BOF and objPKRS.EOF then AllowUPDATE = false
end function

function AllowDELETE(theTable) '  compares table with exceptions to allow DELETS
	AllowDELETE = blnAllowDELETE
	for each arrItem in arrDELETEExceptions
		if LCase(theTable) = LCase(arrItem) then AllowDELETE = not blnAllowDELETE
	next
	'  Tables with no primary keys can't do Deletes!!!
	if objPKRS.BOF and objPKRS.EOF then AllowDELETE = false
end function

function AllowINSERT(theTable) '  compares table with exceptions to allow INSERTS
	AllowINSERT = blnAllowINSERT
	for each arrItem in arrINSERTExceptions
		if LCase(theTable) = LCase(arrItem) then AllowINSERT = not blnAllowINSERT
	next
end function

function AllowPAGING(theTable) '  compares table with exceptions to allow PAGING
	AllowPAGING = blnAllowPaging
	for each arrItem in arrPAGINGExceptions
		if LCase(theTable) = LCase(arrItem) then AllowPAGING = not blnAllowPAGING
	next
end function

function AllowPKEdits(theTable) '  compares table with exceptions to allow Pri. Key edits
	AllowPKEdits = blnAllowPKEdits
	for each arrItem in arrPKEditsExceptions
		if LCase(theTable) = LCase(arrItem) then AllowPKEdits = not blnAllowPKEdits
	next
end function

'  function to convert a field so it can be edited by case statements based on field type
'  thefield:  field from recordset
'  strPrefix:  a prefix to add to the input name to compare during update process
'  blnHasData:  if field has data then use it to fill the field, else field is for insert
function ConvertToEdit(thefield, strPrefix, blnHasData)
dim strHTML 'the final string
	select case thefield.type
		case 2 '  smallint
			strHTML = "<input type=""text"" name=""" & strPrefix & _
					  thefield.Name & """" & " maxlength=""5"""
			if blnHasData then 
				strHTML = strHTML & " value=""" & trim(thefield.value) & """"
			end if
			strHTML = strHTML & ">"
		case 3 '  integer field
			strHTML = "<input type=""text"" name=""" & strPrefix & _
					  thefield.Name & """" & " maxlength=""7"""
			if blnHasData then 
				strHTML = strHTML & " value=""" & trim(thefield.value) & """"
			end if
			strHTML = strHTML & ">"
		case 11 '  bit field
			strHTML = "<select name=""" & strPrefix & thefield.Name & """>" & _
					  "<option value=""0"""
			if blnHasData and not thefield.value then strHTML = strHTML & " selected "
			strHTML = strHTML & ">0</option>" & "<option value=""1"""
			if blnHasData and thefield.value then strHTML = strHTML & " selected "
			strHTML = strHTML & ">1</option>" & "</select>"
		case 129, 200 '  char field, varchar field
		    if not isPasswordField(thefield) then
				strHTML = "<input type=""text"" name=""" & strPrefix & thefield.Name & _
						  """" & " maxlength=""" & thefield.definedsize & """"
			else
				strHTML = "<input type=""password"" name=""" & strPrefix & thefield.Name & _
						  """" & " maxlength=""" & thefield.definedsize & """"
 			end if
			if blnHasData then 
				strHTML = strHTML & " value=""" & trim(thefield.value) & """"
			end if
			strHTML = strHTML & ">"
		case 17, 131 '  UnsignedTinyInt, Numeric/Decimal
			strHTML = "<input type=""text"" name=""" & strPrefix & thefield.Name & """ "
			if blnHasData then 
				strHTML = strHTML & " value=""" & trim(thefield.value) & """"
			end if
			strHTML = strHTML & ">"
		case 133 '  date field
			strHTML = "<input type=""text"" name=""" & strPrefix & _
					  thefield.Name & """" & " maxlength=""10"""
			if blnHasData then 
				strHTML = strHTML & " value=""" & trim(thefield.value) & """"
			end if
			strHTML = strHTML & ">"
		case 135 '  datetime field
			strHTML = "<input type=""text"" name=""" & strPrefix & _
					  thefield.Name & """" & " maxlength=""22"""
			if blnHasData then 
				strHTML = strHTML & " value=""" & trim(thefield.value) & """"
			end if
			strHTML = strHTML & ">"
		case else '  Don't turn it into an edit but normal HTML
			strHTML = ConvertToHTML(thefield)
	end select
	if blnHasData then '  If this field has data then check that the user can edit it
		if not AllowEditOf(thefield) then strHTML = ConvertToHTML(thefield)
	else '  There is not data but the field might be locked
		if not AllowEditOf(thefield) then strHTML = strDBDefault
	end if
	ConvertToEdit = strHTML
end function

'  function to convert a recordset field to HTML in special instances
'  thefield:  a recordset field
function ConvertToHTML(thefield)
	select case thefield.type
	case 2, 3, 17, 131 '  Smallint, Integer, UnsignedTinyInt, Numeric
		ConvertToHTML = trim(thefield.value)
	case 129, 200      '  Char, VarChar
		if not isPasswordField(thefield) then
			ConvertToHTML = trim(thefield.value)
		else
			dim CTHI
			
			for CTHI = 1 to len(thefield.value)
				ConvertToHTML = ConvertToHTML + "*"
			next
		end if
	case 11 '  binary field
		if thefield then
			ConvertToHTML = "1"
		else
			ConvertToHTML = "0"
		end if
	case 128 '  binary data
		ConvertToHTML = "&lt;Binary&gt;"
	case 72 '  GUID
		ConvertToHTML = "&lt;GUID&gt;"
	case 135 '  DateTime
		ConvertToHTML = "<span title=""" & FormatDateTime(Thefield.value, vbLongTime) & _
						""">" & FormatDateTime(thefield.value, vbShortDate) & "</span>"
	'  VarNumeric, LongVarChar, VarWChar, LongVarWChar, VarBinary, LongVarBinary
	case 139, 201, 202, 203, 204, 205 
		ConvertToHTML = "&lt;Param Binary Data&gt;"
	case else '  Add a message to the page for the Developer
		ConvertToHTML = "<font color=""red"">Unhandled field:  " & thefield.type & _
						".</font>"
	end select
end function

Sub DoPaging()
	if objRS.Supports(&H00002000) then
		'Show "previous" and "next" page links which pass the page to view
		'add page numbers for faster paging
		iPageStep = 1
		if iPageCount > 10 then iPageStep = 2
		if iPageCount > 30 then iPageStep = 5
		if iPageCount > 100 then iPageStep = 10
		if iPageCount > 200 then iPageStep = 20
		if iPageCount > 500 then iPageStep = 30
		if iPageCount > 700 then iPageStep = 40
		if iPageCount > 1000 then iPageStep = 50
		if iPageCount > 1200 then iPageStep = 60
		if iPageCount > 1500 then iPageStep = 70
		if iPageCount > 1700 then iPageStep = 80
		if iPageCount > 2000 then iPageStep = 100
		if iPageCount > 2500 then iPageStep = 150
		if iPageCount > 3000 then iPageStep = 200
		'iPageStep = round(iPageCount / 10,0)

		If iPageCurrent <> 1 Then 'show the previous link
			Response.Write("[<A HREF=""" & Request.ServerVariables("Script_Name") & _
						   "?page=" & iPageCurrent - 1 & """>" & strPrevious & _
						   "</A>]&nbsp;&nbsp;" & vbCRLF)
		End If
		for iPageCounter = 1 to iPageCount step iPageStep
			if iPageCounter = iPageCurrent then 'this is the page we are on so no link
				Response.Write("<b>" & iPageCounter & "</b>&nbsp;&nbsp;")
			else 'this number needs to be a link
				Response.Write("<a href=""" & Request.ServerVariables("Script_Name") & _
							   "?page=" & iPageCounter & """>" & iPageCounter & _
							   "</a>&nbsp;&nbsp;" & vbCRLF)
			end if
		next 'iCounter
		If iPageCurrent < iPageCount Then 'show the next link
			Response.Write("[<A HREF=""" & Request.ServerVariables("Script_Name") & _
						   "?page=" & iPageCurrent + 1 & """>" & strNext & "</A>]" & _
						   vbCRLF)
		End If
	else '  the recordset doesn't support bookmarks
		Response.Write "This provider doesn't support bookmarks."
	end if
End Sub
'****************************************************************************************
'******************************         END FUNCTIONS       *****************************
'****************************************************************************************

set objdASQL = server.CreateObject("adodb.connection")
objDASQL.Open(strConn)
set objResultRS = server.CreateObject("adodb.recordset")

'check that all objects exist otherwise create them
set objResultRS = objDASQL.Execute("Select count(*) from sysobjects where name = 'www_Tables'", strConn)
if objResultRS(0) = 0 then objDASQL.Execute "CREATE PROCEDURE www_Tables " & vbCRLF & "AS" & vbCRLF & "declare @Name varchar(100)" & vbCRLF & "select @Name = db_name()" & vbCRLF & "EXEC sp_tables NULL, dbo, @Name, ""'TABLE'""", strConn
set objResultRS = objDASQL.Execute("Select count(*) from sysobjects where name = 'www_PKeys'", strConn)
if objResultRS(0) = 0 then objDASQL.Execute "CREATE PROCEDURE www_pkeys @One sysname, @Two sysname = null, @Three sysname = null AS EXEC sp_pkeys @One, @Two, @Three", strConn
set objResultRS = nothing 'we are done with it so destroy it
'keep objDASQL open for an update, insert, or delete in the action section

'create objects
set objTRS = server.CreateObject("ADODB.Recordset")
set objTRS = objDASQL.Execute("www_Tables", strConn)

'set filter and check that we still have tables
'Build table string
for each arrItem in arrHiddenTables
	strTableFilter = strTableFilter & "TABLE_NAME <> '" & arrItem & "' AND "
Next
'remove last " and "
strTableFilter = mid(strTableFilter,1,Len(strTableFilter)-5)

objTRS.Filter = strTableFilter
if objTRS.BOF and objTRS.EOF then
	Response.Write(strNoTablesError)
	Response.End
end if

'Get what table the user wants to view
blnNewTable = false 'initialize to false and turn it true
if Request.Form("cboTable") <> "" then 'the combo box held information
	strTableName = Request.Form("cboTable") 'set the strTablename to table in combo box
	if strTableName <> Session("__strCurrentTable") then blnNewTable = true 'the table was changed
elseif Session("__strCurrentTable") <> "" then 'nothing in combo check session
	strTableName = Session("__strCurrentTable") 'set var to value in session
else 'nothing in combo or session
	strTableName = objTRS("TABLE_NAME") 'so set var to first table in the TableRS
end if 'for determining this table
Session("__strCurrentTable") = strTableName 'strTableName holds the right table so put it into the session

'load the primary keys for this table
set objPKRS = server.CreateObject("ADODB.Recordset")
set objPKRS = objDASQL.GetData("www_pkeys '" & strTableName &"'", strConn)

blnAllowPKEdits = AllowPKEdits(Session("__strCurrentTable"))
blnAllowINSERT = AllowINSERT(Session("__strCurrentTable"))
blnAllowUPDATE = AllowUPDATE(Session("__strCurrentTable"))
blnAllowDELETE = AllowDELETE(Session("__strCurrentTable"))
blnAllowPaging = AllowPAGING(Session("__strCurrentTable"))
'****************************************************************************************
'*********************           Begin update code            ***************************
'****************************************************************************************
if Request.QueryString("action") = "update" and _
   Request.Form("hdnDoUpdate") = "true" then 'is written right after Cancel Link
'  DO UPDATE
'  Plan of Attack:
'  1.  Find at least one primary Key Field using primary key prefix
'  2.  If there is at least one then build an update string, else no update
'  3.  Loop through all form fields 
'  4.  Find fields with the normal prefix
'  5.  Check that the field is not empty
'  6.  Add the field to the ever growing strSQL
'  7.  Remove last comma and add a where clause
'  8.  Loop through Primary Key RS and add all criteria
'  9.  Remove last " and " statement
' 10.  Turn on error handling, execute query, and turn it off

	if blnAllowUPDATE then 'the user is allowed to update
		If blnDebug then Response.Write("--Doing Update--<br>")
REM 1
		blnFoundUPK = false
		for each frmfld in Request.Form
			if left(Request.Form.Key(frmfld),3) = strPKTag then blnFoundUPK = true
		next
REM 2
		if blnFoundUPK then
			strSQL = "UPDATE [" & strTableName & "] SET " '  first part of update stmt
REM 3
			for each frmfld in Request.Form
REM 4
				if left(Request.Form.Key(frmfld),3) = "DB_" then
REM 5
					if Request.Form(frmfld).Item <> "" then
REM 6
						strSQL = strSQL & mid(Request.Form.Key(frmfld), 4) & " = "
						if isnumeric(Request.Form(frmfld).Item) then
							strSQL = strSQL & Request.Form(frmfld).Item
						else
							strSQL = strSQL & "'" & _
							replace(Request.Form(frmfld).Item, "'", "''", 1, -1, 1) & "'"
						end if
						strSQL = strSQL & ", "
					end if
				end if
			next
REM 7
			if instrrev(strSQL, ",") = (len(strSQL) - 1) then 
				strSQL = mid(strSQL,1,len(strSQL) - 2)
			end if
			strSQL = strSQL & " WHERE "
REM 8
			if not objPKRS.BOF and not objPKRS.EOF then objPKRS.MoveFirst
			do while not objPKRS.EOF
				strSQL = strSQL & objPKRS("Column_Name") & " = '" & _
				replace(Request.Form(strPKTag & objPKRS("Column_Name")), "'", "''",1,-1,1) & _
				"' AND "
				objPKRS.MoveNext
			loop
REM 9
			if instrrev(strSQL, " AND ") = len(strSQL) - 4 then 
				strSQL = mid(strSQL,1,len(strSQL) - 5)
			end if
			If blnDebug then Response.Write(strSQL & "<br>")
REM 10
			ON ERROR RESUME NEXT 'turn on error handling
			objDASQL.Execute strSQL, strConn
			if err.number <> 0 then
				strMsg = strMsg & err.description & "<br>" & strSQL
				err.clear
			end if
			ON ERROR GOTO 0 'turn off error handling
			strSQL = "" 'remove info
		else 'we have no primary keys
			strMsg = strMsg & strNoPKeysNotice
		end if 'for intPKCounter > 0 check
	else 'the user is not allowed to edit
		strMsg = strMsg & strNoEditAllowed
	end if 'for allow edit check
elseif Request.QueryString("action") = "delete" then
'  DO DELETE
'  Plan of Attack:
'  1. Begin SQL Statement
'  2. Loop through Primary key fields and add them to the string
'  3. Remove last section of string
'  4. Turn on error handling, execute query, and turn it off
	if blnAllowDELETE then
		if blnDebug then Response.Write("--Doing Delete--<br>")
REM 1
		strSQL = "DELETE FROM " & Session("__strCurrentTable") & " WHERE "
REM 2
		if not objPKRS.BOF and not objPKRS.EOF then objPKRS.MoveFirst
		do while not objPKRS.EOF
			strSQL = strSQL & objPKRS("Column_Name") & " = '" & _
			replace(Request.QueryString(objPKRS("Column_Name")), "'", "''",1,-1,1) & _
			"' AND "
			objPKRS.MoveNext
		loop
REM 3
		if instrrev(strSQL, "' AND ") = len(strSQL) - 5 then 
			strSQL = mid(strSQL,1,len(strSQL) - 5)
		end if
		if blnDebug then Response.Write(strSQL & "<br>")
REM 4
		ON ERROR RESUME NEXT 'turn on error handling
		objDASQL.Execute strSQL, strConn
		if err.number <> 0 then
			strMsg = strMsg & err.description & "<br>" & strSQL
			err.clear
		end if
		ON ERROR GOTO 0 'turn off error handling
		strSQL = "" 'remove info
	else 'the user is not allowed to delete
		strMsg = strMsg & strNoDeleteAllowed
	end if 'for allow delete check
elseif Request.QueryString("action") = "insert" then
'  DO INSERT
'  Plan of Attack:
'  1. Start Building SQL String
'  2. Generate column names from items with new prefix and not empty
'  3. Remove last comma
'  4. Add middle SQL String
'  5. Loop through fields and add values
'  6. Remove last comma and add close paren
'  7. Turn on error handling, execute SQL Statment, and turn it off
	if blnAllowINSERT then
		if blnDebug then Response.Write("--Doing INSERT--<br>")
REM 1
		strSQL = "INSERT INTO " & Session("__strCurrentTable") & " ("
REM 2
		for each frmfld in Request.Form
			if left(Request.Form.Key(frmfld),4) = strNEWTag then
				if Request.Form(frmfld).Item <> "" then 
					strSQL = strSQL & mid(Request.Form.Key(frmfld), 5) & ", "
				end if
			end if
		next
REM 3
		strSQL = mid(strSQL, 1, len(strSQL) - 2)
REM 4
		strSQL = strSQL & ") VALUES ("
REM 5
		for each frmfld in Request.Form
			if left(Request.Form.Key(frmfld),4) = strNEWTag then
				if Request.Form(frmfld).Item <> "" then
					strSQL = strSQL & "'" & _
					replace(Request.Form(frmfld).Item, "'", "''", 1, -1, 1) & "', "
				end if
			end if
		next
REM 6
		strSQL = mid(strSQL, 1, len(strSQL) - 2)
		strSQL = strSQL & ")"
		if blnDebug then Response.Write (strSQL & "<br>")
REM 7
		ON ERROR RESUME NEXT 'turn on error handling
		objDASQL.Execute strSQL, strConn
		if err.number <> 0 then
			strMsg = strMsg & err.description & "<br>" & strSQL
			err.clear
		end if
		ON ERROR GOTO 0 'turn off error handling
		strSQL = "" 'remove info
	else 'the user can't insert
		strMsg = strMsg & strNoInsertAllowed
	end if 'for blnAllowINSERT check
end if 'for updating
'****************************************************************************************
'*********************           End   update code            ***************************
'****************************************************************************************

'the insert/update/delete has been preformed now get recordset
set objRS = objDASQL.GetData("SELECT * FROM [" & Session("__strCurrentTable") & "]", strConn)
set objDASQL = nothing
'now create filter/sort

'****************************************************************************************
'********************           BEGIN APPLYING FILTER AND SORT       ********************
'****************************************************************************************
if Request.Form("hdnRemoveFilt") = "true" or blnNewTable then Session("__strColFilter") = ""
if trim(Request.Form("hdnFiltCol")) <> "" and trim(Request.Form("hdnFiltOper")) <> "" then 'there is information in the filed
	'Filter should look like: [colName] [<, >, <=, >=, <>, =, LIKE] ['text', #date#, number][*,%]
	strColFilter = " [" & Request.Form("hdnFiltCol") & "] " & Request.Form("hdnFiltOper") & " "
	if isnumeric(Request.Form("hdnFiltStr")) then
		strColFilter = strColFilter & Request.Form("hdnFiltStr")
	elseif isdate(Request.Form("hdnFiltStr")) then
		strColFilter = strColFilter & "#" & Request.Form("hdnFiltStr") & "#"
	elseif len(trim(Request.Form("hdnFiltStr"))) > 0 then 'string is at least 1
		strColFilter = strColFilter & "'"
		if Request.Form("hdnFiltOper") = " LIKE " then
			strColFilter = strColFilter & replace(Request.Form("hdnFiltStr"), "'", "''", 1, -1, 1) & "%"
		else
			strColFilter = strColFilter & replace(Request.Form("hdnFiltStr"), "'", "''", 1, -1, 1)
		end if
		strColFilter = strColFilter & "'"
	else
		strColFilter = ""
	end if
	Session("__strColFilter") = strColfilter
	'Response.Write("Filter set to: " & strColFilter)
	ON ERROR RESUME NEXT 'turn error handling on
	objRS.Filter = Session("__strColFilter")
	if err.number <> 0 then 'there was an error
		objRS.Filter = ""
		strMsg = strMsg & replace(strFilterError, "%1", Session("__strColFilter"))
		Session("__strColFilter") = ""
		err.clear
	end if
	ON ERROR GOTO 0 'turn error handling off
elseif trim(Session("__strColFilter")) <> "" then
	ON ERROR RESUME NEXT 'turn error handling on
	objRS.Filter = Session("__strColFilter")
	if err.number <> 0 then 'there was an error
		objRS.Filter = ""
		strMsg = strMsg & replace(strFilterError, "%1", Session("__strColFilter"))
		Session("__strColFilter") = ""
		err.clear
	end if
	ON ERROR GOTO 0 'turn error handling off
end if 'for filter

if Request.Form("hdnRemoveSort") = "true" or blnNewTable then Session("__arrSortArray") = ""
if Request.QueryString("sortkey") <> "" then 'sortkey contains something
	
	blnfoundsort = false
	if isarray(Session("__arrSortArray")) then
		arrSort = Session("__arrSortArray")
		for arrcounter = 0 to ubound(arrSort)
			if Request.QueryString("sortkey") = mid(arrSort(arrcounter),1,instr(1,arrSort(arrcounter)," ",1) - 1) then 'it is in there
				blnfoundsort = true
				if instr(1,arrSort(arrcounter),"ASC",1) > 0 then 'this field is sorted ascending
					arrSort(arrcounter) = Request.QueryString("sortkey") & " DESC"
				else
					arrSort(arrcounter) = Request.QueryString("sortkey") & " ASC"
				end if
			end if
		next
		if not blnfoundsort then
			redim preserve arrSort(ubound(arrSort) + 1)
			arrSort(ubound(arrSort)) = Request.QueryString("sortkey") & " ASC"
		end if
	else
		redim arrSort(0)
		arrSort(0) = Request.QueryString("sortkey") & " ASC"
	end if 'for isarray check
	Session("__arrSortArray") = arrSort
end if 'for sortkey check
if isarray(Session("__arrSortArray")) then
	for each arrItem in Session("__arrSortArray")
		strTableSort = strTableSort & arrItem & ", "
	next
	strTableSort = mid(strTableSort, 1, len(strTableSort) - 2)
	objRS.Sort = strTableSort
end if 'for isarray check
'*******************************************************************************************
'********************         END APPLYING FILTER AND SORT       ***************************
'*******************************************************************************************

'************************** PAGING CONFIG *************************************************
If isnumeric(Request.QueryString("page")) Then					'Retrieve page to show or default to 1
	iPageCurrent = int(Request.QueryString("page"))
Else
	iPageCurrent = 1
End If
If IsNumeric(Request.Form("txtPageSize")) And Request.Form("txtPageSize") <> "" Then				'new page size
	If int(Request.Form("txtPageSize")) > 0 Then
		Session("__intPageSize") = int(Request.Form("txtPageSize"))
	Else
		Session("__intPageSize") = iPageSize
	End If
ElseIf Session("__intPageSize") = "" Then
	Session("__intPageSize") = iPageSize
End If
objRS.PageSize = Session("__intPageSize")					'set page size to pagesize var
objRS.CacheSize = Session("__intPageSize")					'same with cache size
iPageCount = objRS.PageCount								'Get the count of the pages using the given page size
If iPageCurrent > iPageCount Then iPageCurrent = iPageCount	'If the request page falls outside the acceptable range,
If iPageCurrent < 1 Then iPageCurrent = 1					'give them the closest match (1 or max)
'******************************************************************************************

'<!--begin real page content-->
Response.Write("<HTML><HEAD><title>" & strPageTitle & strTableName & "</title>" & vbCRLF)
Response.Write("<style>" & vbCRLF & "<!--" & vbCRLF)
Response.Write(".configdiv {background-color:lightgrey;border-style:double;}" & vbCRLF)
Response.Write("table {font-family:verdana;font-size:10;}" & vbCRLF)
Response.Write("-->" & vbCRLF & "</style>" & vbCRLF)
Response.Write("<script language=""Javascript"">" & vbCRLF & "<!--" & vbCRLF)
Response.Write(vbTab & "var w = window;" & vbCRLF)
Response.Write(vbTab & "var d = w.document;" & vbCRLF)
Response.Write(vbTab & "var f = d.theform;" & vbCRLF)
Response.Write("//-->" & vbCRLF & "</script>" & vbCRLF)
Response.Write("</HEAD>" & vbCRLF)
Response.Write("<script language=""javascript"">" & vbCRLF)
Response.Write(vbTab & "function CheckWindow() {" & vbCRLF)
Response.Write(vbTab & "    if (typeof(thewindow) == ""object"") {" & vbCRLF)
Response.Write(vbTab & "        if (!thewindow.closed){" & vbCRLF)
Response.Write(vbTab & "            thewindow.close();" & vbCRLF)
Response.Write(vbTab & "        }" & vbCRLF)
Response.Write(vbTab & "    }" & vbCRLF)
Response.Write(vbTab & "}" & vbCRLF)
Response.Write(vbTab & "function ShowFilter() {" & vbCRLF)
Response.Write(vbTab & "    CheckWindow();" & vbCRLF)
Response.Write(vbTab & "	thewindow = window.open(""about:blank"",""thewindow"",""height=150,width=400"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<html>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<head><title>Apply Filter on Table: " & Session("__strCurrentTable") & "</title></head>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<script language=javascript>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""function doSubmit() {"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""window.opener.document.theform.hdnFiltCol.value=document.thePopUpForm.optCol.options[document.thePopUpForm.optCol.selectedIndex].value;"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""window.opener.document.theform.hdnFiltOper.value=document.thePopUpForm.optOperator.options[document.thePopUpForm.optOperator.selectedIndex].value;"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""window.opener.document.theform.hdnFiltStr.value=document.thePopUpForm.txtClause.value;"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""window.opener.document.theform.submit();"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""self.close();"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""}"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""</""+""script><body><form method=post name=thePopUpForm onsubmit=javascript:return(false);>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<table><tr><td>Column to filter:</td><td><select name=optCol>"");" & vbCRLF)
for each RSfld in objRS.Fields
	Response.Write(vbTab & "	thewindow.document.writeln(""<option value='" & RSfld.name & "'>" & RSfld.name & "</option>"");" & vbCRLF)
next
Response.Write(vbTab & "	thewindow.document.writeln(""</select></td></tr>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<tr><td>Operator to use:</td><td><select name=optOperator>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<option selected value=' = '>Equal to =</option>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<option value=' > '>Greater than &gt;</option>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<option value=' >= '>Greater than or equal to &gt;=</option>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<option value=' < '>Less than &lt;</option>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<option value=' <= '>Less than or equal to &lt;=</option>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<option value=' LIKE '>Like</option>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<option value=' <> '>Not equal to &lt;&gt;</option>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""</select></td></tr>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<tr><td>Criteria:</td><td><input type=text name=txtClause maxlength=30></td></tr>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""<tr><td></td><td><input type=button value=Submit onclick=javascript:doSubmit();></td></tr></table>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.writeln(""</form></body></html>"");" & vbCRLF)
Response.Write(vbTab & "	thewindow.document.close();" & vbCRLF)
Response.Write(vbTab & "}" & vbCRLF)
Response.Write("</script>" & vbCRLF)

'<!--begin body-->
Response.Write("<BODY topmargin=0 leftmargin=0 rightmargin=0 marginwidth=0 marginheight=0 onunload=""CheckWindow();"">")


Response.Write("<form name=""theform"" action=""" & Request.ServerVariables("script_name") & "?")
if Request.QueryString("action") = "addnew" then
	Response.Write("action=insert")
ElseIf Request.QueryString("action") = "edit" Then
	Response.Write("action=update")
Else
	Response.Write("action=change")
end if
Response.Write("&page=" & iPageCurrent & """ method=""post"">")
'  <!--begin config div-->
Response.Write("<div id=""config"" class=""configdiv""><table cellpadding=""0"" cellspacing=""0"" border=""0"" width=""100%""><tr><td bgcolor=""lightgrey"">")
If (Request.QueryString("action") = "edit" and blnAllowUPDATE) or _
   (Request.QueryString("action") = "addnew" and blnAllowINSERT) Then
	Response.Write(strCurrentActionNotice)
Else
	'  Table Dropdown
	Response.Write("Go to Table: <select name=""cboTable"" onchange=""" & _
		"CheckWindow();document.theform.submit();"">")
	do while not objTRS.EOF
		Response.Write("<option value=""" & objTRS("TABLE_NAME") & """")
		if objTRS("TABLE_NAME") = strTableName then Response.Write(" selected ")
		Response.Write(">" & objTRS("TABLE_NAME") & "</option>")
		objTRS.MoveNext
	loop
	'done with the TRS
	objTRS.Close
	set objTRS = nothing
	
	Response.Write("</select>")
	'  Page Jump button
	Response.Write (" || <input type=""button"" name=""btnJump"" onclick=""" & _
		"window.location='" & Request.ServerVariables("Script_Name") & _
		"?page='+document.theform.txtPageNo.value;"" value=""" & strGoToButton & """>&nbsp;" & _
		"<input type=""text"" name=""txtPageNo"" size=""3"">")
	'  Page Size Section
	Response.Write(" || <input type=""button"" name=""btnSize"" onclick=""" & _
		"CheckWindow();document.theform.submit();"" value=""" & strPageSizeButton & """>" & _
		"&nbsp;<input type=""text"" name=""txtPageSize"" size=""3"">")
	'  Filter Section
	if Session("__strColFilter") = "" then 'write out the apply button
		Response.Write(" || <input type=""button"" name=""btnApplyFilter"" value=""" & strAddFilterButton & """ onclick=""javascript:ShowFilter();"">")
		Response.Write("<input type=""hidden"" name=""hdnFiltCol"">") 'set to the column to filter
		Response.Write("<input type=""hidden"" name=""hdnFiltOper"">") 'set to the operator
		Response.Write("<input type=""hidden"" name=""hdnFiltStr"">") 'set to the criteria of a filter
	else
		Response.Write(" || <input type=""button"" name=""btnRemoveFilter"" value=""" & strRemoveFilterButton & """ onclick=""javascript:document.theform.hdnRemoveFilt.value=true;document.theform.submit();"">")
		Response.Write("<input type=""hidden"" name=""hdnRemoveFilt"">") 'set to true to remove a filter
	end if 'for apply button
	'  Sort Section
	if isarray(Session("__arrSortArray")) then 'there is a sort going on
		Response.Write(" || <input type=""button"" name=""btnRemoveSort"" value=""" & strRemoveSortButton & """ onclick=""javascript:document.theform.hdnRemoveSort.value=true;document.theform.submit();"">")
		Response.Write("<input type=""hidden"" name=""hdnRemoveSort"">")
	else
		Response.Write(" || " & strAddSorttxt)
	end if '  for sorting
End If
	Response.Write("</td></tr></table></div>" & vbCRLF)
'  <!--End Config-->
'  Write out a message if there are any errors
Response.Write("<font color=""red"">" & strMsg & "</font><br>")
'  Write out session information
Response.Write("<center>")
Response.Write("Current table is: <b>" & strTableName & "</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
if Session("__strColFilter") <> "" then Response.Write("||&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Applied Filter: <b>" & Session("__strColFilter") & "</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
if isarray(Session("__arrSortArray")) then Response.Write("||&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Applied Sort: <b>" & strTableSort & "</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
if blnAllowPaging then 'turns paging on or off.
	Response.Write("||&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Page <B>#" & iPageCurrent & "</B> of <B>" & iPageCount & "</B>")
	Response.Write("<br>")
	DoPaging '  Write out page links
end if  'end paging.
Response.Write("</center>")
'<!--Begin Table-->
Response.Write("<table width=""100%"" border=""2"" cellspacing=""0"" cellpadding=""3"" bordercolor=""#000000"">")
Response.Write(vbTab & "<tr bgcolor=""#9C9C9C"">")
'write out link for addnew
if blnAllowINSERT and not Request.QueryString("action") = "edit" then 'the user is allowed to add new records
	if Request.QueryString("action") <> "addnew" then
		Response.Write("<td align=""center"">")
		Response.Write("<a href=""" & Request.ServerVariables("SCRIPT_NAME") & "?action=addnew&page=" & iPageCurrent)
		Response.Write(""">Add New</a>")
		Response.Write("</td>")
	else
		Response.Write("<td>")
		Response.Write("<!-- addnew buffer-->&nbsp;")
		Response.Write("</td>")
	end if
elseif blnAllowUPDATE or blnAllowDELETE Then 'the user is not allowed to add new records but could edit/update
	Response.Write(vbTab & vbTab & "<td><!--addnew goes here-->&nbsp;</td>")
else 'theuser can't addnew or edit/delete so show nothing
end if 'for blnallowaddnew

'write out field colunm headers
For Each RSfld in objRS.Fields
	'write out link information
	Response.Write(vbTab & vbTab & "<td align=center><a href=""" & _
		Request.ServerVariables("SCRIPT_NAME") & "?page=" & Request.QueryString("page") & _
			"&sortkey=" & RSfld.name & """ style=""text-decoration:none;color:black;"" " & _
			"onmouseover=""javascript:window.status='Sort by " & RSfld.name)
		'if this column is used in the sort find out if the next click on it will be asc or desc
		blnwritten = false
		If isarray(Session("__arrSortArray")) Then
			arrSort = Session("__arrSortArray")
		else
			arrSort = Array()
		end if
		for each arrItem in arrSort
			if instr(1, arrItem, RSfld.name, 1) Then 'this name is in the string
				if instr(1, arrItem, " DESC", 1) then 'they sorted desc so write asc
					Response.Write(" ASC ")
				else
					Response.Write(" DESC ")
				end if
			end if
		Next
		Response.Write("';return true;"" onmouseout=""javascript:window.status='';"">")
	'see if there any primary key fields in this rs	
	if objPKRS.BOF and objPKRS.EOF Then
		'there are none so write out this column normal
		Response.Write RSfld.name
	else 'there is at least one primary key in this table
		objPKRS.movefirst 'reset it just in case
		blnwritten = false 'bln to see if this field was writen out as a primary key
		do while not objPKRS.EOF
			'if they are = then this column is a primary key
			if objPKRS("Column_name") = RSfld.name then
				'write this column with bold tags
				Response.Write "<b>" & RSfld.name & "</b>"
				blnwritten = true 'set the flag so this column doesn't get writen below
			end if
			objPKRS.movenext
		loop
		if not blnwritten then 'this column wasn't a primary key
			'write it out normal
			Response.Write RSfld.name
		end if
	end if 'end primary key rs check
	Response.Write("</a></td>" & vbCRLF)
next 'RSfld
Response.Write(vbTab & "</tr>" & vbCRLF)
'The column headings are now written
'if the person is adding new then add this row
if Request.QueryString("action") = "addnew" and blnAllowINSERT then
	Response.Write(vbTab & "<tr>" & vbCRLF)
	Response.Write(vbTab & vbTab & "<td nowrap>")
	Response.Write("<a href=""javascript:document.theform.submit();"">Insert</a> | ")
	Response.Write("<a href=""" & Request.ServerVariables("Script_name") & "?action=cancel&page=" & iPageCurrent)
	Response.Write(""">Cancel</a>")
	Response.Write("</td>" & vbCRLF)
	for each RSfld in objRS.Fields 'write out cols to enter
		Response.Write(vbTab & vbTab & "<td>" & ConvertToEdit(RSfld, strNEWTag, false) & "</td>" & vbCRLF)
	next
	Response.Write(vbTab & "</tr>" & vbCRLF)
	Response.Write(vbTab & "<tr>" & vbCRLF)
	Response.Write(vbTab & vbTab & "<td align=""center"" colspan=""" & objRS.fields.count + 1 & """>")
	Response.Write(strInsertNotice & vbCRLF)
	Response.Write(vbTab & "</tr>" & vbCRLF)
end if 'for if doing add new
	
if objRS.BOF and objRS.EOF then
	if not Request.QueryString("action") = "addnew" or not blnAllowINSERT then
		Response.Write("<TR>")
		if blnAllowINSERT then 
			Response.Write("<TD>&nbsp;<!--addnew buffer--></td>")
			intColCount = objRS.Fields.count + 1
		else
			if blnAllowUPDATE or blnAllowDELETE then
				intColCount = objRS.Fields.count + 1
			else
				intColCount = objRS.Fields.count
			end if 
		end if
		if Session("__strColFilter") <> "" then
			Response.Write("<TD colspan=""" & intColCount & """> No Records.<br>")
			Response.Write("Try removing the Applied Filter: <b>" & Session("__strColFilter") & "</b></TD></TR>")
		else
			if Session("__strCurrentTable") = "Students" then
				Response.Write("<TD colspan=""" & intColCount & """> You Must Apply a Filter to View Student Records.<br></TD></TR>")
			else
				Response.Write("<TD colspan=""" & intColCount & """> No Records.<br>")
				if blnAllowINSERT then 
					Response.Write("Click the Add New link to add a record.</TD></TR>")
				else
					Response.Write("If you need to add records please contact your web master.")
				end if
			end if
		end if
	end if
else 'there are records in objRS
	iRecordsShown = 0 'plain old counter to control # of records
	objRS.AbsolutePage = iPageCurrent
	Do While iRecordsShown < Session("__intPageSize") And Not objRS.EOF
		Response.Write(vbTab & "<tr ")
		if iRecordsShown mod 2 > 0 then 
			Response.Write("bgcolor=""#D8D8D8""")
		else
			Response.Write("bgcolor=""#FFFFFF""")
		end if
		Response.Write(">" & vbCRLF) 'begin table row for the records
		if blnAllowUPDATE or blnAllowDELETE then 'allow the Edit/Update col to be shown
			Response.Write(vbTab & vbTab & "<td nowrap>") 'start first column which contins edit info
		
			blnEditable = true 'initialize edit var to turn on update/cancel links
			if Request.QueryString.Count >= 3 then
				for i = 3 to Request.QueryString.Count '3 begins first primary key
					if cstr(Request.QueryString(i).Item) <> trim(cstr(objRS(Request.QueryString.Key(i)))) then 'if they are not equal
						blnEditable = false 'then editable is set to false so this row is not editable
					end if
				next
			else
				blnEditable = false
			end if
			
			'at this point if blnEditable is true then this row is the one the person is 
			'trying to edit because the primary keys from the QS match those in the RS
			'if blnEditable is false then this row's PriKeys do not match those in the RS
			
			if (Request.QueryString("action") = "edit") and blnEditable then 'both are edit print update/cancel links
				Response.Write("<a href=""javascript:document.theform.submit();"">Update</a> | ")
				Response.Write("<a href=""" & Request.ServerVariables("Script_name") & "?action=cancel&page=" & iPageCurrent)
				Response.Write(""">Cancel</a><input type=""hidden"" name=""hdnDoUpdate"" value=""true"">")
			else 'do normal edit/delete links
				if Request.QueryString("action") = "edit" or Request.QueryString("action") = "addnew" Then
					Response.Write "&nbsp;"
				else
					if objPKRS.BOF and objPKRS.EOF then 'primary key rs check
						if blnAllowUPDATE then
							Response.Write("<a href=""" & Request.ServerVariables("Script_name") & "?action=edit&page=" & iPageCurrent)
							Response.Write(""">Edit</a>")
						end if
						if blnAllowUPDATE and blnAllowDELETE then Response.Write(" | ")
						if blnAllowDELETE then
							Response.Write("<a href=""javascript:if (window.confirm('Are you sure you want to delete this row?')) {window.location='" & Request.ServerVariables("Script_name") & "?action=delete&page=" & iPageCurrent)
							Response.Write("';}"">Delete</a>")				
						end if
					else
						if blnAllowUPDATE then
							Response.Write("<a href=""" & Request.ServerVariables("Script_name") & "?action=edit&page=" & iPageCurrent)
							objPKRS.movefirst
							do while not objPKRS.eof
								Response.Write "&" & objPKRS("Column_name") & "=" & trim(objRS(objPKRS("Column_name").value))
								objPKRS.movenext
							loop
							Response.Write(""">Edit</a>")
						end if
						if blnAllowUPDATE and blnAllowDELETE then Response.Write(" | ")
						if blnAllowDELETE then
							Response.Write("<a href=""javascript:if (window.confirm('Are you sure you want to delete this row?')) {window.location='" & Request.ServerVariables("Script_name") & "?action=delete&page=" & iPageCurrent)
							objPKRS.movefirst
							do while not objPKRS.eof
								Response.Write "&" & objPKRS("Column_name") & "=" & trim(objRS(objPKRS("Column_name").value))
								objPKRS.movenext
							loop
							Response.Write("';}"">Delete</a>")
						end if
					end if 'for primary key rs check
				End If ' for edit/addnew check
			end if 'for qrystring
			Response.Write("</td>" & vbCRLF)
		elseif blnAllowINSERT then 'the user can't edit/delete but there is an addnew col
			Response.Write(vbTab & vbTab & "<td><!-- addnew buffer -->&nbsp;</td>" & vbCRLF)
		else 'the user can't addnew or edit/delete so show nothing
		end if 'for allow of ED col display
		for each RSfld in objRS.Fields 'loop through fields in this record
			Response.Write(vbTab & vbTab & "<td nowrap>")
			'Response.Write "<b> " & RSfld.type & "</b> "
			if Request.QueryString("action") = "edit" and blnEditable then
			'this person is trying to edit and the PK for this Record match those in the QS
				if objPKRS.BOF and objPKRS.EOF then 'there are no primary keys for this table
				'write everything out as editable
					Response.Write ConvertToEdit(RSfld, strDBTag, true)
				else 'there is a primary key for this row
					objPKRS.MoveFirst
					blnIsAPK = false 'initialize bln
					do while not objPKRS.EOF 'loop through PKRS
						if objPKRS("Column_name") = RSfld.name then
						'This field is a primary key field
							if blnAllowPKEdits then
							'let the person edit the primary key
								Response.Write ConvertToEdit(RSfld, strDBTag, true)
							else 'don't allow pk edits
								Response.Write ConvertToHTML(RSfld)
							end if 'for allow pk edits
							Response.Write("<input type=""hidden"" name=""" & strPKTag &  _
								RSfld.Name & """ value=""" & trim(RSfld.value) & """>")
							blnIsAPK = true
						end if 'prikey col check
						objPKRS.MoveNext
					loop
					if not blnIsAPK then 'this field is not a primary key field
						Response.Write ConvertToEdit(RSfld, strDBTag, true)
					end if 'for prikey field check
				end if 'for primary key rs check
			else 'user is not trying to edit this field
				Response.Write ConvertToHTML(RSfld)
			end if 'for if we are doing edits on this field
			Response.Write("&nbsp;")
			Response.Write("</td>" & vbCRLF)
		next 'RSfld
		
		Response.Write(vbTab & "</tr>" & vbCRLF)
		iRecordsShown = iRecordsShown + 1
		objRS.movenext
	loop
	
end if 'for objRS records check

'end table, form and if for no record check
Response.Write("</table>" & vbCRLF)
Response.Write("</form>" & vbCRLF)
	
'if the person is adding new then set the focus to that item
If (blnAllowINSERT and Request.QueryString("action") = "addnew") or _
   (blnAllowUpdate and Request.QueryString("action") = "edit") then
	Response.Write("<script language=""javascript"">" & vbCRLF)
	Response.Write("for(i=0;i<document.theform.length;i++) {" & vbCRLF)
	Response.Write("	if (document.theform.elements[i].type == ""text"" && document.theform.elements[i].name != ""txtPageNo"" && document.theform.elements[i].name != ""txtPageSize"") {" & vbCRLF)
	Response.Write("		document.theform.elements[i].focus();" & vbCRLF)
	Response.Write("		break;" & vbCRLF)
	Response.Write("	}" & vbCRLF)
	Response.Write("}" & vbCRLF)
	Response.Write("</script>" & vbCRLF)
else '  select the combo box
	Response.Write("<script language=""javascript"">if(typeof(document.theform.cboTable)==""object""){document.theform.cboTable.focus();}</script>")
end if

if blnAllowPaging then
	Response.Write("<center>")
	DoPaging
	Response.Write("</center>" & vbCRLF)
end if
'close and free vars
objRS.Close
set objRS = nothing
objPKRS.close
set objPKRS = nothing

Response.Write("</BODY></HTML>")

'TODO:
'finish moving magic words to the config section
'move colors to config section
'test with new temp stored procedures
'test with access
'make functions out of insert, update, delete
'write so it can use Quilogy or ADO data access with a bln
'I would like the filter and sort to be in the SQL that goes to the database and not in the RS
'finish hiddenFields array
'use database schema objects instead of sp to get look of db
'insert for identity needs to be better
'comment better
'destroy objects asap
'paging should be better than it is
'update should not fire if nothing is changed
'remove response.end's
'quit checking QS.count
'compact javascript by declaring global objects and using them in the following scripts
%>
