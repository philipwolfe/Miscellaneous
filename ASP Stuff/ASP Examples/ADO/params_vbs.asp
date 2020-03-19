<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>Retrieving Output Parameters</TITLE>
<%
Set objCmd = Server.CreateObject("ADODB.Command")
Set dbConnection = Server.CreateObject("ADODB.Connection")

dbConnection.Open Application("dbConnection")

objCmd.ActiveConnection = dbConnection
objCmd.CommandText = "usp_ProcedureWithOutputParam"
objCmd.CommandType = adCmdStoredProc
objCmd.Parameters.Append objCmd.CreateParameter("output_param", adVarChar, adParamOutput, 20)
Set rsExample = objCmd.Execute

intParamAvail = dbConnection.Properties("Output Parameter Availability")
' If Parameter not available until recordset is closed
' DBPROPVAL_OA_ATROWRELEASE = 4
If intParamAvail = 4 Then
   rsExample.Close
End If

strOutParam = objCmd.Parameters("output_param")
Response.Write strOutParam
%>