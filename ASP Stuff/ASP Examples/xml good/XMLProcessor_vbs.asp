<%
Set xmlCatalogDocument = Server.CreateObject("MSXML2.FreeThreadedDOMDocument")
xmlCatalogDocument.async = false
xmlCatalogDocument.load("c:/ASP Prog Ref/Chapter 35/xml/xmlelement.xml")

Set xslCatalogDocument = Server.CreateObject("MSXML2.FreeThreadedDOMDocument")
xslCatalogDocument.async = false
xslCatalogDocument.load("c:/ASP Prog Ref/Chapter 35/xml/xmlelement.xsl")

Set xmlXSLTemplate = Server.CreateObject("MSXML2.XSLTemplate")
Set xmlXSLTemplate.stylesheet = xslCatalogDocument
Set xmlXSLProcessor = xmlXSLTemplate.createProcessor

xmlXSLProcessor.input = xmlCatalogDocument
xmlXSLProcessor.output = Response
xmlXSLProcessor.transform

%>