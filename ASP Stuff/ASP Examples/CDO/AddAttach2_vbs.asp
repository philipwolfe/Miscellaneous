<%@ LANGUAGE = VBScript %>
<!--METADATA TYPE="typelib" NAME="CDO for Windows 2000 Type Library"
             UUID="CD000000-8B95-11D1-82DB-00C04FB1625D" -->
<!--METADATA TYPE="typelib" NAME="ADODB Type Library"
             UUID="00000205-0000-0010-8000-00AA006D2EA4" -->

<%
Option Explicit

Sub DisplayAttachment(bp)
   Dim stream, strBP
   
   Set stream = bp.GetStream()
   strBP = Server.HTMLEncode (stream.ReadText())
   
   Response.Write "<HR>"
   Response.Write "Body part: " & bp.FileName & "<BR>"
   Response.Write "Content Class: " & bp.ContentClass & "<BR>"
   Response.Write "Content Media Type: " & bp.ContentMediaType & _
                  "<BR>"
   Response.Write "Content Transfer Encoding: " & _
                  bp.ContentTransferEncoding & "<BR>"
   Response.Write "Content:" & "<P>"
   Response.Write strBP
   Response.Write "<HR>"
   
   Set stream = Nothing
End Sub 

Dim objMsg, objBodyPart, strFrom, strTo, strSubject, strBody
%>

<HTML>
<HEAD>
<TITLE>CDO2000 Sample #2 - Adding attachments</TITLE>
</HEAD>
<BODY>
<H3>Creating a message with attachments. Let's take a look at the
MIME representation of attachments:</H3>

<%
strFrom="""User 1"" <user1@dev02>"
strTo="""User 33"" <user33@test-server>"
strSubject = "This is the subject"
strBody= "This is the body."

Set objMsg = Server.CreateObject("CDO.Message")

With objMsg
   .To       = strTo
   .From     = strFrom
   .Subject  = strSubject
   .TextBody = strBody
   
   Set objBodyPart = .AddAttachment ("http://test-server/postinfo.html")
   DisplayAttachment(objBodyPart)
   Set objBodyPart = Nothing
   
   Set objBodyPart = .AddAttachment ("file://C:\Attachments\Word attachment.doc")
   DisplayAttachment(objBodyPart)
   ' now we change the encoding rule applied to the Word document
   objBodyPart.ContentTransferEncoding = cdoUuencode
   DisplayAttachment(objBodyPart)
   Set objBodyPart = Nothing

   Set objBodyPart = .AddAttachment ("C:\Attachments\Simple text attachment.txt")
   DisplayAttachment(objBodyPart)
   Set objBodyPart = Nothing

   Set objBodyPart = .AddAttachment ("C:\Attachments\HTML " & _
                                     "attachment.htm")
   DisplayAttachment(objBodyPart)
   Set objBodyPart = Nothing

   .Send
End With
%>
<H3>Here is the list of attachments obtained via the
BodyParts collection of the message object:</H3>

<%
Dim  objMsgBP
Dim  objAttBP
Set objMsgBP = objMsg.BodyPart
For Each objAttBP In objMsgBP.BodyParts
   Response.write objAttBP.filename
   Response.Write "<BR>"
Next
Set objMsgBP = Nothing
Set objMsg = Nothing

Response.Write "<HR>"
%>

<H3>We have sent a message to <% = strTo %>.</H3>
<BR>
</BODY>
</HTML>
