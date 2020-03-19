<!--METADATA TYPE="typelib" NAME="Microsoft CDO 1.21 Library"
             UUID="3FA7DEA7-6438-101B-ACC1-00AA00423326"  -->

<%
Option Explicit
   
Dim objSession, objOutbox, objMessage, objRecipients, objRecipient
Dim strProfileInfo, strServer, strMailbox, strTo, strSubject, strBody
%>

<HTML>
<HEAD>
<TITLE>CDO for Exchange Sample #1 - Sending a simple message</TITLE>
</HEAD>
<BODY>

<%
strTo = Request.QueryString("Recipient")
strSubject = Request.QueryString("Subject")
strBody= Request.QueryString("Body")

Set ObjSession = Server.CreateObject("MAPI.Session")

strServer = "dev"
strMailbox = "AnonExchAspNotifier"
strProfileInfo = strServer + vbLF + strMailbox

ObjSession.Logon "", "", False, True, 0, True, strProfileInfo

Set objOutbox = objSession.Outbox
Set objMessage = objOutbox.Messages.Add
Set objRecipients = objMessage.Recipients
Set objRecipient = objRecipients.Add

objRecipient.Name =  strTo
objRecipient.Resolve
objMessage.Subject = strSubject
objMessage.Text =  strBody
objMessage.Send

Set objRecipient = Nothing
Set objRecipients = Nothing
Set objMessage = Nothing
Set objOutbox = Nothing
Set ObjSession = Nothing
%>

We have sent an administrative alert to <% = strTo %>.<BR>
</BODY>
</HTML>
