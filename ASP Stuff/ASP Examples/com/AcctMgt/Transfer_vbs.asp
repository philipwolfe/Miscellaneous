</HEAD>
<BODY>

<%
Dim OwnerName
Dim objAcctMgt
Dim rsAcctList

OwnerName = "John Smith"  ' Normally obtained via a query string

' Create the Bank.AcctMgt object
Set objAcctMgt = Server.CreateObject("Bank.AcctMgt") 

' Then get a list of the user's accounts
Set rsAcctList = objAcctMgt.GetAccountList(OwnerName)
%>
<P><FONT SIZE=6><EM>Welcome, <% =OwnerName %>,</EM></FONT></P>

<%
' Let the customer know whether their transfer worked or not.
If Request.QueryString("Commit") = "False" Then
   Response.Write "Sorry, your transfer failed to complete.<BR>"
Elseif Request.QueryString("Commit") = "True" Then
   Response.Write "Your transfer has succeeded.<BR>"
End If
%>

<P>Please specify your transfer details:</P>
<P>
<FORM NAME=AcctTransfer Action="DoTransfer_vbs.asp" METHOD=GET>
<TABLE border="0" cellPadding="1" cellSpacing="1" width="300">
 
  <TR>
    <TD>Amount</TD>
    <TD><INPUT Type=Text id=intAmount name=intAmount></TD></TR>
  <TR>
    <TD>Originating Account</TD>
    <TD><SELECT id=OrigAcct name=OrigAcct 
style="HEIGHT: 22px; WIDTH: 154px">
<%
   While Not rsAcctList.EOF 
%>
      <OPTION value=<%= rsAcctList.Fields("AcctID") %>> 
<%= rsAcctList.Fields("AcctType") %>
      </OPTION>
<%      rsAcctList.MoveNext
   Wend 
%>
     
   </SELECT></TD>
   </TR>
   <TR>
    <TD>Destination Account</TD>
    <TD><SELECT id=DestAcct name=DestAcct style="HEIGHT: 22px; WIDTH: 154px">
<%
   rsAcctList.MoveFirst
   While Not rsAcctList.EOF
%>
      <OPTION value= <%= rsAcctList.Fields("AcctID") %> > 
<%= rsAcctList.Fields("AcctType") %>
      </OPTION> 
<%
      rsAcctList.MoveNext
   Wend
%>

</SELECT></TD></TR></TABLE></P>
<INPUT type="Submit" value="Execute Transfer" 
id=btnExecute name=btnExcute>
</FORM>

</BODY>
</HTML>
