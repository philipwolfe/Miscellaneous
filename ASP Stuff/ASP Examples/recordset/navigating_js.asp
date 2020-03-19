<%@ LANGUAGE = JScript %>
<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>Navigating Through a Recordset</TITLE>
<%
var strConnect = Application("DBConnection");
dbConnection = Server.CreateObject("ADODB.Connection");
rsExample = Server.CreateObject("ADODB.Recordset");
dbConnection.Open(strConnect);

// Open a database table as a recordset
rsExample.Open("titles", dbConnection, adOpenStatic,
               adLockReadOnly, adCmdTable);

// Navigate through the entire table
while (!rsExample.EOF) {
   Response.Write(rsExample("Title") + "<BR>\n");
   rsExample.MoveNext();
}
Response.Write("<HR>\n");

// Display the table backwards
rsExample.MoveLast();
while (!rsExample.BOF) {
   Response.Write(rsExample("title_id") + "<BR>\n");
   rsExample.MovePrevious();
}
Response.Write("<HR>\n");

// Display every other record
rsExample.MoveFirst();
while (!rsExample.EOF) {
   Response.Write(rsExample("title") + "<BR>*** Skip One ***<BR>\n");
   rsExample.Move(2);
}
Response.Write("<HR>\n");

// Show only certain titles
rsExample.MoveFirst();
rsExample.Filter = "pub_id=0877";
if (rsExample.EOF) {
   Response.Write("No Matching Titles<BR>\n");
} else {
   while (!rsExample.EOF) {
      Response.Write(rsExample("pub_id") + " - " + 
                     rsExample("title") + "<BR>\n");
      rsExample.MoveNext();
   }
}
Response.Write("<HR>\n");

rsExample.Close();
dbConnection.Close();
delete rsExample
delete dbConnection
%>
