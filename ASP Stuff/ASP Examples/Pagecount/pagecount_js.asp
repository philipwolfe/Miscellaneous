<%@ LANGUAGE="JScript" %>
<TITLE>Page Counter Component</TITLE>
<H2>Page Counter Component</H2><HR>
<%
var objPageCount = Server.CreateObject("MSWC.PageCounter");
var strSubmit = Request.Form("submit");
if (strSubmit=="Reset This Page") {
   objPageCount.Reset();
} else {
   if (strSubmit=="Reset VBS Page") {
      objPageCount.Reset("/ASP Prog Ref/Chapter 22/pagecount_vbs.asp");
   } else {
      objPageCount.PageHit();
   }
}
%>
<TABLE BORDER=0 CELLPADDING=10>
   <TR>
      <TD><B>This Page</B></TD>
      <TD><%= objPageCount.Hits() %></TD>
   </TR>
   <TR>
      <TD><B>VBScript Page</B></TD>
      <TD><%= objPageCount.Hits("/ASP Prog Ref/Chapter 22/pagecount_vbs.asp") %></TD>
</TABLE>

<FORM METHOD="POST" ACTION="pagecount_js.asp">
Reset the count for this page:&nbsp;&nbsp;
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="Reset This Page"><BR><BR>
Reset the count for pagecount_vbs.asp:
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="Reset VBS Page"><BR><BR>
Increment the count for this page:&nbsp;&nbsp;
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="Increment Count">
</FORM>