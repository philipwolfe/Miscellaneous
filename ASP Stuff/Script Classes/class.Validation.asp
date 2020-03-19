<%

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'	Validation Functions
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''


Public Function isNumber(num,min_len,max_len,min_val,max_val,allow_neg,allow_dec,allow_nulls)
	isNumber = true

	If (allow_nulls AND isNullStr(num)) Then
		Exit Function
	ElseIf (isNullStr(num)) Then
		isNumber = false
	ElseIf (NOT isNumeric(num)) Then
		isNumber = false
	ElseIf (len(num) < min_len OR len(num) > max_len) Then
		isNumber = false
	ElseIf (Abs(num) < min_val OR Abs(num) > max_val) Then
		isNumber = false
	ElseIf (NOT allow_neg AND (int(num) < 0 OR inStr(num,"-") <> "0")) Then
		isNumber = false
	ElseIf (NOT allow_dec AND inStr(num,".") <> "0") Then
		isNumber = false
	End If
End Function


Public Function isValidPhone(area,exchange,number,ext,allow_nulls)
	isValidPhone = true	
	
	If (allow_nulls AND isNullStr(area) AND isNullStr(exchange) AND isNullStr(number) AND isNullStr(ext)) Then
		Exit Function
	Else
		If (NOT isNumber(area,3,3,0,999,false,false,false) OR NOT isNumber(exchange,3,3,0,999,false,false,false) OR NOT isNumber(number,4,4,0,9999,false,false,false) OR NOT isNumber(ext,1,5,0,99999,false,false,true)) Then
			isValidPhone = false
		End If
	End If
End Function


Public Function isValidState(state,allow_nulls)	 
	isValidState = false
		
	If (allow_nulls AND isNullStr(state)) Then
		isValidState = true 
		Exit Function
	Else
		ucstate = UCase(state) 
		USStateCodes = Array("AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MH","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP","OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY","AE","AA","AE","AE","AP")
        For each USstate in USStateCodes 
            If (ucstate = USstate) Then 
            	isValidState = True 
            	Exit For 
            End If 
        Next
	End If
End Function


Public Function isValidZip(zip,plus4,code_req,allow_nulls)											
	isValidZip = true
	
	If (allow_nulls AND isNullStr(zip) AND isNullStr(plus4)) Then
		Exit Function
	ElseIf (code_req AND isNullStr(plus4)) Then
		isValidZip = false 
	Else
		If (NOT isNumber(zip,5,5,0,99999,false,false,false) OR NOT isNumber(plus4,4,4,0,9999,false,false,true)) Then
			isValidZip = false
		End If
    End If
End Function


Public Function isValidEmail(email,allow_nulls)
	' set to true, and remains true if not changed to false
	isValidEmail = true
	
	' if nulls are allowed and email is null, then exit
	If (allow_nulls AND isNullStr(email)) Then
		Exit Function
	Else
		email_array = split(email,"@")
		'this should create an array with only two elements, since there should only be one "@"
		
		email_array_size = UBound(email_array)
		
		'since there should be only two elements, the position of the second element must be 1
		If (email_array_size <> 1) Then
			isValidEmail=false
		Else
			'the "domain" part of the address is the second element
			domain=email_array(1)
			
			'the "." must be in the "domain" part, but not right at the beginning or end
			If (inStr(domain,".") = "0" OR inStr(domain,".") = 1 OR inStrRev(domain,".") = len(domain)) Then
				isValidEmail = false
			End If
		End If
	End If
End Function


Public Function isValidDate(m,d,y,startyr,endyr,allow_nulls)										
	' set to true, and remains true if not changed to false
	isValidDate = true
	' if nulls are allowed and all is null, then exit
	If (allow_nulls AND isNullStr(m) AND isNullStr(d) AND isNullStr(y)) Then
		Exit Function
	Else
		' if any are null, then return false
		If (isNullStr(m) OR isNullStr(d) OR isNullStr(y)) Then
			isValidDate = false
		' if any are not numeric, then return false
		ElseIf (NOT isNumeric(m) OR NOT isNumeric(d) OR NOT isNumeric(y)) Then
			isValidDate = false
		' if d or m are greater or less than the max possible day or month, then return false
		' if y is less startyr or greater than endyr, then return false
		ElseIf (m < 1 OR m > 12 OR d < 1 OR d > 31 OR int(y) < startyr OR int(y) > endyr) Then
			isValidDate = false
		' the results of dateExists are returned for isValidDate
		Else
			isValidDate = (dateExists(m,d,y))
		End If
	End If
End Function


Public Function dateExists(m,d,y)
	' set to true, and remains true if not changed to false												  
	dateExists = true

	' create an array of the days in each month,
	' with the maximum days possible for February
	month_days = array(31,29,31,30,31,30,31,31,30,31,30,31)

	' if the input d is greater than the days in that month, then the output is false
	' note: (m - 1) since January would be a one, its index in the array would be 0 
	If (int(d) > month_days(m - 1)) Then
		dateExists = false
	' if input is February - d can be 29 only if:
	' y is divisible by 4 and
	' if divisible by 100, it must also be divisible by 400  
	ElseIf  ((m = 2 and d > 28) AND ((y MOD 4 <> 0) OR (y MOD 100 = 0 AND y MOD 400	<> 0))) Then
		dateExists = false
	End If
End Function


Public Function isDateInPast(m,d,y)										
	' set to false, and remains false if not changed to true
	isDateInPast = false
	' if all is null, then exit
	If (isNullStr(m) AND isNullStr(d) AND isNullStr(y)) Then
		Exit Function
	ElseIf (dateExists(m,d,y)) Then
		' create a date from its components
		indate = m & "/" & d & "/" & y
		' if the difference of days between today and the date passed is negative,
		' then isDateInPast returns true; otherwise it returns false
		isDateInPast = (dateDiff("d",now,indate) < 0)
	End If
End Function


Public Function isValidLevelPulldown(level1ID,level2ID,level3ID,allow_nulls)
	' set to true, and remains true if not changed to false
	isValidLevelPulldown = true
	' if nulls are allowed and all is null, then exit
	If (allow_nulls AND isNullStr(level1ID) AND isNullStr(level2ID) AND isNullStr(level3ID)) Then
		Exit Function
	Else
		' if any are null, then return false
		If (isNullStr(level1ID) OR isNullStr(level2ID) OR isNullStr(level3ID)) Then
			isValidLevelPulldown = false
		End If
	End If
End Function


' ***********************************************************************
' THIS FUNCTION TAKES IN AN EMAIL ADDRESS AND THEN, USING A REGULAR EXPRESSION 
' OBJECT, VALIDATES THAT IT IS FORMATTED CORRECTLY FOR AN EMAIL ADDRESS.
Function validEmailAddress( inEmailAddress )
	Dim regEx
	Set regEx = New RegExp
	' PATTERN FOR AN EMAIL ADDRESS

		' THIS ALLOWS ADDRESSES WITH DASHES IN THE FIRST PART 
		' regEx.Pattern = "^[\w-\.]+@\w+\.\w+$"

		' THIS ALLOWS ADDRESSES WITH DASHES IN THE FIRST AND SECOND PARTS 
'		regEx.Pattern = "^[\w-\.]+@[\w-\.]+.\w+$"
		regEx.Pattern = "^[\w-\.]{1,}\@([\da-zA-Z-]{1,}\.){1,}[\da-zA-Z-]{2,3}$" 		


	regEx.IgnoreCase = True
	regEx.Global = True
	validEmailAddress = regEx.Test( inEmailAddress )
	Set regEx = Nothing
End Function
' ***********************************************************************


' ***********************************************************************
Function returnStateSelect( inStateVal )

	stateSelect = ""
	myArray = returnStatesArray
	For i = 0 To Ubound( myArray ) - 1
		stateParts = Split( myArray(i), ";")
		stateSelect = stateSelect & "<option value=""" & stateParts(0) & """ "
		If stateParts(0) = inStateVal Then
			stateSelect = stateSelect & " SELECTED "
		End If
		stateSelect = stateSelect & ">" & stateParts(1) & vbCrLf
	Next
	Set stateParts = Nothing
	Set myArray = Nothing	

	returnStateSelect = stateSelect
End Function
' ***********************************************************************



' ***********************************************************************
' THIS FUNCTION RETURNS AN ARRAY OF STATES, EACH ELEMENT HAS 
' THE ABBREVIATION AND NAME OF THE STATE
'
'	' FORM STATE SELECT LIST
'	stateSelect = ""
'	myArray = returnStatesArray
'	For i = 0 To Ubound( myArray ) - 1
'		stateParts = Split( myArray(i), ";")
'		stateSelect = stateSelect & "<option value=""" & stateParts(0) & """ "
'		If stateParts(0) = salesmanSearchState Then
'			stateSelect = stateSelect & " SELECTED "
'		End If
'		stateSelect = stateSelect & ">" & stateParts(1) & vbCrLf
'	Next
'	Set stateParts = Nothing
'	Set myArray = Nothing	

Function returnStatesArray
	Dim statesArray(51)
	statesArray(0) = "AL;Alabama"
	statesArray(1) = "AK;Alaska"
	statesArray(2) = "AZ;Arizona"
	statesArray(3) = "AR;Arkansas"
	statesArray(4) = "CA;California"
	statesArray(5) = "CO;Colorado"
	statesArray(6) = "CT;Connecticut"
	statesArray(7) = "DE;Delaware"
	statesArray(8) = "DC;District of Columbia"
	statesArray(9) = "FL;Florida"
	statesArray(10) = "GA;Georgia"
	statesArray(11) = "HI;Hawaii"
	statesArray(12) = "ID;Idaho"
	statesArray(13) = "IL;Illinois"
	statesArray(14) = "IN;Indiana"
	statesArray(15) = "IA;Iowa"
	statesArray(16) = "KS;Kansas"
	statesArray(17) = "KY;Kentucky"
	statesArray(18) = "LA;Louisiana"
	statesArray(19) = "ME;Maine"
	statesArray(20) = "MD;Maryland"
	statesArray(21) = "MA;Massachusetts"
	statesArray(22) = "MI;Michigan"
	statesArray(23) = "MN;Minnesota"
	statesArray(24) = "MS;Mississippi"
	statesArray(25) = "MO;Missouri"
	statesArray(26) = "MT;Montana"
	statesArray(27) = "NE;Nebraska"
	statesArray(28) = "NV;Nevada"
	statesArray(29) = "NH;New Hampshire"
	statesArray(30) = "NJ;New Jersey"
	statesArray(31) = "NM;New Mexico"
	statesArray(32) = "NY;New York"
	statesArray(33) = "NC;North Carolina"
	statesArray(34) = "ND;North Dakota"
	statesArray(35) = "OH;Ohio"
	statesArray(36) = "OK;Oklahoma"
	statesArray(37) = "OR;Oregon"
	statesArray(38) = "PA;Pennsylvania"
	statesArray(39) = "RI;Rhode Island"
	statesArray(40) = "SC;South Carolina"
	statesArray(41) = "SD;South Dakota"
	statesArray(42) = "TN;Tennessee"
	statesArray(43) = "TX;Texas"
	statesArray(44) = "UT;Utah"
	statesArray(45) = "VT;Vermont"
	statesArray(46) = "VA;Virginia"
	statesArray(47) = "WA;Washington"
	statesArray(48) = "WV;West Virginia"
	statesArray(49) = "WI;Wisconsin"
	statesArray(50) = "WY;Wyoming"

	returnStatesArray = statesArray
End Function
' ***********************************************************************
%>