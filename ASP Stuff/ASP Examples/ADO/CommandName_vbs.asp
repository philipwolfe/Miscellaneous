<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>Retrieving Output Parameters</TITLE>
<%
Set objCmd = Server.CreateObject("ADODB.Command")
Set dbConnection = Server.CreateObject("ADODB.Connection")

dbConnection.Open Application("dbConnection")

objCmd.CommandText = "usp_ProcedureWithOutputParam"
objCmd.CommandType = adCmdStoredProc

Set objParam = _
   objCmd.CreateParameter("output_param", _
    adVarChar, adParamOutput,20)

objCmd.Parameters.Append objParam
objCmd.Name = "StoredProcedureName"
Set objCmd.ActiveConnection = dbConnection

dbConnection.StoredProcedureName
Response.write objParam
%>