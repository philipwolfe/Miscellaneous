<%
If not Request.Form("message")="" THEN
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
Application("txt1") = "<B>" & Request.Cookies("nick") & ":</B> " & Request.Form("message")
APPLICATION.UNLOCK
END IF
%>
<HTML>
<HEAD><TITLE>Message Page</TITLE></HEAD>
<BODY BGCOLOR="#006699" TEXT="#FFFFFF" LINK="#FF0000">
<FORM METHOD="POST" ACTION="message.asp">
<FONT SIZE=2>Type your message and click send.</FONT><BR>
<TABLE BORDER=0 CELLSPACING=0>
<TR>
<TD>
<INPUT NAME="message" TYPE="TEXT" SIZE=30>
</TD>
<TD>
<INPUT TYPE="IMAGE" SRC="send.gif" WIDTH=40 HEIGHT=24 BORDER=0>
</TD><TD>&nbsp;</TD>
<TD VALIGN=TOP>
<A HREF="logoff.asp" TARGET="_top"><IMG SRC="exit.gif" WIDTH=35 HEIGHT=26 BORDER=0></A>
</TD>
</TABLE></FORM>
</BODY>
</HTML>