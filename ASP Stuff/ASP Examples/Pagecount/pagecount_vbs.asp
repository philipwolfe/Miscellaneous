<TITLE>Page Counter Component</TITLE>
<H2>Page Counter Component</H2><HR>
<%
Dim objPageCount, strSubmit
Set objPageCount = Server.CreateObject("MSWC.PageCounter")
strSubmit = Request.Form("submit")
If strSubmit = "Reset This Page" Then
   objPageCount.Reset
ElseIf strSubmit = "Reset JS Page" Then
   objPageCount.Reset "/ASP Prog Ref/Chapter 22/pagecount_js.asp"
Else
   objPageCount.PageHit
End If

%>
<TABLE BORDER=0 CELLPADDING=10>
   <TR>
      <TD><B>This Page</B></TD>
      <TD><%= objPageCount.Hits() %></TD>
   </TR>
   <TR>
      <TD><B>JScript Page</B></TD>
      <TD><%= objPageCount.Hits("/ASP Prog Ref/Chapter 22/pagecount_js.asp") %></TD>
</TABLE>

<FORM METHOD="POST" ACTION="pagecount_vbs.asp">
Reset the count for this page:&nbsp;&nbsp;
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="Reset This Page"><BR><BR>
Reset the count for pagecount_js.asp:
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="Reset JS Page"><BR><BR>
Increment the count for this page:&nbsp;&nbsp;
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="Increment Count">
</FORM>