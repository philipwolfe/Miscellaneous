<html>
  <head>
    <title>Site Map</title>
  <head>

  <body>
<%
  Dim objNextLink 
  Set objNextLink = Server.CreateObject("MSWC.Nextlink") 

  intCount = objNextLink.GetListCount("contlink.txt")

  For intLoop = 1 To intCount
%>
  <A HREF="<% = objNextLink.GetNthURL("contlink.txt", intLoop) %>">
    <% = objNextLink.GetNthDescription("contlink.txt", intLoop) %>
    <br>
  </A>
<%
  Next 
%>

 <body>
<html>