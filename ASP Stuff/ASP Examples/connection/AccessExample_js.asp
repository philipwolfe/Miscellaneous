<%@ LANGUAGE=JScript %>
<TITLE>Access Connection Example</TITLE>
<%
objConnection = Server.CreateObject("ADODB.Connection");
strConn = "Provider=Microsoft.Jet.OLEDB.4.0; " +
          "Data Source=C:\\Program Files\\Microsoft " +
          "Visual Studio\\VB98\\NWIND.MDB"
objConnection.Open(strConn);

rsData = Server.CreateObject("ADODB.Recordset"); 
rsData.Open("Customers", objConnection);

rsData.MoveFirst();
while (!rsData.EOF) {
   Response.Write(rsData(1) + "<BR>");
   rsData.MoveNext();
}
%>