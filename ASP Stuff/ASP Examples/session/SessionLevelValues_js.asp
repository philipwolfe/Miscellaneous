<%@ LANGUAGE="JScript" %>
<%
// Store the session start time as a string
Session("Start_Time") = Date();

// Retrieve the starting value
var datStartTime = Session("Start_Time");    
Response.write ("Session Start Time = " + datStartTime);

%>
