<%@ LANGUAGE = VBScript %>
<!--METADATA TYPE="typelib" NAME="CDO for Windows 2000 Type Library"
             UUID="CD000000-8B95-11D1-82DB-00C04FB1625D" -->
<!--METADATA TYPE="typelib" NAME="ADODB Type Library"
             UUID="00000205-0000-0010-8000-00AA006D2EA4" -->

<%
Option Explicit

Sub ReplaceInBodyPart(bp)
   Const strTokentoFind = "SIGNATURE"
   Const strTokenToReplace = "Marco Gregorini"
   Dim objStream, strContent

   Set objStream = bp.GetDecodedContentStream
   strContent = objStream.ReadText
   strContent = Replace (strContent, strTokentoFind, strTokenToReplace)

   objStream.Position = 0
   objStream.SetEOS
   objStream.WriteText strContent
   objStream.Flush
   Set objStream =Nothing
End Sub

Sub ModifyHtmlAndTextBodyParts(msg)
   Dim objBP
   
   Set objBP = msg.HTMLBodyPart
   ReplaceInBodyPart objBP
   Set objBP = Nothing
   
   Set objBP = msg.TextBodyPart
   ReplaceInBodyPart objBP
   Set objBP = Nothing
End Sub

Dim objMsg, strFrom, strTo, strSubject, strBody
%>

<HTML>
<HEAD>
<TITLE>CDO2000 Sample #4 - Creating MHTML messages</TITLE>
</HEAD>
<BODY>

<%
strFrom="""User 1"" <user1@dev02>"
strTo="""User 33"" <user33@test-server>"
strSubject = "With compliments"

Set objMsg = Server.CreateObject("CDO.Message")

With objMsg
   .To       = strTo
   .From     = strFrom
   .Subject  = strSubject
   .CreateMHTMLBody "file://C:\Attachments\Compliments.htm"
End With

ModifyHtmlAndTextBodyParts objMsg
objMsg.Send
   
Set objMsg = Nothing
%>

We have sent a MHTML message to <% = strTo %>.<BR>
</BODY>
</HTML>
