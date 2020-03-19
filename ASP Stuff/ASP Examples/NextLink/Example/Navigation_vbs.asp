<html>
  <head>
    <title>Content Linking Component</title>
  <head>

  <body>
<%
   Set objNextLink = Server.CreateObject("MSWC.NextLink")
   strListFile = "contlink.txt"
   intListIndex = objNextLink.GetListIndex(strListFile)
   intListCount = objNextLink.GetListCount(strListFile)
%>
<H1>Page <%= intListIndex %> of <%= intListCount %></H1><HR>
<FORM>
<%
   If intListIndex > 1 Then 
%> 
      <INPUT TYPE=BUTTON VALUE="|<< Start" 
             ONCLICK="location='<% = objNextLink.GetNthURL(strListFile, 1) %>';">

      <INPUT TYPE=BUTTON VALUE="< Back" 
             ONCLICK="location='<% = objNextLink.GetPreviousURL(strListFile) %>';">
<% 
   End If 
   If intListIndex < intListCount Then 
%> 
      <INPUT TYPE=BUTTON VALUE="Next >" 
             ONCLICK="location='<%= objNextLink.GetNextURL(strListFile)  %>';">

      <INPUT TYPE=BUTTON VALUE="End >>|" 
             ONCLICK="location='<% = objNextLink.GetNthURL(strListFile, intListCount) %>';">
<% 
   End If 
%>
</FORM>
 <body>
<html>