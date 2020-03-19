<%@ LANGUAGE = "JScript" %>
<HTML>
<HEAD>
   <TITLE>The Folders Collection</TITLE>
</HEAD>

<BODY>
<H2>A Simple File System Browser</H2>

<FORM METHOD="POST" ACTION="folder_js.asp">
Select drive: <SELECT NAME="driveLetter">

<%
strDrive = Request.Form('driveLetter');
objFSO=Server.CreateObject('Scripting.FileSystemObject');

enmDrives = new Enumerator(objFSO.Drives);
for (; !enmDrives.atEnd(); enmDrives.moveNext()) {
   objDrive = enmDrives.item();
   Response.Write('<OPTION');
   if (objDrive.DriveLetter == strDrive) {
      Response.Write(' SELECTED');
   }
   Response.Write('>' + objDrive.DriveLetter + '</OPTION>');
}
%>

</SELECT><INPUT TYPE="SUBMIT" NAME="submit" VALUE="OK">
</FORM>
<HR>

<%
strDrive=String(strDrive);
if (strDrive != 'undefined') {
   objDrive = objFSO.GetDrive(strDrive);
   if (!objDrive.IsReady) {
      Response.Write('Drive is not available.<HR>');
   } else {
      strFolder = String(Request.Form('folderPath'));
      if (strFolder == 'undefined') {
         objFolder = objDrive.RootFolder;
      } else {
         strFolderName = String(Request.Form('folderName'));
         if (strFolderName != 'undefined')  {
            if (strFolderName == '[Up one level]') {
               strFolder = strFolder + '\\..';
            } else {
               strFolder = strFolder + '\\' + strFolderName;
            }
         }
         objFolder = objFSO.GetFolder(strFolder);
      }
      Response.Write('Folder path = ' + objFolder.Path + '<BR>');
%>
      
      <FORM METHOD="POST" ACTION="folder_js.asp">
      <INPUT TYPE="HIDDEN" NAME="driveLetter" 
             VALUE="<%= objDrive.DriveLetter %>">
      <INPUT TYPE="HIDDEN" NAME="folderPath" 
             VALUE="<%= objFolder.Path %>">
         Select folder:
         <SELECT NAME="folderName">
<%
            if (!objFolder.IsRootFolder) {
               Response.Write('<OPTION SELECTED>[Up one level]' + 
                              '</OPTION>');
            }
            var enmFolders = new Enumerator(objFolder.SubFolders);
            for (; !enmFolders.atEnd(); enmFolders.moveNext()) {
               objSubFolder = enmFolders.item();
               Response.Write('<OPTION>' + objSubFolder.Name +
                              '</OPTION>');
            }
%>
         </SELECT><INPUT TYPE="SUBMIT" NAME="submit" VALUE="OK">
      </FORM>
      <HR>
      <FORM METHOD="POST" ACTION="folder_js.asp">
      <INPUT TYPE="HIDDEN" NAME="driveLetter"
             VALUE="<%= objDrive.DriveLetter %>">
      <INPUT TYPE="HIDDEN" NAME="folderPath"
             VALUE="<%= objFolder.Path %>">
<%
      if (objFolder.Files.Count > 0) {
         Response.Write('Select file: <SELECT NAME=\"fileName\">');
         var enmFiles = new Enumerator(objFolder.Files);
         for (; !enmFiles.atEnd(); enmFiles.moveNext()) {
            objFile = enmFiles.item();
            Response.Write('<OPTION>' + objFile.Name + '</OPTION>\n');
         }
         Response.Write('</SELECT><INPUT TYPE=\"SUBMIT\" NAME=\"submit\" VALUE=\"OK\">');
      } else {
         Response.Write('No files to view.');
      }
      Response.Write('</FORM><HR>');
      strFileName = String(Request.Form('fileName'));
      if (strFileName != 'undefined') {
         objFile=objFSO.GetFile(objFolder.Path + '\\' + strFileName);
         Response.Write('Filename = ' + objFile.Name);
         try {
            strText = objFile.OpenAsTextStream().ReadAll();
            Response.Write('<FORM><TEXTAREA NAME=\"objTextArea\" ' +
                           'COLS=50 ROWS=10>');
            Response.Write(strText);
            Response.Write('</TEXTAREA></FORM>');
         }
         catch(e) {
            Response.Write('<BR><BR>Sorry, that file cannot be opened.');
         }
      }
   }
}
%>

</FORM>
</BODY>
</HTML>
