<%@ LANGUAGE="JScript"%>
<html>
  <head>
    <title>The Content Rotator Component</title>
  </head>
  <body>
<% // JScript
var objContRot, strPath;
objContRot = Server.CreateObject("MSWC.ContentRotator");
strPath = "content.txt";

Response.Write("Selected content:<HR>");
Response.write(objContRot.ChooseContent(strPath));

Response.Write("<HR>Entire content:");
objContRot.GetAllContent(strPath);
%>
  </body>
</html>