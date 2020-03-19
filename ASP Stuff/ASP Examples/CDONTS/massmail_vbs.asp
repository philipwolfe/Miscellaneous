<%
Option Explicit

Dim objMsg, strFrom, strTo, strCc, strBcc, strSubject, strBody
%>

<HTML>
<HEAD>
<TITLE>CDONTS Sample #5 - Mass E-mailing</TITLE>
</HEAD>
<BODY >

<%
strFrom = """Newsletter manager"" <news.mng@dev02>"
strTo = """Our newsletter subscribers"" <newsletter@dev02>"
strCc = """Newsletter manager"" <news.mng@dev02>"
strSubject = "This is the newsletter subject"
strBody = "This is the newsletter body"

strBcc = """User 33"" <user.33@domain1.com>;" & _
         """User 98"" <user.98@domain1.com>;" & _
         """User 16"" <user.16@domain2.com>;" & _
         """User 25"" <user.25@domain3.com>;"

Set objMsg = Server.CreateObject("CDONTS.NewMail")

With objMsg
   .To = strTo
   .From = strFrom
   .Cc = strCc
   .Bcc = strBcc
   .Subject = strSubject
   .Body = strBody
   .Send
End With

Set objMsg = nothing
%>
We have mass-e-mailed our newsletter to <%= strBcc %>.
<BR>
</BODY>
</HTML>