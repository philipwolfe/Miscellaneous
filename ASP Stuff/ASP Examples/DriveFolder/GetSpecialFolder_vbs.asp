<%
' VBScript
Const WindowsFolder = 0, SystemsFolder = 1, TemporaryFolder =2

Set objFSO = Server.CreateObject("Scripting.FileSystemObject")
Set objFolder = objFSO.GetSpecialFolder(WindowsFolder)
Response.Write "GetSpecialFolder(WindowsFolder) returned:<BR>"
Response.Write "Path: " & objFolder.Path & "<P>"

Set objFolder = objFSO.GetSpecialFolder(SystemsFolder)
Response.Write "GetSpecialFolder(SystemsFolder) returned:<BR>"
Response.Write "Path: " & objFolder.Path & "<P>"

Set objFolder = objFSO.GetSpecialFolder(TemporaryFolder)
Response.Write "GetSpecialFolder(TemporaryFolder) returned:<BR>"
Response.Write "Path: " & objFolder.Path & "<P>"

%>