<%
  Dim objBrowserType
  Set objBrowserType = Server.CreateObject("MSWC.BrowserType")
  Response.Write objBrowserType.Value("vbscript")
%>