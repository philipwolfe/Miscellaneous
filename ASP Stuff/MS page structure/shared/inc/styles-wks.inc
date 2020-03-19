<%
	if (oBD.getsNavBar)
	{
		Response.Write('<LINK REL="stylesheet" TYPE="text/css" HREF="shared/css/navbar.css" />\n');
	}

  function GetMainStylesheet()
  {
		var sSheet = "shared/css/";
		if ("Mac" == oBD.platform) return sSheet + "Mac-wks.css";
		if ("MSIE" == oBD.browser)
		{
			if (3 == oBD.majorVer) return sSheet + "IE3-wks.css";
			else return sSheet + "IE4-wks.css";
		}
		else if ("Nav" == oBD.browser) return sSheet + "Nav-wks.css";
	}
	Response.Write('<LINK REL="stylesheet" TYPE="text/css" HREF="' + GetMainStylesheet() + '" />\n');
%>