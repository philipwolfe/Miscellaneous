<%@ LANGUAGE="JScript" %>
<HTML>
<TITLE>The Tools.Random Method</TITLE>
<%
var objTools = Server.CreateObject("MSWC.Tools");
intRand = Math.abs(objTools.Random()) % 3
switch (intRand) {
   case 0:
      strQuot = "<P>I agree with no man's opinions. I have some of my own.</P>" +
                "<P>Ivan Turgenev</P>"
      break;
   case 1:
      strQuot = "<P>A classic is something that everybody wants to have read, but nobody wants to read.</P>" +
                "<P>Mark Twain</P>"
      break;
   case 2:
      strQuot = "<P>'What is the use of a book,' thought Alice, 'without pictures or conversations?'</P>" +
                "<P>Lewis Carroll</P>"
}
Response.Write(strQuot);
%>

</HTML>