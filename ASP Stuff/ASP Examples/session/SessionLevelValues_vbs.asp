<%
' Store the session start time as a string
Session("Start_Time") = CStr(Now)

' Retrieve the starting value
datStartTime = Session("Start_Time")
Response.Write "Session Start Time = " & datStartTime
%>
