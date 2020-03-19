<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="typelib" NAME="Microsoft CDO for NTS 1.2 Library"
              UUID="0E064ADD-9D99-11D0-ABE5-00AA0064D470" -->
<%
var objMsg, strFrom, strTo, strReplyTo, strSubject, strBody;
%>

<HTML>
<HEAD>
<TITLE>CDONTS Sample #3 - Using custom message headers</TITLE>
</HEAD>
<BODY >

<%
strFrom="\"User 1\" <user.1@dev02>";
strTo="\"User 33\" <user.33@test-server>";
strReplyTo = "please@replyhere";
strSubject = "This is the subject";
strBody = "This is the body";

objMsg = Server.CreateObject("CDONTS.NewMail");

with (objMsg) {
   To = strTo;
   From = strFrom;
   Subject = strSubject;
   Body = strBody;
   Value("Reply-To") = strReplyTo;
   Value("Custom-header") = "This is the value";
   Send();
}

delete objMsg;
%>

We have sent a message with custom headers to <%= strTo %>.
<BR>
</BODY>
</HTML>