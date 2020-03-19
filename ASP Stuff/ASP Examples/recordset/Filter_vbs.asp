<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>The Filter Property</TITLE>
<%
Set cnPubs = Server.CreateObject("ADODB.Connection")
cnPubs.Open Application("DBConnection")
Set rsExample = cnPubs.Execute("SELECT * FROM titles")

rsExample.Filter = "pub_id=0877"
If rsExample.EOF Then
   Response.Write "No Matching Titles<BR>"
Else
   Do While Not rsExample.EOF
      Response.Write rsExample("pub_id") & " - " & _
                     rsExample("Title") & "<BR>" & vbCRLF
      rsExample.MoveNext
   Loop
End If

%>

