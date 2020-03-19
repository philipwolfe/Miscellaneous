<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>Navigating Through a Recordset</TITLE>
<%
Dim dbConnection, rsExample, strConnect, strSQL
strConnect = Application("DBConnection")
Set dbConnection = Server.CreateObject("ADODB.Connection")
Set rsExample = Server.CreateObject("ADODB.Recordset")
dbConnection.Open strConnect

' Open a database table as a recordset
rsExample.Open "titles", dbConnection, adOpenStatic, _
               adLockReadOnly, adCmdTable

' Navigate through the entire table
Do While Not rsExample.EOF
   Response.Write rsExample("Title") & "<BR>" & vbCRLF
   rsExample.MoveNext
Loop
Response.Write "<HR>" & vbCRLF

' Display the table backwards
rsExample.MoveLast
Do While Not rsExample.BOF
   Response.Write rsExample("title_id") & "<BR>" & vbCRLF
   rsExample.MovePrevious
Loop
Response.Write "<HR>" & vbCRLF

' Display every other record
rsExample.MoveFirst
Do While Not rsExample.EOF
   Response.Write rsExample("title") & _
                  "<BR>*** Skip One ***<BR>" & vbCRLF
   rsExample.Move 2
Loop
Response.Write "<HR>" & vbCRLF

' Show only certain titles
rsExample.Filter = "pub_id=0877"
If rsExample.EOF Then
   Response.Write "No Matching Titles<BR>"
Else
   Do While Not rsExample.EOF
      Response.Write rsExample("pub_id") & " - " & _
                               rsExample("Title") & "<BR>"
      rsExample.MoveNext
   Loop
End If
Response.Write "<HR>" & vbCRLF

rsExample.Close
dbConnection.Close
Set rsExample = Nothing
Set dbConnection = Nothing
%>