<%
'go here: http://browserwatch.internet.com/stats.html
'Ideas:http://www.cyscape.com/showbrow.asp
		'UserIP = Request.ServerVariables("REMOTE_ADDR")
		'AcceptLanguage = Request.ServerVariables("HTTP_ACCEPT_LANGUAGE")
Class Browser
'------------------------------------------------------------------------------------
'  
'------------------------------------------------------------------------------------
'  DECLARATIONS ---------------------------------------------------------------------
	Private blnDebug		'  Shows Debug Information
	Private strUserAgent	'  the HTTP_USER_AGENT input string
	Private strBrowser		'  "MSIE", "Nav", "Opera", "Other", "CRAWLER"
	Private intMajorVer		'  major browser version
	Private intMinorVer		'  minor (dot) browser version
	Private strOS			'  "Win95", "Win98", "WinNT", "Unix", "PPC"
	Private strPlatform		'  "x86", "Mac", "Unix", "Sun"
	Private blnIsBeta		'  whether browser is a beta edition
	Private strSpecial		'  Contains (if applicable) "WEBTV", "AOL", "MSN Explorer", "Gold" 
	Private intEncryption	'  Level of encryption this browser supports

'  EVENTS ----------------------------------------------------------------------------
	Private Sub Class_Initialize()
		blnDebug = true
		strUserAgent = LCase(Request.ServerVariables("HTTP_USER_AGENT"))
		strBrowser = "Unknown"
		intMajorVer = "0"
		intMinorVer = "0"
		strOS = "Unknown"
		strPlatform = "Unknown"
		blnIsBeta = False
		intEncryption = 0
		
		If blnDebug Then Response.Write("Class ""Browser"" Initialized.<br>")
		Response.Flush
		Call DetectPlatform()
		Response.Flush
		Call DetectOS()
		Response.Flush
		Call DetectBrowser()
		Response.Flush
		Call DetectVersion()
		Response.Flush
		'Call DetectBeta()
		'Response.Flush
		'Call DetectEncryption()
		'Response.Flush
		Call LogBrowser()
		Response.Flush
		
	End Sub '  Initialize()
	
	Private Sub Class_Terminate()
		If blnDebug Then Response.Write("Class ""Browser"" Terminated.<br>")
	End Sub '  Terminate()

'  PROPERTIES -----------------------------------------------------------------------------
	Public Property Get UserAgent()
		UserAgent = Request.ServerVariables("HTTP_USER_AGENT")
	End Property
	
	Public Property Get BrowserName()
		BrowserName = strBrowser
	End Property
	
	Public Property Get MajorVer()
		MajorVer = intMajorVer
	End Property

	Public Property Get MinorVer()
		MinorVer = intMinorVer
	End Property

	Public Property Get OS()
		OS = strOS
	End Property
	
	Public Property Get Platform()
		Platform = strPlatform
	End Property
	
	Public Property Get IsBeta()
		IsBeta = blnIsBeta
	End Property
	
	Public Property Get ShowDebug()
		ShowDebug = blnDebug
	End Property
	
	Public Property Let ShowDebug(bln)
		blnDebug = CBool(bln)
	End Property
	
	Public Property Get DoLogging()
		DoLogging = blnDoLogging
	End Property
	
	Public Property Let DoLogging(bln)
		blnDoLogging = CBool(bln)
	End Property

'  METHODS --------------------------------------------------------------------------
	Private Sub DetectPlatform()
		
		If blnDebug Then Response.Write ("DetectPlatform() fired.<br>")
		
		If InStr(strUserAgent,"win") Then
			strPlatform = "x86"
		ElseIf InStr(strUserAgent, "mac") then
			strPlatform = "Mac"
		ElseIf InStr(strUserAgent, "sunos") Then
			strPlatform = "Sun"
		ElseIf InStr(strUserAgnet, "x11") or InStr(strUserAgent, "irix") or _
			   InStr(strUserAgent, "hp-ux") or InStr(strUserAgent, "sco") or _
			   InStr(strUserAgent, "unix_sv") or InStr(strUserAgent, "unix_system_v") or _
			   Instr(strUserAgent, "ncr") or InStr(strUserAgent, "reliantunix") or _
			   InStr(strUserAgent, "dec_alpha") or InStr(strUserAgent, "dec_osf1") or _
			   InStr(strUserAgent, "dec") or InStr(strUserAgent, "osf1") or _
			   InStr(strUserAgent, "dec_alpha") or InStr(strUserAgent, "alphaserver") or _
			   InStr(strUserAgent, "ultrix") or InStr(strUserAgent, "alphastation")  or _
			   InStr(strUserAgent, "sinix") or InStr(strUserAgent, "aix") or _
			   InStr(strUserAgent, "inux") or InStr(strUserAgent, "bsd") or _
			   InStr(strUserAgent, "freebsd") Then
			strPlatform = "Unix"
		ElseIf Instr(strUserAgent, "lwp") Then
			strPlatform = "PERL"
		ElseIf InStr(strUserAgent, "os/2") or InStr(strUserAgent,"ibm-webexplorer") Then
			strPlatform = "OS/2"
		ElseIf InStr(strUserAgent,"vax") or InStr(strUserAgent,"openvms") Then
			strPlatform = "VMS"
		End If
	
		If blnDebug Then Response.Write ("Result of DetectPlatform() = " & strPlatform & "<br>")
		
	End Sub '  DetectPlatform()
	
	
	Private Sub DetectOS()
		If blnDebug Then Response.Write("DetectOS() fired.<br>")
		
		Select Case strPlatform
			Case "x86"
				If InStr(strUserAgent, "win16") or InStr(strUserAgent, "win") or InStr(strUserAgent, "16-bit") Then strOS = "Win16"
				If InStr(strUserAgent, "win32") or InStr(strUserAgent, "32bit") Then strPlastrOStform = "Win32"
				If InStr(strUserAgent, "windows 3.1") or InStr(strUserAgent,"win31") Then strOS = "Win31"
				If InStr(strUserAgent, "win95") or InStr(strUserAgent,"windows 95") Then strOS = "Win95"
				If InStr(strUserAgent, "win98") or InStr(strUserAgent,"windows 98") Then strOS = "Win98"
				If InStr(strUserAgent, "winme") or InStr(strUserAgent,"windows melinium edition") Then strOS = "WinME"
				If InStr(strUserAgent, "nt") or InStr(strUserAgent,"windows nt") Then strOS = "WinNT"
				If InStr(strUserAgent, "win2K") or InStr(strUserAgent,"windows nt 5.0") Then strOS = "Win2k"
				If InStr(strUserAgent, "wince") or InStr(strUserAgent,"windows ce") Then strOS = "WinCE"
				If InStr(strUserAgent, "winxp") or InStr(strUserAgent,"windows xp") Then strOS = "WinXP"
			
			Case "Mac"
				If InStr(strUserAgent, "68k") or InStr(strUserAgnet, "68000") Then strOS = "68k"
				If InStr(strUserAgnet, "ppc") or InStr(strUserAgent, "powerpc") Then strOS = "PPC"

			Case "Sun"
				If InStr(strUserAgent, "sunos") Then strOS = "SunOS"
				If InStr(strUserAgent, "sunos 4") Then strOS = "SunOS 4"
				If InStr(strUserAgent, "sunos 5") Then strOS = "SunOS 5"
				If InStr(strUserAgent, "i86") Then strOS = "Suni86"
			
			Case "Unix"
				If InStr(strUserAgent,"irix") Then strOS = "irix"
				If InStr(strUserAgent,"irix 5")Then strOS = "irix5"
				If InStr(strUserAgent,"irix 6") or InStr(strUserAgent,"irix6") Then strOS = "irix6"
				If InStr(strUserAgent,"hp-ux") Then strOS = "hpux"
				If InStr(strUserAgent,"09.") Then strOS = "hpux9"
				If InStr(strUserAgent,"10.") Then strOS = "hpux10"
				If InStr(strUserAgent, "aix") Then strOS = "aix"
				If InStr(strUserAgent, "aix 1") Then strOS = "aix1"
				If InStr(strUserAgent, "aix 2") Then strOS = "aix2"
				If InStr(strUserAgent, "aix 3") Then strOS = "aix3"
				If InStr(strUserAgent, "aix 4") Then strOS = "aix4"
				If InStr(strUserAgent, "inux") Then strOS = "Linux"
				If InStr(strUserAgent, "") Then strOS = ""
				If InStr(strUserAgent, "") Then strOS = ""
				If InStr(strUserAgent, "") Then strOS = ""
				If InStr(strUserAgent, "") Then strOS = ""
				If InStr(strUserAgent, "") Then strOS = ""
				If InStr(strUserAgent, "") Then strOS = ""
			
			Case "PERL"
				If InStr(strUserAgent, "") Then strOS = ""

			Case "OS/2"
				If InStr(strUserAgent, "") Then strOS = ""

			Case "VMS"
				If InStr(strUserAgent, "") Then strOS = ""

			Case Else
				'Unknown Operating System

		End Select

		If blnDebug Then Response.Write("Result of DetectOS() = " & strOS & "<br>")
		
	End Sub '  DetectOS()
	
	Private Sub DetectBrowser()
		
		If blnDebug Then Response.Write ("DetectBrowser() fired.<br>")
		
		If InStr(strUserAgent, "msie") Then 
			strBrowser = "IE"
		ElseIf InStr(strUserAgent, "mozilla") Then 
			strBrowser = "NS"
		ElseIf InStr(struserAgent, "gecko") Then 
			strBrowser = "NS"
		ElseIf InStr(strUserAgent, "opera") Then 
			strBrowser = "Opera"
		ElseIf InStr(strUserAgent, "neoplanet") then 
			strBrowser = "NeoPlanet"
		ElseIf InStr(strUserAgent, "mosaic") Then 
			strBrowser = "Mosaic"
		ElseIf InStr(strUserAgent, "sun") Then 
			strBrowser = "HotJava"
		ElseIf InStr(strUserAgent, "lynx") Then 
			strBrowser = "Lynx"
		ElseIf InStr(strUserAgent, "webreaper") Then 
			strBrowser = "CRAWLER"
		ElseIf InStr(strUserAgent, "architextspider") Then 
			strBrowser = "CRAWLER"
		ElseIf InStr(strUserAgent, "t-h-u-n-d-e-r-s-t-o-n-e") Then 
			strBrowser = "CRAWLER"
		End If

		If blnDebug Then Response.Write("The result of DetectBrowser() = " & strBrowser & "<br>")

	End Sub 'DetectBrowser()

	Private Sub DetectVersion()

		If blnDebug Then Response.Write("DetectVersion() fired.<br>")
		
		dim intLength, blnNotFound, KEY, UA_Pos, DOT_Pos
		Select Case strBrowser
			Case "IE"
				KEY = "msie"
				UA_Pos = InStr(strUserAgent, KEY) '  Find first occurance
				If UA_Pos = 0 Then Exit Sub		  '  Error
				DOT_Pos = InStr(UA_Pos + len(KEY) + 1,strUserAgent,".") '  Find first dot after that
				If DOT_Pos = 0 Then Exit Sub							'  Error
				intMajorVer = CStr(Mid(strUserAgent, UA_Pos + Len(KEY) + 1, DOT_Pos - (UA_Pos + Len(KEY) + 1) )) '  Read from KEY to dotpos
				
				intLength = 0
				blnNotFound = true
				while blnNotFound
					if isNumeric(Mid(strUserAgent,DOT_Pos + 1 + intLength, 1)) then
						intLength = intLength + 1
					else
						blnNotFound = false
					end if
				wend
				intMinorVer = CStr(Mid(strUserAgent, DOT_Pos + 1, intLength)) '  read from dotpos to next non-numeric

				'  Now check for AOL, MSN Explorer, and WEBTV
				If InStr(strUserAgent, "aol") > 0 Then strSpecial = "AOL"
				If InStr(strUserAgent, "webtv") > 0 Then strSpecial = "WEBTV"
				If InStr(strUserAgent, "msn") > 0 Then strSpecial = "MSN Explorer"

			Case "NS"
				KEY = "mozilla"
				UA_Pos = InStr(strUserAgent, KEY) '  Find first occurance
				If UA_Pos = 0 Then Exit Sub		  '  Error
				DOT_Pos = InStr(UA_Pos + len(KEY) + 1,strUserAgent,".") '  Find first dot after that
				If DOT_Pos = 0 Then Exit Sub							'  Error
				intMajorVer = CStr(Mid(strUserAgent, UA_Pos + Len(KEY) + 1, DOT_Pos - (UA_Pos + Len(KEY) + 1) )) '  Read from KEY to dotpos
				
				intLength = 0
				blnNotFound = true
				while blnNotFound
					if isNumeric(Mid(strUserAgent,DOT_Pos + 1 + intLength, 1)) then
						intLength = intLength + 1
					else
						blnNotFound = false
					end if
				wend
				intMinorVer = CStr(Mid(strUserAgent, DOT_Pos + 1, intLength)) '  read from dotpos to next non-numeric

				
				'  Now check for "gold"
				If InStr(strUserAgent, "gold") Then strSpecial = "Gold"
				If InStr(strUserAgent, "nav") Then strSpecial = "Navigator Only"
				
				
				'if strMajor < 5 then
				'	strStyleSheets = "NO"
				'	if strMajor < 4 then
				'		strWhinge = "YES"
				'	end if
				'else
				'	strDHTML = "YES"
				'end if 
				'if strMajor > 3 then
				'	strJScript = "True"
				'end if

			Case "Opera"
				KEY = "opera"
				UA_Pos = InStr(strUserAgent, KEY) '  Find first occurance
				If UA_Pos = 0 Then Exit Sub		  '  Error
				DOT_Pos = InStr(UA_Pos + len(KEY) + 1,strUserAgent,".") '  Find first dot after that
				If DOT_Pos = 0 Then Exit Sub							'  Error
				intMajorVer = CStr(Mid(strUserAgent, UA_Pos + Len(KEY) + 1, DOT_Pos - (UA_Pos + Len(KEY) + 1) )) '  Read from KEY to dotpos
				
				intLength = 0
				blnNotFound = true
				while blnNotFound
					if isNumeric(Mid(strUserAgent,DOT_Pos + 1 + intLength, 1)) then
						intLength = intLength + 1
					else
						blnNotFound = false
					end if
				wend
				intMinorVer = CStr(Mid(strUserAgent, DOT_Pos + 1, intLength)) '  read from dotpos to next non-numeric

			'strDHTML = "YES"

			Case "Mosaic"
				strMajor = Mid(strAgent,13,1)
				strMinor = Mid(strAgent,15,1)
				'strStyleSheets = "NO"
			
			Case "HotJava"
				strMajor = Mid(strAgent,9,1)
				strMinor = Mid(strAgent,11,1)
				'strStyleSheets = "NO"
				
			Case "NeoPlanet"
			
			Case "Lynx"
			
			Case "CRAWLER"
				
			Case Else
				'  Unknown
				'  TODO: Maybe message with casebucket or do some thing for the log?
		End Select

		If blnDebug Then Response.Write("Result of DetectVersion(): intMajorVer = " & intMajorVer & ", intMinorVer = " & intMinorVer & "<br>")

	End Sub '  DetectVersion()

	Private Sub DetectBeta()
	
		If blnDebug Then Response.Write("DetectBeta() fired.<br>")
		
		SC1 = Instr(strUserAgent, ";")
		SC2 = Instr(SC1 + 1, strUserAgent, ";")
		MB = Instr(SC1 + 1, strUserAgent, "b")
		MP = Instr(SC1 + 1, strUserAgent, "p")

		If (bwsrName = "IE" And ((MB > SC1 And MB < SC2) Or (MP > SC1 And MP < SC2))) Or _
		   (bwsrName = "NS" And Instr(ua, "b") < SC1) Or _
		   (bwsrName = "OPERA" And Instr(ua, "b") < SC1) Then bwsrBeta = True
		
		If blnDebug Then Response.Write("Result of DetectBeta() = " & blnIsBeta & "<br>")
		
	End Sub '  DetectBeta()
	
	Private Sub DetectEncryption()
		
		If blnDebug Then Response.Write("DetectEncryption() fired.<br>")
		
		
		
		
		If blnDebug Then Response.Write("Result of DetectEncryption() = " & intEncryption & "<br>")
		
	End Sub '  DetectEncryption()
	
	Private Sub LogBrowser()
		
		If blnDebug Then Response.Write("LogBrowser() fired.<br>")
		
		Dim fso, ts, FileName, TextString, ApplicationPath
		ApplicationPath = Request.ServerVariables("APPL_PHYSICAL_PATH")
		If Right(ApplicationPath,1) <> "\" Then
			ApplicationPath = ApplicationPath + "\"
		End If
		ApplicationPath = Replace(ApplicationPath,"\\","\")
		FileName = ApplicationPath & "UAlog.csv"

		Set fso = CreateObject("Scripting.FileSystemObject")
		If not (fso.FileExists(FileName)) Then
			Set ts = fso.CreateTextFile(FileName, True)
			TextString = """Date"",""UserAgent"",""IP Address"",""Page visited"",""Referer"",""Platform"",""OS"",""Browser"",""MajorVer"",""MinorVer"",""IsBeta"",""Special"""
			ts.WriteLine(TextString)
			ts.Close
		End If


		' Append to existing file
		Set fso = CreateObject("Scripting.FileSystemObject")
		Set ts = fso.OpenTextFile(FileName,8)
		TextString = """" & date() & """,""" & request.servervariables("HTTP_USER_AGENT") & """,""" & request.servervariables("REMOTE_ADDR") & """,""" & request.servervariables("PATH_INFO") & """,""" & request.servervariables("HTTP_REFERER") & """,""" & strPlatform & """,""" & strOS & """,""" & strBrowser & """,""" & intMajorVer & """,""" & intMinorVer & """,""" & blnIsBeta & """,""" & strSpecial & """"
		ts.WriteLine(TextString)
		ts.Close
		
		If blnDebug Then Response.Write("LogBrowser() done.<br>")
		
	End Sub '  LogBrowser()
	
	Private Sub CompareWithBrowsCap()
		
		If blnDebug Then Response.Write("CompareWithBrowsCap() fired.<Br>")
		
	    Dim bc
		Set bc = Server.CreateObject("MSWC.BrowserType")
		'strBrowser = bc.Browser
		'strMajor = bc.Majorver
		'strMinor = bc.Minorver
		'strFrames = bc.Frames
		'strStyleSheets = "YES"
		'strDHTML= "NO"
		'strJScript = bc.javascript
		
		Set bc = Nothing
		
		If blnDebug Then Response.Write("CompareWithBrowsCap() done.<br>")
		
	End Sub '  CompareWithBrowsCap()
	
End Class '  browser
%>
