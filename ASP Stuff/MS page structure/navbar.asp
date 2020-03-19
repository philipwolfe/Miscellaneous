<% @LANGUAGE="JScript" %>
<HTML>
<HEAD>
<TITLE>SBN NavBar Sample Page</TITLE>
<META NAME="keywords" CONTENT="dhtml, dynamic HTML, JavaScript, positioning" />
<META NAME="robots" CONTENT="All" />
<META NAME="description" CONTENT="Sample page implementing Site Builder Network NavBar" />
<META NAME="MS.LOCALE" CONTENT="EN-US" />
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=iso-8859-1" />
<%
  // -----------------------------------------------------------
  // MetaData constructor function
  // Authors/Editors enter document-specific data here to populate INC'd elements
  // -----------------------------------------------------------

	function MetaData()
	{
		// -----------------------------------------------------------
		// Generic information entered for every document
		// Put in HEAD TITLE and META tags
		// -----------------------------------------------------------

		this.title = "SBN NavBar Sample Page";
		this.description = "Sample page implementing Site Builder Network NavBar";
		this.keywords = "dhtml, dynamic HTML, JavaScript, positioning";
		this.robots = "All";

		this.author = "Robert Carter, George Young";
		this.posted = "12/15/1998";
		this.updated = "";

		// -----------------------------------------------------------
		// Optional DocDataBlock in footer-xxx.inc
		// TENTATIVE
		// -----------------------------------------------------------

		this.displayDocDataBlock = false;
	}

	var oMD = new MetaData()
	
%>
<!-- #include file="shared/inc/header.inc" -->

<SCRIPT LANGUAGE="Javascript"><!--

	// -----------------------------------------------------------
	// window_load()
	// Container function for load.
	// -----------------------------------------------------------

	function window_load()
	{
		if (oBD.getsNavBar)
		{
			if ("function" == typeof(InitNavLinks)) InitNavLinks();
			if ("function" == typeof(CheckToTop)) CheckToTop();
		}
	}
	window.onload = window_load;
//--></SCRIPT>

</HEAD>

<BODY TOPMARGIN="0" LEFTMARGIN="0" MARGINHEIGHT="0" MARGINWIDTH="0" BGCOLOR="#FFFFFF">

<!-- #include file="shared/inc/navbar.inc" -->

<DIV CLASS="clsDocBody">

<!-- DOCUMENT CONTENT START -->



<H1>The Site Builder Network NavBar Sample Demonstration Page</H1>
<HR SIZE="1" />
<P><!--DATE-->December 15, 1998
<P><!--/DATE-->
<P>
Hello intrepid coders! </P>
<P>Welcome to our NavBar sample. Hopefully by now you've read our <a href="http://www.microsoft.com/workshop/author/dhtml/navbar.asp">seminal NavBar article</a>, and are ready to plunge into the code itself. Before you do, though, a few notes:
<UL>
	<LI>The code here does not exactly match the code in the article.  Although the logic is the same, we've made some updates. Because you're such accomplished coders, and also because we feel the implementation is smoother and more intuitive, we're sure you won't have any difficult figuring out what's what.</LI>
	<LI>We used virtual includes for our files. To be able to see this ASP file on your local server, you'll need to set up a virtual directory named navbar, and pop all the sample files in the folder it's associated with.</LI>
	</UL>
With that said, dive in, the water's fine. And let us know if you have any comments or suggestions by using the Write-us link below.
</P>
<P>
<I>The Site Builder Network Team</I>
<!-- DOCUMENT CONTENT END -->



<P><I>Did you find this sample useful? Gripes? Compliments? Suggestions for other articles? <A TITLE="Go ahead. Make our day! Send us your thoughts." HREF="http://www.microsoft.com/sitebuilder/write-us.asp?author=Robert%20Carter&area=NavBar%20Sample" TARGET="_top">Write us!</A></I>

  
<%
	if (oBD.getsNavBar)
	{
%>
		<!-- #include file="shared/inc/navmenus.inc" -->
<%
		Response.Write('<SCRIPT LANGUAGE="JavaScript" SRC="shared/js/navbar.js"></SCRIPT> \n');
	}		
%>
</DIV>
</BODY>
</HTML>
