// vshome.js
/**********************************************************************
// global values
// loc values
// loc studio format: L_ + var name + var type (HTMLText mostly)
**********************************************************************/

var L_myProfileLabel_HTMLText = "My Profile";
var L_ErrSettingFilter_HTMLText = "Filter string matched no known filter";
var L_NoRecentSlnFiles_HTMLText = "No recent projects found";
var L_FileNoExist_HTMLText = "Requested project could not be found";
var L_TodayAt_HTMLText = "Today";
var L_YesterdayAt_HTMLText = "Yesterday";
var L_FltCorrupt_HTMLText = "No Filters Found";
var L_FilterCorrupt_HTMLText = "Attempt to set filter failed.\nFilter may be corrupt.";
var L_ChkForUpdate_HTMLText = "Updates to Visual Studio.NET have been found.\nWould you like to download updates now?";
var L_RegKeysMissing_HTMLText = "Registry Keys Missing.";
var L_LaunchVSHomePageAtStartYes_HTMLText = "Visual Studio Start Page will be shown at startup";
var L_LaunchVSHomePageAtStartNo_HTMLText = "Visual Studio Start Page will not be shown at startup";
var L_LaunchVSHomePageAtStartAlt_HTMLText = "Set Visual Studio Start Page start state";

var L_OpenLinksInNewWindowYes_HTMLText = "Web links will be opened in a new browser window";
var L_OpenLinksInNewWindowNo_HTMLText = "Web links will be opened in the current browser window";
var L_OpenLinksInNewWindowAlt_HTMLText = "Set Web links to be internally or externally opened";

var L_DataLoadError_HTMLText = "Could not display data.";
var L_RebootRequired_HTMLText = "Changes will not take effect until you restart Visual Studio.NET";
var L_ResetRequired_HTMLText = "Changes will not take effect until you refresh the Start page";

var L_Configure_HTMLText = "Configure ";
var L_BackTo_HTMLText = "Back to ";
var L_ConfigureThisTab_HTMLText = "Configure this tab";
var L_BackToTab_HTMLText = "Back to tab";

var L_LoadingData_HTMLText = "Checking for updated information from the web...";

var L_StopDebugging_HTMLText = "Cannot open a new project while debugging.";
var L_StopBuilding_HTMLText = "Cannot open a project while a build is in process.";

var L_Done_HTMLText = "Done";
var L_SearchingDotDotDot_HTMLText = "Searching ...";
var L_ReferencesNotSupported_HTMLText = "The selected project does not support references, or the reference could not be found.";
var L_AddReferencesDocs_HTMLText = "To add a web reference, a project supporting web references must be open and selected in the Solution Explorer.";
var L_NoOnlineFeaturesWhenOffline_HTMLText = "The online search feature does not work when offline.";
var L_ErrorQueryOnline_HTMLText = "Error querying online. If error persists please contact your administrator.";
var L_NoSamplesMatching_HTMLText = "No samples found matching query.";
var L_NoDataAvail_HTMLText = "No Data Available. Please refine query.";

/**********************************************************************
// global vars
**********************************************************************/

var g_oHelp;
var g_sFilter = "";
var g_sFilterName = "";
var g_strRegistryHiveRoot = "HKCU\\" + window.external.RegistryRoot + "\\";
var g_LCID = window.external.LocaleID;
var g_MSXML_DOM = "MSXML2.DOMDocument.3.0";
var g_MSXML_Schema_DOM = "Msxml2.XMLSchemaCache.3.0";
var g_valSchema = null;
var g_CurrentUpdateValue = 0;
var g_PendingUpdateValue = 0;
var g_FirstEntry;
var g_args = new Array();
var g_oCurrSelect = null;
var g_oCurrFocus = null;
var g_bDebug = false;
var g_keyObject = false; // global object for context, init as non extant

var g_wshShell = new ActiveXObject("WScript.Shell");
var g_oFSO = null; // initialized when used through FSO()

try{
	var g_FirstEntry = g_wshShell.regread(g_strRegistryHiveRoot+"ProfileRun");
}catch(oErr){
	var g_FirstEntry = 0; 
}

var g_AppDataFolder = 0;
try {
	g_AppDataFolder = g_wshShell.regread("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders\\AppData");
} catch (e) {
	fnAssert(false, "Unable to obtain AppData folder value from registry");
}


try{
	sLoc=document.location.toString().split("?");
	sLoc=sLoc[1].split("&");
	for(var i=0;i<sLoc.length;i++){
		oTmp=sLoc[i].split("=");
		g_args[oTmp[0]]=oTmp[1];
	}
}catch(oErr){
	//noop;
}

function browserNavigate(navigateRelative, strURL){
	var openInNew = 0;
	var strNewURL = strURL;
	
	if(navigateRelative ==0)
	{
		try{
			openInNew = g_wshShell.Regread(g_strRegistryHiveRoot + "OpenDocsInNewWindow");
		} catch(oErr) {
		}
	}
	else if(navigateRelative == 1)
	{
		strNewURL = window.external.GetObject("Help").Collection + strURL;
		openInNew = 2;
	} 
	else if(navigateRelative == 2)
	{
		openInNew = 2;
	}
 
	if(openInNew == 2)
	{
		if(window.external.Properties("Environment", "Help").Item("External").Value == 1)
			window.external.GetObject("Help").DisplayTopicFromURL(strNewURL);
		else
			window.open(strNewURL, "_blank");
	} 
	else if((openInNew == 1) || (navigateRelative == 3))
	{
		window.open(strNewURL, "_blank");
	} 
	else 
	{
		window.open(strNewURL, "_self");
	}
}

function document.onkeydown(){
	if (event.keyCode == 19) { // Pause/break key toggles debug mode
		g_bDebug = !g_bDebug; 
		if (g_bDebug) fnvsSetStatus('debug mode: ' + g_bDebug);
	}
}

function fnvsInitUpdateValues(){
	try{
		g_CurrentUpdateValue = g_wshShell.regread(g_strRegistryHiveRoot+"LastKnownUpdate");
		if (g_CurrentUpdateValue.length > 1 && g_CurrentUpdateValue.charAt == "{") {
			// older versions used a GUID, but now we just use an incrementing value for simplicity
			g_wshShell.regwrite(g_strRegistryHiveRoot+"LastKnownUpdate","0");
			g_CurrentUpdateValue = "0";
		}

	}catch(oErr){
		g_wshShell.regwrite(g_strRegistryHiveRoot+"LastKnownUpdate","0");
		g_CurrentUpdateValue = "0";
	}
	try{
		g_PendingUpdateValue = g_wshShell.regread(g_strRegistryHiveRoot+"PendingUpdate");
	}catch(oErr){
		g_PendingUpdateValue = 0;
	}

	fnCheckForVsUpdate(g_PendingUpdateValue);
}

/**********************************************************************
// boot functions
**********************************************************************/

function fnAssert(bForce, sMsg){
	if (g_bDebug || bForce) {alert(sMsg);}
}

function window.onunload()
{
	if (g_keyObject) g_keyObject.Remove();
}

function window.onload()
{
	try{

		// set the checkbox rollovers

		chkStart.YesText = L_LaunchVSHomePageAtStartYes_HTMLText;
		chkStart.NoText = L_LaunchVSHomePageAtStartNo_HTMLText;
		/*chkWebLinks.YesText = L_OpenLinksInNewWindowYes_HTMLText;
		chkWebLinks.NoText = L_OpenLinksInNewWindowNo_HTMLText;*/
	}catch(oErr){
		//noop;
	}

	fnSetBoxen();

	try{
		iTab = 0;
		if(g_FirstEntry==0){
			iTab = menu.length-1;
			g_wshShell.regwrite(g_strRegistryHiveRoot+"ProfileRun",1,"REG_DWORD");
		}else{
			if(g_args["tab"]){
				for(var i=0;i<menu.length;i++){
					if(menu[i].innerText.toLowerCase()==decodeURI(g_args["tab"]).toLowerCase())iTab=i;
				}
			}
		}
	}catch(e){
		iTab = 1;
	}
	if (menu.length > 0) menu[iTab].click();
	fnvsInitUpdateValues();
}

function fnSetBoxen(){
	// set the checkbox states
	try{
		chkStart.checked = window.external.Properties('Environment', 'General').Item('OnStartup').Value == 0;
	}catch(oErr){
		chkStart.checked = true;
	}
	try{
		chkWebLinks.checked = g_wshShell.Regread(g_strRegistryHiveRoot + "OpenDocsInNewWindow") == 1;
	}catch(oErr){
		chkWebLinks.checked = false;
	}
	chkStart.src = chkStart.checked ? "images\\showHPYes.gif" : "images\\showHPNo.gif";
	chkStart.alt = L_LaunchVSHomePageAtStartAlt_HTMLText;  // chkStart.checked?L_LaunchVSHomePageAtStartYes_HTMLText:L_LaunchVSHomePageAtStartNo_HTMLText;
	chkWebLinks.src = chkWebLinks.checked ? "images\\openAsNewYes.gif" : "images\\openAsNewNo.gif";
	chkWebLinks.alt = L_OpenLinksInNewWindowAlt_HTMLText; // chkWebLinks.checked?L_OpenLinksInNewWindowYes_HTMLText:L_OpenLinksInNewWindowNo_HTMLText;
}

/**********************************************************************
// helper functions
**********************************************************************/
function fnShortDate(oDate){
	var keyDateFormBase = "HKEY_CURRENT_USER\\Control Panel\\International";
	var keyDateForm = keyDateFormBase + "\\sShortDate";
	var keyDateSep = keyDateFormBase + "\\sDate";
	var sDateReturn = "";
	var sBaseForm = String(g_wshShell.RegRead(keyDateForm));
	var sDateSep = String(g_wshShell.RegRead(keyDateSep));

	var sDayAsInt = String(oDate.getDate());
	var sMonthAsInt = String(oDate.getMonth()+1);
	var sFullYearAsInt = String(oDate.getFullYear());

	oDateArry = sBaseForm.split(sDateSep);
	for(var i = 0;i<oDateArry.length; i++){
		var sPartial = "";
		switch(oDateArry[i]){
			case "M":
				sDateReturn += sMonthAsInt;
				break;
			case "MM":
			case "MMM":
				if(parseInt(sMonthAsInt)<10)sMonthAsInt = "0" + sMonthAsInt;
				sPartial += sMonthAsInt;
				break;

			case "d":
				sPartial += sDayAsInt;
				break;
			case "dd":
				if(parseInt(sDayAsInt)<10)sDayAsInt = "0" + sDayAsInt;
				sPartial += sDayAsInt;
				break;
			case "yy":
				sPartial += sFullYearAsInt.substr(2);
				break;
			case "yyyy":
				sPartial += sFullYearAsInt;
				break;

			default:
				//sDateReturn = oDate.toLocaleString();
		}
		if(sPartial!="")sDateReturn += sPartial;
		if(oDateArry.length-1 != i)sDateReturn += sDateSep;
	}
	if(sDateReturn=="")sDateReturn = oDate.toLocaleString();

	return sDateReturn; 
}

function fnTabConfigured(sTabID)
{
	var retVal = false;
	try {
		retVal = window.external.Globals.VariableValue(sTabID+"configured");
	}
	catch (e) {
	}
	
	return retVal;
}


function fnInvokeVsUpdate()
{
	window.external.ExecuteCommand("Help.CheckforUpdates");
	g_CurrentUpdateValue = g_wshShell.regread(g_strRegistryHiveRoot+"PendingUpdate");
	// Make the last known match the pending.
	g_wshShell.regwrite(g_strRegistryHiveRoot+"LastKnownUpdate",g_CurrentUpdateValue);
	// Too disturbing: VsUpdateSpan.style.display="none";
}

function fnCheckForVsUpdate(sIncrement)
{
	try{
		if (sIncrement > g_CurrentUpdateValue) {
			VsUpdateSpan.style.display="inline";
			g_wshShell.regwrite(g_strRegistryHiveRoot+"PendingUpdate",sIncrement);
			g_PendingUpdateValue = sIncrement;
		} else {
			VsUpdateSpan.style.display="none";
			if (sIncrement < g_CurrentUpdateValue) sIncrement = g_CurrentUpdateValue; 
			g_wshShell.regwrite(g_strRegistryHiveRoot+"LastKnownUpdate",sIncrement);
			g_wshShell.regwrite(g_strRegistryHiveRoot+"PendingUpdate",sIncrement);
		}
	}catch(e){
		fnAssert(false, "CheckForVsUpdate: " + e.description);
	}
}

function fnvsGetShellPath(){
	try{
		var sExtLoc = window.external.FullName;
		return sExtLoc.substring(0, sExtLoc.lastIndexOf("\\")+1);
	}catch(e){

	}
}

function fnvsSetStatus(sText){
	window.external.StatusBar.Text = sText;
}

function fnCheckToStopDebugging(){
	if(window.external.Mode == 2) //2 == vsIDEModeDebug
	{
		alert(L_StopDebugging_HTMLText);
		return false;
	}
	if(window.external.Solution.SolutionBuild.BuildState == 2) //2 == vsBuildStateInProgress
	{
		alert(L_StopBuilding_HTMLText);
		return false;
	}
	return true;
}

function fnvsLoadProject(sProjName){
	if(fnCheckToStopDebugging() == false)
		return;
	try{
		window.external.ExecuteCommand("file.openproject", "\""+sProjName+"\"");	
	}catch(oErr){
		fnAssert(true, L_FileNoExist_HTMLText);
	}
}

/**********************************************************************
// object initialization functions
**********************************************************************/

function fnAssocHelp(){
	//var od = new Date();
	try{
		g_oHelp = window.external.GetObject("Help");
	}catch(e){

	}
//	var od2 = new Date();
//	alert(od2.getTime() - od.getTime() + " milliseconds");
}

function fnAddOption(oTgt, sValue, sOptionText, bDefault){
	oOpt = document.createElement("OPTION");

	oOpt.value = sValue;
	oOpt.innerText = sOptionText;
	oOpt.selected = bDefault;

	oTgt.appendChild(oOpt);
}

function fnTabIndex(sOp){
	if(sOp == 'get') return window.iTabIndex;
	if(sOp == 'add') window.iTabIndex++;
	return window.iTabIndex;
}

function fnAddMenuItem(bUsesHelp, sLabel, sClickFn, sAssocId)
{
	var oTR, oTD;
	try{
		oTR = document.createElement("TR");
		oTD = document.createElement("TD");
		oTD.id = "menu";
		oTD.onfocus = new Function("fnFocusRollover(this);");
		oTD.onclick = new Function("fnHelpListToggle("+bUsesHelp+",'"+sAssocId+"');\n"+sClickFn+";\nfnShowContent(" + sAssocId + ");\nfnMenuClick(this)");
		oTD.onkeypress = new Function("if(event.keyCode==13)this.click();");
		oTD.onmouseover = new Function("fnFocusRollover(this);");
		oTD.onmouseout = new Function("try{if(event.toElement.className.indexOf('TabItem')==-1||event.toElement.id=='menuLast')fnFocusRollover();}catch(oErr){}");
		oTD.className = "clsTabItem";
		oTD.valign = "top";
		oTD.tabIndex = fnTabIndex('add');
		oTD.innerText = sLabel;

		oTR.appendChild(oTD);
		tblTabEnum.children[0].insertAdjacentElement("beforeend",oTR);
		tblTabEnum.style.marginTop = "10px";
		tblTabEnum.style.backgroundColor = "#336699";
		tblTabEnum.parent.style.backgroundColor = "#336699";

		return oTD;
	}catch(e){

	}
}

function fnLoadAndValidate(oTab, xmlobj)
{
	var isValid = false;
	try {
		if (g_valSchema == null) {
			g_valSchema = new ActiveXObject(g_MSXML_Schema_DOM);
			try {
				g_valSchema.add("", "vstab.xdr");
			} catch (e) {
				fnAssert(false, "XML schema error: " + e.description);
			}
		}
		try {
			xmlobj.validateOnParse = true;
			xmlobj.schemas = g_valSchema;
			xmlobj.loadXML(oTab.xml);
			isValid = (xmlobj.parseError == 0);
			if (xmlobj.parseError != 0) {
				fnAssert(false, "Content validation error: " + xmlobj.parseError.reason);
			}
		} catch (e) {
			fnAssert(false, "XML parse or validation error: " + e.message);
			fnAssert(false, "Error Code: " + oErr.errorCode + "\nReason: " + oErr.reason);
			isValid = false;
		}
		if (!isValid) {
			xmlobj.loadXML("<Tab/>");	// dummy data that won't result in a tab
		}
	} catch (e) {
		fnAssert(false, "L&V: " + e.message);
	}
	return isValid;
}

function fnEnumMenu()
{
	var oXmlTabList;
	var xmlobj = new ActiveXObject(g_MSXML_DOM);
	var xslobj = new ActiveXObject(g_MSXML_DOM);
	xslobj.async = false;
	xmlobj.async = false;
	try{
		// hackin the first two tab stops
		if(!window.iTabIndex) window.iTabIndex = 2;

		xslobj.load("vshome.xsl");

		try{
			// enumerate all tab entities from disc
			oXmlTabList = fnLoadExtensData();

			// walk them into the page
			var od = new Date();

			if(oXmlTabList.parseError.errorCode == 0){
				var tabsList = oXmlTabList.getElementsByTagName("Tab");
				for(j = 0; j < tabsList.length ; j++){
					var sID = "";
					var oTab = tabsList.item(j);
					try{
						sID = oTab.selectSingleNode("@ID").text;
						// Retrieve the date of the file on disk
						var oDateNew = new Date(window.external.Globals.VariableValue(sID+"newFileDate"));
						// Get the date of the last persisted version
						var oDateOld = null;
						try {
							oDateOld = new Date(window.external.Globals.VariableValue(sID+"oldFileDate"));
						} catch (e) {
							oDateOld = new Date("1/1/1970");	// None ever persisted, force update
						}
						// If the date matches, use the cached version if possible
						// never true for some reason I don't understand: if (oDateOld == oDateNew) {
						if ((oDateOld - oDateNew) == 0) {
							try {
								xmlobj.loadXML(window.external.Globals.VariableValue(sID+"currXml"));
							}catch(e){
								fnAssert(false, "loading from globals: " + e.description);
							}
						} else {	// Otherwise validate and persist the new one
							if (fnLoadAndValidate(oTab, xmlobj)) {
								try {
									window.external.Globals.VariableValue(sID+"currXml") = xmlobj.xml;
									window.external.Globals.VariablePersists(sID+"currXml") = true;
									window.external.Globals.VariableValue(sID+"oldFileDate") = oDateNew;
									window.external.Globals.VariablePersists(sID+"oldFileDate") = true;
								} catch(e){
									fnAssert(false, "writing globals: " + e.description);
								}
							}
						}
					} catch (e) {
						fnAssert(false, "X: " + e.message);
					}
					// At this point, xmlobj contains the XML text of the current tab
					var bOnClick = false;
					try{
						sID = xmlobj.selectSingleNode("Tab/@ID").text;
						bOnClick = (null != xmlobj.selectSingleNode("Tab/Feeds/Feed"));
					}catch(e){
						sID = "";
					}
					if(bOnClick && sID!=""){
						var sOnClick = "fn"+sID+"OnClick();";
					}else{
						var sOnClick = "";
					}

					// Transform the tab data node first to render the tab content
					sTabId = "tab" + sID + "TabDataDiv";
					var str = "<div id='" + sTabId + "' style='display:none'>";
					try{
						var oNodoi = xmlobj.selectSingleNode("Tab/TabData");
						fnAssert(false, "Tab/Application:\n" + oNodoi.xml);
						str = str + oNodoi.transformNode(xslobj);

					}catch(e){
						//fnAssert(false, "TransformTabData: " + e.description);
					}
					str += "</div>";
					
					// Transform the application node to render the tab content
					sTabId = "tab" + sID + "RenderDiv";
					str += "<div id='" + sTabId + "' class='clsTabRenderArea' ";
					try {
						var oKwd = xmlobj.selectSingleNode("Tab/TabData/Value[@Name='VisualStudioF1Keyword']/text()");
						if (oKwd) {
							str += " f1keyword='" + oKwd.xml + "' ";
						}
					} catch (e) {
						fnAssert(false, "Attempting to get keyword: " + e.description);
					}
					
					str += " style='display:none'>";
					
					try{
						var oNodoi = xmlobj.selectSingleNode("Tab/Application");
						//fnAssert(false, "Tab/Application:\n" + oNodoi.xml);
						if (oNodoi) str = str + oNodoi.transformNode(xslobj);

						if(xmlobj.selectSingleNode("Tab/Feeds")){
							// the string spnPooba is unique to the Search tab
							if(str.indexOf("spnPooba")==-1){
								var oNodoi = xmlobj.selectSingleNode("Tab/Feeds");
								try{
									str = str + oNodoi.transformNode(xslobj);
								}catch(e){
									fnAssert(false, "A: " + e.description);
								}
							}			
						}

					}catch(e){
						fnAssert(false, "B: " + e.description);
					}
					
					str += "</div>";
					// Now transform the config element if present

					if(xmlobj.selectSingleNode("Tab/Config")){
						// Get the Config application
						var xmlCfg = new ActiveXObject(g_MSXML_DOM);
						xmlCfg.load("configure.xml");
						var strCfg = "";
						var oCfg = null;
						try{
							oCfg = xmlCfg.selectSingleNode("//Tab/Application");
							strCfg = oCfg.transformNode(xslobj);
						}catch(e){
							fnAssert(false, "330 CXi: " + e.description);
						}

						var ssTabId = "tab" + sID + "CfgDiv";
						var sstr = "<div id='" + ssTabId + "' style='display:none' class='clsTabRenderArea'>";

						// Insert the application
						sstr += strCfg;
	
						try{
							var oNodey = xmlobj.selectSingleNode("Tab/Config");
							sstr = sstr +  oNodey.transformNode(xslobj);
						}catch(e){
							fnAssert(false, "C: " + e.description);
						}

						sstr = sstr + "</div>";
						document.write(sstr);
					}
					document.write(str);

					// persist HTML
					window.external.Globals.VariableValue(sID+"HTML")= document.getElementById("tab"+sID+"RenderDiv").innerHTML; 
					window.external.Globals.VariablePersists(sID+"HTML") = true;


					try{
						bFiltered = tabsList.item(j).selectSingleNode("@Filterable").text.toLowerCase() == "true";
					}catch(oErr){
						bFiltered = false;
						fnAssert(false, "D: " + e.description);
					}
					try{
						sTabName = xmlobj.selectSingleNode("Tab/@Name").text;
						fnAddMenuItem(bFiltered, sTabName, sOnClick, sTabId);
					} catch(e){
						fnAssert(false, "Tab '" + oTab.selectSingleNode("@Name").text 
										+ "' skipped due to validation failure");
					}
				}
			}
		}catch(e){
			fnAssert(false, "EnumMenu: " + e.description);
		}

		var od2 = new Date();
		fnAssert(false, od2.getTime() - od.getTime() + " milliseconds");

		// finally add profile
		sTabId = "profileDiv";
		var str = "<div id='" + sTabId + "' class='clsTabRenderArea' style='display:none' f1keyword='vs.homepage.get.myprofile'>";
		xmlobj.loadXML("<tag></tag>");
		xslobj.load("vsProfile.xsl");
		str = str + xmlobj.transformNode(xslobj);
		str = str + "</div>";
		document.write(str);
		fnAddMenuItem(false, L_myProfileLabel_HTMLText, "try{fnProfileInit();}catch(oErr){}", sTabId);

		// last cell fills dead space
		// tblTabEnum.innerHTML += sRest;
		oTR = document.createElement("TR");
		oTD = document.createElement("TD");

		oTR.height = "100%";
		oTD.id = "menuLast";
		oTD.className = "clsTabItem";
		oTD.valign = "top";
		oTD.innerHTML = "&nbsp;";

		oTR.appendChild(oTD);
		tblTabEnum.children[0].insertAdjacentElement("beforeend",oTR);
	}catch(e){

		fnAssert(false, e.description);
	}
}

function FSO()
{
	if (g_oFSO == null) {
		g_oFSO = new ActiveXObject("Scripting.FileSystemObject");
	}
	return g_oFSO;
}

function fnLoadTabElements(sFolderName, oXTmp, oTabs) 
{
	try {
		var sFld = null;
		var oFld = null;
		try { 
			sFld = FSO().GetAbsolutePathName(sFolderName);
			oFld = FSO().getFolder(sFld);
		}
		catch (e) {
		}
		if (oFld != null) {
			oFileColl = new Enumerator(oFld.files);

			// Create a table body for sorting
			var oTable = window.document.createElement("TABLE");
			var oTBody = window.document.createElement("TBODY");
			oTable.insertAdjacentElement("beforeEnd", oTBody);

			// column 0 is filename, column 1 is file date

			// Now create and add each row in the table
			while (!oFileColl.atEnd()) {
				var sPath = oFileColl.item().Path;
				// create the row
				var oTR = window.document.createElement("TR");
				var oTD = window.document.createElement("TD");
				var oTD1 = window.document.createElement("TD");
				oTD.innerText = sPath;
				oTD1.innerText = new Date(oFileColl.item().DateLastModified);
				oTR.insertAdjacentElement("beforeEnd", oTD);
				oTR.insertAdjacentElement("beforeEnd", oTD1);

				// Now insertion-sort it.
				var bInserted = false;
				for (i = 0; i < oTBody.rows.length; i++) {
					if (sPath.localeCompare(oTBody.rows[i].children[0].innerText) < 0) {
						oTBody.insertBefore(oTR, oTBody.rows[i]);
						bInserted = true;
						break;
					}
				}
				if (!bInserted) oTBody.insertAdjacentElement("beforeEnd", oTR);
				oFileColl.moveNext();
			}
			for (i = 0; i < oTBody.rows.length; i++) {
				oXTmp.load(oTBody.rows[i].children[0].innerText);
				if (oXTmp.parseError.errorCode == 0){
					var tabsList = oXTmp.getElementsByTagName("Tab");
					for(j = 0; j < tabsList.length ; j++){
						oTabs.documentElement.appendChild(tabsList.item(j));
						try{
							var sID = tabsList.item(j).selectSingleNode("@ID").text;
							window.external.Globals.VariableValue(sID+"newFileDate") = oTBody.rows[i].children[1].innerText;
						}catch(e){
							fnAssert(false, "storing new date: " + e.description);
						}
					}
				}
			}
		}
	} catch(e) {
		fnAssert(false, "fnLoadTabElements: " + e.description);
	}
}

function fnLoadExtensData()
{
	try {
		var od = new Date();
		var oXTmp = new ActiveXObject(g_MSXML_DOM);
		var oTabs = new ActiveXObject(g_MSXML_DOM);
		oXTmp.async = false;
		oTabs.async = false;
		oTabs.loadXML("<TabDefinition></TabDefinition>");

		// VS principle tabs
		var sVSLoc = fnvsGetShellPath() + "HTML\\StartPageTabs\\" + g_LCID;
		fnLoadTabElements(sVSLoc, oXTmp, oTabs);

		// now add custom tabs
		var sExtLoc = fnvsGetShellPath() + "HTML\\Custom";
		fnLoadTabElements(sExtLoc, oXTmp, oTabs);

		// now add more custom tabs
		sExtLoc = fnvsGetShellPath() + "HTML\\"+g_LCID+"\\Custom";
		fnLoadTabElements(sExtLoc, oXTmp, oTabs);

		// now add personal custom tabs
		sExtLoc = g_AppDataFolder + "\\Visual Studio.NET\\Start Page\\Custom Tabs";
		fnLoadTabElements(sExtLoc, oXTmp, oTabs);

		var od2 = new Date();
		fnAssert(false, od2.getTime() - od.getTime() + " milliseconds");
		return oTabs;
	}
	catch(e) {
		fnAssert(false, "fnLoadExtensData: " + e.description)
	}
	return null;
}


function shouldGenerateMRU(){
	var ifShowMru = 0;
	var keyShowRecentSlns = "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer\\NoRecentDocsHistory";
	try{
	ifShowMru = g_wshShell.RegRead(keyShowRecentSlns);
	}catch(oErr){
	return 1;
	}
	if(ifShowMru) return 0;
	return 1;
}

function generateMRUTableItems(){
	try{
	  var strToReturn = "";
	  var keyNameSolution = g_strRegistryHiveRoot + "ProjectMRUList";
	  var keyShowRecentSlns = "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer\\NoRecentDocsHistory";
	
	  var sMruFile;
	  var sMruProject;
	  var i, j;
	  var bFound = false;
	  var iCount = 0;
	  var iMaxCount = 0;
	  try{
		iMaxCount = window.external.Properties("Environment", "General").Item("MRUListContainsNItems").Value;
	  }catch(oErr){
		fnAssert(false, oErr.description);
	  }
	
	  if (iMaxCount == 0 || shouldGenerateMRU() == 0){
		return "<tr><td colspan='2' align='center'><i class='homePageInactive'>"+L_NoRecentSlnFiles_HTMLText+"</i></td></tr>";
	  }
	  oMruArray = new Array();
	  try{
			i = 1;
			while(iCount < iMaxCount){
				var strExt;
				var sTimeStampFile = "";
				sMruFile = g_wshShell.RegRead(keyNameSolution + "\\File" + new String(i));
				sMruProject = sMruFile.substr(sMruFile.lastIndexOf("\\")+1);
				strExt = sMruProject.substr(sMruProject.lastIndexOf(".")+1);
				if(strExt == "sln"){
					sMruProject = sMruProject.substr(0, sMruProject.lastIndexOf("."));
				var sSUOFile = sMruFile.substr(0, sMruFile.lastIndexOf(".")) + ".suo";
				
				if(FSO().FileExists(sSUOFile))
					sTimeStampFile = sSUOFile;
				else if(FSO().FileExists(sMruFile))
					sTimeStampFile = sMruFile;
			
					if(FSO().FileExists(sMruFile)){
						oMruArray[iCount] = sMruFile;
						var fModified = false;
						var objDateFile = new Date(FSO().GetFile(sTimeStampFile).DateLastModified);
						var objDateNow = new Date();
						var strDateString = objDateFile.toString();
						var sDateStrForVB = objDateFile.getMonth()+1 + "/" + objDateFile.getDate() + "/" + objDateFile.getYear();
						if(objDateNow.getTime() - objDateFile.getTime() < 1000*60*60*48 && (objDateNow.getDay() % 7) - (objDateFile.getDay() % 7) < 2 ){
							var sDayString = L_YesterdayAt_HTMLText;
							if( (objDateNow.getDay() % 7) - (objDateFile.getDay() % 7) == 0 ){
       								sDayString = L_TodayAt_HTMLText;
        						}
							strDateString =  sDayString;
							fModified = true;
						}
						if(fModified == false||objDateNow < objDateFile){
							strDateString = fnShortDate(objDateFile);
						}
						bFound = true;
						sBgClass = iCount%2==0?"":" class='clsGray'";
						strToReturn = strToReturn + "<tr"+sBgClass+">";
						strToReturn = strToReturn + "<td title=\"" + oMruArray[iCount] + "\" valign=\"middle\"><a id=\"mruListEntry\" class=\"homePageInactive\" href=\"" + oMruArray[iCount] + "\" alt=\"" + oMruArray[iCount] + "\" onclick='fnvsLoadProject(oMruArray[" + iCount + "]); return false;'> " + sMruProject + "</a></td>";
						strToReturn = strToReturn + "<td title=\"" + objDateFile.toLocaleString() + "\" class=\"homePageInactive\">" + strDateString + "</td>";
						strToReturn = strToReturn + "<td class=\"homePageInactive\">"
			if(FSO().FileExists(sMruFile.substr(0, sMruFile.lastIndexOf(".")) + ".vbproj"))
				strToReturn += "VB";
			else if(FSO().FileExists(sMruFile.substr(0, sMruFile.lastIndexOf(".")) + ".csproj"))
				strToReturn += "C#";
			else if(FSO().FileExists(sMruFile.substr(0, sMruFile.lastIndexOf(".")) + ".sln"))
			{
try {
				var ofile = FSO().OpenTextFile(sMruFile.substr(0, sMruFile.lastIndexOf(".")) + ".sln", 1);
				ofile.ReadLine();
				var s = ofile.ReadLine();
				ofile.Close();

				if(s.lastIndexOf(0, ".csproj") > 0)
					strToReturn += "C#";
				else if(s.lastIndexOf(0, ".vbproj") > 0)
					strToReturn += "VB";
}catch(e){}
			}
						strToReturn = strToReturn + "</td>";
						strToReturn = strToReturn + "</tr>";
						iCount++;
					}
				}
				i++;
			}
	  }catch(exceptionVar){
	    //Tried to read the value, but it was not there, means that there are not that many MRU items.
	  }
	  if(bFound == false){
		return "<tr><td class=\"homePageInactive\" colspan='2' align='center'><i>" + L_NoRecentSlnFiles_HTMLText + "</i></td></tr>";
	  }
	  return strToReturn;
	}catch(e){}
}


/**********************************************************************
// shared interactive functions
**********************************************************************/

function document.onselectstart(){
	e = event.srcElement;
	ret = false;
	try{
		if((e.tagName == 'INPUT' && e.type != 'button') || e.tagName == 'A')ret = true;
	}catch(e){}
	return ret;
}

function fnConfigureTab(tab, cfg){
	if(AConfig.state=='back'){
		fnShowContent(tab);
		AConfig.innerText = L_Configure_HTMLText + g_oCurrSelect.innerText + "...";
		AConfig.alt = L_ConfigureThisTab_HTMLText;
		AConfig.state='config';
	}else{
		fnShowContent(cfg);
		AConfig.innerText = L_BackTo_HTMLText + g_oCurrSelect.innerText + "...";
		AConfig.state='back';
		AConfig.alt = L_BackToTab_HTMLText;
	}
}


function fnAddCfgMode(sID){
	if(!window.oConfigurableApps) window.oConfigurableApps = new Array();
	window.oConfigurableApps[sID] = true;
}

function fnGetPos(oTgt, sPos){
	try{
		var iPos = 0;
		while (oTgt!=null){
			iPos += oTgt["offset" + sPos];
			oTgt = oTgt.offsetParent;
		}
		return iPos;
	}catch(e){

	}
}

function fnFocusRollover(oTgtElem){
	try{
		if(g_oCurrFocus && g_oCurrFocus != g_oCurrSelect){
			//blur current elem
			sFocusState = "Over";
			//g_oCurrFocus.className = g_oCurrFocus.className.substring(0,g_oCurrFocus.className.indexOf(sFocusState));
			g_oCurrFocus.style.color = SpanClsTabItem.currentStyle.color; // "#ffffff";
			g_oCurrFocus.style.textDecoration = SpanClsTabItem.currentStyle.textDecoration; 
		}
		if(oTgtElem){
			g_oCurrFocus = oTgtElem;
			if(oTgtElem != g_oCurrSelect){
				//oTgtElem.className = oTgtElem.className + "Over";
				oTgtElem.style.color = SpanClsTabItemOver.currentStyle.color; // "#ffcc99";
				oTgtElem.style.textDecoration = SpanClsTabItemOver.currentStyle.textDecoration; 
			}
		}else{
			g_oCurrFocus = null;
		}
	}catch(e){

	}
}



// element specific functions
function fnFillHelpList(oTgt)
{
	if(!g_oHelp)fnAssocHelp();
	if(!document.oaFiltList){document.oaFiltList= new Array(); bFillGlobalArray = true;}
	try{
		var oFilters = g_oHelp.HxSession.Collection.Filters;
		var iFiltCnt = oFilters.Count();
		for(var i = 1; i<=iFiltCnt; i++){
			if(bFillGlobalArray){
				document.oaFiltList[document.oaFiltList.length]=oFilters.GetFilterName(i);
				//fnAddOption(inptProfileFilterSelect, oFilters.GetFilterName(i), oFilters.GetFilterName(i), g_oHelp.Filter == oFilters.GetFilterName(i));
			}
			if(oTgt.children.length==0 || !oTgt.bPopulated){
				fnAddOption(oTgt, oFilters.GetFilterName(i), oFilters.GetFilterName(i), g_oHelp.Filter == oFilters.GetFilterName(i));
			}
			if(g_oHelp.Filter == oFilters.GetFilterName(i)){
				g_sFilter = oFilters.GetFilterQuery(i);
			}
		}
		oTgt.bPopulated = true;
	}catch(oErr){
		fnAssert(false, oErr.description);
	}
	g_sFilterName = g_oHelp.Filter==""?L_FltCorrupt_HTMLText:g_oHelp.Filter;
/*
	for(var j = 0; j<oElemCurrFilter.length;j++){
		oElemCurrFilter[j].innerText = g_sFilterName;
	}
*/
}

function fnSetHelpFilter(sFilter,bNoDet)
{
	if(sFilter !=  g_sFilterName){
		try{
			var oFilters = g_oHelp.HxSession.Collection.Filters;
			var iFiltCnt = oFilters.Count();
			for(var i = 1; i<=iFiltCnt; i++){
				if(sFilter == oFilters.GetFilterName(i)){
					try{
						g_oHelp.Filter = oFilters.GetFilterName(i);
					}catch(oErr){
						fnAssert(true, L_FilterCorrupt_HTMLText);
						return;
					}
					g_sFilterName = sFilter;
					g_sFilter = oFilters.GetFilterQuery(i);
					try{
						for(var j = 0; j<inptProfileFilterSelect.options.length; j++){
							if(sFilter == inptProfileFilterSelect.options(j).value){
								try{
									inptChipSelect.selectedIndex = j;
								}catch(e){}
								try{
									inptProfileFilterSelect.selectedIndex = j;
								}catch(e){}
							}
						}
/*
						if(inptChipSelect.options(inptChipSelect.selectedIndex).value == sFilter){
							inptProfileFilterSelect.selectedIndex = inptChipSelect.selectedIndex;
						}else if(inptProfileFilterSelect.options(inptProfileFilterSelect.selectedIndex).value == sFilter){
							inptChipSelect.selectedIndex = inptProfileFilterSelect.selectedIndex;
						}else{
							for(var j = 0; j<inptChipSelect.options.length; j++){
								if(sFilter == inptChipSelect.options(j).value){
									inptChipSelect.selectedIndex = j;
									inptProfileFilterSelect.selectedIndex = j;
								}
							}
						}
*/
					}catch(e){
						fnAssert(false, e.description);
					}
					try{
						if(!bNoDet)fnDetProfile();
					}catch(e){
						fnAssert(false, e.description);
					}
					window.ocurrTabTgt.click();

					return true;
				}
			}
			fnvsSetStatus(L_ErrSettingFilter_HTMLText);
		}catch(oErr){
			fnAssert(false, oErr.description);
		}
	}
}

function fnHelpListToggle(bShow, sAssocID)
{
	// extract the tab ID from the div ID
	tabID = sAssocID.substring(3,sAssocID.length - 9);
	
	var bHasConfigure = false;
	try {
		bHasConfigure = (window.oConfigurableApps[tabID] != null)
	} catch (e) {
	}

	// Show the toolbar if appropriate
	if(bShow || bHasConfigure){
		tdSubLogo.background="start2.gif";
		tdTabFill.background="images\\droptabfill.gif";
		tdTabFill.style.backgroundRepeat = "repeat-x"
	}else{
		tdSubLogo.background="start2_bar.gif";
		tdTabFill.background="images\\droptab.gif";
		tdTabFill.style.backgroundRepeat = "no-repeat"
	}

	// Fill the filter list
	if(bShow){
		if(!inptChipSelect.bPopulated || !document.oaFiltList){
			fnFillHelpList(inptChipSelect);
		}
		selHelpFilterList.style.display="inline";		
	}else{
		selHelpFilterList.style.display="none";
	}

}

function fnChkToggle(oTgt){
	// switch the images first
	if(oTgt.checked){
		oTgt.checked = false;
		oTgt.src = oTgt.src.substring(0,oTgt.src.indexOf("Yes"))+"No.gif"; //"uncheck.gif";
		setTimeout("fnvsSetStatus('"+oTgt.NoText+"');",0300,"javascript");
	}else{
		oTgt.checked = true;
		oTgt.src = oTgt.src.substring(0,oTgt.src.indexOf("No"))+"Yes.gif"; //"check.gif";
		setTimeout("fnvsSetStatus('"+oTgt.YesText+"');",0300,"javascript");
	}

	// specific functions 
	// bugbug this should be extended to support declarative binding
	if(oTgt.id == "chkWebLinks"){
		iRegSet = oTgt.checked?1:0;
		//window.external.Properties("Environment", "Help").Item("External").Value = iRegSet;
		g_wshShell.RegWrite(g_strRegistryHiveRoot + "OpenDocsInNewWindow", iRegSet, "REG_DWORD");
		//fnAssert(true, L_RebootRequired);
	}
	if(oTgt.id == "chkStart"){
		iStartVal = oTgt.checked?0:4;
		window.external.Properties('Environment', 'General').Item('OnStartup').Value = iStartVal;
		inptProfileStartupSelect.selectedIndex = iStartVal;
	}
}

function showom(ex)
{
  var obj = eval(ex)
  var s = ex + ": "
  for ( var p in obj )
  {
	var foo = "ex." + p;
	 s += p + " = " + eval(foo) + " , " ;
  }
  alert (s)
}

function fnMenuClick(oTgtElem){
	window.ocurrTabTgt = oTgtElem;

/*
	// Can't do this because it causes flicker on IE over terminal server
	if(g_oCurrSelect){
		g_oCurrSelect.className = "clsTabItem";
	}
	if(g_oCurrFocus&&g_oCurrFocus!=g_oCurrSelect){
		g_oCurrFocus.className = "clsTabItem";
	}
*/
	document.all("checkStateFrame").style.visibility = "visible";
	if(g_oCurrFocus){
//		g_oCurrFocus.className = "clsTabItem";
		g_oCurrFocus.style.fontWeight = SpanClsTabItem.currentStyle.fontWeight;
		g_oCurrFocus.style.backgroundColor = SpanClsTabItem.currentStyle.backgroundColor; // "#336699";
		g_oCurrFocus.style.color = SpanClsTabItem.currentStyle.color; // "#ffffff";
		g_oCurrFocus.style.textDecoration = SpanClsTabItem.currentStyle.textDecoration; 
		g_oCurrFocus.style.borderRightColor = SpanClsTabItem.currentStyle.borderRightColor; // "1px solid #ffcc99";
		g_oCurrFocus.style.borderRightStyle = SpanClsTabItem.currentStyle.borderRightStyle; // "1px solid #ffcc99";
		g_oCurrFocus.style.borderRightWidth = SpanClsTabItem.currentStyle.borderRightWidth; // "1px solid #ffcc99";
		g_oCurrFocus.style.borderTopColor = SpanClsTabItem.currentStyle.borderTopColor; // "none";
		g_oCurrFocus.style.borderTopStyle = SpanClsTabItem.currentStyle.borderTopStyle; // "none";
		g_oCurrFocus.style.borderTopWidth = SpanClsTabItem.currentStyle.borderTopWidth; // "none";
		g_oCurrFocus.style.borderBottomColor = SpanClsTabItem.currentStyle.borderBottomColor; // "none";
		g_oCurrFocus.style.borderBottomStyle = SpanClsTabItem.currentStyle.borderBottomStyle; // "none";
		g_oCurrFocus.style.borderBottomWidth = SpanClsTabItem.currentStyle.borderBottomWidth; // "none";
		g_oCurrFocus.style.paddingLeft = SpanClsTabItem.currentStyle.paddingLeft; // "15";
		g_oCurrFocus.style.paddingBottom = SpanClsTabItem.currentStyle.paddingBottom; // "7px";
		g_oCurrFocus.style.paddingTop = SpanClsTabItem.currentStyle.paddingTop; // "7px";
		g_oCurrFocus.style.cursor = SpanClsTabItem.currentStyle.cursor; // "hand";
	}

	if(g_oCurrSelect){
//		g_oCurrSelect.className = "clsTabItem";
		g_oCurrSelect.style.fontWeight = SpanClsTabItem.currentStyle.fontWeight;
		g_oCurrSelect.style.backgroundColor = SpanClsTabItem.currentStyle.backgroundColor; // "#336699";
		g_oCurrSelect.style.color = SpanClsTabItem.currentStyle.color; // "#ffffff";
		g_oCurrSelect.style.textDecoration = SpanClsTabItem.currentStyle.textDecoration; 
		g_oCurrSelect.style.borderRightColor = SpanClsTabItem.currentStyle.borderRightColor; // "1px solid #ffcc99";
		g_oCurrSelect.style.borderRightStyle = SpanClsTabItem.currentStyle.borderRightStyle; // "1px solid #ffcc99";
		g_oCurrSelect.style.borderRightWidth = SpanClsTabItem.currentStyle.borderRightWidth; // "1px solid #ffcc99";
		g_oCurrSelect.style.borderTopColor = SpanClsTabItem.currentStyle.borderTopColor; // "none";
		g_oCurrSelect.style.borderTopStyle = SpanClsTabItem.currentStyle.borderTopStyle; // "none";
		g_oCurrSelect.style.borderTopWidth = SpanClsTabItem.currentStyle.borderTopWidth; // "none";
		g_oCurrSelect.style.borderBottomColor = SpanClsTabItem.currentStyle.borderBottomColor; // "none";
		g_oCurrSelect.style.borderBottomStyle = SpanClsTabItem.currentStyle.borderBottomStyle; // "none";
		g_oCurrSelect.style.borderBottomWidth = SpanClsTabItem.currentStyle.borderBottomWidth; // "none";
		g_oCurrSelect.style.paddingLeft = SpanClsTabItem.currentStyle.paddingLeft; // "15";
		g_oCurrSelect.style.paddingBottom = SpanClsTabItem.currentStyle.paddingBottom; // "7px";
		g_oCurrSelect.style.paddingTop = SpanClsTabItem.currentStyle.paddingTop; // "7px";
		g_oCurrSelect.style.cursor = SpanClsTabItem.currentStyle.cursor; // "hand";
	}
	g_oCurrFocus = null;
	g_oCurrSelect = oTgtElem;

//	oTgtElem.className = "clsTabItemSelected";

	oTgtElem.style.fontWeight = SpanClsTabItemSelected.currentStyle.fontWeight;
	oTgtElem.style.backgroundColor = SpanClsTabItemSelected.currentStyle.backgroundColor;
	oTgtElem.style.color = SpanClsTabItemSelected.currentStyle.color;
	oTgtElem.style.textDecoration = SpanClsTabItem.currentStyle.textDecoration; 
	oTgtElem.style.borderRightColor = SpanClsTabItemSelected.currentStyle.borderRightColor;
	oTgtElem.style.borderRightStyle = SpanClsTabItemSelected.currentStyle.borderRightStyle;
	oTgtElem.style.borderRightWidth = SpanClsTabItemSelected.currentStyle.borderRightWidth;
	oTgtElem.style.borderTopColor = SpanClsTabItemSelected.currentStyle.borderTopColor;
	oTgtElem.style.borderTopStyle = SpanClsTabItemSelected.currentStyle.borderTopStyle;
	oTgtElem.style.borderTopWidth = SpanClsTabItemSelected.currentStyle.borderTopWidth;
	oTgtElem.style.borderBottomColor = SpanClsTabItemSelected.currentStyle.borderBottomColor;
	oTgtElem.style.borderBottomStyle = SpanClsTabItemSelected.currentStyle.borderBottomStyle;
	oTgtElem.style.borderBottomWidth = SpanClsTabItemSelected.currentStyle.borderBottomWidth; 
	oTgtElem.style.paddingLeft = SpanClsTabItemSelected.currentStyle.paddingLeft; 
	oTgtElem.style.paddingBottom = SpanClsTabItemSelected.currentStyle.paddingBottom;
	oTgtElem.style.paddingTop = SpanClsTabItemSelected.currentStyle.paddingTop;
	oTgtElem.style.cursor = SpanClsTabItemSelected.currentStyle.cursor;

	spnSubPageToolbar.className = "clsSubPgTlBarHidden";
	spnSubPageToolbar.innerHTML = "";
	
}

function fnShowContent(oTab){
	for(var i=0; i<tdContentCell.children.length;i++){
		tdContentCell.children[i].style.display = "none";
	}

	// extract the tab ID from the div ID
	tabID = oTab.id.substring(3,oTab.id.length - 9);

	if (window.oConfigurableApps != null) {
		if (window.oConfigurableApps[tabID]){
			spnSubPageToolbar.className = "clsSubPgTlBar";
			spnSubPageToolbar.innerHTML = "<a ID='AConfig' alt='"+L_ConfigureThisTab_HTMLText+"' class='clsTabToolbarItem' href='javascript://null' onClick='fnConfigureTab("+oTab.id+",tab"+tabID+"CfgDiv)'>Configure "+g_oCurrSelect.innerText+"...</a><br/>"; 
		}
	}
	else {
	}
	oTab.style.display = "inline";

	if (g_keyObject) g_keyObject.Remove();
	g_keyObject = null;

	if (oTab.f1keyword != null) {
		g_keyObject = window.external.ActiveWindow.ContextAttributes.Add("keyword", oTab.f1keyword,3);
	} else {
		g_keyObject = window.external.ActiveWindow.ContextAttributes.Add("keyword","vs.homepage",3);
	}

}

function getArticle(sURL){
	window.open(sURL, getTarget(sURL));
}

function getTarget(sURL){
	try{
	  if(!chkWebLinks.checked||sURL.indexOf("news:")!=-1){
	    return "_top";
	  }else{
	    return "_blank";
	  }
	}catch(e){
		fnAssert(false, e.description);
	}
}

function fnChangeFeed(tabID, feedID){
	//fnAssert(false, "<fnChangeFeed tabID='" +tabID+ "' feedID='" +feedID+"'>");
	try {
		var oTab = new ActiveXObject(g_MSXML_DOM);
		oTab.loadXML(window.external.Globals.VariableValue(tabID+"currXml"));

		var oNewFeed = new ActiveXObject(g_MSXML_DOM);
		oNewFeed.loadXML(document.body.children[feedID].outerHTML);

		// Replace the active Feed with the matching Feed
		var oFeeds = oTab.selectSingleNode("Tab/Feeds");
		oOldFeed = oTab.childNodes.item(0);
		oFeeds.replaceChild(oNewFeed, oOldFeed);

		window.external.Globals.VariableValue(tabID+"currXml") = oTab.xml;
		window.external.Globals.VariableValue(tabID+"configured") = true;

		fnvsSetStatus(L_ResetRequired_HTMLText);
	}
	catch (e) {
		fnAssert(false, "fnChangeFeed: " + e.description);
	}
	// fnAssert(false, "</fnChangeFeed>");
}

function fnSrchGDNLoader(){
	if(window.oGDNSchXML.readyState==4 && window.oGDNSchXSL.readyState==4 ){
		btnGDNSrch.item(1).disabled = false;
		if(!document.activeElement.id){
			btnGDNSrch.item(1).focus();
		}else{
			document.activeElement.focus();
		}
		fnvsSetStatus(L_Done_HTMLText);
		
		if(window.oGDNSchXML.parseError.errorCode == 0&&window.oGDNSchXSL.parseError.errorCode == 0){
			sResults = window.oGDNSchXML.transformNode(window.oGDNSchXSL);
			if(window.oGDNSchXML.selectSingleNode("ErrorReport/Message") != null){
				VsGDNSearchDisplayRegion.item(1).innerHTML = sResults;
			}
			else
			{
				if(window.oGDNSchXML.selectSingleNode("//BusinessEntityCollection/BusinessEntity") == null)
				{
					VsGDNSearchDisplayRegion.item(1).innerHTML = '<br/><span class=\"homepageinactive\">No services found matching query.</span>';
				}
				else
					VsGDNSearchDisplayRegion.item(1).innerHTML = sResults;

				// store query
				try{
					window.external.Globals.VariableValue("VSGDNSrchHTML") = sResults;
					window.external.Globals.VariablePersists("VSGDNSrchHTML") = true;
					window.external.Globals.VariableValue("VSGDNSrchQuery") = SrchVSGDNSrchQueryInpt.value;
					window.external.Globals.VariablePersists("VSGDNSrchQuery") = true;
				}catch(m){
					//noop;
				}
			}
		}else{
			VsGDNSearchDisplayRegion.item(1).innerHTML = '<br/><span class=\"homepageinactive\">' + L_ErrorQueryOnline_HTMLText + '</span>';
		}
	}
}

function fnSrchGDN(sQuery,sArgs,sURL){
	if(navigator.onLine){
		btnGDNSrch.item(1).disabled = true;
		fnvsSetStatus(L_SearchingDotDotDot_HTMLText);
		document.body.VSGDNSrchQUERY = sQuery;
		document.body.VSGDNSrchARGS = sArgs;
		setTimeout("fnSrchGDNNow('"+sURL+"','"+sArgs+"');", 0100, "javascript");
	}else{
		VsGDNSearchDisplayRegion.innerHTML = '<span class=\"homePageInactive\">' + L_NoOnlineFeaturesWhenOffline_HTMLText + '</span>';
	}
}

function fnSrchGDNNow(sURL,sArgs){
	var sQuery = document.body.VSGDNSrchQUERY;
	
	sURL += "?";
	sURL += sArgs;
	sURL += "searchstr="+sQuery;
	sURL += "&Categoryguid="+WSCategory.item(1).options(WSCategory.item(1).selectedIndex).value;

	window.oGDNSchXML = new ActiveXObject("MSXML2.DOMDocument.3.0");
	window.oGDNSchXSL = new ActiveXObject("MSXML2.DOMDocument.3.0");

	window.oGDNSchXML.async = true;
	window.oGDNSchXSL.async = true;

	window.oGDNSchXML.onreadystatechange = fnSrchGDNLoader;
	window.oGDNSchXSL.onreadystatechange = fnSrchGDNLoader;

	sURL+="&UseTestEnv="+SrchUDDITest.item(1).checked;

	window.oGDNSchXML.load(sURL);
	window.oGDNSchXSL.load("vshome.xsl");
}

function CreateUDDIURL(test, page, data)
{
	var url = "http://msdn.microsoft.com/vsdata/vsdata.asp?tab=UDDIData&Test=";
	//var url = "http://msdnprod/vsdata/vsdata.asp?tab=UDDIData&Test=";
	if(test)
		url = url + "True";
	else
		url = url + "False";
	url = url + "&Page=" + page + "&Data=" + data;
	return url;
}

function NavigateToUDDIBusiness(sKey){
	var url = CreateUDDIURL(SrchUDDITest.item(1).checked, "BusinessDetail", sKey);
	browserNavigate(3, url);
}

function NavigateToUDDIService(sServiceKey){
	var url = CreateUDDIURL(SrchUDDITest.item(1).checked, "SpecSignatureDetail", sServiceKey);
	browserNavigate(3, url);
}

function NavigateToUDDIBinding(sServiceKey, sBindingKey){
	var url = CreateUDDIURL(SrchUDDITest.item(1).checked, "SpecSignatureDetailWithBinding", sServiceKey + "&bindingID="+sBindingKey);
	browserNavigate(3, url);
}