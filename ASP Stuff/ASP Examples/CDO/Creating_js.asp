<%@ LANGUAGE = JScript %>
<!--METADATA TYPE="typelib" UUID="CD000000-8B95-11D1-82DB-00C04FB1625D"
   NAME="CDO for Windows 2000 Type Library" -->
<!--METADATA TYPE="typelib" UUID="00000205-0000-0010-8000-00AA006D2EA4"
   NAME="ADODB Type Library" -->

<%
objMsg = Server.CreateObject("CDO.Message");
with (objMsg) {
   To       = "\"User 33 \" <user33@test-server>";
   From     = "\"User 1 \" <user1@dev02>";
   Subject  = "This is the subject";
   TextBody = "This is the body.";
   Send();
}
%>