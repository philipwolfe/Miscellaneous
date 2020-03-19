<%@ LANGUAGE="JScript" %>
<!-- METADATA TYPE="typelib" 
              FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->
<%
var dbConnection, rsExample, strConnect, cmdExample;
strConnect = Application("dbConnection");

dbConnection = Server.CreateObject("ADODB.Connection");
cmdExample = Server.CreateObject("ADODB.Command");
dbConnection.Open(strConnect);

cmdExample.ActiveConnection = dbConnection;
cmdExample.CommandText = "reptq3";
cmdExample.CommandType = adCmdStoredProc;
cmdExample.Parameters.Refresh();
%>
<TABLE border=1><TR><TH>Name</TH><TH>Type</TH><TH>Size</TH><TH>Direction</TH></TR>
<%
enmParm=new Enumerator(cmdExample.Parameters);
while (!enmParm.atEnd()) {
   parm=enmParm.item();
   Response.Write("<TR>");
   Response.Write("<TD>" + parm.Name + "</TD>");
   Response.Write("<TD>" + parm.Type + "</TD>");
   Response.Write("<TD>" + parm.Size + "</TD>");
   switch (parm.Direction) {
     case 1:
        strDir = "Input";
        break;
     case 2:
        strDir = "Output";
        break;
     case 3:
        strDir = "Input/Output";
        break;
     case 4:
        strDir = "Return"
   }
   Response.Write("<TD>" + strDir + "</TD>");
   Response.Write("</TR>");
   enmParm.moveNext();
}
Response.Write('</TABLE>');
delete enmParm;
delete cmdExample;
dbConnection.Close();
delete dbConnection;
%>
