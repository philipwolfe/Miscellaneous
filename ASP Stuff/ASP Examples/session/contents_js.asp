<%@ LANGUAGE="JScript" %>
<%
var objEnum = new Enumerator(Session.Contents)
for (;!objEnum.atEnd();objEnum.moveNext()) {
   var objItem = objEnum.item();
   Response.Write('Session("' + objItem + '") = ' + Session.Contents(objItem) + '<BR>');
}

%>