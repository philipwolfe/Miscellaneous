<%@ LANGUAGE="JScript" %>
<HTML>
<HEAD>
<TITLE>Mandatory Properties</TITLE>
</HEAD>
<BODY>
<H1>MandatoryProperties Demo</H1>

<%
var NewADsPath = "WinNT://LT/CRASHLOTS/Dhcp";
var objObject = GetObject(NewADsPath);
var objSchema = GetObject(objObject.Schema);
   
Response.Write("<STRONG>MANDATORY PROPERTIES</STRONG><BR>");

var arrMandProps=new VBArray(objSchema.MandatoryProperties);

for (i=0; i<=arrMandProps.ubound(); i++) {
   var strProp = arrMandProps.getItem(i);
   Response.Write(strProp + ":<BR>");
   var arrValues = new VBArray(objObject.GetEx(strProp));
   for (j=0; j<=arrValues.ubound(); j++) {
      Response.Write("&nbsp &nbsp &nbsp " + 
                    arrValues.getItem(j) + "<BR>");
   }
}
%>
</BODY>
</HTML>