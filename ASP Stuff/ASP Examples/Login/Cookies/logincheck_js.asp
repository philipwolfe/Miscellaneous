<%@ LANGUAGE="JScript" %>
<%
if (Request.Form("USR") != null & Request.Form("PWD") != null) {
   try {
      Conn = Server.CreateObject("ADODB.Connection");
      strConn = "Provider=SQLOLEDB; Data Source=server" +
                "Initial Catalog=database;User ID=user;" +
                "Passsword=password;";
      Conn.Open(strConn);
      Response.Cookies("APP")("USR") = Request.Form("USR");
      Response.Cookies("APP")("PWD") = Request.Form("PWD");
      Conn.close();
      Response.Redirect("main_js.asp");
   }
   catch(e) {
      // Couldn't open connection, or other error occurred
      if (Conn.State == 1) {
         Conn.Close();
      }
      Response.Write("Sorry, we cannot verify your details.");
   }
} else {
   Response.Redirect("index.htm");
}
%>