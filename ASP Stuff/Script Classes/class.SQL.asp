<%

' ***********************************************************************
' THIS FUNCTION IS TO WRAP A STRING IN WHEN INSERTING INTO AN SQL STATEMENT
Function encode( inStr )
	newStr = Replace(inStr,"'","''")
	encode = newStr
End Function
' ***********************************************************************

Public Function isNullStr(str)
	' isNull(str) and str = "" are exclusive, so check for either
	isNullStr = (str = "" OR isNull(str))
End Function


Public Function cleanSQL(instr)
	' if instr is null or "", return instr
	If (isNullStr(instr)) Then
		cleanSQL = instr
	Else
		' replace ' with '' (' preceded by the SQL escape character)
		' replace the SQL keyword "&" with " and "
		' call cleanEOL
		' surround the string with quotes
		cleanSQL = replace(instr,"'","''")
		cleanSQL = replace(cleanSQL,"&"," and ")
		cleanSQL = cleanEOL(cleanSQL)
		cleanSQL = "'" & cleanSQL & "'"
	End If
End Function


Public Function textCleanSQL(instr)
	' if instr is null or "", return instr
	If (isNullStr(instr)) Then
		textCleanSQL = instr
	Else
		' replace "'" with "''" ("'" preceded by the SQL escape character)
		' replace the SQL keyword & with and
		' call replaceEOL
		' surround the string with quotes
		textCleanSQL = replace(instr,"'","''")
		textCleanSQL = replace(textCleanSQL,"&"," and ")
		textCleanSQL = replaceEOL(textCleanSQL)
		textCleanSQL = "'" & textCleanSQL & "'"
	End If
End Function


Public Function cleanEOL(instr)
	' replace carriage returns and new line characters with spaces
	instr = replace(instr,Chr(10)," ")
	instr = replace(instr,Chr(13)," ")
	cleanEOL = instr
End Function


Public Function replaceEOL(instr)
	' if instr is null or "", return instr
	If (isNullStr(instr)) Then
		replaceEOL = instr
	Else
		' replace VbCrLf with "\r" for storage in the database
		' when retrieved it will be replaced with "<BR>" for text areas (addBR())
		' or VbCrLf for form fields(addBR()) 
		replaceEOL = replace(instr,VbCrLf,"\r")
    End If
End Function


Public Function addBR(instr)
	' if instr is null or "", return instr
	If (isNullStr(instr)) Then
		addBR = instr
	Else
		' replace "\r" with "<BR>"
		addBR = replace(instr,"\r","<BR>")
	End If
End Function


Public Function addCR(instr)
	' if instr is null or "", return instr
	If (isNullStr(instr)) Then
		addCR = instr
	Else
		' replace "\r" with VbCrLf
		addCR = replace(instr,"\r",VbCrLf)
	End If
End Function


Public Function checkNull(input,default)
	' if input isNullStr, return default
	' otherwise return input
	If (isNullStr(input)) Then
		checkNull = default
	Else
		checkNull = input
	End If
End Function

Function SQLDate(datum)
  dd = Day(datum)
  if Len(dd)=1 then dd = "0" & dd
  mm = Month(datum)
  if Len(mm)=1 then mm = "0" & mm
  SQLDate = "{d '" & Year(datum) & "-" & mm & "-" &  dd & "'}"
End Function
%>