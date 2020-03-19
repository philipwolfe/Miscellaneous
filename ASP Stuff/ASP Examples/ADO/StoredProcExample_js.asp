<%@ LANGUAGE = JScript %>
<!-- METADATA TYPE="typelib" 
     FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->
<%
strConnect = Application("dbConnection");

dbConnection = Server.CreateObject("ADODB.Connection");
cmdExample = Server.CreateObject("ADODB.Command");
dbConnection.Open(strConnect);

cmdExample.ActiveConnection = dbConnection;
cmdExample.CommandText = "reptq3";
cmdExample.CommandType = adCmdStoredProc;

cmdExample.Parameters.Append(cmdExample.CreateParameter 
                             ("return", adInteger, adParamReturnValue));
cmdExample.Parameters.Append(cmdExample.CreateParameter 
                             ("@lolimit", adCurrency, adParamInput));
cmdExample.Parameters.Append(cmdExample.CreateParameter 
                             ("@hilimit", adCurrency, adParamInput));
cmdExample.Parameters.Append(cmdExample.CreateParameter 
                             ("@type", adVarChar, adParamInput, 12));

cmdExample.Parameters("@lolimit").Value = 10;
cmdExample.Parameters("@hilimit").Value = 20;
cmdExample.Parameters("@type") = "psychology";

rsExample = cmdExample.Execute();

strTable = rsExample.GetString(adClipString, -1, "</TD><TD>", 
                               "</TD></TR><TR><TD>");
Response.Write("<TABLE BORDER=1><TR><TD>" + strTable + "</TABLE>");
rsExample.Close();
Response.Write("Return value = " +
               cmdExample.Parameters("return").Value);

delete cmdExample;
dbConnection.Close();
delete rsExample;
delete dbConnection;
%>
