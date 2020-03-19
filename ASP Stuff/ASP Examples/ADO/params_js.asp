<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="typelib" 
     FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->

<%
strConnect = Application("dbConnection");
dbConnection = Server.CreateObject("ADODB.Connection");
objCmd = Server.CreateObject("ADODB.Command");
dbConnection.Open(strConnect);

objCmd.ActiveConnection = dbConnection;

objCmd.CommandText = "usp_ProcedureWithOutputParam";
objCmd.CommandType = adCmdStoredProc;
objCmd.Parameters.Append(objCmd.CreateParameter("output_param", 
    adVarChar, adParamOutput,20));
rsExample = objCmd.Execute();

intParamAvail = dbConnection.Properties("Output Parameter Availability");
// If Parameter not available until recordset is closed
// DBPROPVAL_OA_ATROWRELEASE = 4
if (intParamAvail == 4) {
   rsExample.Close();
}

strOutParam = objCmd.Parameters("output_param");
Response.Write(strOutParam);
%>