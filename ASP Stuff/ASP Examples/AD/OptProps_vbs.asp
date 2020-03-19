<HTML>
<HEAD>
<TITLE>Optional Properties</TITLE>
</HEAD>
<BODY>
<H1>OptionalProperties Demo</H1>

<%
Dim objObject
NewADsPath = "WinNT://LT/CRASHLOTS/Dhcp"
Set objObject = GetObject(NewADsPath)
  
Dim objSchema
Set objSchema = GetObject(objObject.Schema)
Response.Write "<STRONG>OPTIONAL PROPERTIES</STRONG><BR>"
For Each strProp In objSchema.OptionalProperties
   Response.Write strProp & ":<BR>"
   For Each Value In objObject.GetEx(strProp)
      Response.Write "&nbsp; &nbsp; &nbsp; " & Value & "<BR>"
   Next
Next
%>
</BODY>
</HTML>