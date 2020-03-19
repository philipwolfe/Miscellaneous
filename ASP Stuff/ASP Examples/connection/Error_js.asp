<%@ LANGUAGE=JScript %>
<TITLE>Error Object Example</TITLE>
<%
try {
objConn = Server.CreateObject("ADODB.Connection");
objConn.Open("Provider=SQLOLEDB; Data Source=myserver;" +
             "Initial Catalog=pubs; User ID=Fred; Password=");
} 

catch(e) {
Response.Write(objConn.Errors(0).Description + "<BR>");
Response.Write(objConn.Errors(0).NativeError + "<BR>");
Response.Write(objConn.Errors(0).Number + "<BR>");
Response.Write(objConn.Errors(0).Source + "<BR>");
Response.Write(objConn.Errors(0).SQLState + "<BR>");
}
%>

