<TITLE>Counters Component</TITLE>
<%@ LANGUAGE=JScript %>
<%
MyAD=Server.CreateObject("MSWC.AdRotator");
Response.write(MyAD.GetAdvertisement("schedule.txt"));
%>
<H3>Rest of the page goes here...</H3>