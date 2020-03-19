<%@ LANGUAGE = JScript %>
<!--METADATA TYPE="typelib" UUID="CD000000-8B95-11D1-82DB-00C04FB1625D"
   NAME="CDO for Windows 2000 Type Library" -->
<!--METADATA TYPE="typelib" UUID="00000205-0000-0010-8000-00AA006D2EA4"
   NAME="ADODB Type Library" -->
<%
function DisplayCfgTable(cfgObj) {
   strTableHeader = "<P><TABLE WIDTH=\"100%\" BORDER=\"1\"" +
                    "BGCOLOR=\"Silver\" CELLSPACING=\"1\" " +
                    "CELLPADDING=\"1\"><TR bgcolor=\"Yellow\">" +
                    "<TD><B>Field</B></TD><TD><B>Value</B></TD></TR>"
   strTableFooter = "</TABLE><P>";

   Response.Write(strTableHeader);

   var objEnum = new Enumerator(cfgObj.Fields);
   for (;!objEnum.atEnd();objEnum.moveNext()) {
      var objItem = objEnum.item();
      Response.Write("<TR><TD>" + objItem.Name + "</TD>");
      Response.Write("<TD>" + objItem.Value + "</TD></TR>");
   }

   Response.Write(strTableFooter);
}
%>

<HTML>
<HEAD>
<TITLE>CDO2000 sample 1 - Sending a simple message</TITLE>
</HEAD>
<BODY>

<%
strFrom = "\"User 1\" <user1@dev02>";
strTo = "\"User 33\" <user33@test-server>";
strSubject = "This is the subject";
strBody = "This is the body.";

objMsg = Server.CreateObject("CDO.Message");
objCfg = Server.CreateObject("CDO.Configuration");
objCfg.Load(cdoIIS);
%>

These are the default IIS/SMTP configuration settings:
<% 
DisplayCfgTable(objCfg);
 %>

Now we are changing the configuration ...<BR>
<%
objCfgFlds = objCfg.Fields;
with (objCfgFlds) {
  Item(cdoSendUsingMethod) = cdoSendUsingPort;
  Item(cdoSMTPServer) = "test-server";
  Item(cdoSMTPConnectionTimeout) = 20;
  Item(cdoSMTPAuthenticate) = cdoAnonymous;
  // the following line is meaningful with cdoSendUsingMethod
  // equal to cdoSendUsingPickup
  Item(cdoSMTPServerPickupDirectory) = "c:\Alternative Pickup"
  Update();
}
%>
These are the new configuration settings:
<% DisplayCfgTable(objCfg) %>
Now we are sending the message ... <BR>
<%
with (objMsg) {
   Configuration = objCfg;
   To       = strTo;
   From     = strFrom;
   Subject  = strSubject;
   TextBody = strBody;
   Send
}

delete objCfgFlds;
delete objCfg;
delete objMsg;
%>
We have sent a message to <%= strTo %>.<BR>
</BODY>
</HTML>

