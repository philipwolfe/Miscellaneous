
<META NAME="Author" CONTENT="<%= oMD.author %>" />
<META NAME="Posted" CONTENT="<%= oMD.posted %>" />
<META NAME="Updated" CONTENT="<%= oMD.updated %>" />

<!-- #include file="browdata.inc" -->

<!-- #include file="styles-wks.inc" -->

<SCRIPT LANGUAGE="JavaScript"><!--

	// -----------------------------------------------------------
	// Client-side BrowserData constructor
	// Populated using data from server-side oBD object to avoid redundancy
	// -----------------------------------------------------------

	function BrowserData()
	{
<%
	for (Prop in oBD)
	{
		var vProp = oBD[Prop];
		if ("string" == typeof(vProp)) Response.Write("		this." + Prop + " = \"" + oBD[Prop] + "\";" + "\n");
		else Response.Write("		this." + Prop + " = " + oBD[Prop] + ";" + "\n");
	}
%>
	}
	var oBD = new BrowserData();
	
//--></SCRIPT>