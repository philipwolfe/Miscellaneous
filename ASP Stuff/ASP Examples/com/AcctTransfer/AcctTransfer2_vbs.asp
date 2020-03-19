<%@ LANGUAGE=VBScript TRANSACTION=Required %>

<% 
Dim objTransfer, TransAmount, OrigAccountNum, DestAccountNum

TransAmount = Request.QueryString("Amount")
OrigAccountNum = Request.QueryString("OrigAcctNum")
DestAccountNum = Request.QueryString("DestAcctNum")

Set objTransfer = Server.CreateObject("BankTransfer.AcctTransfer")

objTransfer.Withdrawal CInt(OrigAccountNum),CInt(TransAmount) 

objTransfer.Deposit CInt(DestAccountNum),CInt(TransAmount) 

Set objTransfer = Nothing

'// This subroutine is called when the transaction is committed
Sub OnTransactionCommit()
   Response.Write "Transfer has succeeded"
End Sub

'// This subroutine is called when the transaction is aborted
Sub OnTransactionAbort()
   Response.Write "Transfer has failed"
End Sub
%>
