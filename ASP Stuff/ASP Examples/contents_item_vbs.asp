<%
' VBScript
Session.Contents.Item("FirstName") = "John"
FirstName = Session.Contents.Item(1)
Response.Write "First Name = " &  FirstName

%>