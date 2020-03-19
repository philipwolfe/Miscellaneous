<%@ LANGUAGE="JScript" %>
<%
// JScript
Session.Contents.Item("FirstName") = "Fred";
FirstName = Session.Contents.Item(1);
Response.Write ("First Name = " +  FirstName);
%>