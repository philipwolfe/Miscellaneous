<%
Option Explicit
Dim objMsg, strFrom, strTo, strSubject, strBody
%>
<HTML>
<HEAD>
<TITLE>CDONTS Sample #2 - Working with MHTML</TITLE>
</HEAD>
<BODY>
<%
strFrom="""User 1"" <user.1@dev02>"
strTo="""User 33"" <user.33@test-server>"
strSubject = "With compliments"

strBody = "<HTML><HEAD><TITLE>With compliments</TITLE></HEAD>" & _
          "<BODY><P><IMG src=""the_wrox_logo.gif""></P>" & _
          "<P><FONT color=red size=5> With authors' and " & _
          "publisher's compliments.</FONT></P>" & _
          "<P><FONT color=black><EM>" & _
          "The ""ASP 3.0 Programmer's Reference"" Team" & _
          "</EM></FONT></P></BODY></HTML>"

Set objMsg = Server.CreateObject("CDONTS.NewMail")

With objMsg
   .To = strTo
   .From = strFrom
   .Subject = strSubject
   .MailFormat = CdoMailFormatMime
   .BodyFormat = CdoBodyFormatHTML
   .Body = strBody
   .AttachURL "C:\ASP Prog Ref\Chapter 39\wrox_logo100.gif", "the_wrox_logo.gif"
   .Send
End With

Set objMsg = nothing
%>
We have sent a MHTML message to <%= strTo %>.
<BR>
</BODY>
</HTML>