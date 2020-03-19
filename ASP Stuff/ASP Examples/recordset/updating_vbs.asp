<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>Changing Data Using a Recordset</TITLE>
<%
Dim dbConnection, rsExample, strConnect, strSQL
strConnect = Application("DBConnection")
Set dbConnection = Server.CreateObject("ADODB.Connection")
Set rsExample = Server.CreateObject("ADODB.Recordset")
dbConnection.Open strConnect

rsExample.Open "SELECT title_id, title, price FROM titles", _
           dbConnection, adOpenDynamic, adLockOptimistic, adCmdText

rsExample.Find "title_id = 'PC1034'"
If Not rsExample.EOF Then
   rsExample("title") = "This is the new title"
   rsExample("price") = 125.00
   rsExample.Update
End If

rsExample.AddNew
rsExample("title_id") = "BF1235"
rsExample("title") = "ASP Prog Ref 3.0"
rsExample("price") = 29.95
rsExample.Update

rsExample.MoveFirst
Dim strTable
strTable = rsExample.GetString(adClipString, , "</TD><TD>", _
                               "</TD></TR><TR><TD>")
strTable = Left(strTable, Len(strTable)-8) 
Response.Write "<TABLE BORDER=1><TR><TD>" & strTable & "</TABLE><HR>"

rsExample.Close
dbConnection.Close   
Set rsExample = Nothing
Set dbConnection = Nothing
%>