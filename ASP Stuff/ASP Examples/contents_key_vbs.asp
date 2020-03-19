<%
' VBScript
str_key = Session.Contents.Key(1)
str_item = Session.Contents.Item(str_key)
Response.Write "str_item = " & str_item

%>