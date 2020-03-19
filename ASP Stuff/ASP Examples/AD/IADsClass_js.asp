<%@ Language="JScript" %>
<HTML>
<HEAD>
<TITLE>IADsClass Example</TITLE>
</HEAD>
<BODY>
<H1>Display Properties of DHCP Service</H1>

<%
// attempt to bind to ADSI object and display message if succeeded

try {
   var NewADsPath = "WinNT://JULIANS/Dhcp";
   var objObject = GetObject(NewADsPath);
   Response.Write("Currently viewing object at <STRONG>" + 
                  objObject.ADsPath + "</STRONG><BR>");
   Response.Write("<P>");

   var oSchema = GetObject(objObject.Schema);
   
   Response.Write("Bound to Schema object at <STRONG>" + 
                  oSchema.ADsPath + "</STRONG><P>");
   
   Response.Write("<STRONG>MANDATORY PROPERTIES</STRONG><BR>");

   var arrMandProps=new VBArray(oSchema.MandatoryProperties);

   for (i=0; i<=arrMandProps.ubound(); i++) {
      var strProp = arrMandProps.getItem(i);
      Response.Write(strProp + ":<BR>");
      var arrValues = new VBArray(objObject.GetEx(strProp));
      for (j=0; j<=arrValues.ubound(); j++) {
         Response.Write("&nbsp &nbsp &nbsp " + 
                        arrValues.getItem(j) + "<BR>");
      }
   }

   Response.Write("<STRONG>OPTIONAL PROPERTIES</STRONG><BR>");

   var arrOptProps=new VBArray(oSchema.OptionalProperties);

   for (i=0; i<=arrOptProps.ubound(); i++) {
      var strProp = arrOptProps.getItem(i);
      Response.Write(strProp + ":<BR>");
      var arrValues = new VBArray(objObject.GetEx(strProp));
      for (j=0; j<=arrValues.ubound(); j++) {
         Response.Write("&nbsp &nbsp &nbsp " +
                        arrValues.getItem(j) + "<BR>");
      }
   }
}

catch(e) {
   Response.Write("Failed to bind to object <STRONG>" + 
                  NewADsPath + "</STRONG>");
}
%>

</BODY>
</HTML>