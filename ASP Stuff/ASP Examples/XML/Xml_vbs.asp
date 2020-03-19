<%
Response.ContentType = "text/xml"
Set objResponse = Server.CreateObject("Microsoft.XMLDOM")

Dim objDocElement
Set objPI = objResponse.createProcessingInstruction("xml", _
                "version='1.0' encoding='UTF-8' standalone='yes'")

Set objDocElement = objResponse.createElement("GREETING")
objDocElement.text = "hello"

objResponse.appendChild objPI
objResponse.appendChild objDocElement

objResponse.save response
%>
