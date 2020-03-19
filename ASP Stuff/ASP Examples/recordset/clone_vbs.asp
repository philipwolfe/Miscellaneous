<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>The Clone Method</TITLE>
<%
Dim strConn, rsExample, rsExampleClone
strConn = Application("DBConnection")
Set rsExample = Server.CreateObject("ADODB.Recordset") 
rsExample.CursorLocation = adUseClient
rsExample.Open "authors", strConn, adOpenStatic, _
               adLockOptimistic, adCmdTable 

If rsExample.supports(adBookmark) Then
   Set rsExampleClone1 = rsExample.Clone
      rsExampleClone1.MoveFirst
   do While Not rsExampleClone1.EOF
      Response.Write rsExampleClone1(1) & "<BR>"
      rsExampleClone1.MoveNext
   Loop
Else
   Response.Write "Bookmarks, and hence cloning, not supported<BR>"
End If
%>
