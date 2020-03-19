<HTML>
<HEAD>
   <TITLE>Demo of the Dictionary object</TITLE>
</HEAD>
<BODY>
<H1>How did you find our web site?</H1>

<FORM ACTION="FeedbackExample_vbs.asp" METHOD="POST">
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
If Request.Form.Count > 1 Then
   Set objMyDict = Server.CreateObject("Scripting.Dictionary")
   For Each objItem In Request.Form
      objMyDict.Add objItem, Request.Form(objItem)
   Next
   Response.Write "<P>You submitted the following " & _
                  "key/item pairs:</P>"
   arrKeys = objMyDict.Keys()
   arrItems = objMyDict.Items()
   For intLoop = 0 To objMyDict.Count -1
      strThisKey = arrKeys(intLoop)
      strThisItem = arrItems(intLoop)
      Response.Write "<P>&nbsp;&nbsp;&nbsp;&nbsp;" & strThisKey & _
                     " = " & strThisItem & "</P>"
   Next
   Response.Write "<P><B>Thank you for completing " & _
                  "our feedback form.</B></P>"
   objMyDict.RemoveAll
End If

%>
</BODY>
</HTML>
