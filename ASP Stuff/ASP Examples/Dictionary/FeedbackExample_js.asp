<%@ LANGUAGE="JScript" %>
<HTML>
<HEAD>
   <TITLE>Demo of the Dictionary object</TITLE>
</HEAD>
<BODY>
<H1>How did you find our web site?</H1>

<FORM ACTION="FeedbackExample_js.asp" METHOD="POST">

<TABLE CELLSPACING=10>
<TR><TD>How do you rate our web site overall?</TD>
<TD><INPUT TYPE="RADIO" NAME='Web Site Overall'
           VALUE="Very Good">Very Good</INPUT>
<TD><INPUT TYPE="RADIO" NAME='Web Site Overall'
           VALUE="Good">Good</INPUT></TD>
<TD><INPUT TYPE="RADIO" NAME='Web Site Overall'
           VALUE="OK">OK</INPUT></TD>
<TD><INPUT TYPE="RADIO" NAME='Web Site Overall' 
           VALUE="Poor">Poor</INPUT></TD></TR>
<TR></TR>

<TR><TD>How are our web site contents?</TD>
<TD><INPUT TYPE="RADIO" NAME='Web Site Content'
           VALUE="Very Good">Very Good</INPUT></TD>
<TD><INPUT TYPE="RADIO" NAME='Web Site Content'
           VALUE="Good">Good</INPUT></TD>
<TD><INPUT TYPE="RADIO" NAME='Web Site Content'
           VALUE="OK">OK</INPUT></TD>
<TD><INPUT TYPE="RADIO" NAME='Web Site Content'
           VALUE="Poor">Poor</INPUT><BR></TD></TR>
<TR></TR>

<TR><TD>How is our look and feel?</TD>
<TD><INPUT TYPE="RADIO" NAME='Web Site Look and Feel'
           VALUE="Very Good">Very Good</INPUT></TD>
<TD><INPUT TYPE="RADIO" NAME='Web Site Look and Feel'
           VALUE="Good">Good</INPUT></TD>
<TD><INPUT TYPE="RADIO" NAME='Web Site Look and Feel'
           VALUE="OK">OK</INPUT></TD>
<TD><INPUT TYPE="RADIO" NAME='Web Site Look and Feel'
           VALUE="Poor">Poor</INPUT></TD></TR>
</TABLE>

<INPUT TYPE="SUBMIT" VALUE="Submit">
</FORM><HR>
<%
if (Request.Form.Count>1) {
   objMyDict = Server.CreateObject('Scripting.Dictionary');
   var enmRadio = new Enumerator(Request.Form);
   for (; !enmRadio.atEnd(); enmRadio.moveNext()) {
      var objItem = enmRadio.item();
      objMyDict.Add(objItem, Request.Form(objItem));
   }
   Response.Write('<P>You submitted the following ' + 
                  'key/item pairs:</P>');
   var arrKeys = new VBArray(objMyDict.Keys()).toArray();
   var arrItems = new VBArray(objMyDict.Items()).toArray();
   for (intLoop = 0; intLoop < objMyDict.Count; intLoop++) {
      strThisKey = arrKeys[intLoop];
      strThisItem = arrItems[intLoop];
      Response.Write('<P>&nbsp;&nbsp;&nbsp;&nbsp;' + strThisKey +
                     ' = ' + strThisItem + '</P>');
   }
   Response.Write('<P><B>Thank you for completing ' +
                  'our feedback form.</B></P>')
   objMyDict.RemoveAll();
}

%>
</BODY>
</HTML>
