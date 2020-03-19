<%if Request.Form.Count = 0 and Request.QueryString.Count = 0 then 'display login form%>
<html>
	<head>
		<title>Please login</title>
	</head>
	<body>
		<form name="theform" method="post" action="<%= Request.ServerVariables("SCRIPT_NAME")%>">
			Enter the name you would like to use in the chat room:
			<input type="text" name="txtUserName" value="Default User">
			<input type="hidden" name="page" value="login">
			<input type="submit" value="Enter Chat Room">
		</form>
	</body>
</html>
<%elseif Request.Form("page") = "login" then 'user is loging in
	if Request.Form("txtUserName") <> "" then 'username is not blank
		'create session variable
		Session("CHATUSERNAME") = Request.Form("txtUserName")
	else 'put in our own name
		Session("CHATUSERNAME") = "Default User"
	end if 'for empty name check
	
	'randomize color for name enter
	randomize
	select case Int((9 - 1 + 1) * Rnd + 1)
		case 1
			strColor = "red"
		case 2
			strColor = "green"
		case 3
			strColor = "blue"
		case 4
			strColor = "yellow"
		case 5
			strColor = "orange"
		case 6
			strColor = "purple"
		case 7
			strColor = "aqua"
		case 8
			strColor = "lime"
		case 9 
			strColor = "maroon"
	end select

	APPLICATION.LOCK
	Application("txt20") = Application("txt19")
	Application("txt19") = Application("txt18")
	Application("txt18") = Application("txt17")
	Application("txt17") = Application("txt16")
	Application("txt16") = Application("txt15")
	Application("txt15") = Application("txt14")
	Application("txt14") = Application("txt13")
	Application("txt13") = Application("txt12")
	Application("txt12") = Application("txt11")
	Application("txt11") = Application("txt10")
	Application("txt10") = Application("txt9")
	Application("txt9") = Application("txt8")
	Application("txt8") = Application("txt7")
	Application("txt7") = Application("txt6")
	Application("txt6") = Application("txt5")
	Application("txt5") = Application("txt4")
	Application("txt4") = Application("txt3")
	Application("txt3") = Application("txt2")
	Application("txt2") = Application("txt1")
	Application("txt1") = "<FONT COLOR=""" & strColor & """>** " & Session("CHATUSERNAME") & " enters chatroom **</FONT>"
	APPLICATION.UNLOCK
'show frame set page%>
<html>
	<head>
		<title>Chat</title>
	</head>
	<frameset rows="100,325,*" framespacing="0" border="0" frameborder="0">
		<frame src="chat.asp" target="_parent" scrolling="no" noresize>
		<frame src="<%= Request.ServerVariables("SCRIPT_NAME")%>?page=view" scrolling="auto">
		<frame src="<%= Request.ServerVariables("SCRIPT_NAME")%>?page=submit">
	</frameset>
</html>
<%elseif Request.QueryString("page") = "view" then 'show the text%>
<HTML>
	<HEAD>
		<title>Chat View</title>
		<META HTTP-EQUIV="REFRESH" CONTENT="5;<%= Request.ServerVariables("SCRIPT_NAME")%>?page=view">
	</HEAD>
	<BODY topMargin=0>
		<FONT SIZE=2>
			<%= Application("txt20")%><BR>
			<%= Application("txt19")%><BR>
			<%= Application("txt18")%><BR>
			<%= Application("txt17")%><BR>
			<%= Application("txt16")%><BR>
			<%= Application("txt15")%><BR>
			<%= Application("txt14")%><BR>
			<%= Application("txt13")%><BR>
			<%= Application("txt12")%><BR>
			<%= Application("txt11")%><BR>
			<%= Application("txt10")%><BR>
			<%= Application("txt9")%><BR>
			<%= Application("txt8")%><BR>
			<%= Application("txt7")%><BR>
			<%= Application("txt6")%><BR>
			<%= Application("txt5")%><BR>
			<%= Application("txt4")%><BR>
			<%= Application("txt3")%><BR>
			<%= Application("txt2")%><BR>
			<%= Application("txt1")%>
		</FONT>
	</BODY>
</HTML>
<%elseif Request.QueryString("page") = "submit" then 'show submit form
	If not Request.Form("message")="" THEN
		APPLICATION.LOCK
		Application("txt20") = Application("txt19")
		Application("txt19") = Application("txt18")
		Application("txt18") = Application("txt17")
		Application("txt17") = Application("txt16")
		Application("txt16") = Application("txt15")
		Application("txt15") = Application("txt14")
		Application("txt14") = Application("txt13")
		Application("txt13") = Application("txt12")
		Application("txt12") = Application("txt11")
		Application("txt11") = Application("txt10")
		Application("txt10") = Application("txt9")
		Application("txt9") = Application("txt8")
		Application("txt8") = Application("txt7")
		Application("txt7") = Application("txt6")
		Application("txt6") = Application("txt5")
		Application("txt5") = Application("txt4")
		Application("txt4") = Application("txt3")
		Application("txt3") = Application("txt2")
		Application("txt2") = Application("txt1")
		Application("txt1") = "<B>" & Session("CHATUSERNAME") & ":</B> " & _
			"<span style=color:" & Request.Form("optColor") & ">" & Request.Form("message") & "</span>"
		APPLICATION.UNLOCK
	END IF
%>
<html>
	<head>
		<title>Chat Submit</title>
	</head>
	<body topMargin=0>
		<center>
			<form METHOD="POST" ACTION="<%= Request.ServerVariables("SCRIPT_NAME")%>?page=submit" id=form1 name=form1>
				<font SIZE="2">Type your message, select a color, and click send.</font><br>
				<table BORDER="0" CELLSPACING="0">
					<tr>
						<td colspan="6">
							<input NAME="message" TYPE="TEXT" SIZE="60"> 
							<input TYPE=submit name=submit1 value="Send Message">
						</td>
						<td>
						</td>
					</tr>
					<tr>
						<td bgcolor="Navy"><INPUT type="radio" id=radio1 name=optColor value="navy"><label for="radio1"><font color="#FFFFFF">Navy</font></label></td>
						<td bgcolor="Maroon"><INPUT type="radio" id=radio2 name=optColor value="maroon"><label for="radio2">Maroon</label></td>
						<td bgcolor="Teal"><INPUT type="radio" id=radio3 name=optColor value="teal"><label for="radio3">Teal</label></td>
						<td bgcolor="Lime"><INPUT type="radio" id=radio4 name=optColor value="lime"><label for="radio4">Lime</label></td>
						<td bgcolor="Indigo"><INPUT type="radio" id=radio5 name=optColor value="indigo"><label for="radio5"><font color="#FFFFFF">Indigo</font></label></td>
						<td bgcolor="Gold"><INPUT type="radio" id=radio6 name=optColor value="gold"><label for="radio6">Gold</label></td>
						<td bgcolor="Cyan"><INPUT type="radio" id=radio7 name=optColor value="cyan"><label for="radio7">Cyan</label></td>
					</tr>
					<tr>
						<td bgcolor="FireBrick"><INPUT type="radio" id=radio8 name=optColor value="firebrick"><label for="radio8">FireBrick</label>	</td>
						<td bgcolor="darkkhaki"><INPUT type="radio" id=radio9 name=optColor value="darkkhaki"><label for="radio9">Darkkhaki</label></td>
						<td bgcolor="Chocolate"><INPUT type="radio" id=radio10 name=optColor value="chocolate"><label for="radio10">Chocolate</label></td>
						<td bgcolor="Darkorchid"><INPUT type="radio" id=radio11 name=optColor value="darkorchid"><label for="radio11">Darkorchid</label></td>
						<td bgcolor="Indianred"><INPUT type="radio" id=radio12 name=optColor value="indianred"><label for="radio12">Indianred</label></td>
						<td bgcolor="Crimson"><INPUT type="radio" id=radio13 name=optColor value="crimson"><label for="radio13">Crimson</label>	</td>
						<td bgcolor="Darkgreen"><INPUT type="radio" id=radio14 name=optColor value="darkgreen"><label for="radio14">Darkgreen</label></td>
					</tr>
				</table>
			</form>
		</center>
	</body>
</html>
<%end if%>