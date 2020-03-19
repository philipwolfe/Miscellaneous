<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="Cookie" NAME="Browscap" SRC="clientCaps.htm" -->
<%
  objBrowserType = Server.CreateObject("MSWC.BrowserType");
  Response.Write (objBrowserType.Value("vbscript"));

  blnJava=objBrowserType.Value("javaEnabled");
  Response.Write ("Java Enabled? = " + blnJava);
%>