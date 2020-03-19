<%
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'	Error Functions
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''


Public Function errorMsg(err)
	' if theres one error, display "error" 
	' if more than one error, display "errors"
	' if theres already a record with this First Name, Email, and Conference, display Error
	If (dictError.count = 1) Then 
		errorMsg = "<P><STRONG>NOTE!</STRONG> Please correct the following error (&nbsp;<IMG SRC=""/pdp/images/triangle.gif"" ALT=""!"" WIDTH=""10"" HEIGHT=""12"" BORDER=""0"">&nbsp;):</P>"	
		
		aError = dictError.Items
		errorMsg = errorMsg & "<DL>" & VbCrLf
		errorMsg = errorMsg & "<DD>" & aError(0) & VbCrLf
		errorMsg = errorMsg & "</DL>" & VbCrLf
	ElseIf (dictError.count > 1) Then
		errorMsg = errorMsg & "<P><STRONG>NOTE!</STRONG> Please correct the following errors (&nbsp;<IMG SRC=""/pdp/images/triangle.gif"" ALT=""!"" WIDTH=""10"" HEIGHT=""12"" BORDER=""0"">&nbsp;):</P>"
		
		errorMsg = errorMsg & "<DL>" & VbCrLf
		For each item in dictError.Items
			errorMsg = errorMsg & "<DD>" & item & VbCrLf
		Next
		errorMsg = errorMsg & "</DL>" & VbCrLf
	Else
		errorMsg = err
	End If
End Function


Public Function errorMark(field)
	' if an item exists in the error scripting dictionary with a key equal to field,
	' then the function returns HTML for a red triangle to mark the error
	If (dictError.Exists(field)) Then
		errorMark = "&nbsp;<IMG SRC=""/pdp/images/triangle.gif"" ALT=""!"" WIDTH=""10"" HEIGHT=""12"" BORDER=""0"">"
	End If
End Function


Public Function errorRed(err)
	' if the error string passed to this function is not null,
	' then the function returns the error surrounded by HTML for red text
	If (isNullStr(err)) Then
		errorRed=""
	Else
		errorRed="<FONT COLOR=""#FF0000"">" & err & "</FONT>" & vbCrLf
	End If 
End Function
%>