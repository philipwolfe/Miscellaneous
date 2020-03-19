<HTML>
<HEAD>
<TITLE>The GetEx Method</TITLE>
</HEAD>
<BODY>
<H1>Get and GetEx Demo</H1>

<%
Set objObject = GetObject("WinNT://detower/Administrator")
Response.Write "<P>"

' display automation properties if we have bound to an object
If (Err.number = 0) Then
   Response.Write "Description using Get:<BR>" & objObject.Get("Description") & "<P>"
   For Each Value in objObject.GetEx("Description")
      Response.Write "Description using GetEx:<BR>" & Value & "<BR>"
   Next
End If
%>
</BODY>
</HTML>