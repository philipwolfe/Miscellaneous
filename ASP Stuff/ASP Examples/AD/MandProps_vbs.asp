<HTML>
<HEAD>
<TITLE>Mandatory Properties</TITLE>
</HEAD>
<BODY>
<H1>MandatoryProperties Demo</H1>

<%
Dim objObject
NewADsPath = "WinNT://LT/CRASHLOTS/Dhcp"
Set objObject = GetObject(NewADsPath)
  
Dim objSchema
Set objSchema = GetObject(objObject.Schema)
Response.Write "<STRONG>MANDATORY PROPERTIES</STRONG><BR>"
For Each strProp In objSchema.MandatoryProperties
   Response.Write strProp & ":<BR>"
   For Each Value In objObject.GetEx(strProp)
      Response.Write "&nbsp; &nbsp; &nbsp; " & Value & "<BR>"
   Next
Next
%>
</BODY>
</HTML>