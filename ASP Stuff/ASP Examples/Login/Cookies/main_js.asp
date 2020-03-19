<%@ LANGUAGE="JScript" %>
<% // JScript
Conn = Server.CreateObject("ADODB.Connection");
strConn = "Provider=SQLOLEDB;Data Source=server;" +
          "Initial Catalog=databse;User ID=" +
          Request.Cookies("APP")("USR") + ";Password=" +
          Request.Cookies("APP")("PWD");
Conn.Open(strConn);
%>
