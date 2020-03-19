<%@ LANGUAGE="JScript" %>
<%
// JScript
var str_key = Session.Contents.Key(1);
var str_item = Session.Contents.Item(str_key);
Response.Write ('str_item = ' + str_item);
%>