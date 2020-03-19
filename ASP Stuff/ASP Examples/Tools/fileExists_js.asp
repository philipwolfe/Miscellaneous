<%@ LANGUAGE="JScript" %>
<TITLE>The FileExists Method</TITLE>

<FORM ACTION="fileExists_js.asp" METHOD="POST">
Please type a file URL:
<INPUT TYPE="TEXT" NAME="file"><BR>
<INPUT TYPE="SUBMIT" NAME="submit">
</FORM>
<HR>
<%
var objTools = Server.CreateObject("MSWC.Tools");
var strFile = Request.Form("file");
if (strFile != "") {
   if (objTools.FileExists(strFile)) {
      Response.Write("The file <B>" + strFile + "</B> exists.");
   } else {
      Response.Write("The file <B>" + strFile + 
                     "</B> does not exist.");
   }
}
delete objTools;
%>
