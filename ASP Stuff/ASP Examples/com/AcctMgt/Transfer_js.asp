<%@ LANGUAGE=JScript TRANSACTION=Required %>
<% Response.buffer = false %>
<HTML>
<HEAD>
<TITLE>Account Transfer Page</TITLE>
</HEAD>
<BODY>

<%
OwnerName = "John Smith";  // Normally obtained via a query string

// Create the Bank.AcctMgt object
objAcctMgt = Server.CreateObject("Bank.AcctMgt"); 

// Then get a list of the user's accounts
rsAcctList = objAcctMgt.GetAccountList(OwnerName);
%>
<P><FONT SIZE=6><EM>Welcome, <% =OwnerName %>,</EM></FONT></P>

<%
// Let the customer know whether their transfer worked or not.
if (Request.QueryString("Commit") == "False") {
   Response.Write("Sorry, your transfer failed to complete.<BR>");
} else {
   Response.Write("Your transfer has succeeded.<BR>");
}
%>

<P>Please specify your transfer details:</P>
<P>
<FORM NAME=AcctTransfer Action="DoTransfer_js.asp" METHOD=GET>
<TABLE border="0" cellPadding="1" cellSpacing="1" width="300">
 
  <TR>
    <TD>Amount</TD>
    <TD><INPUT Type=Text id=intAmount name=intAmount></TD></TR>
  <TR>
    <TD>Originating Account</TD>
    <TD><SELECT id=OrigAcct name=OrigAcct style="HEIGHT: 22px; WIDTH: 154px">
<%
   while (!rsAcctList.EOF) { 
%>
      <OPTION value=<%= rsAcctList.Fields("AcctID") %>> <%= rsAcctList.Fields("AcctType") %>
      </OPTION>
<%      rsAcctList.MoveNext();
   } 
%>
     
   </SELECT></TD>
   </TR>
   <TR>
    <TD>Destination Account</TD>
    <TD><SELECT id=DestAcct name=DestAcct style="HEIGHT: 22px; WIDTH: 154px">
<%
   rsAcctList.MoveFirst();
   while (!rsAcctList.EOF) {
%>
      <OPTION value= <%= rsAcctList.Fields("AcctID") %> > 
<%= rsAcctList.Fields("AcctType") %>
      </OPTION> 
<%
      rsAcctList.MoveNext();
   }
%>

</SELECT></TD></TR></TABLE></P>
<INPUT type="Submit" value="Execute Transfer" 
id=btnExecute name=btnExcute>
</FORM>

</BODY>
</HTML>
