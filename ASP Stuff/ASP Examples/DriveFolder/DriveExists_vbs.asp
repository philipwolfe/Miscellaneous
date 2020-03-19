<%
' VBScript
Set objFSO = Server.CreateObject("Scripting.FileSystemObject")
For intCode = 65 To 90   'ANSI codes for 'A' to 'Z'
   strLetter = Chr(intCode)
   If objFSO.DriveExists(strLetter) Then
      Response.Write "Found drive " & strLetter & ":<BR>"
   End If
Next
%>