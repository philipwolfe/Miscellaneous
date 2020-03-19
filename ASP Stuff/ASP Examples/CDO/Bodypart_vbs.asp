<% LANGUAGE = VBScript %>
<!--METADATA TYPE="typelib" UUID="CD000000-8B95-11D1-82DB-00C04FB1625D"
   NAME="CDO for Windows 2000 Type Library" -->
<!--METADATA TYPE="typelib" UUID="00000205-0000-0010-8000-00AA006D2EA4"
   NAME="ADODB Type Library" -->
<%
Sub DisplayAttachment(bp)
   Dim stream, strBP
   
   Set stream = bp.GetStream()
   strBP = Server.HTMLEncode (stream.ReadText())
   
   Response.Write "<HR>"
   Response.Write "Body part: " & bp.FileName & "<BR>"
   Response.Write "Content Class: " & bp.ContentClass & "<BR>"
   Response.Write "Content Media Type: " & bp.ContentMediaType & "<BR>"
   Response.Write "Content Transfer Encoding: " & bp.ContentTransferEncoding & "<BR>"
   Response.Write "Content:" & "<P>"
   Response.Write strBP
   Response.Write "<HR>"
   
   Set stream = Nothing
End Sub 

%>