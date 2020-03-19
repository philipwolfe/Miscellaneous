<%@ LANGUAGE="JScript" %>
<%
// 
cookie = Response.Cookies("myCookie");
if (cookie.HasKeys) {
   //Set the value for each key in a multiple value cookie to blank
   var enmCookie = new Enumerator(cookie);
   for (; !enmCookie.atEnd(); enmCookie.moveNext()) {
      cookie(enmCookie.item()) = "";
   }
} else {
   Response.Cookies("myCookie") = "";         //Set single value cookies to blank
}
%>
