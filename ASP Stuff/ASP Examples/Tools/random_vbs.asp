<HTML>
<TITLE>The Tools.Random Method</TITLE>
<%
Set objTools = Server.CreateObject("MSWC.Tools")
intRand = Abs(objTools.Random) mod 3
Select Case intRand
   Case 0
      strQuot = "<P>I agree with no man's opinions. I have some of my own.</P>" & _
                "<P>Ivan Turgenev</P>"
   Case 1
      strQuot = "<P>A classic is something that everybody wants to have read, but nobody wants to read.</P>" & _
                "<P>Mark Twain</P>"
   Case 2
      strQuot = "<P>'What is the use of a book,' thought Alice, 'without pictures or conversations?'</P>" & _
                "<P>Lewis Carroll</P>"
End Select
Response.Write strQuot
%>

</HTML>