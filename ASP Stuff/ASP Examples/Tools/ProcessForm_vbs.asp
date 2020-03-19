<TITLE>The Tools.ProcessForm Method</TITLE>
<%
Set objTools = Server.CreateObject("MSWC.Tools")
objTools.ProcessForm "/ASP Prog Ref/Chapter 24/output.asp","/ASP Prog Ref/Chapter 24/template.asp"
Server.transfer "output.asp"
%>