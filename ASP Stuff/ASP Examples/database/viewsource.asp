<HTML>
<HEAD>
<META NAME="GENERATOR" Content="Microsoft Visual Studio 6.0">
<TITLE></TITLE>
</HEAD>
<BODY>

<%
Dim objFSO, objInFile
Dim strIn, strTemp
Dim I, J
Dim strFileName
Dim ProcessString
Dim bCharWritten
Dim bInsideScript
Dim bInsideString
Dim iInsideComment

ProcessString = 0
bCharWritten = False
bInsideScript = False
bInsideString = False
iInsideComment = 0

strFileName = Request.QueryString("file")

' Conditional limiting use of this file
If InStr(1, strFileName, "\", 1) Then strFileName=""
If InStr(1, strFileName, "/", 1) Then strFileName=""

If strFileName <> "" Then
	Set objFSO = CreateObject("Scripting.FileSystemObject")
	Set objInFile = objFSO.OpenTextFile(Server.MapPath(strFileName))

	Response.Write "<PRE>" & vbCRLF
	' Loop Through Real File and Output Results to Browser
	Do While Not objInFile.AtEndOfStream
		strIn = Server.HTMLEncode(objInFile.ReadLine)
		' If we find Begin Script Tag start processing
		If InStr(1, strIn, "&lt;!-- BEGIN SCRIPT --&gt;", 1) Then
			ProcessString = 1
			strIn = Server.HTMLEncode(objInFile.ReadLine)
		End If
		' If we find End Script Tag stop processing
		If InStr(1, strIn, "&lt;!-- END SCRIPT --&gt;", 1) Then ProcessString = 0
		
		If ProcessString = 1 Then
			strTemp = ""
			For I = 1 to Len(strIn)
				bCharWritten = False
				If InStr(I, strIn, "&lt;%", 1) = I Then
		 			strTemp = strTemp & "<FONT COLOR=#0000FF>"
					bInsideScript = True
				Else
					If InStr(I, strIn, "%&gt;", 1) = I Then
						strTemp = strTemp & "%&gt;</FONT>"
						bCharWritten = True
						' so we dont get the trailing end of this tag again!
						' ie. Len("%&gt;") - 1 = 4
						I = I + 4
						bInsideScript = False
					End If
				End If
				' Toggle Inside String if needed!
				If bInsideScript And iInsideComment = 0 And InStr(I, strIn, "&quot;", 1) = I Then bInsideString = Not bInsideString
				' Now do comments if we're in script
				If bInsideScript And Not bInsideString And InStr(I, strIn, "'", 1) = I Then
		 			strTemp = strTemp & "<FONT COLOR=#009900>"
					iInsideComment = iInsideComment + 1
				End If
				' End comment at end of line if needed
				If iInsideComment > 0 And I = Len(strIN) Then
						strTemp = strTemp & Mid(strIn, I, 1)
						For J = 1 to iInsideComment
							strTemp = strTemp & "</FONT>"
						Next 'J
						bCharWritten = True
						iInsideComment = 0
				End If
				If bCharWritten = False Then
					strTemp = strTemp & Mid(strIn, I, 1)
				End If
			Next
			Response.Write strTemp & vbCRLF
		End If
	Loop
	Response.Write "</PRE>" & vbCRLF

	objInFile.Close
	Set objInFile = Nothing
	Set objFSO = Nothing
End If
%>
</BODY>
</HTML>
