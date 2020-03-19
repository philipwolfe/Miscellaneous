<%@ LANGUAGE="JScript" %>
<HTML>
<HEAD>
   <TITLE>The Drives Collection</TITLE>
</HEAD>
<BODY>
   <H2>The Drive Object and Drives Collection</H2>
<HR>

<%
objFSO = Server.CreateObject('Scripting.FileSystemObject');
colDrives = objFSO.Drives;
Response.Write('Number of available drives = ' + colDrives.Count + '<HR>');
%>

Please select a drive letter:
<FORM METHOD="POST" ACTION="Drives_js.asp">
<SELECT NAME="driveLetter">

<%
enmDrives = new Enumerator(colDrives);
for (; !enmDrives.atEnd(); enmDrives.moveNext()) {
   objDrive = enmDrives.item();
   Response.Write('<OPTION>' + objDrive.DriveLetter + '</OPTION>');
}
%>

</SELECT><BR><BR>
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="View Properties">
</FORM>
<HR>
<B>Properties of selected drive:</B><BR><BR>

<%
strLetter = Request.Form('driveLetter');
if (String(strLetter) != "undefined") {
   objDrive = colDrives.Item(strLetter);
   Response.Write('Drive letter = ' + objDrive.DriveLetter + '<BR>');
   switch (objDrive.DriveType) {
      case 1:
         strDriveType = 'Removable';
         break;
      case 2:
         strDriveType = 'Fixed';
         break;
      case 3:
         strDriveType = 'Network';
         break;
      case 4:
         strDriveType = 'CD-ROM';
         break;
      case 5:
         strDriveType = 'RAM Disk';
         break;
      default:
         strDriveType = 'Unknown';
   }
   Response.Write('Drive type = ' + strDriveType + '<BR>');
   if (!objDrive.IsReady) {
      Response.Write('Drive ' + strLetter + ' is not ready.');
   } else {
      Response.Write('File system = ' + objDrive.FileSystem + '<BR>');
      Response.Write('Available space = ' + objDrive.AvailableSpace + '<BR>');
      Response.Write('Free space = ' + objDrive.FreeSpace + '<BR>');
      Response.Write('Total size = ' + objDrive.TotalSize + '<BR>');
      Response.Write('Path = ' + objDrive.Path + '<BR>');
      Response.Write('Root folder = ' + objDrive.RootFolder + '<BR>');
      Response.Write('Serial number = ' + objDrive.SerialNumber + '<BR>');
      Response.Write('Share name = ' + objDrive.ShareName + '<BR>');
      Response.Write('Volume name = ' + objDrive.VolumeName + '<BR>');
   }
}
%>

<A HREF="DisplaySource_js.asp?FileName=<%= Server.URLEncode(Request.ServerVariables("PATH_INFO")) %>">Click here to see ASP source</A>
