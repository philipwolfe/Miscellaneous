<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="typelib" NAME="Microsoft CDO for NTS 1.2 Library"
              UUID="0E064ADD-9D99-11D0-ABE5-00AA0064D470" -->
<%
var objMsg, objSession, objOutbox, objInbox;
var strFrom, strTo, strSubject, strBody;
%>

<HTML>
<HEAD>
<TITLE>CDONTS Sample #1 - Working with attachments</TITLE>
</HEAD>
<BODY >
<%
strFrom="\"User 1\" <user.1@dev02>";
strTo="\"User 33\" <user.33@test-server>";
strSubject = "This is the subject";
strBody = "This is the body";

// Using NewMail object
objMsg = Server.CreateObject("CDONTS.NewMail");

with (objMsg) {
   To = strTo;
   From = strFrom;
   Subject = strSubject;
   MailFormat = CdoMailFormatMime;
   AttachFile("C:/Attachments/Word attachment.doc",
              "A Word attachment.doc");
   AttachFile("C:/Attachments/HTML attachment.htm",
              "An HTML attachment.htm");
   Send();
}

delete objMsg;

// Using Session-rooted hierachy
objSession = Server.CreateObject("CDONTS.Session");
objSession.LogonSMTP("Sender Name", "sender@domain1.com");
objOutbox = objSession.Outbox;
// objInbox = objSession.GetDefaultFolder(CdoDefaultFolderInbox);

objMsg = objOutbox.Messages.Add();
objMsg.Subject = "This is the subject";
objMsg.Text = "This is the very short mail message.";
objMsg.Recipients.Add("Recipient Name", "recipient@domain2.com", CdoTo);
objMsg.Attachments.Add("A Word attachment.doc" , CdoFileData,
                       "C:/Attachments/Word attachment.doc");
objMsg.Send();

delete objMsg;
delete objOutbox;
objSession.Logoff();
delete objSession;
%>

We have sent messages with attachments to <%= strTo %>.
<BR>
</BODY>
</HTML>