<%@ LANGUAGE="JScript" %>
<TITLE>The Counters Component</TITLE>
<% 
Response.expires=-1000;
strURL=String(Request.QueryString("url"));
switch (strURL) {
   case "http://www.wrox.com":
      objCounters.Increment("wrox");
      break;
   case "http://www.asptoday.com":
      objCounters.Increment("ASPToday");
      break;
   default:
      Response.write(strURL);
}
%>
<H3>Current values for the Counters Component</H3>
<TABLE CELLPADDING=10>
   <TR>
      <TD>Wrox Press</TD>
      <TD><%= objCounters.Get("Wrox") %></TD>
   </TR>
   <TR>
      <TD>ASPToday</TD>
      <TD><%= objCounters.Get("ASPToday") %></TD>
   </TR>
</TABLE>