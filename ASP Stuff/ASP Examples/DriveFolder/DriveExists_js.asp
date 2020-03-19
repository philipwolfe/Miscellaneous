<%@ LANGUAGE="JScript" %>
<%
// JScript
var objFSO = Server.CreateObject('Scripting.FileSystemObject');
for (var intCode = 65; intCode <= 90; intCode++) {
   strLetter = String.fromCharCode(intCode);
   if (objFSO.DriveExists(strLetter))
      Response.Write('Found drive ' + strLetter + ':<BR>');
}

%>