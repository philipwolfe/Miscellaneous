<%
	// -----------------------------------------------------------
	// BrowserData() constructor
	// .userAgent: (string) the HTTP_USER_AGENT input string
	// .browser: (string) "MSIE", "Nav", "Other" 
	// .majorVer: (integer) major browser version
	// .minorVer: (integer) minor (dot) browser version
	// .platform: (string) "Win95", "Win98", "WinNT", "Unix", "Mac"
	// .getsNavBar (boolean) whether browser is "GoodBrowser"
	// -----------------------------------------------------------

	function BrowserData(sUA)
	{
		this.userAgent = sUA.toString();
		var rPattern = /(MSIE)\s(\d+)\.(\d+)((b|p)([^(s|;)]+))?;?(.*(98|95|NT|3.1|32|Mac|X11))?/;
		if (this.userAgent.match(rPattern))
		{
			this.browser = "MSIE";
			this.majorVer = RegExp.$2 || 0;
			this.minorVer = RegExp.$3 || 0;
			this.betaVer = RegExp.$6 || 0;
			this.platform = RegExp.$8 || "Other";
		}
		else if (this.userAgent.match(/Opera[/](\d+)\.?(\d*).*;(.*(95[/]NT4|3.1)\)\s*(\d*)\.?(\d*))/))   
		{
			this.browser = "Opera";
			this.majorVer = RegExp.$5 || RegExp.$1 || 0;
			this.minorVer = RegExp.$6 || RegExp.$2 || 0;
			this.platform = RegExp.$4 || "Other";
		}
		else if (this.userAgent.match(/Mozilla[/](\d*)\.?(\d*)(.*(98|95|NT|32|16|68K|PPC|X11))?/))
		{
			this.browser = "Nav";
			this.majorVer = RegExp.$1 || 0;
			this.minorVer = RegExp.$2 || 0;
			this.platform = RegExp.$4 || "Other";
		}
		else
		{
			this.browser = "Other";
		}
		this.getsNavBar = ("MSIE" == this.browser && 4 <= this.majorVer && "Mac" != this.platform);
		this.doesActiveX = ("MSIE" == this.browser && 3 <= this.majorVer && ("95" == this.platform || "98" == this.platform || "NT" == this.platform));
	}

	var oBD = new BrowserData(new String(Request.ServerVariables("HTTP_USER_AGENT")));
%>
