<%@ LANGUAGE="JScript" %>
<HTML>
<HEAD>
<TITLE>Optional Properties</TITLE>
</HEAD>
<BODY>
<H1>OptionalProperties Demo</H1>

<%
var NewADsPath = "WinNT://LT/CRASHLOTS/Dhcp";
var objObject = GetObject(NewADsPath);
var objSchema = GetObject(objObject.Schema);
   
Response.Write("<STRONG>OPTIONAL PROPERTIES</STRONG><BR>");

var arrOptProps=new VBArray(objSchema.OptionalProperties);

for (i=0; i<=arrOptProps.ubound(); i++) {
   var strProp = arrOptProps.getItem(i);
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