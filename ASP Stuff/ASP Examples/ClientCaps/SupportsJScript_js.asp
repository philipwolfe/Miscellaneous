<%@ LANGUAGE="JScript" %>
<%
var objBrowscap = Server.CreateObject("MSWC.BrowserType");
if (objBrowscap.javascript) {
   Response.Write("JavaScript supported. " +
                  "You will be redirected to a different version of the site.")
   Response.Redirect("new/dhtml.asp");
} else {
   Response.Write("JavaScript is not supported. " +
                  "You will be redirected to the plain HTML version of the site.");
   Response.Redirect("old/plain.asp");
}

%>