<!-- METADATA TYPE="typelib" FILE="C:\WINNT\system32\inetsrv\logscrpt.dll" -->
<html>
  <head>
    <title>The Logging Component</title>
  </head>
  <body>
<h1>The Logging Utility Component</h1><hr>

<b>The following entries are contained in your log:</b>
<%
Dim objLogUtil
Set objLogUtil = Server.CreateObject("MSWC.IISLog")
objLogUtil.OpenLogFile "c:\logs\w3svC1\extend1.log", ForReading, "W3SVC", 1, 0

<!-- There seems to be a problem with this Filter -->
'objLogUtil.ReadFilter DateAdd("d", -1, Now), Now

%>
<TABLE CELLPADDING="10">
<TR>
<TH>Date/Time</TH>
<TH>Client IP</TH>
<TH>Bytes Sent</TH>
<TH>Target URL</TH>
</TR>
<%
Do While Not objLogUtil.AtEndOfLog
   objLogUtil.ReadLogRecord  'read the next record
%>
<TR>
<TD><% = objLogUtil.DateTime %></TD>
<TD><% = objLogUtil.ClientIP %></TD>
<TD><% = objLogUtil.BytesSent %></TD>
<TD><% = objLogUtil.URIStem %></TD>
</TR>
<%
Loop
objLogUtil.CloseLogFiles(ForReading)
%>
  </body>
</html>