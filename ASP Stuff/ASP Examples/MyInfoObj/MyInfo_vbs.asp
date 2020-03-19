
<HTML>
<TITLE>MyInfo Component</TITLE>
<H2>The MyInfo Component</H2>
<%
Set objMyInfo = Server.CreateObject("MSWC.MyInfo")
If IsEmpty(Session("strPropNames")) Then
   Session("strPropNames") = ""
End If

If Request.Form("submit") = "Add property" Then
   strName = Request.Form("txtName")
   strValue = Request.Form("txtValue")
   strOption = "<OPTION>" & strName & "</OPTION>"
   ' Only add the new property to the list if it's not already there
   If Instr(Session("strPropNames"), strOption) = 0 Then
      Session("strPropNames") = Session("strPropNames") & _
                                strOption & vbCrLf
   End If
   objMyInfo(strName) = strValue
End If
%>
<FORM ACTION="myinfo_vbs.asp" METHOD="POST">
View the value of a property:
<SELECT NAME="propName">
   <%= Session("strPropNames") %>
</SELECT>
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="View value">
<BR>

<%
If Request.Form("submit") = "View value" Then
   strProp = Request.Form("propName")
   Response.Write "<HR>Value of MyInfo." & strProp & _
                  " is <B>" & objMyInfo(strProp) & "</B>"
End If
%>
<HR>
Or add a new property:<BR>
New name:
<INPUT TYPE="TEXT" NAME="txtName">
New value:
<INPUT TYPE="TEXT" NAME="txtValue">
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="Add property">
</HTML>
