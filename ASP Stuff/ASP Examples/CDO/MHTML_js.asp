<%@ LANGUAGE = JScript %>
<!--METADATA TYPE="typelib" NAME="CDO for Windows 2000 Type Library"
             UUID="CD000000-8B95-11D1-82DB-00C04FB1625D" -->
<!--METADATA TYPE="typelib" NAME="ADODB Type Library"
             UUID="00000205-0000-0010-8000-00AA006D2EA4" -->

<%
function ReplaceInBodyPart(bp) {
   re = /SIGNATURE/g;
   var strTokenToReplace = "Marco Gregorini";
   objStream = bp.GetDecodedContentStream();
   var strContent = objStream.ReadText();
   strContent = strContent.replace(re, strTokenToReplace);

   objStream.Position = 0;
   objStream.SetEOS();
   objStream.WriteText(strContent);
   objStream.Flush();
   delete objStream;
}

function ModifyHtmlAndTextBodyParts(msg) {
   objBP = msg.HTMLBodyPart;
   ReplaceInBodyPart(objBP);
   delete objBP;
   
   objBP = msg.TextBodyPart;
   ReplaceInBodyPart(objBP);
   delete objBP;
}
%>

<HTML>
<HEAD>
<TITLE>CDO2000 Sample #4 - Creating MHTML messages</TITLE>
</HEAD>
<BODY>

<%
strFrom="\"User 1\" <user1@dev02>";
strTo="\"User 33\" <user33@test-server>";
strSubject = "With compliments";

objMsg = Server.CreateObject("CDO.Message");

with (objMsg) {
   To       = strTo;
   From     = strFrom;
   Subject  = strSubject;
   CreateMHTMLBody("file://C:\\Attachments\\Compliments.htm");
}

ModifyHtmlAndTextBodyParts(objMsg);
objMsg.Send();
   
delete objMsg;
%>

We have sent a MHTML message to <% = strTo %>.<BR>
</BODY>
</HTML>
