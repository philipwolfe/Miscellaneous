<!-- METADATA TYPE="TypeLib" 
     FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->
<%
Dim dbConnection, rsPubs, strConnect, strSHAPE, rsTitles, rsEmp
strConnect = Application("DBShapingConnection")
strSHAPE = "SHAPE {SELECT Pub_ID, Pub_Name FROM Publishers} " & _
           "APPEND ({SELECT Pub_ID, title FROM Titles} " & _
           "RELATE Pub_ID to Pub_ID) AS rsTitles, " & _
           "({SELECT * FROM Employee} " & _
           "RELATE Pub_ID TO Pub_ID) AS rsEmployees"
Set dbConnection = Server.CreateObject("ADODB.Connection")
Set rsPubs = Server.CreateObject("ADODB.Recordset")
dbConnection.Open strConnect

rsPubs.Open strSHAPE, dbConnection
Response.Write "<UL>" & vbCrLf
Do While Not rsPubs.EOF
   Response.Write "<LI>" & rsPubs("Pub_Name") & vbCrLf
   Response.Write "<UL>Titles<UL>" & vbCrLf
   Set rsTitles = rsPubs("rsTitles").Value
   Do While Not rsTitles.EOF
      Response.Write "<LI>" & rsTitles("title") & vbCrLf
      rsTitles.MoveNext
   loop
   Response.Write "</UL></UL>" & vbCrLf

   Response.Write "<UL>Employees<UL>" & vbCrLf
   Set rsEmp = rsPubs("rsEmployees").Value
   Do While Not rsEmp.EOF
      Response.Write "<LI>" & rsEmp("fname") & " " & _
                     rsEmp("lname") & vbCrLf
      rsEmp.MoveNext
   Loop
   Response.Write "</UL></UL>" & vbCrLf
   rsPubs.MoveNext
Loop
Response.Write "</UL>"

rsPubs.Close
dbConnection.Close   
Set rsTitles = Nothing
Set rsPubs = Nothing
Set rsEmp = Nothing
Set dbConnection = Nothing
%>