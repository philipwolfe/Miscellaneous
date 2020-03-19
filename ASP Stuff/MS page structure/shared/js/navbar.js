
	// -----------------------------------------------------------------------
	// 	NAVIGATION FOR MENUBAR AND MENUITEMS
	// -----------------------------------------------------------------------

	// -----------------------------------------------------------------------
	// 	Global variables to track menu state
	// -----------------------------------------------------------------------

	var eNavBarItemShown = null;
	var eMenuShown = null;

	// -----------------------------------------------------------------------
	// 	Conditional global event-handlers
	// -----------------------------------------------------------------------

	function document_click()
	{
		if ("clsNavBarItemShown" != window.event.srcElement.className && null != eMenuShown) HideMenu();
	}

	function document_keypress()
	{
		if ("27" == window.event.keyCode && null != eMenuShown) HideMenu();
	}

	function window_blur()
	{
		if (null != eMenuShown) HideMenu();
	}

	// -----------------------------------------------------------------------
	// 	Cache/Uncache functions to store and bind if menu shown
	// -----------------------------------------------------------------------

	function CacheAndBind()
	{
		window.CachedClick = document.onclick;
		window.CachedKeypress = document.onkeypress;
		window.CachedBlur = window.onblur;
		document.onclick = document_click;
		document.onkeypress = document_keypress;
		window.onblur = window_blur;
	}

	function UncacheAndRebind()
	{
		document.onclick = window.CachedClick;
		document.onkeypress = window.CachedKeypress;
		window.onblur = window.CachedBlur;
	}

	// -----------------------------------------------------------------------
	// 	HideMenu and ShowMenu functions
	// -----------------------------------------------------------------------

	function HideMenu()
	{
		eMenuShown.style.visibility = "hidden";
		eMenuShown = null;
		eNavBarItemShown.className = "clsNavBarItem";
		eNavBarItemShown = null;
		UncacheAndRebind();
	}

	function ShowMenu(eSrc)
	{
		eMenuShown = document.all["divMenu" + eSrc.expItemNum];
		eNavBarItemShown = eSrc;
		eNavBarItemShown.className = "clsNavBarItemShown";
		if (null != eMenuShown) eMenuShown.style.visibility = "visible";
		CacheAndBind();
	}

	// -----------------------------------------------------------------------
	// 	FindTD function used in NavBar event-handlers to determine TD ancestor
	// -----------------------------------------------------------------------

	function FindTD(eSrc,eContainer)
	{
		while (eContainer.contains(eSrc))
		{
			if ("TD" == eSrc.tagName) return eSrc;
			eSrc = eSrc.parentElement;
		}
		return false;
	}

	// -----------------------------------------------------------------------
	// 	NavBar event-handlers (bound below)
	// -----------------------------------------------------------------------

	function NavBar_mouseover(eContainer)
	{
		var eSrc = FindTD(window.event.srcElement,eContainer);
		if (FindTD(window.event.fromElement,eContainer) != eSrc)
		{
			if ("clsNavBarItem" == eSrc.className)
			{
				eSrc.className = "clsNavBarItemOver";
				if (null != eMenuShown)
				{
					HideMenu();
					ShowMenu(eSrc);
				}
			}
		}
	}

	function NavBar_mouseout(eContainer)
	{
		var eSrc = FindTD(window.event.srcElement,eContainer);
		if (FindTD(window.event.toElement,eContainer) != eSrc)
		{
			if ("clsNavBarItemOver" == eSrc.className) eSrc.className = "clsNavBarItem";
		}
	}

	function NavBar_click(eContainer)
	{
		window.event.cancelBubble = true;
		var eSrc = FindTD(window.event.srcElement,eContainer);
		if ("clsNavBarItemOver" == eSrc.className)
		{
			if (null != eMenuShown) HideMenu();
			ShowMenu(eSrc);
		}
		else if ("clsNavBarItemShown" == eSrc.className)
		{
			if (null != eMenuShown) HideMenu();
			eSrc.className = "clsNavBarItemOver";
		}
	}

	// -----------------------------------------------------------------------
	// 	HackURL function used in Menu_click to create unique c-frame frameset in Menu_click
	// -----------------------------------------------------------------------

	function HackURL(sURL)
	{
		var dDate = new Date().getTime();
		var sFrameURL = sURL.substring(0,sURL.indexOf("#"));
		var sHash = sURL.substring(sURL.indexOf("#"));
		if ("" != sFrameURL)
		{
			if (-1 < location.protocol.indexOf("file:")) return sHash.substring(1);
			else return sFrameURL + "?" + dDate + sHash;
		}
		else return sURL;
	}

	// -----------------------------------------------------------------------
	// 	Menu event-handlers (bound inline at time of menu creation)
	// -----------------------------------------------------------------------

	function Menu_hover()
	{
		var eSrc = window.event.srcElement;
		if ("clsMenu" != eSrc.className) eSrc.className = ("" == eSrc.className ? "clsMenuItemOver" : "");
	}

	function Menu_click()
	{
		HideMenu();
		top.location.href = HackURL(window.event.srcElement.expURL);
	}

	// -----------------------------------------------------------------------
	// 	NavBar event binding
	// -----------------------------------------------------------------------

	if ("object" == typeof(tblNavBar))
	{
		tblNavBar.onmouseover = new Function("NavBar_mouseover(this);");
		tblNavBar.onmouseout = new Function("NavBar_mouseout(this);");
		tblNavBar.onselectstart = new Function("return false;");
		tblNavBar.onclick = new Function("NavBar_click(this);");
	}
