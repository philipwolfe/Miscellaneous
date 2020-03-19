<%@ LANGUAGE = JScript %>
<!--METADATA TYPE="typelib" NAME="CDO for Windows 2000 Type Library"
             UUID="CD000000-8B95-11D1-82DB-00C04FB1625D" -->
<!--METADATA TYPE="typelib" NAME="ADODB Type Library"
             UUID="00000205-0000-0010-8000-00AA006D2EA4" -->

<%
function DisplayAttachment(bp) {
   stream = bp.GetStream();
   strBP = Server.HTMLEncode (stream.ReadText());
   
   Response.Write("<HR>");
   Response.Write("Body part: " + bp.FileName + "<BR>");
   Response.Write("Content Class: " + bp.ContentClass + "<BR>");
   Response.Write("Content Media Type: " + bp.ContentMediaType + 
                  "<BR>");
   Response.Write("Content Transfer Encoding: " + 
                  bp.ContentTransferEncoding + "<BR>");
   Response.Write("Content:" + "<P>");
   Response.Write(strBP);
   Response.Write("<HR>");
   
   delete stream;
}
%>

<HTML>
<HEAD>
<TITLE>CDO2000 Sample #2 - Adding attachments</TITLE>
</HEAD>
<BODY>
<H3>Creating a message with attachments. Let's take a look at the
MIME representation of attachments:</H3>

<%
strFrom="\"User 1\" <user1@dev02>";
strTo="\"User 33\" <user33@test-server>";
strSubject = "This is the subject";
strBody= "This is the body.";

objMsg = Server.CreateObject("CDO.Message");

with (objMsg) {
   To       = strTo;
   From     = strFrom;
   Subject  = strSubject;
   TextBody = strBody;
   
   objBodyPart = AddAttachment ("http://test-server/postinfo.html");
   DisplayAttachment(objBodyPart);
   delete objBodyPart;
   
   objBodyPart = AddAttachment("file://C:\\Attachments\\" +
                                "Word attachment.doc");
   DisplayAttachment(objBodyPart);
   // now we change the encoding rule applied to the Word document
   objBodyPart.ContentTransferEncoding = cdoUuencode;
   DisplayAttachment(objBodyPart);
   delete objBodyPart;

   objBodyPart = AddAttachment ("C:\\Attachments\\" + 
                                 "Simple text attachment.txt")
   DisplayAttachment(objBodyPart);
   delete objBodyPart;

   objBodyPart = AddAttachment("C:\\Attachments\\HTML " + 
                                "attachment.htm")
   DisplayAttachment(objBodyPart);
   delete objBodyPart;

   Send();
}
%>
<H3>Here is the list of attachments obtained via the
BodyParts collection of the message object:</H3>

<%
objMsgBP = objMsg.BodyPart();
var objEnum = new Enumerator(objMsgBP.BodyParts);
for (;!objEnum.atEnd(); objEnum.moveNext()) {
   var objItem = objEnum.item();
   Response.Write(objItem.filename + "<BR>"); 
}

delete objMsgBP;
delete objMsg;

Response.Write("<HR>");
%>

<H3>We have sent a message to <% = strTo %>.</H3>
<BR>
</BODY>
</HTML>
