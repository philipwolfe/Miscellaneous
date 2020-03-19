<HTML>
<HEAD>
   <TITLE>The Drives Collection</TITLE>
</HEAD>
<BODY>
   <H2>The Drive Object and Drives Collection</H2>
<HR>

<%
dim objFSO, colDrives, objDrive, strLetter, strDriveType
Set objFSO = Server.CreateObject("Scripting.FileSystemObject")
Set colDrives = objFSO.Drives
Response.Write "Number of available drives = " & colDrives.Count & "<HR>"
%>

Please select a drive letter:
<FORM METHOD="POST" ACTION="Drives_vbs.asp">
<SELECT NAME="driveLetter">

<%
for each objDrive in colDrives
   Response.Write "<OPTION>" & objDrive.DriveLetter & "</OPTION>"
next
%>

</SELECT><BR><BR>
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="View Properties">
</FORM>
<HR>
<B>Properties of selected drive:</B><BR><BR>

<%
strLetter = Request.Form("driveLetter")
If strLetter <> "" Then
   Set objDrive = colDrives.Item(CStr(strLetter))
   Response.Write "Drive letter = " & objDrive.DriveLetter & "<BR>"
   Select case objDrive.DriveType
      Case 1
         strDriveType = "Removable"
      Case 2
         strDriveType = "Fixed"
      Case 3
         strDriveType = "Network"
      Case 4
         strDriveType = "CD-ROM"
      Case 5
         strDriveType = "RAM Disk"
      Case Else
         strDriveType = "Unknown"
   End Select
   Response.Write "Drive type = " & strDriveType & "<BR>"
   If objDrive.IsReady = false then
      Response.Write "Drive " & strLetter & " is not ready."
   Else
      Response.Write "File system = " & objDrive.FileSystem & "<BR>"
      Response.Write "Available space = " & objDrive.AvailableSpace & "<BR>"
      Response.Write "Free space = " & objDrive.FreeSpace & "<BR>"
      Response.Write "Total size = " & objDrive.TotalSize & "<BR>"
      Response.Write "Path = " & objDrive.Path & "<BR>"
      Response.Write "Root folder = " & objDrive.RootFolder & "<BR>"
      Response.Write "Serial number = " & objDrive.SerialNumber & "<BR>"
      Response.Write "Share name = " & objDrive.ShareName & "<BR>"
      Response.Write "Volume name = " & objDrive.VolumeName & "<BR>"
   End If
End If
%>
