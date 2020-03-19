<%@ LANGUAGE="JScript" %>
<HTML>
<HEAD>
<TITLE>The GetObject Method</TITLE>
</HEAD>
<BODY>
<H1>GetObject Demo</H1>

<%
var objObject = ActiveXObject("LDAP://JULIANS/CN=Users," +
                              "DC=julians,DC=wrox,DC=com");
Response.Write("Bound to object <STRONG>" + 
               objObject.ADsPath + "</STRONG><P>");

var objChild = objObject.GetObject("User", "cn=Administrator");
   
Response.Write("Now bound to child:<BR>");
Response.Write("Name: " + objChild.name + "<BR>");
Response.Write("ADsPath: " + objChild.ADsPath);

delete objChild;
delete objObject;
%>

</BODY>
</HTML>