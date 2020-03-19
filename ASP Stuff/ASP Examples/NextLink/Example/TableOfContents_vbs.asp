<html>
<HEAD>
<H1>ASP 3.0 Programmer's Reference</H1><HR>
<%
Set objNextLink = Server.CreateObject("MSWC.NextLink")
strListFile = "contlink.txt"
intListCount = objNextLink.GetListCount(strListFile)
%>
</head>
<body>
<TABLE CELLSPACING=10>
   <TH><TR>
      <TD><B>Section</B></TD>
      <TD><B>Title</B></TD>
   </TR></TH>
   <TBODY>
<%
      For intCount = 1 To intListCount
%>
         <TR>
            <TD><%= intCount %></TD>
            <TD>
               <A HREF="<%= objNextLink.GetNthURL(strListFile, intCount) %>">
                  <%= objNextLink.GetNthDescription(strListFile, intCount) %>
               </A>
            </TD>
         </TR>
<%
      Next
%>
   </TBODY>
</TABLE>

</body>
</html>