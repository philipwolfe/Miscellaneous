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
cmdExample.Parameters.Refresh
%>
<TABLE border=1><TR><TH>Name</TH><TH>Type</TH><TH>Size</TH><TH>Direction</TH></TR>
<%
For Each parm In cmdExample.Parameters
   Response.Write "<TR>"
   Response.Write "<TD>" & parm.Name & "</TD>"
   Response.Write "<TD>" & parm.Type & "</TD>"
   Response.Write "<TD>" & parm.Size & "</TD>"
   Select Case parm.Direction
      Case 1
         strDir = "Input"
      Case 2
         strDir = "Output"
      Case 3
         strDir = "Input/Output"
      Case 4
         strDir = "Return"
      End Select
   Response.Write "<TD>" & strDir & "</TD>"
   Response.Write "</TR>"
Next
Response.Write "</TABLE>"
Set cmdExample = Nothing
dbConnection.Close
Set dbConnection = Nothing
%>
