<%@ Language=VBScript %>
<!-- #include file="clsUpload.asp" -->
<form method=post
      enctype="multipart/form-data"
      action=test.asp>
Your Name:<BR><input type=text name=YourName><BR><BR>
Your File:<BR><input type=file name=YourFile><BR><BR>
<input type=submit name=submit value="Upload">
</form>
<HR>
<%
Dim objUpload, lngLoop

If Request.TotalBytes > 0 Then
	Set objUpload = New clsUpload
%>
File(s) Uploaded: <%= objUpload.Files.Count %>
<BR><BR>
<%
  For lngLoop = 0 to objUpload.Files.Count - 1
    'If accessing this page annonymously,
    'the internet guest account must have
    'write permission to the path below.
    objUpload.Files.Item(lngLoop).Save "c:\upload\"
%>
Form Element Name:
<%= objUpload.Files.Key(lngLoop) %>
<BR>
File Name: 
<%= objUpload.Files.Item(lngLoop).FileName %>
<BR><BR>
<%
  Next
%>
Other Form Element(s): <%= objUpload.Form.Count %>
<BR><BR>
<%
  For lngLoop = 0 to objUpload.Form.Count - 1
%>
Form Element Name:
<%= objUpload.Form.Key(lngLoop) %>
<BR>
Form Element Value:
<%= objUpload.Form.Item(lngLoop) %>
<BR><BR>
<%
  Next
End If
%>