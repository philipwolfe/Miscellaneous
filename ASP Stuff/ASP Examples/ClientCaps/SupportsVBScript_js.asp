<%@ LANGUAGE="JScript" %>
<%
var objBrowserType = Server.CreateObject('MSWC.BrowserType');
Response.Write(objBrowserType.Value('vbscript'));
%>