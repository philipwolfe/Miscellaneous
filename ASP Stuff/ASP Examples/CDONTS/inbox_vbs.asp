<!-- METADATA TYPE="typelib" NAME="Microsoft CDO for NTS 1.2 Library"
              UUID="0E064ADD-9D99-11D0-ABE5-00AA0064D470" -->
<%
Option Explicit

Sub DisplayMsgsTable(folder)
	
   Const strTableHeader = "<P><TABLE WIDTH=100% bgcolor=Silver BORDER=1 CELLSPACING=1 CELLPADDING=1><TR BGCOLOR=Yellow><STRONG><TD>From</TD><TD>To</TD><TD>Subject</TD><TD>Message text</TD><TD>Attachment</TD><TD>Received</TD></STRONG></TR>"
   Const strTableFooter = "</TABLE><P>"

   Response.Write "<HR><H2>" & folder.Name & "</H2><BR>"
	
   If Not (folder.Messages.Count > 0) Then
      Response.Write "Sorry, the folder contains no messages<HR>"
      Exit Sub
   End If

   Response.Write strTableHeader
	
   Dim objMsg
   For Each objMsg In folder.Messages
      Response.Write "<TR><TD>" & objMsg.Sender.Name & " &lt;" & _
                     objMsg.Sender.Address & "&gt;</TD>"
		
      Dim strRecs
      If objMsg.Recipients.Count > 0 Then 
         strRecs = objMsg.Recipients(1).Name & " &lt;" & _
                   objMsg.Recipients(1).Address & "&gt;"
         Dim idx
         For idx=2 To objMsg.Recipients.count
            strRecs = strRecs & "; " & _
                      objMsg.Recipients(idx).Name & " &lt;" & _
                      objMsg.Recipients(idx).Address & "&gt;"
         Next
      Else
         strRecs = "No recipient" 
      End if
				
      Response.Write "<TD>" & strRecs & "</TD>"
      Response.Write "<TD>" & objMsg.Subject & "</TD>"
      Response.Write "<TD>" & objMsg.Text & "</TD>"
      Response.Write "<TD>" & CStr(objMsg.Attachments.Count>0) & _
                     "</TD>"
      Response.Write "<TD>" & FormatDateTime(objMsg.TimeReceived, _
                     vbShortDate) & "</TD></TR>"
   Next
	
   Response.Write strTableFooter
   Response.Write "<HR>"

End sub

Dim objSession, objOutbox, objInbox
%>
<HTML>
<HEAD>
<TITLE>CDONTS Sample #4 - Examining inbox and outbox folders</TITLE>
</HEAD>
<BODY >

<%
Set objSession = Server.CreateObject("CDONTS.Session")
objSession.LogonSMTP "Newsletter manager", "news.mng@dev02"
'Set objOutbox = objSession.Outbox
Set objOutbox = objSession.GetDefaultFolder(CdoDefaultFolderOutbox)
Set objInbox = objSession.GetDefaultFolder(CdoDefaultFolderInbox)

Response.Write "<H1> Welcome " & objSession.Name & "</H1><P>"

Response.Write "<H3> This is the content of your mail folders:</H3><P>"

' ######################
' We can use the following code to verify that we cannot add
' messages to the Inbox folder
'Dim objNewMsg
'Set objNewMsg = objInbox.Messages.Add
'Set objNewMsg = nothing
'######################

DisplayMsgsTable objInbox

' ######################
' We can use the following code to verify that outbox's Messages
' collection is always empty
'Dim objNewMsg
'Set objNewMsg = objOutbox.Messages.Add
'objNewMsg.Subject = "This is the subject"
'objNewMsg.Text = "This is the very short mail message."
'objNewMsg.Recipients.Add "Recipient Name", _
'                         "recipient@domain2.com", CdoTo
'objNewMsg.Attachments.Add "A Word attachment.doc" , CdoFileData, _
'                          "C:/Wrox/Books/1999/ASP30PR/ch10/" & _
'                          "CDO2000/Attachments/Word attachment.doc"
' ### objOutbox.Messages.count is always 0
'Response.write objOutbox.Messages.count
'objNewMsg.Send
'Set objNewMsg = nothing
'######################

DisplayMsgsTable objOutbox

Set objOutbox = nothing
Set objInbox = nothing
objSession.Logoff
Set objSession = nothing
%>

<BR>
</BODY>
</HTML>