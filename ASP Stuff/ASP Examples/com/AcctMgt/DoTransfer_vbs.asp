<%@ LANGUAGE=VBScript TRANSACTION=Required %>

<%
Dim objAcctMgt
Dim intOrigAcct
Dim intDestAcct
Dim intAmount

' Get the information from the query string
intOrigAcct = Request.QueryString("OrigAcct")
intDestAcct = Request.QueryString("DestAcct")
intAmount = Request.QueryString("intAmount")

' Create the object
Set objAcctMgt = server.CreateObject("Bank.AcctMgt")

' Call the method to transfer the money
objAcctMgt.TransferMoney intOrigAcct,intDestAcct,intAmount

' Release the object
Set objAcctMgt = nothing

Sub OnTransactionCommit()
   Response.Redirect "Transfer_vbs.asp?Commit=True"
End Sub

Sub OnTransactionAbort()
 Response.Redirect "Transfer_vbs.asp?Commit=False"
End Sub

%>
