<%@ LANGUAGE = JScript %>
<!--METADATA TYPE="typelib" NAME="CDO for Windows 2000 Type Library"
             UUID="CD000000-8B95-11D1-82DB-00C04FB1625D" -->
<!--METADATA TYPE="typelib" NAME="ADODB Type Library"
             UUID="00000205-0000-0010-8000-00AA006D2EA4" -->
<%
function CreateAndSaveMessageTemplate(path) {
   strFrom="\"User 1\" <user1@dev02>";
   strSubject = "This is the subject";
   strBody= "This is the body.";

   objMsg = Server.CreateObject("CDO.Message");
   objCfg = Server.CreateObject("CDO.Configuration");

   objCfg.Load(cdoIIS);
   objCfgFlds = objCfg.Fields;
   
   with (objCfgFlds) {
      Item(cdoSendUsingMethod) = cdoSendUsingPort;
      Item(cdoSMTPServer) = "test-server";
      Item(cdoSMTPConnectionTimeout) = 20;
      Item(cdoSMTPAuthenticate) = cdoAnonymous;
      Update();
   }

   with (objMsg) {
      Configuration = objCfg;
      Sender   = strFrom;
      From     = strFrom;
      Subject  = strSubject;
      TextBody = strBody;
   }

   objStream = Server.CreateObject("ADODB.Stream");
   objStream.Open();
   objStream.Type = adTypeText;
   objStream.Charset = "US-ASCII";

   itfDatasource = objMsg.DataSource;
   itfDatasource.SaveToObject(objStream, 
                              CdoInterfaces.cdoAdoStream);

   objStream.SaveToFile(path, adSaveCreateOverWrite);
   
   delete objStream;
   delete itfDatasource;
   delete objCfgFlds;
   delete objCfg;
   delete objMsg;
}

function GetMessageTemplateFromFile(path) {
   objStream = Server.CreateObject("ADODB.Stream");
   objStream.Open();
   objStream.LoadFromFile(path);
   objMsg = Server.CreateObject("CDO.Message");
   itfDatasource = objMsg.DataSource;
   itfDatasource.OpenObject(objStream, CdoInterfaces.cdoAdoStream);
   return objMsg;
   delete(objStream);
}

strTemplatePath = "C:\\CDO2000MsgTemplate.eml"
%>

<HTML>
<HEAD>
<TITLE>CDO2000 Sample #6 - Loading/saving messages from/to 
ADO Stream objects</TITLE>
</HEAD>
<BODY>

We are creating and saving to a file. This message template
hasn't got a recipient ...<BR><BR>

<% 
CreateAndSaveMessageTemplate(strTemplatePath);
%>
Now we are loading our template from file, setting the 
recipient and sending it ...<BR><BR>

<%
strTo="\"User 33\" <user33@test-server>"
objMsg = GetMessageTemplateFromFile(strTemplatePath);


with (objMsg) {
   To = strTo;
   Send();
}
delete objMsg;
%>

We have sent a message to <% = strTo %>.
</BODY>
</HTML>
