<%@ LANGUAGE = VBScript %>
<!--METADATA TYPE="typelib" NAME="CDO for Windows 2000 Type Library"
             UUID="CD000000-8B95-11D1-82DB-00C04FB1625D" -->
<!--METADATA TYPE="typelib" NAME="ADODB Type Library"
             UUID="00000205-0000-0010-8000-00AA006D2EA4" -->
<%
Option Explicit

Sub CreateAndSaveMessageTemplate( path )
   Const  strFrom="""User 1"" <user1@dev02>"
   Const  strSubject = "This is the subject"
   Const  strBody= "This is the body."

   Dim objCfg, objMsg, objCfgFlds, objStream, itfDatasource

   Set objMsg = Server.CreateObject("CDO.Message")
   Set objCfg = Server.CreateObject("CDO.Configuration")

   objCfg.Load cdoIIS
   Set objCfgFlds = objCfg.Fields
   
   With objCfgFlds
      .Item(cdoSendUsingMethod) = cdoSendUsingPort
      .Item(cdoSMTPServer) = "test-server"
      .Item(cdoSMTPConnectionTimeout) = 20
      .Item(cdoSMTPAuthenticate) = cdoAnonymous
      .Update
   End With

   With objMsg
      Set .Configuration = objCfg
      .Sender   = strFrom
      .From     = strFrom
      .Subject  = strSubject
      .TextBody = strBody
   End With

   Set objStream = Server.CreateObject("ADODB.Stream")
   objStream.Open
   objStream.Type = adTypeText
   objStream.Charset = "US-ASCII"

   Set itfDatasource = objMsg.DataSource
   itfDatasource.SaveToObject objStream, CdoInterfaces.cdoAdoStream

   objStream.SaveToFile path, adSaveCreateOverWrite
   
   Set objStream = Nothing
   Set itfDatasource = Nothing
   Set objCfgFlds = Nothing
   Set objCfg = Nothing
   Set objMsg = Nothing
End Sub

Function GetMessageTemplateFromFile (path)
   Dim objStream, objMsg, itfDatasource

   Set objStream = Server.CreateObject("ADODB.Stream")
   objStream.Open
   objStream.LoadFromFile path
   Set objMsg = Server.CreateObject("CDO.Message")
   Set itfDatasource = objMsg.DataSource
   itfDatasource.OpenObject objStream, CdoInterfaces.cdoAdoStream
   Set GetMessageTemplateFromFile = objMsg
   Set objStream = Nothing
End Function

Const  strTemplatePath = "C:\CDO2000MsgTemplate.eml"

Dim strTo, objMsg
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
CreateAndSaveMessageTemplate(strTemplatePath)
%>
Now we are loading our template from file, setting the 
recipient and sending it ...<BR><BR>

<%
strTo="""User 33"" <user33@test-server>"
Set objMsg = GetMessageTemplateFromFile(strTemplatePath)
With objMsg
   .To = strTo
   .Send
End With
Set objMsg = Nothing
%>

We have sent a message to <% = strTo %>.
</BODY>
</HTML>
