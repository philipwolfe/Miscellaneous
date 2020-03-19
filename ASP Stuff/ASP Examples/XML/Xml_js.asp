<%@ LANGUAGE=JScript %>

<%
Response.ContentType = 'text/xml';
var objResponse = Server.CreateObject('Microsoft.XMLDOM');

var objPI = objResponse.createProcessingInstruction('xml',
            "version='1.0' encoding='UTF-8' standalone='yes' ");

var objDocElement = objResponse.createElement('GREETING');
objDocElement.text = 'hello';

objResponse.appendChild (objPI);
objResponse.appendChild (objDocElement);

objResponse.save (Response);
%>

