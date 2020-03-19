
<%
Dim objBrowscap
Set objBrowscap = Server.CreateObject("MSWC.BrowserType")
If objBrowscap.javascript Then
   Response.Write "JavaScript supported. " & _
                  "You will be redirected to a different version of the site."
   Response.Redirect "new/dhtml.asp"
Else
   Response.Write "JavaScript is not supported. " & _
                  "You will be redirected to the plain HTML version of the site."
   Response.Redirect "old/plain.asp"
End If
%>