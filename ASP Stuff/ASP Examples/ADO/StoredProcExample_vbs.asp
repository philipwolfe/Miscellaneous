<!-- METADATA TYPE="typelib" 
     FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->
<%
Dim dbConnection, rsExample, strConnect, cmdExample
strConnect = Application("dbConnection")

Set dbConnection = Server.CreateObject("ADODB.Connection")
Set cmdExample = Server.CreateObject("ADODB.Command")
dbConnection.Open strConnect

cmdExample.ActiveConnection = dbConnection
cmdExample.CommandText = "reptq3"
cmdExample.CommandType = adCmdStoredProc
cmdExample.Parameters.Append cmdExample.CreateParameter _
                             ("return",adInteger, adParamReturnValue)
cmdExample.Parameters.Append cmdExample.CreateParameter _
                             ("@lolimit", adCurrency, adParamInput)
cmdExample.Parameters.Append cmdExample.CreateParameter _
                             ("@hilimit", adCurrency, adParamInput)
cmdExample.Parameters.Append cmdExample.CreateParameter _
                             ("@type", adVarChar, adParamInput, 12)
cmdExample.Parameters("@lolimit").Value = 10
cmdExample.Parameters("@hilimit").Value = 20
cmdExample.Parameters("@type") = "psychology"
Set rsExample = cmdExample.Execute

Dim strTable
strTable = rsExample.GetString(adClipString, , "</TD><TD>", _
                               "</TD></TR><TR><TD>")
Response.Write "<TABLE BORDER=1><TR><TD>" & strTable & "</TABLE>"
rsExample.Close
Response.Write "Return value = " & _
               cmdExample.Parameters("return").Value
Set cmdExample = Nothing
dbConnection.Close
Set rsExample = Nothing
Set dbConnection = Nothing
%>
