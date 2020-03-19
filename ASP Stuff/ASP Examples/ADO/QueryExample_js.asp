<%@ LANGUAGE=JScript %>
<!-- METADATA TYPE="typelib" 
     FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->

<%
strConnect = Application("dbConnection");
strSQL = "SELECT title, au_lname, price, ytd_sales, pub_id " + 
         "FROM authors INNER JOIN titleauthor " + 
         "ON authors.au_id = titleauthor.au_id INNER JOIN " +
         "titles ON titleauthor.title_id = titles.title_id;";

dbConnection = Server.CreateObject("ADODB.Connection");
cmdExample = Server.CreateObject("ADODB.Command");
dbConnection.Open(strConnect);

cmdExample.ActiveConnection = dbConnection;
cmdExample.CommandText = strSQL;
cmdExample.CommandType = adCmdText;
rsExample = cmdExample.Execute();

var strTable = rsExample.GetString(adClipString, -1, "</TD><TD>",
                                   "</TD></TR>\n<TR><TD>");
strTable = strTable.substring(0,strTable.length - 8);
Response.Write("<TABLE BORDER=1><TR><TD>" + strTable + "</TABLE>");

rsExample.Close();
delete cmdExample;
dbConnection.Close();	
delete rsExample;
delete dbConnection;
%>
