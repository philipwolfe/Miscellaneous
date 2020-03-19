<%@ LANGUAGE = JScript %>
<TITLE>SQL Server Connection Example</TITLE>
<%
objConnection = Server.CreateObject("ADODB.Connection");
strConn = "Provider=SQLOLEDB; Data Source=MYSERVER; " +
          "Initial Catalog=pubs; User ID=sa; Password=";
objConnection.Open(strConn);

rsData = Server.CreateObject("ADODB.Recordset");
rsData.Open("titles", objConnection);

rsData.MoveFirst();
while (!rsData.EOF) {
   Response.Write(rsData(1) + "<BR>")
   rsData.MoveNext();
}
%>
