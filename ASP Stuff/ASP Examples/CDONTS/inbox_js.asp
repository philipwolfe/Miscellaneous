<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="typelib" NAME="Microsoft CDO for NTS 1.2 Library"
              UUID="0E064ADD-9D99-11D0-ABE5-00AA0064D470" -->
<%
function DisplayMsgsTable(folder) {
	
   var strTableHeader = "<P><TABLE WIDTH=100% bgcolor=Silver " +
                        "BORDER=1 CELLSPACING=1 CELLPADDING=1>" +
                        "<TR BGCOLOR=Yellow><STRONG>" +
                        "<TD>From</TD><TD>To</TD>" +
                        "<TD>Subject</TD><TD>Message text</TD>" +
                        "<TD>Attachment</TD><TD>Received</TD>" +
                        "</STRONG></TR>";
   var strTableFooter = "</TABLE><P>";

   Response.Write("<HR><H2>" + folder.Name + "</H2><BR>");
	
   if (!folder.Messages.Count > 0) {
      Response.Write("Sorry, the folder contains no messages<HR>");
      return;
   }

   Response.Write(strTableHeader);
	
   var objEnum = new Enumerator(folder.Messages);
   for (; !objEnum.atEnd(); objEnum.moveNext()) {
      var objMsg = objEnum.item();
      Response.Write("<TR><TD>" + objMsg.Sender.Name + " &lt;" +
                     objMsg.Sender.Address + "&gt;</TD>");
		
      var strRecs
      if (objMsg.Recipients.Count > 0) { 
         strRecs = objMsg.Recipients(1).Name + " &lt;" +
                   objMsg.Recipients(1).Address + "&gt;"
         var idx
         for (idx=2; idx<=objMsg.Recipients.Count; idx++) {
            strRecs += "; " + objMsg.Recipients(idx).Name + 
                       " &lt;" + objMsg.Recipients(idx).Address +
                       "&gt;"
         }
      } else {
         strRecs = "No recipient" ;
      }
				
      Response.Write("<TD>" + strRecs + "</TD>");
      Response.Write("<TD>" + objMsg.Subject + "</TD>");
      Response.Write("<TD>" + objMsg.Text + "</TD>");
      Response.Write("<TD>" + String(objMsg.Attachments.Count>0) +
                     "</TD>");
      Response.Write("<TD>" + Date(objMsg.TimeReceived) +
                     "</TD></TR>");
   }
	
   Response.Write(strTableFooter);
   Response.Write("<HR>");

}

var objSession, objOutbox, objInbox;
%>
<HTML>
<HEAD>
<TITLE>CDONTS Sample #4 - Examining inbox and outbox folders</TITLE>
</HEAD>
<BODY >

<%
objSession = Server.CreateObject("CDONTS.Session");
objSession.LogonSMTP("Newsletter manager", "news.mng@dev02");
// objOutbox = objSession.Outbox;
objOutbox = objSession.GetDefaultFolder(CdoDefaultFolderOutbox);
objInbox = objSession.GetDefaultFolder(CdoDefaultFolderInbox);

Response.Write("<H1> Welcome " + objSession.Name + "</H1><P>");

Response.Write("<H3> This is the content of your mail folders:" +
               "</H3><P>");

/* ######################
We can use the following code to verify that we cannot add
messages to the Inbox folder
var objNewMsg
objNewMsg = objInbox.Messages.Add();
delete objNewMsg
###################### */

DisplayMsgsTable(objInbox);

/* ######################
We can use the following code to verify that outbox's Messages
collection is always empty
var objNewMsg
objNewMsg = objOutbox.Messages.Add();
objNewMsg.Subject = "This is the subject";
objNewMsg.Text = "This is the very short mail message.";
objNewMsg.Recipients.Add("Recipient Name", 
                         "recipient@domain2.com", CdoTo);
objNewMsg.Attachments.Add("A Word attachment.doc" , CdoFileData,
                          "C:/Wrox/Books/1999/ASP30PR/ch10/" +
                          "CDO2000/Attachments/Word attachment.doc");
 ### objOutbox.Messages.count is always 0
Response.Write(objOutbox.Messages.count);
objNewMsg.Send();
delete objNewMsg
###################### */

DisplayMsgsTable(objOutbox);

delete objOutbox
delete objInbox
objSession.Logoff();
delete objSession
%>

<BR>
</BODY>
</HTML>