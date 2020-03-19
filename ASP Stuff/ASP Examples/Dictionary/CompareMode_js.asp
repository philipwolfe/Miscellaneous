<%@ LANGUAGE="JScript" %>
<%
// JScript
var objDictionary = Server.CreateObject("Scripting.Dictionary");
objDictionary.CompareMode = 0;      //binary (case-sensitive) comparison

objDictionary.Item("Red") = "Rouge";
objDictionary.Item("red") = "rouge";
Response.write(objDictionary("RED") + '<HR>');
Response.write(objDictionary("Red") + '<HR>');
Response.write(objDictionary("red") + '<HR>');

%>