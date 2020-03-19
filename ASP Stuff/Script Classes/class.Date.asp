<%
function DateToStr (datum)
	if (day(datum)>0) then
		DateToStr =  PadZero(day(datum),2) & "-" & PadZero(Month(datum),2) & "-" & CStr(Year(datum))
	else
		DateToStr= "geen datum"
	end if
end function

function StrToDate (ValueStr)
	List = Split(ValueStr,"-")
	StrToDate = DateSerial(Int(List(2)),Int(List(1)),Int(List(0)))
end function

function StartsWith (Str1,Str2)
	StartsWith = (StrComp(Left(Str1,Len(Str2)),Str2,1)=0)
end function


Function Ists(byVal d)
	if d = 1 or ((d > 20) and ((d mod 10) = 1) )Then
		Ists = "st"
	elseif d = 2 or ((d > 20) and ((d mod 10) = 2) ) Then
		Ists = "nd"
	elseif d = 3 or ((d > 20) and ((d mod 10) = 3) )Then
		Ists = "rd"
	else
		Ists = "th"
	end if				
end function

Function OzDate(byVal nowdate)

	if not IsNull(nowdate) then

	dim monthn

	monthn = Month(nowdate)

	if (monthn=1) then 
		months="January" 
	elseif(monthn=2)then 
		months="February"
	elseif(monthn=3)then 
		months="March"
	elseif(monthn=4)then 
		months="April"
	elseif(monthn=5)then 
		months="May"
	elseif(monthn=6)then 
		months="June"
	elseif(monthn=7)then 
		months="July"
	elseif(monthn=8)then 
		months="August"
	elseif(monthn=9)then 
		months="September"
	elseif(monthn=10)then 
		months="October"
	elseif(monthn=11)then 
		months="November"
	elseif(monthn=12)then 
		months="December"
	end if


	'OzDate = Day(nowdate) & Ists(Day(nowdate)) & " "& months & " " & Year(nowdate)

	' this is without the st, rd and th behind a day
	OzDate = Day(nowdate) & " "& months & " " & Year(nowdate)

	else
		OzDate = ""
	end if

end function



'----------------------------------------------------------- 30
   Function uDate( tstamp )
'-----------------------------------------------------------
   if tstamp = "" then abort("uDate given null timestamp")
   '
   y = year(tstamp)
   y = mid(y,3,2)
   m = month(tstamp)
   m = mid("JanFebMarAprMayJunJulAugSepOctNovDec", (m-1)*3+1, 3)
   d = day(tstamp)
   '
   uDate = d & "-" & m & "-" & y
End Function

'----------------------------------------------------------- 31
   Function uTime( tstamp )
'-----------------------------------------------------------
   if tstamp = "" then abort("uTime given null timestamp")
   '
   h = hour( tstamp )
   m = minute( tstamp )
   if h < 12 then am_pm = " am" else am_pm = " pm"
   if h > 12 then h = h - 12 '--- after 1 pm
   if h = 0 then h = 12      '--- first hour after midnite
   if m < 10 then m = "0" & m
   '
   uTime = h & ":" & m & am_pm
End Function

'----------------------------------------------------------- 32
   Function timestamp_fn
'-----------------------------------------------------------
   '
   '--- create timestamp in 98-07-07__16.00.00 format
   '    (ie: usable for filenames)
   '
   t = now
   y = mid(year(t),3)
   m = month(t):       if m < 10 then m = "0" & m
   d = day(t):         if d < 10 then d = "0" & d
   h = hour(t):        if h < 10 then h = "0" & h
   e = minute(t):      if e < 10 then e = "0" & e
   s = second(t):      if s < 10 then s = "0" & s
   timestamp_fn = y & "-" & m & "-" & d & "__" & h &"."& e &"."& s
End Function

Sub ShowDate (ByVal sDate)
		Dim sDay, sMonth, sYear
		sDay = Left (sDate, 2)
		sMonth = Mid (sDate, 4, 3)
		sYear = Right (sDate, 2)
		if sDay < 10 then
			sDay = Right (sDay, 1)
		end if
		Response.Write sDay
		if sDay = 1 or sDay = 21 or sDay = 31 then
			Response.Write "st "
		elseif sDay = 2 or sDay = 22 then
			Response.Write "nd "
		elseif sDay = 3 or sDay = 23 then
			Response.Write "rd "
		else
			Response.Write "th "
		end if
		select Case sMonth
			Case "Jan" :
				Response.Write "January"
			Case "Feb" :
				Response.Write "February"
			Case "Mar" :
				Response.Write "March"
			Case "Apr" :
				Response.Write "April"
			Case "May" :
				Response.Write "May"
			Case "Jun" :
				Response.Write "June"
			Case "Jul" :
				Response.Write "July"
			Case "Aug" :
				Response.Write "August"
			Case "Sep" :
				Response.Write "September"
			Case "Oct" :
				Response.Write "October"
			Case "Nov" :
				Response.Write "November"
			Case "Dec" :
				Response.Write "December"
			Case Else :
				Response.Write "<B><I>Error!</i></B>"
		End Select
		if sYear < 57 then
			Response.Write " 20"
		else
			Response.Write " 19"
		end if
		Response.Write sYear
	End Sub
%>