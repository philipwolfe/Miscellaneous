<%@ LANGUAGE="JScript" %>
<% // JScript
Conn = Server.CreateObject("ADODB.Connection");
strConn = "Provider=SQLOLEDB; Data Source=server; " +
          "Initial Catalog=databse;User ID=" + Session("USR") +
          ";Password=" + Session("PWD");
Conn.Open(strConn);
%>