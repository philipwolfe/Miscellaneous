<%@ LANGUAGE = JScript %>
<!-- METADATA TYPE="TypeLib" FILE="C:\Program Files\Common Files\System\ADO\msado15.dll" -->
<TITLE>Paging Through a Recordset</TITLE>
<%
var strConnect = Application("DBConnection");
dbConnection = Server.CreateObject("ADODB.Connection");
rsExample = Server.CreateObject("ADODB.Recordset");
dbConnection.Open(strConnect);

var pageSize = 6;     // display 6 records per page
if (String(Request.QueryString("page")) != "undefined") {
   var curPage = Request.QueryString("page"); 
} else {
   var curPage = 1;
}

rsExample.Open("titles", dbConnection, adOpenStatic, adLockReadOnly);
rsExample.PageSize = pageSize;
numPages = rsExample.PageCount;
if (curPage > numPages) { curPage = numPages; }
rsExample.AbsolutePage = curPage;

var strTable = rsExample.GetString(adClipString, pageSize,
                                   "</TD><TD>","</TD></TR><TR><TD>");
strTable = strTable.substring(0,strTable.length - 8); 
Response.Write("<TABLE BORDER=1><TR><TD>" + strTable +
               "</TABLE><HR>");

if (curPage > 1) { 
   Response.Write("<A HREF=" + "paging_js.asp?page=" + (curPage-1));
   Response.Write("" + ">Previous Page</a><BR>");
}
if (curPage < numPages) { 
   Response.Write("<A HREF=" + "paging_js.asp?page=" + (Number(curPage)+1) +
                  "" + ">Next Page</A>");
}

rsExample.Close();
dbConnection.Close();   
delete rsExample;
delete dbConnection;
%>