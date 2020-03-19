<!-- METADATA TYPE="typelib" 
     FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->

<%
Dim dbConnection, rsExample, strConnect, strSQL, cmdExample
strConnect = Application("dbConnection")
strSQL = "SELECT title, au_lname, price, ytd_sales, pub_id " & _ 
         "FROM authors INNER JOIN titleauthor " & _ 
         "ON authors.au_id = titleauthor.au_id INNER JOIN " & _
         "titles ON titleauthor.title_id = titles.title_id;"

Set dbConnection = Server.CreateObject("ADODB.Connection")
Set cmdExample = Server.CreateObject("ADODB.Command")
dbConnection.Open strConnect

cmdExample.ActiveConnection = dbConnection
cmdExample.CommandText = strSQL
cmdExample.CommandType = adCmdText
Set rsExample = cmdExample.Execute

Dim strTable
strTable = rsExample.GetString(adClipString, ,"</TD><TD>", _
                               "</TD></TR>" & vbCrlf & "<TR><TD>")
strTable = left(strTable,len(strTable) - 8)
Response.Write "<TABLE BORDER=1><TR><TD>" & strTable & "</TABLE>"

rsExample.Close
Set cmdExample = Nothing
dbConnection.Close	
Set rsExample = Nothing
Set dbConnection = Nothing
%>
