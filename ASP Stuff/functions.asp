<!--#include file="adovbs_inc.asp"-->
<script language="vbscript" runat="server">
Function TheRoot()
	dim Vroot, strG1, strG2, icount, idx
	On Error Resume Next
	' discover the VRoot for the current page;
	' walk back up VPath until we find global.asa
	Vroot = Request.ServerVariables("PATH_INFO")	'The path of this page
	strG1 = "global.asa"							'name of file 1
	strG2 = "Global.asa"							'name of file 2
	iCount = 0										'counter var for errors
	do while Len(Vroot) > 1 'number of chars in Vroot
		idx = InStrRev(Vroot, "/") 'returns position of last slash
		if idx > 0 then			   'there is a slash in Vroot
			Vroot = Left(Vroot,idx) 'return string up to last slash from left
		else ' error; assume root web
			Vroot = "/"
		end if
		if FrontPage_FileExists(Server.MapPath(Vroot & strG1)) then exit do
		if FrontPage_FileExists(Server.MapPath(Vroot & strG2)) then exit do
		if Right(Vroot,1) = "/" then Vroot = Left(Vroot,Len(Vroot)-1) 'remove slash from right
		iCount = iCount + 1 'up counter
		if iCount > 100 then 'error; assume root web
			Vroot = "/"
			exit do
		end if
	loop
	' set TheRoot
	TheRoot = Vroot
End function


function LogicalPath()
	dim Vroot, strG1, strG2, icount, idx, thepath
	On Error Resume Next
	' discover the VRoot for the current page;
	' walk back up VPath until we find global.asa
	Vroot = Request.ServerVariables("PATH_INFO")	'The path of this page
	strG1 = "global.asa"							'name of file 1
	strG2 = "Global.asa"							'name of file 2
	iCount = 0										'counter var for errors
	do while Len(Vroot) > 1 'number of chars in Vroot
		idx = InStrRev(Vroot, "/") 'returns position of last slash
		if idx > 0 then			   'there is a slash in Vroot
			Vroot = Left(Vroot,idx) 'return string up to last slash from left
		else ' error; assume root web
			Vroot = "/"
		end if
		if FrontPage_FileExists(Server.MapPath(Vroot & strG1)) then exit do
		if FrontPage_FileExists(Server.MapPath(Vroot & strG2)) then exit do
		if Right(Vroot,1) = "/" then Vroot = Left(Vroot,Len(Vroot)-1) 'remove slash from right
		iCount = iCount + 1 'up counter
		if iCount > 100 then 'error; assume root web
			thepath = ""
			exit do
		end if
		thepath = thepath & "../"
	loop

	' set LogicalPath
	LogicalPath = thepath
end function

Function FrontPage_FileExists(fspath)
	dim fs, istream
	On Error Resume Next
	FrontPage_FileExists = False
	set fs = CreateObject("Scripting.FileSystemObject")
	Err.Clear
	set istream = fs.OpenTextFile(fspath)
	if Err.Number = 0 then
		FrontPage_FileExists = True
		istream.Close
	end if
	set istream = Nothing
	set fs = Nothing
End Function
</script>