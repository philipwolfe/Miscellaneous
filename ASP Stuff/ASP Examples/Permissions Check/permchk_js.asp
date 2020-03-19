<%@ LANGUAGE="JScript" %>
<TITLE>Permissions Checker Component</TITLE>
<H2>The Permissions Checker Component</H2>
Please enter the path of a file on the system:
<FORM ACTION="permchk_js.asp" METHOD="POST">
   <INPUT TYPE="TEXT" NAME="txtPath">&nbsp;&nbsp;
   <INPUT TYPE="SUBMIT" VALUE="Check Permissions">
</FORM><HR>

<%
strPath = Request.Form("txtPath");
if (strPath != null) {
   objPermChk = Server.CreateObject("MSWC.PermissionChecker");
   if (objPermChk.HasAccess(strPath)) {
      Response.Write("The current user has access to the file <B>" +
                     strPath + "</B>");
   } else {
      Response.Write("The current user does not have access " +
                     "to the file <B>" + strPath + "</B>");
   }
}
%>

