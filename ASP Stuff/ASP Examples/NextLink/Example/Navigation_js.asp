<%@ LANGUAGE="JScript" %>
<html>
  <head>
    <title>Content Linking Component</title>
  <head>

  <body>
<%
   var objNextLink = Server.CreateObject("MSWC.NextLink");
   var strListFile = "contlink.txt";
   var intListIndex = objNextLink.GetListIndex(strListFile);
   var intListCount = objNextLink.GetListCount(strListFile);
%>
<H1>Page <%= intListIndex %> of <%= intListCount %></H1><HR>
<FORM>
<%
   if (intListIndex > 1) { 
%> 
      <INPUT TYPE=BUTTON VALUE="|<< Start" 
             ONCLICK="location='<% = objNextLink.GetNthURL(strListFile, 1) %>';">

      <INPUT TYPE=BUTTON VALUE="< Back" 
             ONCLICK="location='<% = objNextLink.GetPreviousURL(strListFile) %>';">
<% 
   } 
   if (intListIndex < intListCount) { 
%> 
      <INPUT TYPE=BUTTON VALUE="Next >" 
             ONCLICK="location='<%= objNextLink.GetNextURL(strListFile)  %>';">

      <INPUT TYPE=BUTTON VALUE="End >>|" 
             ONCLICK="location='<% = objNextLink.GetNthURL(strListFile, intListCount) %>';">
<% 
   } 
%>
</FORM>
 <body>
<html>