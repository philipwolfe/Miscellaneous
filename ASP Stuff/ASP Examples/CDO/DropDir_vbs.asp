<%@ LANGUAGE = VBScript %>
<!--METADATA TYPE="typelib" NAME="CDO for Windows 2000 Type Library"
             UUID="CD000000-8B95-11D1-82DB-00C04FB1625D" -->
<!--METADATA TYPE="typelib" NAME="ADODB Type Library"
             UUID="00000205-0000-0010-8000-00AA006D2EA4" -->

<%
Option Explicit

Function MsgFileName (msgsColl, msg)
   Dim strFileName
   strFileName = msgsColl.FileName(msg)
   strFileName = Right(strFileName, Len(strFileName) - _
                       InStrRev(strFileName,"\") )
   MsgFileName = strFileName
End Function

Sub DisplayMsgsTable( msgsColl )
   
   Dim strTableHeader, strTableFooter
   strTableHeader = "<P><TABLE WIDTH=""100%"" BORDER=""1""" & _
                   "BGCOLOR=""Silver"" CELLSPACING=""1"" " & _
                   "CELLPADDING=""1""><TR BGCOLOR=""Yellow"">" & _
                   "<TD><B>From</B></TD><TD><B>Subject</B></TD></TR>"
   strTableFooter = "</TABLE><P>"


   Response.Write strTableHeader
   
   Dim  objMsg
   For Each objMsg In msgsColl
      Response.Write "<TR><TD>" & objMsg.From & "</TD>"
      Response.Write "<TD>" & objMsg.Subject & "</TD>"
      Response.Write "<TD>" & MsgFileName(msgsColl, objMsg)
      Response.Write  "</TD></TR>"
   Next
   
   Response.Write strTableFooter
End Sub

Const  strNewDropPath = "c:\mailboxes"

Dim objDropDir, objMsgsColl, objMsg, objStream, lngCounter
%>

<HTML>
<HEAD>
<TITLE>CDO2000 sample 5 - Working with Drop Directories</TITLE>
</HEAD>
<BODY>
We are moving the following message files from the default 
SMTP drop directory to the " <%= strNewDropPath%>" directory.
<P>
<%
Set objDropDir = Server.CreateObject("CDO.DropDirectory")
Set objMsgsColl = objDropDir.GetMessages

DisplayMsgsTable(objMsgsColl)
lngCounter = 0

For Each objMsg In objMsgsColl
Set objStream = objMsg.GetStream
   objStream.SaveToFile strNewDropPath & "\" & _
                        MsgFileName(objMsgsColl, objMsg)
   objStream.Close
   Set objStream = Nothing
   lngCounter = lngCounter + 1
Next

objMsgsColl.DeleteAll
Set objMsgsColl = Nothing
%>
<P>We have moved <%= CStr(lngCounter) %> messages 
to the new location.<BR>
Now we are opening the " <%= strNewDropPath%>" drop directory  
that contains the following messages.

<P>
<%
Set objMsgsColl = objDropDir.GetMessages(strNewDropPath)
DisplayMsgsTable(objMsgsColl)

Set objMsgsColl = Nothing   
Set objDropDir = Nothing
%>
</BODY>
</HTML>


