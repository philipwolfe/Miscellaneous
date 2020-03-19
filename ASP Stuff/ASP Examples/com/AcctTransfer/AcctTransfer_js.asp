<%@ LANGUAGE=JScript TRANSACTION=Required %>
<%
/*Get the information that was passed in from 
the Account Transfer request form page*/
TransAmount = Request.QueryString("Amount");
OrigAccountNum = Request.QueryString("OrigAcctNum");
DestAccountNum = Request.QueryString("DestAcctNum");

// Create our COM+ object that is used for transfers
objTransfer = Server.CreateObject("BankTransfer.AcctTransfer");

// First, try to deduct the money using the Withdrawal method
if (objTransfer.Withdrawal(OrigAccountNum,
                          TransAmount) != 0) {
   ObjectContext.SetAbort();      // Rollback transaction if Withdrawal fails, 

// If the Withdrawal method succeeds, deposit the money using the Deposit method
   Response.Write("Withdrawal Aborted");
} else {

   if (objTransfer.Deposit(DestAccountNum,TransAmount) != 0) {
      ObjectContext.SetAbort();    // Rollback transaction if Deposit fails 
      Response.Write("Aborted");
   } else {
      ObjectContext.SetComplete(); // Commit transaction when both succeed
           Response.Write("Succeeded");
   }

}
delete objTransfer
%>
