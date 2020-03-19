<%@ LANGUAGE = "JScript" %>
<!-- METADATA TYPE="typelib" 
              FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->
<TITLE>The New Command</TITLE>
<%
dbConnection = Server.CreateObject("ADODB.Connection");
dbConnection.Open("Provider=MSDataShape; Data Provider=NONE;");
var strSHAPE = "SHAPE APPEND " +
           "NEW adInteger AS ClientID, " +
           "NEW adVarChar(50) AS ClientName, " +
           "(( SHAPE APPEND " +
                  "NEW adVarChar(4) AS StockID, " + 
                  "NEW adVarChar(20) AS StockName, " +
                  "NEW adInteger AS ClientID) " +
            "RELATE ClientID TO ClientID) AS Portfolio";
rsParent = Server.CreateObject("ADODB.Recordset");
rsParent.CursorLocation = adUseClient;
rsParent.Open(strSHAPE, dbConnection, adOpenStatic, adLockOptimistic);

with (rsParent) { 
   AddNew();
   Fields("ClientID") = 1;
   Fields("ClientName") = "Chris Mawbey";
   Update();

   AddNew();
   Fields("ClientID") = 2;
   Fields("ClientName") = "Fenela Wills";
   Update();
}

rsChild = rsParent.Fields("Portfolio").Value;
with (rsChild) {
   AddNew();
   Fields("ClientID") = 1;
   Fields("StockID") = "AOL";
   Fields("StockName") = "America OnLine";
   Update();

   AddNew();
   Fields("ClientID") = 1;
   Fields("StockID") = "GE";
   Fields("StockName") = "General Electric";
   Update();

   AddNew();
   Fields("ClientID") = 2;
   Fields("StockID") = "CSCO";
   Fields("StockName") = "Cisco";
   Update();
}

Response.Write("<UL>\n");
rsParent.MoveFirst();
while (!rsParent.EOF) {
   Response.Write("<LI>" + rsParent("ClientID"));
   Response.Write(" - " + rsParent("ClientName") + "\n");
   Response.Write("<UL>Stock<UL>" + "\n");
   rsChild = rsParent.Fields("Portfolio").Value;
   while (!rsChild.EOF) {
      Response.Write("<LI>" + rsChild("StockID")); 
      Response.Write(" - " + rsChild("StockName") + "\n");
      rsChild.MoveNext();
   }
   Response.Write("</UL></UL>\n");
   rsParent.MoveNext();
}

Response.Write("</UL>");
rsParent.Close();
dbConnection.Close();   
delete rsParent;
delete dbConnection;
%>








