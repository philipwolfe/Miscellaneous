<%@ LANGUAGE = VBScript %>
<!--METADATA TYPE="typelib" UUID="CD000000-8B95-11D1-82DB-00C04FB1625D"
   NAME="CDO for Windows 2000 Type Library" -->
<!--METADATA TYPE="typelib" UUID="00000205-0000-0010-8000-00AA006D2EA4"
   NAME="ADODB Type Library" -->

<%
Option Explicit

Sub DisplayCfgTable( cfgObj )
Dim strTableHeader, strTableFooter
   strTableHeader = "<P><TABLE WIDTH=""100%"" BORDER=""1""" & _
                     "BGCOLOR=""Silver"" CELLSPACING=""1"" " & _
                     "CELLPADDING=""1""><TR bgcolor=""Yellow"">" & _
                     "<TD><B>Field</B></TD><TD><B>Value</B></TD></TR>"
   strTableFooter = "</TABLE><P>"

   Response.Write strTableHeader

   Dim field
   For Each field In cfgObj.Fields
      Response.Write "<TR><TD>" & field.Name & "</TD>"
      Response.Write "<TD>" & CStr(field.Value) & "</TD></TR>"
   Next

   Response.Write strTableFooter
End Sub

Dim objCfg, objMsg, objCfgFlds, strFrom, strTo, strSubject, strBody
%>

<HTML>
<HEAD>
<TITLE>CDO2000 sample 1 - Sending a simple message</TITLE>
</HEAD>
<BODY>

<%
strFrom = """User 1"" <user1@dev02>"
strTo = """User 33"" <user33@test-server>"
strSubject = "This is the subject"
strBody = "This is the body."

Set objMsg = Server.CreateObject("CDO.Message")
Set objCfg = Server.CreateObject("CDO.Configuration")
objCfg.Load cdoIIS
%>

These are the default IIS/SMTP configuration settings:
<% DisplayCfgTable(objCfg) %>

Now we are changing the configuration ...<BR>
<%
Set objCfgFlds = objCfg.Fields
With objCfgFlds
  .Item(cdoSendUsingMethod) = cdoSendUsingPort
  .Item(cdoSMTPServer) = "test-server"
  .Item(cdoSMTPConnectionTimeout) = 20
  .Item(cdoSMTPAuthenticate) = cdoAnonymous
  ' the following line is meaningful with cdoSendUsingMethod equal to
  ' cdoSendUsingPickup
  .Item(cdoSMTPServerPickupDirectory) = "c:\Alternative Pickup"
  .Update
End With
%>
These are the new configuration settings:
<% DisplayCfgTable(objCfg) %>
Now we are sending the message ... <BR>
<%
With objMsg
   Set .Configuration = objCfg
   .To       = strTo
   .From     = strFrom
   .Subject  = strSubject
   .TextBody = strBody
   .Send
End With

Set objCfgFlds = Nothing
Set objCfg = Nothing
Set objMsg = Nothing
%>
We have sent a message to <%= strTo %>.<BR>
</BODY>
</HTML>

