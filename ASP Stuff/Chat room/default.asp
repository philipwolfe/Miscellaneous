<%
IF len(Request.Cookies("nick")) = 0 AND len(Request.Form("nick")) = 0 THEN
%>
<HTML>
<HEAD>
<TITLE>Chat Login</TITLE>
</HEAD>
<BODY BGCOLOR="#FFFFFF" TEXT="#000000" LINK="#FF0000" VLINK="#FF0000">
<BR>
<CENTER>Type in your nickname:</CENTER>
<FORM METHOD="POST" ACTION="default.asp">
<CENTER><INPUT NAME="nick" TYPE="TEXT" SIZE=10></CENTER>
<CENTER><INPUT TYPE="SUBMIT" VALUE="Enter chat"></CENTER>
</BODY>
</HTML>
<%
ELSE
Response.Cookies("Nick")=Request.Form("nick")
APPLICATION.LOCK

Application("txt10") = Application("txt9")
Application("txt9") = Application("txt8")
Application("txt8") = Application("txt7")
Application("txt7") = Application("txt6")
Application("txt6") = Application("txt5")
Application("txt5") = Application("txt4")
Application("txt4") = Application("txt3")
Application("txt3") = Application("txt2")
Application("txt2") = Application("txt1")
Application("txt1") = "<FONT COLOR=""#0000FF"">** " & Request.Form("nick") & " enters chatroom **</FONT>"
APPLICATION.UNLOCK
%>

<HTML>
<HEAD><TITLE>** VBChat v. 1.0 **</TITLE></HEAD>
<FRAMESET ROWS="180,70" FRAMEBORDER="0" BORDER="false">
<FRAME SRC="display.asp" SCROLLING="auto">
<FRAME SRC="message.asp" SCROLLING="no">
</FRAMESET>
</HTML>
<%
END IF
%>