<%@ LANGUAGE = JScript %>
<!--METADATA TYPE="typelib" NAME="CDO for Windows 2000 Type Library"
             UUID="CD000000-8B95-11D1-82DB-00C04FB1625D" -->
<!--METADATA TYPE="typelib" NAME="ADODB Type Library"
             UUID="00000205-0000-0010-8000-00AA006D2EA4" -->

<%
function MsgFileName (msgsColl, msg) {
   strFileName = msgsColl.FileName(msg);
   strFileName = strFileName.substring(strFileName.lastIndexOf ("\\")+1,                  strFileName.length);
   return strFileName;
   }

function DisplayMsgsTable (msgsColl) {
   strTableHeader = "<P><TABLE WIDTH=\"100%\" BORDER=\"1\"" + 
                   "BGCOLOR=\"Silver\" CELLSPACING=\"1\" " + 
                   "CELLPADDING=\"1\"><TR BGCOLOR=\"Yellow\">" + 
                   "<TD><B>From</B></TD><TD><B>Subject</B></TD></TR>";
   strTableFooter = "</TABLE><P>";
   Response.Write(strTableHeader);
   var objEnum = new Enumerator(msgsColl);
   for (;!objEnum.atEnd();objEnum.moveNext()) {
      var objItem = objEnum.item();
      Response.Write("<TR><TD>" + objItem.From + "</TD>");
      Response.Write("<TD>" + objItem.Subject + "</TD>");
      Response.Write("<TD>" + MsgFileName(msgsColl, objItem));
      Response.Write( "</TD></TR>");
   }
   Response.Write(strTableFooter);
}

strNewDropPath = "c:\\mailboxes";
%>

<HTML>
<HEAD>
<TITLE>CDO2000 sample 5 - Working with Drop Directories</TITLE>
</HEAD>
<BODY>
We are moving the following message files from the default 
SMTP drop directory to the " <%= strNewDropPath%>" directory.
<P>
<%
objDropDir = Server.CreateObject("CDO.DropDirectory");
objMsgsColl = objDropDir.GetMessages();

DisplayMsgsTable(objMsgsColl);
lngCounter = 0;

var objEnum = new Enumerator(objMsgsColl);
for (;!objEnum.atEnd();objEnum.moveNext()) {
   var objItem = objEnum.item();
   objStream = objItem.GetStream();
   objStream.SaveToFile(strNewDropPath + "\\" + MsgFileName(objMsgsColl, objItem));
   objStream.Close();
   delete objStream;
   lngCounter++;   
}

objMsgsColl.DeleteAll();
delete(objMsgsColl);
%>
<P>We have moved <%= lngCounter %> messages 
to the new location.<BR>
Now we are opening the " <%= strNewDropPath%>" drop directory  
that contains the following messages.

<P>
<%
objMsgsColl = objDropDir.GetMessages(strNewDropPath);
DisplayMsgsTable(objMsgsColl);

delete objMsgsColl;   
delete objDropDir;
%>
</BODY>
</HTML>


