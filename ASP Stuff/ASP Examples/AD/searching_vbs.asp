<HTML>
<HEAD>
<TITLE>Seacrhing Directories</TITLE>
</HEAD>
<BODY>
<H1>Searching with ADSI and ADO</H1>

<%
On Error Resume Next

Dim objConnection, objCommand

Set objConnection = Server.CreateObject("ADODB.Connection")
Set objCommand = Server.CreateObject("ADODB.Command")

objConnection.Provider = "ADsDSOObject"
objConnection.Open "Active Directory Provider"
Set objCommand.ActiveConnection = objConnection
Response.Write "<P><P><P>"

Dim strCommand
strCommand = "<LDAP://CRASHLOTS/DC=LT,DC=local>;" & _
             "(objectCategory=Person);sAMAccountName,ADsPath;subtree"
objCommand.CommandText = strCommand

Response.Write "<P>This page displays the results from the " & _
               "following search request:<BR>" &  _
               objCommand.CommandText & "<P>"

Dim objRecordset
Set objRecordset = objCommand.Execute(strCommand)

While Not objRecordset.EOF
   For Each objField In objRecordset.Fields
      Response.Write objField.Value & "<BR>"
   Next
   objRecordset.MoveNext
Response.Write "<BR>"
Wend
%>

</BODY>
</HTML>