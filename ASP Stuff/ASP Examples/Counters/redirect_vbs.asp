<TITLE>The Counters Component</TITLE>
<% 
Response.expires=-1000
strURL=Request.QueryString("url")
Select Case strURL
   Case "http://www.wrox.com"
      objCounters.Increment "wrox"
   Case "http://www.asptoday.com"
      objCounters.Increment "ASPToday"
End Select
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