<HTML>
<HEAD>
   <TITLE>The Folders Collection</TITLE>
</HEAD>

<BODY>
<H2>A Simple File System Browser</H2>

<FORM METHOD="POST" ACTION="folder_vbs.asp">
Select drive: <SELECT NAME="driveLetter">

<%
strDrive = Request.Form("driveLetter")
Set objFSO=Server.CreateObject("Scripting.FileSystemObject")
For Each objDrive in objFSO.Drives
   Response.Write "<OPTION"
   If objDrive.DriveLetter=strDrive Then
      Response.Write " SELECTED"
   End If
   Response.Write ">" & objDrive.DriveLetter & "</OPTION>"
Next
%>
</SELECT><INPUT TYPE="SUBMIT" NAME="submit" VALUE="OK">
</FORM>
<HR>

<%
If strDrive <> "" Then
   Set objDrive = objFSO.GetDrive(CStr(strDrive))
   If Not objDrive.IsReady Then
      Response.Write "Drive is not available.<HR>"
   Else
      strFolder = Request.Form("folderPath")
      If strFolder = "" Then
         Set objFolder = objDrive.RootFolder
      Else
         strFolderName = Request.Form("folderName")
         If strFolderName <> "" Then
            If strFolderName = "[Up one level]" Then
               strFolder = strFolder & "\.."
            Else
               strFolder = strFolder & "\" & strFolderName
            End If
         End If
         Set objFolder = objFSO.GetFolder(CStr(strFolder))
      End If
      Response.Write "Folder path = " & objFolder.Path & "<BR>"
%>
      
      <FORM METHOD="POST" ACTION="folder_vbs.asp">
      <INPUT TYPE="HIDDEN" NAME="driveLetter" 
             VALUE="<%= objDrive.DriveLetter %>">
      <INPUT TYPE="HIDDEN" NAME="folderPath" 
             VALUE="<%= objFolder.Path %>">
         Select folder:
         <SELECT NAME="folderName">
<%
            If Not objFolder.IsRootFolder Then
               Response.Write "<OPTION SELECTED>[Up one level]" & _
                              "</OPTION>"
            End If
            For Each objSubFolder in objFolder.SubFolders
               Response.Write "<OPTION>" & objSubFolder.Name & _
                              "</OPTION>"
            Next
%>
         </SELECT><INPUT TYPE="SUBMIT" NAME="submit" VALUE="OK">
      </FORM>
      <HR>
      <FORM METHOD="POST" ACTION="folder_vbs.asp">
      <INPUT TYPE="HIDDEN" NAME="driveLetter"
             VALUE="<%= objDrive.DriveLetter %>">
      <INPUT TYPE="HIDDEN" NAME="folderPath"
             VALUE="<%= objFolder.Path %>">
<%
      If objFolder.Files.Count > 0 Then
         Response.Write "Select file: <SELECT NAME=""fileName"">"
         For Each objFile in objFolder.Files
            Response.Write "<OPTION>" & objFile.Name & _
                           "</OPTION>" & vbCrLf
         Next
         Response.Write "</SELECT><INPUT TYPE=""SUBMIT"" " & _
                        "NAME=""submit"" VALUE=""OK"">"
      Else
         Response.Write "No files to view."
      End If
      Response.Write "</FORM><HR>"
      strFileName = Request.Form("fileName")
      If strFileName <> "" Then
         Set objFile=objFSO.GetFile(objFolder.Path & "\" & _
                                    strFileName)
         Response.Write "Filename = " & objFile.Name
         on error resume next
         strText = objFile.OpenAsTextStream.ReadAll
         If err.number <> 0 Then
            Response.Write "<BR><BR>Sorry, that file " & _
                           "cannot be opened."
         Else
            Response.Write "<FORM><TEXTAREA NAME=""objTextArea""" & _
                           " COLS=50 ROWS=10>"
            Response.Write  strText
            Response.Write  "</TEXTAREA></FORM>"
         End If
      End If
   End If
End If
%>

</FORM>
</BODY>
</HTML>
