<%@ LANGUAGE = JScript %>
<!--METADATA TYPE="typelib" NAME="CDO for Windows 2000 Type Library"
             UUID="CD000000-8B95-11D1-82DB-00C04FB1625D" -->
<!--METADATA TYPE="typelib" NAME="ADODB Type Library"
             UUID="00000205-0000-0010-8000-00AA006D2EA4" -->
<HTML>
<HEAD>
<TITLE>CDO2000 Sample #3 - Advanced techniques for 
managing attachments</TITLE>
</HEAD>
<BODY>

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
   objBodyPart = Attachments.Add();
}

objBPfields = objBodyPart.Fields;

with (objBPfields) {
   Item("urn:schemas:mailheader:content-type") = "text/plain;" + 
                    " name=Simple text attachment.txt"
   Item("urn:schemas:mailheader:content-transfer-encoding") = 
                    "quoted-printable"
   Update();
}

delete objBPfields;

strCharSet = objBodyPart.GetFieldParameter ("urn:schemas:mailheader:content-type","charset")
Response.Write(strCharSet);

objStream = objBodyPart.GetDecodedContentStream();
objStream.WriteText("This content has been produced on the " + 
                    "fly by ASP script.");
objStream.Flush();
delete objStream;

objMsg.Send();
delete objMsg;
%>

We have sent a message to <% = strTo %> with an attachment 
produced on the fly by ASP script.<BR>
</BODY>
</HTML>

