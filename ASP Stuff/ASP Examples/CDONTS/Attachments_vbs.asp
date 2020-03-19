<!-- METADATA TYPE="typelib" NAME="Microsoft CDO for NTS 1.2 Library"
              UUID="0E064ADD-9D99-11D0-ABE5-00AA0064D470" -->
<%
Option Explicit

Dim objMsg, objSession, objOutbox, objInbox
Dim strFrom, strTo, strSubject, strBody
%>

<HTML>
<HEAD>
<TITLE>CDONTS Sample #1 - Working with attachments</TITLE>
</HEAD>
<BODY >
<%
strFrom="""User 1"" <user.1@dev02>"
strTo="""User 33"" <user.33@test-server>"
strSubject = "This is the subject"
strBody = "This is the body"

' Using NewMail object
Set objMsg = Server.CreateObject("CDONTS.NewMail")

With objMsg
   .To = strTo
   .From = strFrom
   .Subject = strSubject
   .MailFormat = CdoMailFormatMime
   .AttachFile "C:\ASP Prog Ref\Chapter 39\Word attachment.doc", _
               "A Word attachment.doc"
   .AttachFile "C:\ASP Prog Ref\Chapter 39\HTML attachment.htm", _
               "An HTML attachment.htm"
   .Send
End With

Set objMsg = nothing

' Using Session-rooted hierachy
Set objSession = Server.CreateObject("CDONTS.Session")
objSession.LogonSMTP "Sender Name", "sender@domain1.com"
Set objOutbox = objSession.Outbox
'Set objInbox = objSession.GetDefaultFolder(CdoDefaultFolderInbox)

Set objMsg = objOutbox.Messages.Add
objMsg.Subject = "This is the subject"
objMsg.Text = "This is the very short mail message."
objMsg.Recipients.Add "Recipient Name", "recipient@domain2.com", CdoTo
objMsg.Attachments.Add "A Word attachment.doc" , CdoFileData, _
                       "C:\ASP Prog Ref\Chapter 39\Word attachment.doc"
objMsg.Send

Set objMsg = nothing
Set objOutbox = nothing
objSession.Logoff
Set objSession = nothing
%>

We have sent messages with attachments to <%= strTo %>.
<BR>
</BODY>
</HTML>