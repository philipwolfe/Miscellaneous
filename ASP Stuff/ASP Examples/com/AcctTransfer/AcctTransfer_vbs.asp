<%@ LANGUAGE=VBScript TRANSACTION=Required %>
<%
Dim objTransfer, TransAmount, OrigAccountNum, DestAccountNum

'Get information passed in from the Account Transfer request form page
TransAmount = Request.QueryString("Amount")
OrigAccountNum = Request.QueryString("OrigAcctNum")
DestAccountNum = Request.QueryString("DestAcctNum")

' Create our COM+ object that is used for transfers
Set objTransfer = Server.CreateObject("BankTransfer.AcctTransfer")

' First, try to deduct the money using the Withdrawal method
If objTransfer.Withdrawal(CInt(OrigAccountNum),
                          CInt(TransAmount)) <> 0 Then
   ObjectContext.SetAbort    ' Rollback transaction if Withdrawal fails, 

' If the Withdrawal succeeds, deposit the money using Deposit method
   Response.Write "Withdrawal Aborted"
Elseif  objTransfer.Deposit(CInt(DestAccountNum),
                            CInt(TransAmount)) <> 0 Then
   ObjectContext.SetAbort       ' Rollback transaction if Deposit fails, 
   Response.Write "Aborted"
Else
   ObjectContext.SetComplete    ' Commit transaction when both succeed   
   Response.Write "Succeeded"
End If

Set objTransfer = Nothing
%>
