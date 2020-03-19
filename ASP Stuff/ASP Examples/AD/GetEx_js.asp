<%@ LANGUAGE="JScript" %>
<HTML>
<HEAD>
<TITLE>The GetEx Method</TITLE>
</HEAD>
<BODY>
<H1>Get and GetEx Demo</H1>

<%
var objObject = ActiveXObject("WinNT://CRASHLOTS/Administrator");
Response.Write("<P>");

// Display automation properties if we have bound to an object
try {
   Response.Write("Description using Get:<BR>" + 
                  objObject.Get("Description") + "<P>");

   var arrValues=new VBArray(objObject.GetEx("Description"));
   for (i=0; i<=arrValues.ubound(); i++) {
      Response.Write("Description using GetEx:<BR>" + 
                     arrValues.getItem(i) + "<BR>");
   }
}
catch(e) {
   Response.Write(e.description);
}
%>
</BODY>
</HTML>