<% Response.Buffer = False %>
<TITLE>Data Shaping</TITLE>
<FORM ACTION="shape_vbs.asp" METHOD="POST">
   <TEXTAREA NAME="txtShape" ROWS=15 COLS=100></TEXTAREA><BR><BR>
   <INPUT TYPE=SUBMIT>
</FORM>

<%
If Request.Form("txtShape") <> "" Then
   strShape = Request.Form("txtShape")

   ' ********** Configure this connection string **********
   strConnect = "Provider=MSDataShape;Data Provider=SQLOLEDB;" & _
                "Initial Catalog=Northwind;Data Source=ServerName;" & _
                "User ID=sa;Password=;"
   Set cnShape = Server.CreateObject("ADODB.Connection")

   cnShape.Open strConnect

   Set rsParent = cnShape.Execute(strShape)
   Response.Write "<BR>Results of SHAPE command <B>" & strShape & "</B>:<HR>"
   RecurseChildren rsParent
End If

Sub RecurseChildren(rsChild)
%>
<TABLE BORDER=1><THEAD><TR>
<%
For Each objField In rsChild.Fields
   Response.Write "<TH>" & objField.Name & "</TH>"
Next
%>
</TR></THEAD>
<TBODY>
<%
   Do Until rsChild.EOF
      Response.Write "<TR>"
      Dim objField
      For Each objField In rsChild.Fields
         Response.Write "<TD>"
         If objField.Type = 136 Then
            Response.Write "<TABLE BORDER=1 WIDTH='100%'>"
            RecurseChildren objField.Value
            Response.Write "</TABLE>"
         Else
            Response.Write objField.Value
         End If
         Response.Write "</TD>"
      Next
      rsChild.MoveNext
      Response.Write "</TR>"
   Loop
End Sub
%>
</TBODY></TABLE>