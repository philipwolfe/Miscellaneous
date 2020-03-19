<%Option Explicit%>
<!-- #include file = "dhtmltextbox.inc" -->

<html>
<body>

<b><font face="arial" size=3>ASP 3.0 DHTMLTextBox</font></b><br>
<font face="arial">
Download <a href="/downloads/download.aspx?id=1023" target="_blank">here</a>

<br><br>
Use:<br>
<code>
Dim DHTML<br>
Set DHTML = New DHTMLTextBox<br>
Call DHTML.Draw("VariableName","FormName",InputText,Width,Height)
</code>
</font>

<form name="theForm" method="post">

<%
Dim DHTML
Set DHTML = New DHTMLTextBox

Call DHTML.Draw("myVar", "theForm", Request.Form("myVar"),600, 400)
%>
<br>
<input type="submit" value="See Output">
<br><br>

<%=Request.Form("myVar")%>

</form>
</body>
</html>
