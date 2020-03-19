<HTML>
<HEAD>
<TITLE>IADsClass Example</TITLE>
</HEAD>
<BODY>
<H1>Display Properties of DHCP Service</H1>

<%
' attempt to bind to ADSI object & display message if succeeded

On Error Resume Next
Dim objObject
NewADsPath = "WinNT://JULIANS/DHCP"
Set objObject = GetObject(NewADsPath)
If Not (Err.number = 0) Then
   Response.Write "Failed to bind to object <STRONG>" & _
                  NewADsPath & "</STRONG>"
Else
   Response.Write "Currently viewing object at <STRONG>" & _
                  objObject.ADsPath & "</STRONG><BR>"
End If
Response.Write "<P>"

' display automation properties if we have bound to an object
If (Err.number = 0) Then
   
   Dim oSchema
   Set oSchema = GetObject(objObject.Schema)
   ' should do some more error checking here but have left 
   ' it for clarity
   
   Response.Write "Bound to Schema object at <STRONG>" & _
                  oSchema.ADsPath & "</STRONG><P>"

   Response.Write "<STRONG>MANDATORY PROPERTIES</STRONG><BR>"
   For Each strProp In oSchema.MandatoryProperties
      Response.Write strProp & ":<BR>"
      For Each Value In objObject.GetEx(strProp)
         Response.Write "&nbsp &nbsp &nbsp " & Value & "<BR>"
      Next
   Next

   Response.Write "<STRONG>OPTIONAL PROPERTIES</STRONG><BR>"
   For Each strProp In oSchema.OptionalProperties
      Response.Write strProp & ":<BR>"
      For Each Value In objObject.GetEx(strProp)
         Response.Write "&nbsp &nbsp &nbsp " & Value & "<BR>"
      Next
   Next

End If
%>

</BODY>
</HTML>