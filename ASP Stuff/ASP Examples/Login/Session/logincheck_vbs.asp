<%
On Error Resume Next
If Request.Form("USR") <> "" AND Request.Form("PWD") <> "" Then
   Set Conn = Server.CreateObject("ADODB.Connection")
   strConn = "Provider=SQLOLEDB; Data Source=server" & _
             "Initial Catalog=database;User ID=user;" & _
             "Password=password;"
   Conn.Open strConn

   If err.number = 0  Then
      Session("USR") = Request.Form("USR")
      Session("PWD") = Request.Form("PWD")
      Conn.close 
      Response.Redirect "main_vbs.asp"
   Else
      ' Couldn't open connection, or other error occurred
      If Conn.State = 1 Then   ' 1 = adStateOpen 
         Conn.Close
      End If
      Response.Write "Sorry, we cannot verify your details."
   End If
Else
   Response.Redirect "index.htm"
End IF
%>