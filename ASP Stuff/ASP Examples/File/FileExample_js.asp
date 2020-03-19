<%@ LANGUAGE="JScript" %>
<HTML>
<HEAD>
   <TITLE>Details of a File</TITLE>
</HEAD>
<BODY>
   <H2>Details of a File - Using the File Object</H2>

Please enter your file name (including its full path):
<FORM METHOD="POST" ACTION="FileExample_js.asp">
<INPUT NAME="FilePath"></INPUT><BR><BR>
<INPUT TYPE="SUBMIT" NAME="submit" VALUE="View Details">
</FORM>
<HR>

<%
var strFilePath = Request.Form('FilePath');

if (String(strFilePath) != 'undefined') {
   objFSO = Server.CreateObject('Scripting.FileSystemObject');
   objFile = objFSO.GetFile(strFilePath);

   Response.Write('<B>Properties of your file:</B><BR>');
   Response.Write('Name: ' + objFile.Name + '<BR>');
   Response.Write('ShortName: ' + objFile.ShortName + '<BR>');
   Response.Write('Size: ' + objFile.Size + ' bytes <BR>');
   Response.Write('Type: ' + objFile.Type + '<BR>');
   Response.Write('Path: ' + objFile.Path + '<BR>');
   Response.Write('ShortPath: ' + objFile.ShortPath + '<BR>');
   Response.Write('Created: ' + objFile.DateCreated + '<BR>');
   Response.Write('LastModified: ' + objFile.DateLastModified + '<P>');
}
%>