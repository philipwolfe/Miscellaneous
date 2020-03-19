<%
' VBScript
Set cookie=Response.Cookies("myCookie")
If cookie.HasKeys Then
   'Set the value for each key in a multiple value cookie to blank
   For Each key in cookie
      cookie(key) = ""
   Next
Else
   Response.Cookies("myCookie") = ""  'Set single value cookies to blank
End If

%>