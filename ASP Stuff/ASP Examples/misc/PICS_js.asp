<%@ LANGUAGE="JScript" %>
<%
// JScript
var strPicsLabel = '(PICS-1.0 "http://www.rsac.org/ratingsv01.html"' +
                   ' l gen true comment "RSACi North America Server"' +
                   ' for "http://yoursite.com" on ' +  
                   '"1999.08.01T03:04-0500" r (n 0 s 0 v 2 l 3))';
Response.Pics(strPicsLabel);
%>

