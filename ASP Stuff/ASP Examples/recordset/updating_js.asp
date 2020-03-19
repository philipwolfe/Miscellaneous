<%@ LANGUAGE = JScript %>
<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>Changing Data Using a Recordset</TITLE>
<%
var strConnect = Application("DBConnection");
dbConnection = Server.CreateObject("ADODB.Connection");
rsExample = Server.CreateObject("ADODB.Recordset");
dbConnection.Open(strConnect);

rsExample.Open("SELECT title_id, title, price FROM titles", 
           dbConnection, adOpenDynamic, adLockOptimistic, adCmdText);

rsExample.Find("title_id = 'PC1035'");
if (!rsExample.EOF) {
   rsExample("title") = "This is the new title";
   rsExample("price") = 125.00;
   rsExample.Update();
}

rsExample.AddNew();
rsExample("title_id") = "BF1234";
rsExample("title") = "ASP Prog Ref 3.0";
rsExample("price") = 29.95;
rsExample.Update();

rsExample.MoveFirst();
var strTable = rsExample.GetString(adClipString, -1, "</TD><TD>",
                                   "</TD></TR><TR><TD>");
strTable = strTable.substring(0,strTable.length - 8); 
Response.Write("<TABLE BORDER=1><TR><TD>" + strTable + "</TABLE><HR>");

rsExample.Close();
dbConnection.Close();  
delete rsExample;
delete dbConnection;
%>
