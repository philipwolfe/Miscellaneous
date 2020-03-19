<%@ LANGUAGE = VBScript %>
<!--METADATA TYPE="typelib" NAME="CDO for Windows 2000 Type Library"
             UUID="CD000000-8B95-11D1-82DB-00C04FB1625D" -->
<!--METADATA TYPE="typelib" NAME="ADODB Type Library"
             UUID="00000205-0000-0010-8000-00AA006D2EA4" -->
<TITLE>Adding Attachments</TITLE>

<%
Set objMsg = Server.CreateObject("CDO.Message")

With objMsg
   .To       = """User 33"" <user33@test-server>"
   .From     = """User 1"" <user1@dev02>"
   .Subject  = "This is the subject"
   .TextBody = "This is the body."
   .AddAttachment "http://test-server/postinfo.html"
   .AddAttachment "C:\Attachments\Word attachment.doc"
   .AddAttachment "C:\Attachments\Simple text attachment.txt"
   .AddAttachment "C:\Attachments\HTML attachment.htm"
   .Send
End With

Set objMsg = Nothing
%>
