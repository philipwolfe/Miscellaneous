<%@ LANGUAGE="JScript" %>
<html>
<HEAD>
<H1>ASP 3.0 Programmer's Reference</H1><HR>
<%
var objNextLink = Server.CreateObject("MSWC.NextLink");
var strListFile = "contlink.txt";
var intListCount = objNextLink.GetListCount(strListFile);
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
      for (i=1; i<=intListCount; i++) {
%>
         <TR>
            <TD><%= i %></TD>
            <TD>
               <A HREF="<%= objNextLink.GetNthURL(strListFile, i) %>">
                  <%= objNextLink.GetNthDescription(strListFile, i) %>
               </A>
            </TD>
         </TR>
<%
      }
%>
   </TBODY>
</TABLE>
</body>
</html>