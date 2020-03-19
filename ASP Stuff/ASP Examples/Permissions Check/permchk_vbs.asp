<%@ LANGUAGE="VBScript" %>
<TITLE>Permissions Checker Component</TITLE>
<H2>The Permissions Checker Component</H2>
Please enter the path of a file on the system:
<FORM ACTION="permchk_vbs.asp" METHOD="POST">
   <INPUT TYPE="TEXT" NAME="txtPath">&nbsp;&nbsp;
   <INPUT TYPE="SUBMIT" VALUE="Check Permissions">
</FORM><HR>

<%
strPath = Request.Form("txtPath")
If strPath <> "" Then
   Set objPermChk = Server.CreateObject("MSWC.PermissionChecker")
   If objPermChk.HasAccess(strPath) Then
      Response.Write "The current user has access to the file <B>" & _
                     strPath & "</B>"
   Else
      Response.Write "The current user does not have access " & _
                     "to the file <B>" & strPath & "</B>"
   End If
End If
%>

