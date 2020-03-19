<%@ LANGUAGE = VBScript %>
<!--METADATA TYPE="typelib" NAME="CDO for Windows 2000 Type Library"
             UUID="CD000000-8B95-11D1-82DB-00C04FB1625D" -->
<!--METADATA TYPE="typelib" NAME="ADODB Type Library"
             UUID="00000205-0000-0010-8000-00AA006D2EA4" -->
<%
Option Explicit

Dim objMsg, objBodyPart, objBPfields, objStream, strFrom
Dim strTo, strSubject, strBody
%>

<HTML>
<HEAD>
<TITLE>CDO2000 Sample #3 - Advanced techniques for 
managing attachments</TITLE>
</HEAD>
<BODY>

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
   Set objBodyPart = .Attachments.Add
End With

Set objBPfields = objBodyPart.Fields

With objBPfields
   .Item("urn:schemas:mailheader:content-type") = "text/plain;" & _ 
                          " name=Simple text attachment.txt"
   .Item("urn:schemas:mailheader:content-transfer-encoding") = _
"quoted-printable"
   .Update
End With

Set objBPfields = Nothing

Set objStream = objBodyPart.GetDecodedContentStream
objStream.WriteText "This content has been produced on the " & _
                    "fly by ASP script."
objStream.Flush
Set objStream = Nothing

objMsg.Send
Set objMsg = Nothing
%>

We have sent a message to <% = strTo %> with an attachment 
produced on the fly by ASP script.<BR>
</BODY>
</HTML>

