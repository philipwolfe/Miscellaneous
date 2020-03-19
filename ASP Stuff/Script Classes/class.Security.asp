<%
Function IsMemberOf(ByVal strGroup, ByVal strDomain)
	Dim GroupAD,R
	Set GroupAD = GetObject("WinNT://" & strDomain & "/" & strGroup)
						
	if (GroupAD.IsMember("WinNT://" & strDomain & "/" & Request.ServerVariables("LOGON_USER"))) Then
		IsMemberOf = "true"
	else
		IsMemberOf = "false"
	end if	
	'Response.Write("IsMember " & strGroup & " = " & IsMemberOf & "<br>")
end function


Public Sub checkSession(obj)
	If (isNullStr(obj)) Then
		go("nosession")
	End If
End Sub


Public Sub checkProvider(actlvl)
	If (isNullStr(actlvl)) Then
		go("nosession")
	ElseIf (actlvl <> "p" AND actlvl <> "s") Then
		go("noaccess")
	End If
End Sub


Public Sub checkAdmin(actlvl)
	If (isNullStr(actlvl)) Then
		go("nosession")
	ElseIf (actlvl <> "s") Then
		go("noaccess")
	End If
End Sub

Public Sub go(url)
	' if the user does not have access to a page or no longer has an active session,
	' then redirect them to an explanatory page;
	' otherwise redirect them to the url that is passed
	If (url = "noaccess") Then
		Response.Redirect("/pdp/gen/noaccess.asp")
	ElseIf (url = "nosession") Then
		Response.Redirect("/pdp/gen/nosession.asp")
	Else
		Response.Redirect(url)
	End If
End Sub
%>