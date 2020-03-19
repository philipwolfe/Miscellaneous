<%
'Henter nick
nickname = Request.Cookies("Nick")
nickname_entry = nickname & "#"

Response.Cookies("Nick")=""
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
Application("txt1") = "<FONT COLOR=""#00C800"">** " & nickname & " leaves chatroom **</FONT>"
APPLICATION.UNLOCK

%>
<HTML>
<HEAD>
<script language="JavaScript">
{close();}
</SCRIPT>
</HEAD>
<BODY>
</BODY>
</HTML>