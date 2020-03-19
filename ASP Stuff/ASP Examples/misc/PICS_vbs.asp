<%
' VBScript
QUOT = Chr(34) 'double-quote character
strPicsLabel = "(PICS-1.0 " & QUOT & "http://www.rsac.org/ratingsv01.html" & _
               QUOT & " l gen true comment " & QUOT & _
               "RSACi North America Server" & QUOT & " for " & QUOT & _
               "http://yoursite.com" & QUOT & " on " & QUOT & _
               "1999.08.01T03:04-0500" & QUOT & " r (n 0 s 0 v 2 l 3))"
Response.Pics(strPicsLabel)

%>
