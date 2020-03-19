<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="typelib" 
     FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->
<%
var dbConnection, rsPubs, strConnect, strSHAPE, rsTitles, rsEmp;
strConnect = Application("DBShapingConnection");
strSHAPE = "SHAPE {SELECT Pub_ID, Pub_Name FROM Publishers} " +
           "APPEND ({SELECT Pub_ID, title FROM Titles} " +
           "RELATE Pub_ID to Pub_ID) AS rsTitles, " +
           "({SELECT * FROM Employee} " +
           "RELATE Pub_ID TO Pub_ID) AS rsEmployees";
dbConnection = Server.CreateObject("ADODB.Connection");
rsPubs = Server.CreateObject("ADODB.Recordset");
dbConnection.Open(strConnect);

rsPubs.Open(strSHAPE, dbConnection);
Response.Write("<UL>\n");
while (!rsPubs.EOF) {
   Response.Write("<LI>" + rsPubs("Pub_Name") + "\n");
   Response.Write("<UL>Titles\n<UL>\n");
   rsTitles = rsPubs("rsTitles").Value;
   while (!rsTitles.EOF) {
      Response.Write("<LI>" + rsTitles("title") + "\n");
      rsTitles.MoveNext();
   }
   Response.Write("</UL>\n</UL>\n");
   Response.Write("<UL>Employees\n<UL>\n");
      rsEmp = rsPubs("rsEmployees").Value;
   while (!rsEmp.EOF) {
      Response.Write("<LI>" + rsEmp("fname") + " " + 
                     rsEmp("lname") + "\n");
      rsEmp.MoveNext();
   }
   Response.Write("</UL>\n</UL>\n");
   rsPubs.MoveNext();
}
Response.Write("</UL>");

rsPubs.Close();
dbConnection.Close();
delete rsTitles;
delete rsPubs;
delete rsEmp;
delete dbConnection;
%>