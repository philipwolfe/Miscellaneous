<%
Dim strSortBy, objDocument, objTransform, objParseError, strError, objTemplate, objProcessor
On Error Resume Next

strSortBy = Request.Form("sortby")

Set objDocument = Server.CreateObject("MSXML2.FreeThreadedDOMDocument")
objDocument.async = false
objDocument.load "c:\ASP Prog Ref\Chapter 36\catalog.xml"

Set objTransform = Server.CreateObject("MSXML2.FreeThreadedDOMDocument")
objTransform.async = False
objTransform.load "c:\ASP Prog Ref\Chapter 36\param.xsl"

Set objParseError = objDocument.parseError
If objParseError.errorCode <> 0 Then
   strError = "<H2>Error " & objParseError.errorCode & "</H2>" & _
              objParseError.reason & "<BR>" & _
              objParseError.url & _
              ", line " & objParseError.line & _
              ", position " & objParseError.filepos & ":<BR>" & _
              Server.HTMLEncode(objParseError.srcText) & "<BR>"
   Response.write strError
Else
   Set objTemplate = Server.CreateObject("MSXML2.XSLTemplate")
   Set objTemplate.stylesheet = objTransform
   Set objProcessor = objTemplate.createProcessor

   objProcessor.input = objDocument
   objProcessor.output = Response

   objProcessor.addParameter "sortBy", CStr(strSortBy)

   objProcessor.transform
End If
%>