<%
Class Headers
'------------------------------------------------------------------------------------
'  
'------------------------------------------------------------------------------------
'  DECLARATIONS ---------------------------------------------------------------------
	
'  EVENTS ----------------------------------------------------------------------------
	Private Sub Class_Initialize()

	End Sub '  Initialize()
	
	Private Sub Class_Terminate()

	End Sub '  Terminate()

'  PROPERTIES ------------------------------------------------------------------------

'  METHODS ---------------------------------------------------------------------------
	Public Sub AddExpiresHTTPHeaders()
		Response.Expires = 0								'0 min
		Response.ExpiresAbsolute = NOW() - 1				'Date and time
		Response.AddHeader("Pragma: ", "no-cache")								'For Client
		Response.AddHeader("Cache-control: ", "no-cache, no-store, max-age=0")	'For Proxy
	End Sub

	Public Sub AddExpiresMetaTags()
		Response.Write("<META HTTP-EQUIV=""Pragma"" CONTENT=""no-cache"">")
		Response.Write("<META HTTP-EQUIV=""Expires"" CONTENT=""0"">")
		Response.Write("<META HTTP-EQUIV=""Expires"" CONTENT=""Sun, 22 Mar 1998 16:18:35 GMT"">")
	End Sub
	
	Private Sub AddExpiresDownloadSafeHTTPHeaders()
	
	End Sub
	
	Public Sub AddWindowHeader(strWindowName)
		Response.AddHeader("Window-target:", strWindowName)
	End Sub

	Public Sub AddCookieHeader(strCookieName)
		Response.AddHeader("Set-Cookie:", "name=" & strCookieName)
	End Sub
	
	Public Sub AddDownloadHeader(strContentType, strContentSubType, lngSize, optional strParamAttrib, optional strParamValue)
		'valid types for strContentType as per RFC2045: (not validated)
			'text
			'image
			'audio
			'video
			'application
		If Not IsEmpty(strContentSubType) Then
			strContentType = strContentType & "/" & strContentSubType
		End If
		
		If Not IsEmpty(strParamAttrib) And Not IsEmpty(strParamValue) Then
			strContentType = strContentType & "; " & strParamAttrib & "=""" & strParamValue & """"
		End If
		
		Response.AddHeader("Content-Type:", strContentType)
		Response.AddHeader("Content-Length:", lngSize)
	End Sub
	
	Public Sub AddRefreshHeader(intSeconds, optional strAltURL)
		If Not IsEmpty(strAltURL) Then
			Response.AddHeader("REFRESH:", intSeconds & "; URL=" & strAltURL)
		Else
			Response.AddHeader("REFRESH:", intSeconds)
		End If
	End Sub
	
	Public Sub AddRefreshMetaTag(intSeconds, optional strAltURL)
		If Not IsEmpty(strAltURL) Then
			Response.Write("<META HTTP-EQUIV=""REFRESH"" CONTENT=""" & intSeconds & "; URL=" & strAltURL & """>"
		Else
			Response.Write("<META HTTP-EQUIV=""REFRESH"" CONTENT=""" &intSeconds & """>"
		End If
	End Sub
End Class
%>