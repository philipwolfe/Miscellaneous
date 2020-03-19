<!-- METADATA TYPE="typelib" 
              FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->
<TITLE>The New Command</TITLE>
<%
Dim dbConnection, rsParent, rsChild

Set dbConnection = Server.CreateObject("ADODB.Connection")
dbConnection.Open "Provider=MSDataShape; Data Provider=NONE;"

strSHAPE = "SHAPE APPEND " & _
           "NEW adInteger AS ClientID, " & _
           "NEW adVarChar(50) AS ClientName, " & _
           "(( SHAPE APPEND " & _
                  "NEW adVarChar(4) AS StockID, " & _ 
                  "NEW adVarChar(20) AS StockName, " & _
                  "NEW adInteger AS ClientID) " & _
            "RELATE ClientID TO ClientID) AS Portfolio" 
            
Set rsParent = Server.CreateObject("ADODB.Recordset")
With rsParent
   .ActiveConnection = dbConnection
   .CursorLocation = adUseClient
   .CursorType = adOpenStatic
   .LockType = adLockOptimistic
   .Source = strSHAPE
   .Open

   .AddNew
   .Fields("ClientID") = 1
   .Fields("ClientName") = "Chris Mawbey"
   .Update

   .AddNew
   .Fields("ClientID") = 2
   .Fields("ClientName") = "Fenela Wills"
   .Update
End with

Set rsChild = rsParent.Fields("Portfolio").Value
With rsChild
   .AddNew
   .Fields("ClientID") = 1
   .Fields("StockID") = "AOL"
   .Fields("StockName") = "America OnLine"
   .Update

   .AddNew
   .Fields("ClientID") = 1
   .Fields("StockID") = "GE"
   .Fields("StockName") = "General Electric"
   .Update

   .AddNew
   .Fields("ClientID") = 2
   .Fields("StockID") = "CSCO"
   .Fields("StockName") = "Cisco"
   .Update

End with

Response.Write "<UL>" & vbCrLf
rsParent.MoveFirst
Do While Not rsParent.EOF
   Response.Write "<LI>" & rsParent("ClientID")
   Response.Write " - " & rsParent("ClientName") & vbCrLf
   Response.Write "<UL>Stock<UL>" & vbCrLf
   Set rsChild = rsParent.Fields("Portfolio").Value
   Do While Not rsChild.EOF
      Response.Write "<LI>" & rsChild("StockID") 
      Response.Write " - " & rsChild("StockName") & vbCrLf
      rsChild.MoveNext
   loop
   Response.Write "</UL></UL>" & vbCrLf
   rsParent.MoveNext
Loop

Response.Write "</UL>"
rsParent.Close
dbConnection.Close   
Set rsParent = Nothing
Set dbConnection = Nothing
%>








