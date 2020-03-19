<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="typelib" NAME="Microsoft CDO for NTS 1.2 Library"
              UUID="0E064ADD-9D99-11D0-ABE5-00AA0064D470" -->
<%
var objMsg, strFrom, strTo, strSubject, strBody;
%>
<HTML>
<HEAD>
<TITLE>CDONTS Sample #2 - Working with MHTML</TITLE>
</HEAD>
<BODY>
<%
strFrom="\"User 1\" <user.1@dev02>";
strTo="\"User 33\" <user.33@test-server>";
strSubject = "With compliments";

strBody = "<HTML><HEAD><TITLE>With compliments</TITLE></HEAD>" +
          "<BODY><P><IMG SRC=\"the_wrox_logo.gif\"></P>" +
          "<P><FONT color=red size=5> With authors' and " +
          "publisher's compliments.</FONT></P>" +
          "<P><FONT color=black><EM>" +
          "The \"ASP 3.0 Programmer's Reference\" Team" +
          "</EM></FONT></P></BODY></HTML>";

objMsg = Server.CreateObject("CDONTS.NewMail");

with (objMsg) {
   To = strTo;
   From = strFrom;
   Subject = strSubject;
   MailFormat = CdoMailFormatMime;
   BodyFormat = CdoBodyFormatHTML;
   Body = strBody;
   AttachURL("C:\\ASP Prog Ref\\Chapter 39\\wrox_logo100.gif", "the_wrox_logo.gif");
   Send();
}

delete objMsg;
%>
We have sent a MHTML message to <%= strTo %>.
<BR>
</BODY>
</HTML>