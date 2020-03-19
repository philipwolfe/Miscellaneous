<%@ LANGUAGE = JScript %>
<!--METADATA TYPE="typelib" UUID="CD000000-8B95-11D1-82DB-00C04FB1625D"
   NAME="CDO for Windows 2000 Type Library" -->
<!--METADATA TYPE="typelib" UUID="00000205-0000-0010-8000-00AA006D2EA4"
   NAME="ADODB Type Library" -->

<%
objCfg = Server.CreateObject("CDO.Configuration");
objCfgFlds = objCfg.Fields;

with (objCfgFlds) {
  Item(cdoSendUsingMethod) = cdoSendUsingPort;
  Item(cdoSMTPServer) = "jennyw";
  Item(cdoSMTPAuthenticate) = cdoAnonymous;
  Item(cdoSMTPConnectionTimeout) = 20;
  Update();
}

objMsg = Server.CreateObject("CDO.Message");

with (objMsg) {
   Configuration = objCfg;
   To       = "\"User 33\" <user33@test-server>";
   From     = "\"User 1\" <user1@dev02>";
   Subject  = "This is the subject";
   TextBody = "JScript message.";
   Send();
}
%>
