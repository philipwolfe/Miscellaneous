<%@ LANGUAGE="JScript"%>
<html>
  <head>
    <title>Site Map</title>
  <head>

  <body>
<%
  var objNextLink = Server.CreateObject('MSWC.Nextlink');

  intCount = objNextLink.GetListCount('contlink.txt');

  for (i=1; i<=intCount; i++) {
%>
   <A HREF="<%= objNextLink.GetNthURL('contlink.txt', i) %>">
      <%= objNextLink.GetNthDescription('contlink.txt', i) %>  
   </A>
   <br>
<% 
  } 
%>

 <body>
<html>