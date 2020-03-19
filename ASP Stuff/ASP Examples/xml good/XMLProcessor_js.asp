<%@ LANGUAGE="JScript"%>
<%
var xmlCatalogDocument = Server.CreateObject("MSXML2.FreeThreadedDOMDocument");
xmlCatalogDocument.async = false;
xmlCatalogDocument.load("c:/ASP Prog Ref/Chapter 35/xml/xmlelement.xml");

var xslCatalogDocument = Server.CreateObject("MSXML2.FreeThreadedDOMDocument");
xslCatalogDocument.async = false;
xslCatalogDocument.load("c:/ASP Prog Ref/Chapter 35/xml/xmlelement.xsl");

var xmlXSLTemplate = Server.CreateObject("MSXML2.XSLTemplate");

xmlXSLTemplate.stylesheet = xslCatalogDocument;
var xmlXSLProcessor = xmlXSLTemplate.createProcessor();

xmlXSLProcessor.input = xmlCatalogDocument;
xmlXSLProcessor.output = Response;
xmlXSLProcessor.transform();

%>