<%@ LANGUAGE = VBScript %>
<!--METADATA TYPE="typelib" NAME="CDO for Windows 2000 Type Library"
             UUID="CD000000-8B95-11D1-82DB-00C04FB1625D" -->
<!--METADATA TYPE="typelib"  NAME="ADODB Type Library"
             UUID="00000205-0000-0010-8000-00AA006D2EA4" -->

<%
Option Explicit
Dim objCfg, objMsg, objCfgFlds, strFrom, strTo, strSubject, strBody

strFrom="a.vip@vips.com"
strTo="""User 33"" <user33@test-server>"
strSubject = "This is the subject"
strBody= "This is the body."

Set objMsg = CreateObject("CDO.Message")
Set objCfg = CreateObject("CDO.Configuration")
Set objCfgFlds = objCfg.Fields

With objCfgFlds
   .Item("http://schemas.microsoft.com/cdo/configuration/sendusing") = 2 ' cdoSendUsingPort
   .Item("http://schemas.microsoft.com/cdo/configuration/smtpserver") _
         = "jennyw"
   .Item("http://schemas.microsoft.com/cdo/configuration/" & _
         "smtpauthenticate") = 0 ' cdoAnonymous
   .Update
End With
Set objCfgFlds = Nothing

' Response.Write cdoSendUsingPort & " - http://schemas.microsoft.com/cdo/configuration/sendusing ?"

With objMsg
   Set .Configuration = objCfg
   .To       = strTo
   .From     = strFrom
   .Subject  = strSubject
   .TextBody = strBody
   .Fields.Item("urn:schemas:httpmail:importance") = 0 ' cdoLow
   .Fields.Update
   .Send
End With

Set objCfg = Nothing
Set objMsg = Nothing
%>