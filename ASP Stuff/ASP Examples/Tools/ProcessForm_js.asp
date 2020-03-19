<%@ LANGUAGE="JScript" %>
<TITLE>The Tools.ProcessForm Method</TITLE>
<%
objTools = Server.CreateObject("MSWC.Tools");
objTools.ProcessForm("/ASP Prog Ref/Chapter 24/output.asp",
                     "/ASP Prog Ref/Chapter 24/template.asp");
Server.Transfer("output.asp");
%>
