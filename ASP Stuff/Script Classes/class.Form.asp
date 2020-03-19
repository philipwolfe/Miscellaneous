<%
	' ************************************************************
	' * Filename: normalize.inc                                  *
	' *  Purpose: Will allow normalization of form fields for    *
	' *           browsers with differing fields structures.     *
	' *   Author: Iain MacNeill	- 08_02_2000                     *
	' *    Notes: Arguments: 1) Requested size of field          *
	' *                      2) Type of field: 1] INPUT          *
	' *                                        2] TEXTAREA       *
	' *           THIS FUNCTION REQUIRES THAT THE FOLLOWING      *
	' *           VARIABLES HAVE BEEN INITIALIZED VIA THE        *
	' *           "getbrsinfo.inc" INCLUDE FILE:                 *
	' *               1. strBrowser                              *
	' *               2. strVersion                              *
	' *               3. strPlatform                             *
	' *               4. strMajorVer                             *
	' *               5. strMinorVer                             *
	' * -------------------------------------------------------- *
	' * 08-09-2000: Added global variable to this file to handle *
	' *             styles for input text box form fields. This  *
	' *             variable will contain the style string to    *
	' *             display the text inside the form field. It   *
	' *             is initialized based upon the browser type & *
	' *             platform.                                    *
	' ************************************************************
	Dim strFormStyle, strFixedStyle
	
	Function normalize( intFldlen, intFldtype )
		Dim intNewsize, dblMod
		
		If intFldtype = 1 Then
			If strBrowser = "Netscape" and strPlatform = "Windows" and CInt(strMajorVer) > 3 Then
				dblMod = .43
			Else
				dblMod = 1.0
			End If
		ElseIf intFldType = 2 Then
			If strBrowser = "Internet Explorer" and strPlatform = "Macintosh" Then
				dblMod = 1.65
			ElseIf strBrowser = "Netscape" and strPlatform = "Macintosh" Then
				dblMod = 1.35
			ElseIf strBrowser = "Netscape" Then
				dblMod = .89
			Else
				dblMod = 1.0
			End If
		End If
		
		intNewsize = CInt(CDbl(intFldlen) * dblMod)
		
		normalize = intNewsize
	End Function
	
	Function loadstyle()
		Dim strStyleTemplate
		
		If (strBrowser = "Netscape" or strBrowser = "Internet Explorer") and strPlatform = "Macintosh" and Trim(strMajorVer) = "4" Then
			strStyleTemplate = "Library/styleMN.css"
		Else
			strStyleTemplate = "Library/styles.css"
		End If

		If strBrowser = "Netscape" and strPlatform = "Windows" Then
			strFormStyle = "FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif;FONT-SIZE: 9pt;"
			strFixedStyle = "FONT-FAMILY: Courier New, Fixedsys; FONT-SIZE: 10pt;"
		Else
			strFormStyle = "FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif;FONT-SIZE: 7pt;"
			strFixedStyle = "FONT-FAMILY: Courier New, Fixedsys; FONT-SIZE: 8pt;"
		End If
		
		loadstyle = strStyleTemplate
	End Function



Function CheckboxFlag(byVal flag)
	dim S
	S  = ""
	if (flag <> 0) Then
		S = " checked=true "
	else
		S = ""



	end if
	CheckboxFlag = S
end function


Function CheckboxString(byVal flag)
	dim S
	S  = ""
	if (flag <> "") Then
		S = " checked=true "
	else
		S = ""
	end if
	CheckboxString = S
end function

Function SelectBoxString(byVal try, byVal val)
	dim S
	S  = ""
	if (try = val) Then
		S = " selected "
	else
		S = ""
	end if
	SelectBoxString = S
end function

Function SelectBoxNumber(byVal try, byVal val)
	dim S
	S  = ""
	if (CInt(try) = CInt(val)) Then
		S = " selected "
	else
		S = ""
	end if
	SelectBoxNumber = S
end function

Function DayDropDown(byVal DayVal)
	dim S
	S = ""
	dim i
	i = 1
	do while (i <= 31)	
		S = S & "<option value="""& i & """ "  & SelectBoxString(CStr(i),DayVal) & ">" & i & "</option>"
		i = i + 1
	loop
	DayDropDown = S
End Function

Function YearDropDown(byVal YearVal)
	dim S
	S = ""
	dim i
	i = 1999
	do while (i <= 2005)	
		S = S & "<option value=""" & i & """ "  & SelectBoxString(CStr(i),YearVal) & ">" & i & "</option>"
		i = i + 1
	loop
	YearDropDown = S
End Function

Function MonthDropDown(byVal MonthVal)
	dim S
	S = ""
	S = S & "<option value=""1"" "  & SelectBoxString("1",MonthVal) & ">January</option>"
	S = S & "<option value=""2"" "  & SelectBoxString("2",MonthVal) & ">Febuary</option>"
	S = S & "<option value=""3"" "  & SelectBoxString("3",MonthVal) & ">March</option>"
	S = S & "<option value=""4"" "  & SelectBoxString("4",MonthVal) & ">April</option>"
	S = S & "<option value=""5"" "  & SelectBoxString("5",MonthVal) & ">May</option>"
	S = S & "<option value=""6"" "  & SelectBoxString("6",MonthVal) & ">June</option>"
	S = S & "<option value=""7"" "  & SelectBoxString("7",MonthVal) & ">July</option>"
	S = S & "<option value=""8"" "  & SelectBoxString("8",MonthVal) & ">August</option>"
	S = S & "<option value=""9"" "  & SelectBoxString("9",MonthVal) & ">September</option>"
	S = S & "<option value=""10"" " & SelectBoxString("10",MonthVal) & ">October</option>"
	S = S & "<option value=""11"" " & SelectBoxString("11",MonthVal) & ">November</option>"
	S = S & "<option value=""12"" " & SelectBoxString("12",MonthVal) & ">December</option>"												
	MonthDropDown = S
End Function


Public Function ButtonPushed(button_name)
	ButtonPushed = (NOT isNullStr(Request(button_name)))
End Function


Public Function markChecked(value,checkbox)
	If (value = checkbox) Then
		markChecked = " CHECKED"
	End If
End Function


Public Function isItSelected(current,selection)
	If (trim(current) = trim(selection)) Then isItSelected = true
End Function

Public Function markSelected(selected)
	If (selected) Then markSelected = " SELECTED"
End Function

Public Function markChecked(selected)
	If (selected) Then markChecked = " CHECKED"
End Function

Public Function writeNullJS(str)
	If (isNullStr(str)) Then
		writeNullJS = "null"
	Else
		writeNullJS = str	
	End If
End Function
%>


