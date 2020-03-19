<TITLE>The FileExists Method</TITLE>
<FORM ACTION="fileExists_vbs.asp" METHOD="POST">
Please type a file URL:
<INPUT TYPE="TEXT" NAME="file"><BR>
<INPUT TYPE="SUBMIT" NAME="submit">
</FORM>
<HR>
<%
Set objTools = Server.CreateObject("MSWC.Tools")
strFile=Request.Form("file")
If strFile <> "" Then
   If objTools.FileExists(strFile) Then
      Response.Write "The file <B>" & strFile & "</B> exists."
   Else
      Response.Write "The file <B>" & strFile & "</B> does not exist."
   End If
End If
%>