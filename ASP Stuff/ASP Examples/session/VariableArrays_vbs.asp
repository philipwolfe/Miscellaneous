<%
' Create a Variant array and fill it
Dim varArray(2)
varArray(0) = "This is a Variant array "
varArray(1) = "stored in the "
varArray(2) = "Session object."

' Store it in the Session
Session("Variant_Array") = varArray
Response.Write varArray(0) & varArray(1) & varArray(2)
%>
