<HTML>
<HEAD>
<TITLE>The GetObject Method</TITLE>
</HEAD>
<BODY>
<H1>GetObject Demo</H1>

<%
Dim objObject
Set objObject = GetObject("LDAP://detower/CN=Users,DC=LT,DC=local")
Response.Write "Bound to object <STRONG>" & _
                objObject.ADsPath & "</STRONG><P>"

Dim objChild
Set objChild = objObject.GetObject("User", "cn=Administrator")
   
Response.Write "Now bound to child:<BR>"
Response.Write "Name: " & objChild.name & "<BR>"
Response.Write "ADsPath: " & objChild.ADsPath

Set objChild = Nothing
Set objObject = Nothing
%>

</BODY>
</HTML>