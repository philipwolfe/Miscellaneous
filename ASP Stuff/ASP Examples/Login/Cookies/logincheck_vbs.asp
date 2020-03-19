<%
On Error Resume Next
If Request.Form("USR") <> "" AND Request.Form("PWD") <> "" Then
   Set Conn = Server.CreateObject("ADODB.Connection")
   strConn = "Provider=SQLOLEDB;Data Source=server;" & _
             "Initial Catalog=databse;User ID=" & _
             Request.Form("USR") & ";Password=" & Request.Form("PWD")
   Conn.Open strConn

   If err.number = 0  Then
      ' Couldn't open connection, or other error occurred
      Response.Cookies("APP")("USR") = Request.Form("USR")
      Response.Cookies("APP")("PWD") = Request.Form("PWD")
      Conn.close 
      Response.Redirect "main_vbs.asp"
   Else

      If Conn.State = 1 Then
         Conn.Close
      End If
      Response.Write "Sorry, we cannot verify your details." & _
                     "</BODY></HTML>"
   End If
Else
   Response.Redirect "index.htm"
End IF
%>