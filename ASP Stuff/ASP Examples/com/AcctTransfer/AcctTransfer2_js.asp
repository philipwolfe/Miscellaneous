<%@ LANGUAGE=JScript TRANSACTION=Required %>

<% 
TransAmount = Request.QueryString("Amount");
OrigAccountNum = Request.QueryString("OrigAcctNum");
DestAccountNum = Request.QueryString("DestAcctNum");

objTransfer = Server.CreateObject("BankTransfer.AcctTransfer");

objTransfer.Withdrawal(OrigAccountNum,TransAmount); 

objTransfer.Deposit(DestAccountNum,TransAmount); 

delete objTransfer;

// This subroutine is called when the transaction is committed
function OnTransactionCommit() {
   Response.Write("Transfer has succeeded");
}

// This subroutine is called when the transaction is aborted
function OnTransactionAbort() {
   Response.Write("Transfer has failed");
}

%>

