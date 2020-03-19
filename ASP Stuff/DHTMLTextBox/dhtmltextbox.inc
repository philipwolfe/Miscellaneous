<%

Dim Black, White
Black = "#000000"
White = "#FFFFFF"

Class DHTMLTextBox
	Private i, j, k
	Private tempArray(10,10)
	Private CustomFonts()
	
	Private ButtonBG
	Private ButtonLight
	Private ButtonDark
	
	Public ColorsArray
	Public ButtonsArray
	Public FontsArray
	Public ArrangementArray
	Public OptionsStyle
	Public TextBoxStyle
	Public TableBorderColorLight
	Public TableBorderColorDark
	Public HTMLMessage
	Public ImageFolder
	

	Private Sub Class_Initialize()
		Redim CustomFonts(7,0)
		CustomFonts(0,0) = "Normal"
		CustomFonts(1,0) = "Arial"
		CustomFonts(2,0) = 1
		CustomFonts(3,0) = "#000000"
		CustomFonts(4,0) = 0
		CustomFonts(5,0) = 0
		CustomFonts(6,0) = 0
		CustomFonts(7,0) = NULL
		
		OptionsStyle = "background:#CCCCCC; font-face: Arial; font-size: 10px; font-color: #000066;"
		TextBoxStyle = "background:#FFFFFF; font-face: Arial; font-size: 10px; font-color: #000000;"	
		BGColor = "#BFBFBF"
		ButtonLight = "#FFFFFF"
		ButtonDark = ColorShift(BGColor, .54)
		TableBorderColorDark  = "#000000"
		TableBorderColorLight = "#999999"
		HTMLMessage	= "HTML"
		ImageFolder = "dhtmleditor/"
		
		ColorsArray = Array("#000000","#666666","#FFFFFF",_
					"#FF0000","#FF0099","#FF00FF",_
					"#9900FF","#0000FF","#0066FF",_	
					"#00FFFF","#00FF99","#00FF00",_
					"#99FF00","#FFFF00","#FF9900",_
					"#996633")
		ButtonsArray = Array("cut","Cut","copy","Copy","paste","Paste","link","Insert Link",_
					"separator","","bold","Bold","italics","Italics","underline","Underline",_
					"separator","","left","Align Left","center","Align Center","right","Align Right",_
					"separator","","numbers","Numbered List","bullets","Bulleted List",_
					"indent","Increase Indent","outdent","Decrease Indent")	
		FontsArray = Array("Verdana", "Arial", "Times","Tahoma","Garamond", "Courier")
			
		tempArray(0,0) = "fontfaces"
		tempArray(1,0) = "fontcolors"
		tempArray(2,0) = "fontsizes"
		tempArray(3,0) = "html"
		'tempArray(3,0) = "customfonts"
		tempArray(0,1) = "buttons"
		'tempArray(0,2) = "table"	
		'tempArray(1,2) = "html"
				
		ArrangementArray = tempArray
	End Sub 
	
	Property Let BGColor(Color)
		ButtonBG = Color
		ButtonDark = ColorShift(Color, .54)
	End Property
	
	Property Get BGColor()
		BGColor = ButtonBG
	End Property
	
	Public Sub AddCustomFont(Title, theFace, theSize, theColor, Bold, Italic, UnderLine, Alignment)
		Dim LastOne
		LastOne = Ubound(CustomFonts, 2) + 1
		Redim Preserve CustomFonts(7, LastOne)
		
		CustomFonts(0, LastOne) = Title
		CustomFonts(1, LastOne) = theFace
		CustomFonts(2, LastOne) = theSize
		CustomFonts(3, LastOne) = theColor
		CustomFonts(4, LastOne) = CBool(Bold)
		CustomFonts(5, LastOne) = CBool(Italic)
		CustomFonts(6, LastOne) = CBool(Underline)
		CustomFonts(7, LastOne) = Alignment	
		
	End Sub

	Private Function ColorShift(HexValue, Percent)
		HexValue = Replace(HexValue,"#","")
		Do While Len(HexVAlue) < 6
			HexValue = HexValue & "0"
		Loop


		Dim Red, Blue, Green, Final
		Red = CInt("&h" & Left(HexValue,2))
		Green = CInt("&h" & Mid(HexValue,3,2))
		Blue = CInt("&h" & Mid(HexValue,5,2))

		Red = Red * Percent
		If Red < 0 Then Red = 0
		If Red > 256 Then Red = 256

		Green = Green * Percent
		If Green < 0 Then Green = 0
		If Green > 256 Then Green = 256

		Blue = Blue * Percent
		If Blue < 0 Then Blue = 0
		If Blue > 256 Then Blue = 256

		Final  = _
			Right("0" & Hex(Red), 2) & _
			Right("0" & Hex(Green), 2) & _
			Right("0" & Hex(Blue), 2)

		ColorShift = "#" & Final
	End Function
	
	Private Sub SpacerLines()
		Response.Write("<TR><TD BGCOLOR=""" & ButtonDark & """ HEIGHT=""1"">")
			Call Spacer(1,1,NULL)
		Response.Write("</TD></TR>")	
		Response.Write("<TR><TD BGCOLOR=""" & ButtonLight & """ HEIGHT=""1"">")
			Call Spacer(1,1,NULL)
		Response.Write("</TD></TR>")
		Response.Write("<TR><TD BGCOLOR=""" & BGColor & """ HEIGHT=""1"">")
			Call Spacer(1,1,NULL)
		Response.Write("</TD></TR>")
		Response.Write("<TR>") 	
	End Sub

	Private Sub Separator()
		Response.Write("<TD>")   
			Response.Write("<TABLE WIDTH=""0"" CELLPADDING=""0"" CELLSPACING=""0"" BORDER=""0"">")
				Response.Write("<TR>")
					Response.Write("<TD BGCOLOR=""" & BGColor & """>")
						Call Spacer(2,21,NULL)
					Response.Write("</TD>")
					Response.Write("<TD BGCOLOR=""" & ButtonDark & """>")
						Call Spacer(1,21,NULL)
					Response.Write("</TD>")
					Response.Write("<TD BGCOLOR=""" & ButtonLight & """>")
						Call Spacer(1,21,NULL)
					Response.Write("</TD>")					
					Response.Write("<TD BGCOLOR=""" & BGColor & """>")
						Call Spacer(1,21,NULL)
					Response.Write("</TD>")					
				Response.Write("</TR>")
			Response.Write("</TABLE>")				
		Response.Write("</TD>")		
	End Sub
	
	Private Sub LeftEdge()
		Response.Write("<TABLE CELLPADDING=""0"" CELLSPACING=""0"" BORDER=""0"">")
			Response.Write("<TR>")
				Response.Write("<TD ROWSPAN=""5"" BGCOLOR=""" & ButtonLight & """>")
					Call Spacer(1,23,NULL)
				Response.Write("</TD>")
				Response.Write("<TD COLSPAN=""5"" BGCOLOR=""" & BGColor & """>")
					Call Spacer(7,1,NULL)
			Response.Write("</TR>")
			Response.Write("<TR>")
				Response.Write("<TD ROWSPAN=""4"" BGCOLOR=""" & BGColor & """>")
					Call Spacer(1,22,NULL)
				Response.Write("</TD>")			
				Response.Write("<TD ROWSPAN=""2"" BGCOLOR=""" & ButtonLight & """>")
					Call Spacer(1,20,NULL)
				Response.Write("</TD>")							
				Response.Write("<TD BGCOLOR=""" & ButtonLight & """>")
					Call Spacer(1,1,NULL)
				Response.Write("</TD>")
				Response.Write("<TD BGCOLOR=""" & ButtonDark & """>")
					Call Spacer(1,1,NULL)
				Response.Write("</TD>")
				Response.Write("<TD BGCOLOR=""" & BGColor & """>")
					Call Spacer(1,1,NULL)
				Response.Write("</TD>")				
			Response.Write("</TR>")
			Response.Write("<TR>")
				Response.Write("<TD BGCOLOR=""" & BGColor & """>")
					Call Spacer(1,19,NULL)
				Response.Write("</TD>")				
				Response.Write("<TD ROWSPAN=""2"" BGCOLOR=""" & ButtonDark & """>")
					Call Spacer(1,20,NULL)
				Response.Write("</TD>")								
				Response.Write("<TD ROWSPAN=""3"" BGCOLOR=""" & BGColor & """>")
					Call Spacer(1,21,NULL)
				Response.Write("</TD>")
			Response.Write("</TR>")			
			Response.Write("<TR>")
				Response.Write("<TD COLSPAN=""2"" BGCOLOR=""" & ButtonDark & """>")
					Call Spacer(2,1,NULL)
				Response.Write("</TD>")
			Response.Write("</TR>")
			Response.Write("<TR>")
				Response.Write("<TD COLSPAN=""3"" BGCOLOR=""" & BGColor & """>")
					Call Spacer(3,1,NULL)
				Response.Write("</TD>")
			Response.Write("</TR>")			
		Response.Write("</TABLE>")	
	
	End Sub
	
	Private Sub HTMLCommand()
		Response.Write("<TD>")
			Call OpenFont("Arial",2,Black)
				Response.Write("<INPUT onClick=""javascript:ChangeText('HMTL');"" TYPE=""checkbox"" NAME=""HTML"" VALUE=""1"">")
				Response.Write(HTMLMessage)
		Response.Write("</TD>")		
	End Sub
	
	Private Sub TableCommand()
		Response.Write("<TD>")
			Call Spacer(3,1,NULL)
		Response.Write("</TD>")
		Response.Write("<TD>")
			Call OpenFont("Arial",1,Black)
				Response.Write(" Rows ")
		Response.Write("</TD>")
		Response.Write("<TD>")
			Call Spacer(3,1,NULL)
		Response.Write("</TD>")	
		Response.Write("<TD>")
			Response.Write("<INPUT TYPE=""text"" NAME=""tablerows"" SIZE=""3"" MAXLENGTH=""3"" STYLE=""" & TextBoxStyle  & """>")
		Response.Write("</TD>")
		Response.Write("<TD>")
			Call Spacer(3,1,NULL)
		Response.Write("</TD>")		
		Response.Write("<TD>")
			Call OpenFont("Arial",1,Black)
				Response.Write(" Cols ")
		Response.Write("</TD>")		
		Response.Write("<TD>")
			Call Spacer(3,1,NULL)
		Response.Write("</TD>")				
		Response.Write("<TD>")				
			Response.Write("<INPUT TYPE=""text"" NAME=""tablecols"" SIZE=""3"" MAXLENGTH=""3"" STYLE=""" & TextBoxStyle  & """>")
		Response.Write("</TD>")
		Response.Write("<TD>")
			Call Spacer(3,1,NULL)
		Response.Write("</TD>")
		Response.Write("<TD>")
			Call MakeButton("table", "Insert Table")
		Response.Write("</TD>")		
	End Sub
	
	Private Sub MakeButton(Action, Over)
		Response.Write("<TABLE CELLPADDING=""0"" CELLSPACING=""0"" BORDER=""0"">")
			Response.Write("<TR>")
				Response.Write("<TD STYLE=""border:1; border-style:solid; border-color:" & BGColor & ";"" onMouseOver=""javascript:overBorder(this);"" onMouseDown=""javascript:downBorder(this);"" onMouseUp=""javascript:overBorder(this);"" onMouseOut=""javascript:restoreBorder(this);"">")
					Response.Write("<A HREF=""javascript:ChangeText('" & Action & "');void(0);"" onClick=""javascript:this.blur();"">")
						Call Image(ImageFolder & "" & Action & ".gif",21,21,NULL,NULL,Over)
					Response.Write("</A>")				
				Response.Write("</TD>")
			Response.Write("</TR>")	
		Response.Write("</TABLE>")
	End Sub
		
	Private Sub ShowFontFaces()
		Response.Write("<TD>")
			Call OpenFont("Arial",2,Black)
			Call Spacer(5,1,NULL)
			Response.Write("<SELECT ID=""fontface"" onChange=""ChangeText('fontface'); this.value=0;"" NAME=""fontface"" STYLE=""" & OptionsStyle & " width:80;"">")
				Response.Write("<OPTION VALUE=""0"">Face</OPTION>")
				For i = 0 to Ubound(FontsArray)
					Response.Write("<OPTION VALUE=""" & FontsArray(i) & """ >" & FontsArray(i) & "</OPTION>")
				Next
			Response.Write("</SELECT>")
		Response.Write("</TD>") 	
	End Sub
	
	Private Sub ShowFontColors()
		Response.Write("<TD>")
			Call OpenFont("Arial",2,Black)
			Call Spacer(5,1,NULL)						
			Response.Write("<SELECT ID=""fontcolor"" onClick=""ChangeText('fontcolor'); this.value=0;"" NAME=""fontcolor"" STYLE=""" & OptionsStyle & " width: 60;"">")
				Response.Write("<OPTION VALUE=""0"">Color</OPTION>")
				For i = 0 to Ubound(ColorsArray)
					Response.Write("<OPTION STYLE=""background:" & ColorsArray(i) & """ VALUE=""" & ColorsArray(i) & """>&nbsp;&nbsp;&nbsp;</OPTION>")
				Next
			Response.Write("</SELECT>")
		Response.Write("</TD>")	
	End Sub
	
	Private Sub ShowFontSizes()		
		Response.Write("<TD>")
			Call OpenFont("Arial",1,Black)
			Call Spacer(5,1,NULL)						
			Response.Write("<SELECT ID=""fontsize"" onChange=""ChangeText('fontsize'); this.value=0;"" NAME=""fontsize"" STYLE=""" & OptionsStyle & " width: 60;"">")
				Response.Write("<OPTION VALUE=""0"">Size</OPTION>")
				For i = 1 to 7
					Response.Write("<OPTION VALUE=""" & i & """>" & i & "</OPTION>")
				Next
			Response.Write("</SELECT>")
		Response.Write("</TD>")    
	End Sub	
	
	Private Sub ShowCustomFonts2()
		Response.Write("<TD>")
			Call OpenFont("Arial",2,Black)
			Call Spacer(5,1,NULL)						
			Response.Write("<SELECT ID=""custom"" onChange=""ChangeText('custom'); this.value=0;"" NAME=""custom"" STYLE=""" & OptionsStyle & """>")
				Response.Write("<OPTION VALUE=""0"">Custom Fonts</OPTION>")
				For i = 0 to Ubound(CustomArray,2)
					If CustomArray(0,i) <> "" Then
						Response.Write("<OPTION VALUE=""" & LCase(Replace(CustomArray(0,i), " ", "")) & """>" & CustomArray(0,i) & "</OPTION>")
					End If
				Next
			Response.Write("</SELECT>")
		Response.Write("</TD>")			
	End Sub
	
	Private Sub ShowCustomFonts()						
		Response.Write("<TD>")
			Call OpenFont("Arial",2,Black)
			Call Spacer(5,1,NULL)						
			Response.Write("<SELECT ID=""custom"" onChange=""ChangeText('custom'); this.value=0;"" NAME=""custom"" STYLE=""" & OptionsStyle & """>")
				Response.Write("<OPTION VALUE=""0"">Custom Fonts</OPTION>")
				For i = 0 to Ubound(CustomFonts,2)
					If CustomFonts(0,i) <> "" Then
						Response.Write("<OPTION VALUE=""" & LCase(Replace(CustomFonts(0,i), " ", "")) & """>" & CustomFonts(0,i) & "</OPTION>")
					End If
				Next
			Response.Write("</SELECT>")
		Response.Write("</TD>")			
	End Sub	
	
	Private Sub ShowButtons()
		For i = 0 to Ubound(ButtonsArray) Step 2
			Response.Write("<TD>")   
			If ButtonsArray(i) = "separator" Then 
				Call Separator()
				'Call Image(ImageFolder & "separator.gif",5,23,NULL,NULL,NULL)
			Else
				Call MakeButton(ButtonsArray(i), ButtonsArray(i+1))
			End If
			Response.Write("</TD>")	
		Next													
	End Sub
	
	
	Public Sub Draw(FrameName, FormName, theValue, Width, Height)
		
		'Call OpenScript()
		'	Call ImageRolloverScript()
		'	For i = 0 to Ubound(buttonsArray) Step 2
		'		If ButtonsArray(i) <> "separator" Then
		'			Call PredefineImage(ButtonsArray(i),ButtonsArray(i),"gif",24,23,1,1)
		'		End If			
		'	Next
		'	Call PredefineImage("table","table","gif",24,23,1,1)
		'Call CloseScript()
		
		Response.Write("<INPUT TYPE=""hidden"" NAME=""" & FrameName & """ VALUE="""">")
			
		Response.Write("<TABLE WIDTH=""" & Width & """ CELLPADDING=""0"" CELLSPACING=""0"" BORDER=""0"" BGCOLOR=""" & BGCOLOR & """>")
		
			For j = 0 to UBound(ArrangementArray, 2)
				If 	ArrangementArray(0,j) <> "" Then
					Call SpacerLines()
					Response.Write("<TR>")
						Response.Write("<TD>")
							Response.Write("<TABLE WIDTH=""0"" CELLPADDING=""0"" CELLSPACING=""0"" BORDER=""0"">")
								Response.Write("<TR>")
									Response.Write("<TD>")   
										Call LeftEdge()
									Response.Write("</TD>")								
				End If
				
				For k = 0 to UBound(ArrangementArray, 1)
					
					Select Case lcase(ArrangementArray(k,j))
						Case "fontfaces"
							If k > 0 Then Call Separator()
							Call ShowFontFaces()
						Case "fontcolors"
							If k > 0 Then Call Separator()
							Call ShowFontColors()
						Case "fontsizes"
							If k > 0 Then Call Separator()
							Call ShowFontSizes()							
						Case "customfonts"
							If k > 0 Then Call Separator()
							Call ShowCustomFonts()
						Case "table"
							If k > 0 Then Call Separator()
							Call TableCommand()
						Case "buttons"
							If k > 0 Then Call Separator()
							Call ShowButtons()
						Case "html"
							If k > 0 Then Call Separator()
							Call HTMLCommand()							
					End Select				
				Next		
				
				If 	ArrangementArray(0,j) <> "" Then
								Response.Write("</TR>")
							Response.Write("</TABLE>")
						Response.Write("</TD>")
					Response.Write("</TR>")
				End If				
			Next
		
		Response.Write("</TABLE>")

		Call OpenScript()

		Response.Write("var buttonBG = """ & BGColor & """;")
		Response.Write("var buttonLight = """ & ButtonLight & """;")
		Response.Write("var buttonDark = """ & ButtonDark & """;")

		Response.Write("function overBorder(theTD) {")
			Response.Write("theTD.style.borderTopColor=buttonLight;")
			Response.Write("theTD.style.borderRightColor=buttonDark;")
			Response.Write("theTD.style.borderLeftColor=buttonLight;")
			Response.Write("theTD.style.borderBottomColor=buttonDark;")
		Response.Write("}")
		Response.Write("function downBorder(theTD) {")
			Response.Write("theTD.style.borderTopColor=buttonDark;")
			Response.Write("theTD.style.borderRightColor=buttonLight;")
			Response.Write("theTD.style.borderLeftColor=buttonDark;")
			Response.Write("theTD.style.borderBottomColor=buttonLight;")
		Response.Write("}")
		Response.Write("function restoreBorder(theTD) {")
			Response.Write("theTD.style.borderTopColor=buttonBG;")
			Response.Write("theTD.style.borderRightColor=buttonBG;")
			Response.Write("theTD.style.borderLeftColor=buttonBG;")
			Response.Write("theTD.style.borderBottomColor=buttonBG;")
		Response.Write("}")		

		Response.Write("function copyToHidden() {")
			Response.Write("if (document." & FormName & ".HTML.checked) {  	  ")
				Response.Write("document." & FormName & "." & FrameName & ".value = " & FrameName & "FRAME.document.body.innerText;")
			Response.Write("} else {")
				Response.Write("document." & FormName & "." & FrameName & ".value = " & FrameName & "FRAME.document.body.innerHTML;")
			Response.Write("}")
			Response.Write("if (document." & FormName & "." & FrameName & ".value == '<P>&nbsp;</P>') {")
				Response.Write("document." & FormName & "." & FrameName & ".value = '';")
			Response.Write("}")
		Response.Write("}")

		Response.Write("document.write('<IFRAME onBlur=""copyToHidden();"" id=""" & FrameName & "FRAME"" VALIGN=""top"" WIDTH=""" & Width & """ HEIGHT=""" & Height & """></IFRAME>');")
		
		Response.Write("function Init() {")
			Response.Write(FrameName & "FRAME.document.designMode = 'On'; ")
			Response.Write(FrameName & "FRAME.document.open(); ")
			Response.Write(FrameName & "FRAME.document.write('<STYLE>body{font:8pt Verdana;}</STYLE>'); ")		
			Response.Write(FrameName & "FRAME.document.close(); ")
			If IsNull(theValue) Then theValue = ""
			Response.Write(FrameName & "FRAME.document.body.innerHTML = '" & Replace(Replace(Replace(theValue, "'", "&#39;"), CHR(10), ""), CHR(13), "") & "'; ")
			Response.Write("document." & FormName & "." & FrameName & ".value = " & FrameName & "FRAME.document.body.innerHTML;")				
		Response.Write("}")
		Response.Write("window.onload=Init; ")
		
		FrameName = FrameName & "FRAME"	

		Response.Write("function ValidInteger(theValue){")
			Response.Write("if (!(isNaN(theValue))) return (Math.floor(Number(theValue)) == Number(theValue));")
			Response.Write("else return false;")
		Response.Write("}")

		Response.Write("function ChangeText(command) {")
			Response.Write("switch(command) {")

			  Response.Write("case 'bold': ")
				 Response.Write(FrameName & ".document.execCommand('Bold','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'italics': ")
				 Response.Write(FrameName & ".document.execCommand('Italic','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'underline': ")
				 Response.Write(FrameName & ".document.execCommand('Underline','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'link': ")
				 Response.Write("if(navigator.appVersion.indexOf('MSIE4.0')!= -1) ")
					Response.Write(FrameName & ".document.execCommand('CreateLink','   '); ")
				 Response.Write("else ")
					Response.Write(FrameName & ".document.execCommand('CreateLink',null); ")
				 Response.Write("break; ")
				 Response.Write("return true; ")
			  Response.Write("case 'numbers': ")
				 Response.Write(FrameName & ".document.execCommand('InsertOrderedList','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'bullets': ")
				 Response.Write(FrameName & ".document.execCommand('InsertUnOrderedList','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'cut': ")
				 Response.Write(FrameName & ".document.execCommand('Cut','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'copy': ")
				 Response.Write(FrameName & ".document.execCommand('Copy','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'paste': ")
				 Response.Write(FrameName & ".document.execCommand('Paste','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'left': ")
				 Response.Write(FrameName & ".document.execCommand('JustifyLeft','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'center': ")
				 Response.Write(FrameName & ".document.execCommand('JustifyCenter','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'right': ")
				 Response.Write(FrameName & ".document.execCommand('JustifyRight','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'indent': ")
				 Response.Write(FrameName & ".document.execCommand('Indent','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'outdent': ")
				 Response.Write(FrameName & ".document.execCommand('Outdent','',''); ")
				 Response.Write("return true; ")
			  Response.Write("case 'fontcolor': ")
				 Response.Write(FrameName & ".document.execCommand('ForeColor','',document." & FormName & ".fontcolor.value); ")
				 Response.Write(FrameName & ".document.focus();  ")
				 Response.Write("return true; ")
			  Response.Write("case 'fontface': ")
				 Response.Write(FrameName & ".document.execCommand('FontName','',document." & FormName & ".fontface.value); ")
				 Response.Write(FrameName & ".document.focus();  ")
				 Response.Write("return true;  ")
			  Response.Write("case 'fontsize': ")
				 Response.Write(FrameName & ".document.execCommand('FontSize','',document." & FormName & ".fontsize.value); ")
				 Response.Write(FrameName & ".document.focus();  ")
				 Response.Write("return true;   ")
			  Response.Write("case 'quote': ")
				 Response.Write(FrameName & ".document.execCommand('Indent','',''); ")
				 Response.Write(FrameName & ".document.execCommand('FontSize','',1); ")
				 Response.Write(FrameName & ".document.focus();  ")
				 Response.Write("return true;   ")			 
			  Response.Write("case 'HMTL': ")
				 Response.Write("var temphtml; ")
				 Response.Write("if (document." & FormName & ".HTML.checked) {  	  ")
					Response.Write("temphtml = " & FrameName & ".document.body.innerHTML; ")
					Response.Write(FrameName & ".document.body.innerHTML = ''; ")
					Response.Write(FrameName & ".document.body.innerText = temphtml; ")
				 Response.Write("} ")
				 Response.Write("else { ")
					Response.Write("temphtml =  " & FrameName & ".document.body.innerText; ")
					Response.Write(FrameName & ".document.body.innerText = ''; ")
					Response.Write(FrameName & ".document.body.innerHTML = temphtml; ")
				 Response.Write("} ")
				 Response.Write("return true;    ")
			  Response.Write("case 'custom': ")
				For i = 0 to Ubound(CustomFonts,2)
					Response.Write("switch(document." & FormName & ".custom.value) {")

					If CustomFonts(0,i) <> "" Then
						Response.Write("case '" & lcase(Replace(CustomFonts(0,i), " ", "")) & "': ")
							Response.Write(FrameName & ".document.execCommand('ForeColor','','" & CustomFonts(1,i) & "'); ")
							Response.Write(FrameName & ".document.execCommand('FontSize','','" & CustomFonts(2,i) & "'); ")				
							Response.Write(FrameName & ".document.execCommand('FontName','','" & CustomFonts(3,i) & "'); ")
							If CustomFonts(4,i) <> "" Then
								If CBool(CustomFonts(4,i)) = True Then
									Response.Write(FrameName & ".document.execCommand('Bold','',''); ")
								End If
							End If
							If CustomFonts(5,i) <> "" Then
								If CBool(CustomFonts(5,i)) = True Then
									Response.Write(FrameName & ".document.execCommand('Italic','',''); ")
								End If
							End If
							If CustomFonts(6,i) <> "" Then
								If CBool(CustomFonts(6,i)) = True Then
									Response.Write(FrameName & ".document.execCommand('Underline','',''); ")
								End If
							End If			
							If lcase(CustomFonts(7,i)) = "right" OR lcase(CustomFonts(7,i)) = "left" OR lcase(CustomFonts(7,i)) = "center" Then
								Response.Write(FrameName & ".document.execCommand('Justify" & Ucase(Left(CustomFonts(7,i),1)) & lcase(Right(CustomFonts(7,i),Len(CustomFonts(7,i))-1)) & "','',''); ")
							End If
					End If
					Response.Write(FrameName & ".focus();")
					Response.Write("}")
				Next
			  Response.Write("return true;    ") 
			
			  Response.Write("case 'table': ")
				Response.Write("if (document." & FormName & ".tablerows.value == '' || !(ValidInteger(document." & FormName & ".tablerows.value))) { ")
					Response.Write("alert ('You must enter a valid number of rows for the table.'); ")
					Response.Write("return false; ")
				Response.Write("} ")
				Response.Write("if (document." & FormName & ".tablecols.value == '' || !(ValidInteger(document." & FormName & ".tablecols .value))) { ")
					Response.Write("alert ('You must enter a valid number of columns for the table.'); ")
					Response.Write("return false; ")
				Response.Write("} ")

				Response.Write("var tablecode; ")
				Response.Write("tablecode = ''; ")
				Response.Write("for (i = 1;i<=" & FormName & ".tablerows.value;i++) { ")
					Response.Write("tablecode = tablecode + '<TR>'; ")
					Response.Write("for (j = 1;j<=" & FormName & ".tablecols.value;j++) { ")
						Response.Write("tablecode = tablecode + '<TD VALIGN=top><FONT SIZE=1>&nbsp;</TD>'; ")
					Response.Write("} ")
					Response.Write("tablecode = tablecode + '</TR>'; ")
				Response.Write("} ")

				Response.Write("tablecode = '<TABLE BORDER=1 BORDERCOLORLIGHT=" & TableBorderColorLight & " BORDERCOLORDARK=" & TableBorderColorDark & " CELLSPACING=0 CELLPADDING=0>' + tablecode + '</table>'; ")
				Response.Write(FrameName & ".document.body.innerHTML = " & FrameName & ".document.body.innerHTML + tablecode; ")
				Response.Write("alert('You resize the table by clicking on it or delete it by pressing the delete key.'); ")
				Response.Write(FrameName & ".document.body.focus(); ")
				Response.Write("return true; ")

			Response.Write("}")
		Response.Write("}")

		Call CloseScript()	
	End Sub
	
End Class

'--------Global Variables------------
Dim ImagePrefix
ImagePrefix = "/images/"

'--------HTML Formatting--------------

Sub OpenScript()
	Response.Write("<SCRIPT LANGUAGE=""Javascript"">")
End Sub

Sub CloseScript()
	Response.Write("</SCRIPT>")
End Sub

Function f_OpenFont(FontFace, FontSize, FontColor)
	Dim Format
	Format = "<FONT"
	If FontFace <> "" And Not IsNull(FontFace) Then
		If IsNumeric(FontFace) Then
			If FontFace <> 0 Then Format = Format & " FACE=""" & FontFace & """"
		Else
			Format = Format & " FACE=""" & FontFace & """"
		End If		
	End If
	If FontSize <> "" And Not IsNull(FontSize) Then
		Format = Format & " SIZE=""" & FontSize & """"
	End If
	If FontColor <> "" And Not IsNull(FontColor) Then
		If IsNumeric(FontColor) Then
			If FontColor <> 0 Then Format = Format & " COLOR=""" & FontColor & """"
		Else
			Format = Format & " COLOR=""" & FontColor & """"
		End If
	End If	
	Format = Format & ">"
	f_OpenFont = Format
End Function

Sub OpenFont(FontFace, FontSize, FontColor)
	Response.Write(f_OpenFont(FontFace, FontSize, FontColor))
End Sub

Sub CloseFont()
	Response.Write(f_CloseFont)
End Sub

Function f_CloseFont()
	f_CloseFont = "</FONT>"
End Function

Sub BR
	Response.Write(f_BR)
End Sub

Function f_BR
	f_BR = "<BR>"
End Function

'--------HTML Images--------------------
Function f_Image(FileName, Width, Height, Alignment, OverName, AltText)
	Dim Format
	Format = "<IMG SRC=""" & ImagePrefix & FileName & """"
	If Width <> "" And Not IsNull(Width) Or Width <> 0 Then
		Format = Format & " WIDTH=""" & Width & """"
	Else
		'
	End If
	If Height <> "" And Not IsNull(Height) Or Height <> 0 Then
		Format = Format & " HEIGHT=""" & Height & """"
	Else
		'
	End If
	If Alignment <> "" And Not IsNull(Alignment) Then
		Format = Format & " ALIGN=""" & Alignment & """"
	End If	
	If OverName <> "" And Not IsNull(OverName) Then
		Format = Format & " NAME=""imagename_" & OverName & """"
	End If		
	If AltText <> "" And Not IsNull(AltText) Then
		Format = Format & " ALT=""" & AltText & """"
	End If		
	Format = Format & " BORDER=""0"">"	
	f_Image = Format
End Function

Sub Image(FileName, Width, Height, Alignment, OverName, AltText)
	Response.Write(f_Image(FileName, Width, Height, Alignment, OverName, AltText))
End Sub

Sub RollOver(URL,ImageName,Down)
	Response.Write("<A HREF=""" & URL & """")
	Response.Write(" onFocus=""blur();"" " & _
		"onMouseOver=""changeimg('imagename_" & ImageName & "','img_" & ImageName & "_over');"" ")
	If Down Then
		Response.Write(_
		"onMouseDown=""changeimg('imagename_" & ImageName & "','img_" & ImageName & "_down');"" " & _
		"onMouseUp=""changeimg('imagename_" & ImageName & "','img_" & ImageName & "_over');"" ")
	End If
	Response.Write(_
		"onMouseOut=""changeimg('imagename_" & ImageName & "','img_" & ImageName & "');"" ")
	Response.Write(">")	
End Sub

Sub RollOverButton()

End Sub

Sub ImageRolloverScript()
	Response.Write("function changeimg(a,b) {")
		Response.Write("if (document.images) document.images[a].src = eval(b + "".src"");")
	Response.Write("};")
End Sub

Sub PredefineImage(ImageName,FileName,FileType,Width,Height,Over,Down)
	Response.Write("img_" & ImageName & " = new Image(" & Width & "," & Height & ");")
	Response.Write("img_" & ImageName & ".src = ""../images/buttons/" & FileName & "." & FileType & """;")
	If CBool(Over) = True Then
		Response.Write("img_" & ImageName & "_over = new Image(" & Width & "," & Height & ");")
		Response.Write("img_" & ImageName & "_over.src = ""../images/buttons/" & FileName & ".over." & FileType & """;")
	End If
	If CBool(Down) = True Then
		Response.Write("img_" & ImageName & "_down = new Image(" & Width & "," & Height & ");")
		Response.Write("img_" & ImageName & "_down.src = ""../images/buttons/" & FileName & ".down." & FileType & """;")		
	End If
End Sub

Sub S4S_MenuRollover(URL,Target,ImageName, CurveOriginal, CurveNeeded, OriginalMenu)
	Response.Write("<A HREF=""" & URL & """")
	If Not IsNull(Target) Then
		Response.Write(" TARGET=""" & Target & """")
	End If
	Response.Write(" onFocus=""blur();"" " & _
		"onMouseOver=""changeimg('" & OriginalMenu & "','img_" & OriginalMenu & "'); " & _
						"changeimg('" & ImageName & "','img_" & ImageName & "_sel'); " & _
						"changeimg('" & CurveOriginal & "','img_" & CurveNeeded & "');"" " & _
		"onMouseOut=""changeimg('" & ImageName & "','img_" & ImageName & "'); " & _
						"changeimg('" & OriginalMenu & "','img_" & OriginalMenu & "_sel'); " & _
						"changeimg('" & CurveOriginal & "','img_" & CurveOriginal & "');"">")
End Sub

Sub S4S_ImageRollBack(URL,Target,ImageName, Original)
	Response.Write("<A HREF=""" & URL & """")
	If Not IsNull(Target) Then
		Response.Write(" TARGET=""" & Target & """")
	End If
	Response.Write(" onFocus=""blur();"" " & _
		"onMouseOver=""changeimg('" & Original & "','img_" & Original & "'); " & _
						"changeimg('" & ImageName & "','img_" & ImageName & "_sel'); "" " & _
		"onMouseOut=""changeimg('" & ImageName & "','img_" & ImageName & "'); " & _
						"changeimg('" & Original & "','img_" & Original & "_sel'); "">")
End Sub

Function f_Spacer(Width, Height, Alignment)
	Dim Format
	Format = "<IMG SRC=""" & ImagePrefix & "spacer.gif"""
	If Height <> "" And Not IsNull(Height) And Height <> 0 Then
		Format = Format & " HEIGHT=""" & Height & """"
	Else
		Format = Format & " HEIGHT=""1"""
	End If	
	If Width <> "" And Not IsNull(Width) And Width <> 0 Then
		Format = Format & " WIDTH=""" & Width & """"
	Else
		Format = Format & " WIDTH=""1"""
	End If		
	If Alignment <> "" And Not IsNull(Alignment) Then
		If IsNumeric(Alignment) Then
			If Alignment <> 0 Then Format = Format & " ALIGN=""" & Alignment & """"
		Else
			Format = Format & " ALIGN=""" & Alignment & """"
		End If	
	End If	
	Format = Format & " ALT=""spacer"" BORDER=""0"">"	
	f_Spacer = Format
End Function

Sub Spacer(Height, Width, Alignment)
	Response.Write(f_spacer(Height, Width, Alignment))
End Sub




%>
