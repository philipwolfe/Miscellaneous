<%@ Language=VBScript %>
<%option explicit%>
<!--#include file="class.Browser.asp"-->
<HTML>
<HEAD>
<META NAME="GENERATOR" Content="Microsoft Visual Studio 6.0">
</HEAD>
<BODY>
<%
dim obj
set obj = new Browser

Response.Write "UserAgent: " & obj.UserAgent & "<br>"
Response.Write "Platform: " & obj.Platform & "<br>"
Response.Write "OS: " & obj.OS & "<br>"
Response.Write "Browser: " & obj.BrowserName & "<br>"
Response.Write "MajorVer: " & obj.MajorVer & "<br>"
Response.Write "MinorVer: " & obj.MinorVer & "<br>"
Response.Write "IsBeta: " & obj.IsBeta & "<br>"

set obj = nothing
%>
<P>&nbsp;</P>

</BODY>
</HTML>
