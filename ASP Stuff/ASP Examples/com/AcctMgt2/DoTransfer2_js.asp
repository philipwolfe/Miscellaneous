<%@ LANGUAGE=JScript TRANSACTION=Required %>

<%
// Get the information from the query string
intOrigAcct = Request.QueryString("OrigAcct");
intDestAcct = Request.QueryString("DestAcct");
intAmount = Request.QueryString("intAmount");

// Create the object
objAcctMgt = server.CreateObject("Bank.AcctMgt2");

// Call the method to transfer the money
objAcctMgt.TransferMoney(intOrigAcct,intDestAcct,intAmount);

// Release the object
delete objAcctMgt;

function OnTransactionCommit() {
   Response.Redirect("Transfer2_js.asp?Commit=True");
}

function OnTransactionAbort() {
 Response.Redirect("Transfer2_js.asp?Commit=False");
}

%>
