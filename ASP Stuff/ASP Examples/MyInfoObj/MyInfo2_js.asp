<%@ lANGUAGE="JScript" %>
<HTML>
<TITLE>MyInfo Component</TITLE>
<H2>The MyInfo Component</H2>
<%
// Instantiate component, and if it doesn't already exist
// initialize the session variable which holds the property names
var objMyInfo = Server.CreateObject("MSWC.MyInfo");
if (String(Session("strPropNames")) == "undefined") {
   Session("strPropNames") = "";
}
if (Request.Form("submit") == "Add property") {
   strName = Request.Form("txtName");
   strValue = Request.Form("txtValue");
   strOption = "<OPTION>" + strName + "</OPTION>"
   // Only add the new property to the list if it's not already there
   if (Session("strPropNames").indexOf(strOption) == -1) {
      Session("strPropNames") += strOption + "\n";
   }
   // Set the property of the MyInfo component
   objMyInfo(strName) = strValue;
}
%>
<FORM ACTION="myinfo2_js.asp" METHOD="POST">
View the value of a property:
<SELECT NAME="propName">
   <%= Session("strPropNames") %>
</SELECT>
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="View value">
<%
if (Request.Form("submit") == "View value") {
   strProp = Request.Form("propName");
   // Retrieve the value for the requested property
   Response.Write("<HR>Value of MyInfo." + strProp +
                  " is <B>" + objMyInfo(strProp) + "</B>");
}
%>
<BR>
<HR>
Or add a new property:<BR>
New name:
<INPUT TYPE="TEXT" NAME="txtName">
New value:
<INPUT TYPE="TEXT" NAME="txtValue">
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="Add property">
</HTML>
