<%@ LANGUAGE="JScript" %>
<HTML>
<HEAD>
<TITLE>Seacrhing Directories</TITLE>
</HEAD>
<BODY>
<H1>Searching with ADSI and ADO</H1>

<%
objConnection = Server.CreateObject("ADODB.Connection");
objCommand = Server.CreateObject("ADODB.Command");

objConnection.Provider = "ADsDSOObject";
objConnection.Open("Active Directory Provider");
objCommand.ActiveConnection = objConnection;
Response.Write("<P><P><P>");

strCommand = "<LDAP://CRASHLOTS/DC=LT,DC=local>;" +
             "(objectCategory=Person);sAMAccountName," +
             "ADsPath;subtree";
objCommand.CommandText = strCommand;

Response.Write("<P>This page displays the results from the " +
             "following search request:<BR>" + 
             objCommand.CommandText + "<P>");

objRecordset = objCommand.Execute(strCommand);

while (!objRecordset.EOF) {
   var enumFields = new Enumerator(objRecordset.Fields);
   for (;!enumFields.atEnd();enumFields.moveNext()) {
      var objFieldsItem = enumFields.item();
      Response.Write(objFieldsItem.Value + "<BR>")
   }
   objRecordset.MoveNext();
Response.Write("<BR>");
}
%>

</BODY>
</HTML>
