<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>Retrieving Output Parameters</TITLE>
<%
objCmd = Server.CreateObject("ADODB.Command");
dbConnection = Server.CreateObject("ADODB.Connection");

dbConnection.Open(Application("dbConnection"));

objCmd.CommandText = "usp_ProcedureWithOutputParam";
objCmd.CommandType = adCmdStoredProc;

objParam = objCmd.CreateParameter("output_param", 
                                  adVarChar, adParamOutput,20);
objCmd.Parameters.Append(objParam);
objCmd.Name = "StoredProcedureName";
objCmd.ActiveConnection = dbConnection;

dbConnection.StoredProcedureName();

Response.write(objParam);
%>