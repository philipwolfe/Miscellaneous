<%
'------------------------------------------------------------------------
'  Filename: Functions.asp
'  Purpose:  To encapsulate many used ASP Functions
'  Creation: 03/30/2001 by pw
'  Authors:  Various unprotected scripts on the internet and my own
'------------------------------------------------------------------------

'  GLOBAL VARIABLES -----------------------------------------------------
Const QUOTE = """"			'Double Quote
Const LT = "<"				'Less Than
Const GT = ">"				'Greater Than



'  SUBS ------------------------------------------------------------------
Function rw(txt)
  Response.Write(txt)
  rw=""
End Function	
Function rwn(txt)
  Response.Write(vbCrLf&txt)
  rwn=""
End Function
Public Function print(str)
	' just an abbreviation for Response.Write
	print = Response.Write(str)
End Function
Function JavaString(s)
  if s<>"" then 
    s = Replace(s,"'","\'")
  end if
  JavaString = s
End Function

Function UFirst(s)
  UFirst = UCase(Left(s,1)) & Mid(s,2)
End Function
%>


<%'Bbox - Display a button box ************************************************%>
<script runat=server language="VBscript">
Function Bbox(txt,fun,Xc,clr)
	If txt="Users" Then clr="red"
	If clr<>"" Then clr=" color="&clr
	Bbox=Bbox&"<table bgcolor=silver border=0 cellpadding=1 cellspacing=0><td>"
	If txt="ADD_files" Then
		Bbox=Bbox&"<table bgcolor=silver border=1 cellpadding=0 cellspacing=0><td>"
		scrpt=" onclick=""winNEW('AddEdit',600,850,'"&fun&"')"""
		Bbox=Bbox&"<a name=ADDfiles href=#"&scrpt&">"
		Bbox=Bbox&"<font color=red size=-2>&nbsp;&nbsp;"&txt&"&nbsp;&nbsp;</font></a>"
	ElseIf txt="EDIT_catalog" Then
		Bbox=Bbox&"<table bgcolor=silver border=1 cellpadding=0 cellspacing=0><td>"
		scrpt=" onclick=""winNEW('AddEdit',600,850,'"&fun&"')"""
		Bbox=Bbox&"<a name=EDITfiles href=#"&scrpt&">"
		Bbox=Bbox&"<font color=red size=-2>&nbsp;&nbsp;"&txt&"&nbsp;&nbsp;</font></a>"
	ElseIf txt="CRD" Then
		Bbox=Bbox&"<table bgcolor=silver border=1 cellpadding=0 cellspacing=0><td>"
		scrpt=" onclick=""winNEW('CRD',275,700,'"&fun&"')"""
		Bbox=Bbox&"<a name=CRD href=#"&scrpt&">"
		Bbox=Bbox&"<font color=red size=-2>&nbsp;&nbsp;"&txt&"&nbsp;&nbsp;</font></a>"
	ElseIf txt="Help" Then
		Bbox=Bbox&"<table bgcolor=silver border=1 cellpadding=0 cellspacing=0><td>"
		scrpt=" onclick=""winNEW('HELP',400,700,'"&fun&"')"""
		Bbox=Bbox&"<a name=CRD href=#"&scrpt&">"
		Bbox=Bbox&"<font color=black size=-2>&nbsp;&nbsp;"&txt&"&nbsp;&nbsp;</font></a>"
	Else
		If fun<>"" Then
			If ((Instr(fun,"?")<1) and (Xc<>"")) Then fun=fun&"?"
			Bbox=Bbox&"<table bgcolor=silver border=1 cellpadding=0 cellspacing=0><td>"
			Bbox=Bbox&"<a href="&fun&Xc&"><font"&clr&" size=-2>&nbsp;&nbsp;"&txt&"&nbsp;&nbsp;</font></a>"
		Else
			Bbox=Bbox&"<table bgcolor=silver border=1 cellpadding=0 cellspacing=0><td>"
			Bbox=Bbox&"<font color=white size=-2>&nbsp;&nbsp;"&txt&"&nbsp;&nbsp;</font>"
		End If
	End If 'txt="ADDfiles"
	Bbox=Bbox&"</td></table></td></table>"
End Function
</script>


<%'bldSQL - Build SQL search Command                                 **********%>
<script runat=server language="VBscript">
Function bldSQL(Sn,From,Where)
  Dim sql,Tdst,Tsrc
    Tsrc="Z"&(Sn Mod 2)&Session.SessionID					'Source Table
    Tdst="Z"&((Sn+1) mod 2)&Session.SessionID			'Destination Table
    'sql="Select DistinctRow "&From&".sdyID,"&From&".serID Into "&Tdst
    sql="Select Distinct "&From&".sdyID,"&From&".serID Into "&Tdst
    sql=sql&" From "&From
    If Sn>1 Then sql=sql&","&Tsrc
    sql=sql&" Where "&Where
    If Sn>1 Then sql=sql&" AND ("&Tsrc&".serID="&From&".serID)"
    On Error Resume Next
      Con.Execute ("Drop Table "&Tdst)
    On Error GoTo 0
  bldSQL=sql
End Function
</script>

<%'Chkbox_bld *********************************************************%>
<script runat=server language="VBscript">
Function Chkbox_bld(list,curcod,fsiz,bgcolor,perrow) 'build RADIO button list
	Dim bg,cod,comcod,cp,hdg,i,item,ohdg,p,val
	If bgcolor<>"" Then
		bg=" bgcolor="&bgcolor
	Else
		bg=""
	End if 'bgcolor<>""
	Chkbox_bld="<table"&bg&" border=0 cellpadding=0 cellspacing=0 width=""100%"">"
	p=99
	comcod=","&curcod&","
	hdg=""
	ohdg=""
	Do While list<>""
		p=p+1
		If p>perrow Then
			Chkbox_bld=Chkbox_bld&"<tr>"
			p=1
		End If 'p>perrow
		cp=InStr(list,"|")
		If cp<1 Then cp=99
		item=Mid(list,1,cp-1)
		list=Mid(list,cp+1,9999)
		cp=InStr(item,"@")
		cod=Mid(item,1,cp-1)
		val=Mid(item,cp+1,99)
		If InStr(val,"_")>0 Then
			cp=InStr(val,"_")
			hdg=Mid(val,1,cp-1)
			val=Mid(val,cp+1,99)
		End If
		If ohdg<>hdg Then
			Chkbox_bld=Chkbox_bld&"<tr><td colspan=3><font size=" & (fsiz+1) & "><b><u>"
			Chkbox_bld=Chkbox_bld& hdg &"</u></b></font></td><tr>"
			ohdg=hdg
			p=1
		End If 'ohdg<>hdg
		Chkbox_bld=Chkbox_bld&"<td><font size="&fsiz&">"
		If InStr(comcod,(","&cod&","))>0 Then
			Chkbox_bld=Chkbox_bld&"<input type=checkbox name="""&val&""" value="&cod&" checked>"&val&"&nbsp;"
		Else
			Chkbox_bld=Chkbox_bld&"<input type=checkbox name="""&val&""" value="&cod&">"&val&"&nbsp;"
		End If
		Chkbox_bld=Chkbox_bld&"</font></td>"
	Loop
	Chkbox_bld=Chkbox_bld&"</table>"
End Function
</script>

<%'Chkbox_str *********************************************************%>
<script runat=server language="VBscript">
Function Chkbox_str(list,curcod,fsiz,bgcolor,perrow) 	'build CheckBox list for
	Dim bg,cd,cod,comcod,cp,hcd,hsp,i,item,ohdg,p,val		'focus Structures
	hsp="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
	hsp=hsp&hsp&hsp&hsp&hsp&hsp
	bg=""
	Chkbox_str="<table"&bg&" border=0 cellpadding=0 cellspacing=0 width=""100%"">"
	comcod=","&curcod&","
	ohcd=""
	Do While list<>""
		cp=InStr(list,"|")
		If cp<1 Then cp=99
		item=Mid(list,1,cp-1)
		list=Mid(list,cp+1,9999)
		cp=InStr(item,"@")
		cod=Mid(item,1,cp-1)
		val=Mid(item,cp+1,99)
		
		cp=InStr(val,"-")
		hcd=Mid(val,1,cp-1)
		val=Mid(val,cp+1,99)
		clen=Len(hcd)
		spc=Mid(hsp,1,(24*(clen)))
		'val=val & " " & hcd
		'Chkbox_str=Chkbox_str&"<tr><td>"&spc
		
		If ohcd=hcd Then
			p=p+1
			If p>perrow Then
				Chkbox_str=Chkbox_str&"<tr><td>"&spc
				p=1
			Else 'p>perrow
				Chkbox_str=Chkbox_str&"<td>"
			End If 'p>perrow
		Else 'ohcd=hcd
			Chkbox_str=Chkbox_str&"<tr><td>"&spc
			p=1
		End If 'ohcd=hcd
		ckhcd=ohcd
		ohcd=hcd
		
		If InStr(comcod,(","&cod&","))>0 Then
			Chkbox_str=Chkbox_str&"<input type=checkbox name="""&val&""" value="&cod&" checked>"
		Else
			Chkbox_str=Chkbox_str&"<input type=checkbox name="""&val&""" value="&cod&">"
		End If

		If clen<2 Then
			Chkbox_str=Chkbox_str&"<font size="&(fsiz+1)&"><b><u>"
		ElseIf (hcd=ckhcd) or (InStr(list,("@" & hcd & "-"))>0) Then
			Chkbox_str=Chkbox_str&"<font size="&fsiz&">"
		ElseIf clen<3 Then
			Chkbox_str=Chkbox_str&"<font size="&(fsiz+1)&"><b><u>"
		ElseIf clen<4 Then
			Chkbox_str=Chkbox_str&"<font size="&(fsiz+1)&"><b>"
		Else
			Chkbox_str=Chkbox_str&"<font size="&fsiz&">"
		End If
		Chkbox_str=Chkbox_str & val & "</font></td>"
	Loop
	Chkbox_str=Chkbox_str&"</table>"
End Function
</script>




<%'chkFld *********************************************************%>
<script runat=server language="VBscript">
Function chkFld(mne,qst,erlst) 						'Check that field <>""
	chkFld=erlst
	If InStr(qst,"*")>0 Then
		If ((Session(mne)="") or (Session(mne)=-1)) Then		'field blank
			If chkFld<>"" Then chkFld=chkFld&","
			chkFld=chkFld&mne
		ElseIf ((mne="f_dat") and (IsDate(Session("f_dat"))=False)) Then
			If chkFld<>"" Then chkFld=chkFld&","
			chkFld=chkFld&mne
		End If
	End If 'InStr(qst,"*")>0
End Function
</script>

<%'chkFldF *********************************************************%>
<script runat=server language="VBscript">
Function chkFldF(mne,erlst) 						'RED if field in Error
	If InStr(erlst,(","&mne&","))>0 Then
		chkFldF=" color=red"
	Else
		chkFldF=" color=black"
	End If
End Function
</script>

<%'Code_get *********************************************************%>
<script runat=server language="VBscript">
Function Code_get(clist,curval) 						'get Code for list
	Dim cod,cp,item,list,val
	list=clist
	Code_get=""
	Do While list<>""
		cp=InStr(list,"|")
		If cp<1 Then cp=99
		item=Mid(list,1,cp-1)
		list=Mid(list,cp+1,9999)
		cp=InStr(item,"@")
		cod=Mid(item,1,cp-1)
		val=Replace(Mid(item,cp+1,99),"  "," ")
		val=RTrim(val)
		If val=curval Then
			Code_get=cod
			Exit Do
		End if
	Loop
	'If Code_get="" Then Code_get=-1
End Function
</script>




<%'Hover********************************************************************%>
<script runat=server language="VBscript">
Function Hover(txt,clr,url)
  Dim hgt,wid
  hgt=25
  wid=300
  rwn("<tr><td width="&wid&" height="&hgt&">")
  rwn("<applet code=fphover.class width="&wid&" height="&hgt&">")
  rwn("<param name=text value="""&txt&""">")
  rwn("<param name=color value=#FFFFFF>")
  If Ucase(clr)="BLACK" Then
	 rwn("<param name=hovercolor value=#FF0000>")
	 rwn("<param name=textcolor value=#000000>")
  Else
	 rwn("<param name=hovercolor value=#000000>")
	 rwn("<param name=textcolor value=#FF0000>")
  End If
  rwn("<param name=effect value=Glow>")
  rwn("<param name=url value="""&url&""" valuetype=ref>")
  rwn("<param name=font value=Helvetica>")
  rwn("<param name=fontstyle value=bold>")
  rwn("<param name=fontsize value=18>")
  rwn("</applet></td>")
  If Ucase(clr)="BLACK" Then
	 Hover="red"
  Else
	 Hover="black"
  End If 'Ucase(clr)="BLACK"
End Function
</script>

<%'Radbox_str *********************************************************%>
<script runat=server language="VBscript">
Function Radbox_str(list,curcod,fsiz,bgcolor,perrow) 		'build RadioBox list for
	Dim bg,cd,cod,comcod,cp,hcd,hsp,i,item,ohdg,p,val		'focus Structures
	hsp="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
	hsp=hsp&hsp&hsp&hsp&hsp&hsp
	bg=""
	Radbox_str="<table"&bg&" border=0 cellpadding=0 cellspacing=0 width=""100%"">"
	comcod=","&curcod&","
	ohcd=""
	Do While list<>""
		cp=InStr(list,"|")
		If cp<1 Then cp=99
		item=Mid(list,1,cp-1)
		list=Mid(list,cp+1,9999)
		cp=InStr(item,"@")
		cod=Mid(item,1,cp-1)
		val=Mid(item,cp+1,99)
		
		cp=InStr(val,"-")
		hcd=Mid(val,1,cp-1)
		val=Mid(val,cp+1,99)
		clen=Len(hcd)
		spc=Mid(hsp,1,(24*(clen)))
		
		If ohcd=hcd Then
			p=p+1
			If p>perrow Then
				Radbox_str=Radbox_str&"<tr><td>"&spc
				p=1
			Else 'p>perrow
				Radbox_str=Radbox_str&"<td>"
			End If 'p>perrow
		Else 'ohcd=hcd
			Radbox_str=Radbox_str&"<tr><td>"&spc
			p=1
		End If 'ohcd=hcd
		ckhcd=ohcd
		ohcd=hcd
		
		If InStr(comcod,(","&cod&","))>0 Then
			'Radbox_str=Radbox_str&"<input type=radio name="""&val&""" value="&cod&" checked>"
			Radbox_str=Radbox_str&"<input type=radio name=val value="&cod&" checked>"
		Else
			'Radbox_str=Radbox_str&"<input type=radio name="""&val&""" value="&cod&">"
			Radbox_str=Radbox_str&"<input type=radio name=val value="&cod&">"
		End If

		If clen<2 Then
			Radbox_str=Radbox_str&"<font size="&(fsiz+1)&"><b><u>"
		ElseIf (hcd=ckhcd) or (InStr(list,("@" & hcd & "-"))>0) Then
			Radbox_str=Radbox_str&"<font size="&fsiz&">"
		ElseIf clen<3 Then
			Radbox_str=Radbox_str&"<font size="&(fsiz+1)&"><b><u>"
		ElseIf clen<4 Then
			Radbox_str=Radbox_str&"<font size="&(fsiz+1)&"><b>"
		Else
			Radbox_str=Radbox_str&"<font size="&fsiz&">"
		End If
		Radbox_str=Radbox_str & val & "</font></td>"
	Loop
	Radbox_str=Radbox_str&"</table>"
End Function
</script>

<%'Select_bld *********************************************************%>
<script runat=server language="VBscript">
Function Select_bld(name,clist,curcod,scrpt) 'build SELECT input statement
	Dim cod,cp,list,item,val
	list=clist
	Select_bld="<select name="&name&scrpt&">"
	If curcod="" Then curcod=-100&""
	Do While list<>""
		cp=InStr(list,"|")
		If cp<1 Then cp=99
		item=Mid(list,1,cp-1)
		list=Mid(list,cp+1,9999)
		cp=InStr(item,"@")
		If cp<1 Then cp=999
		cod=Mid(item,1,cp-1)
		val=Mid(item,cp+1,99)
		'If cod="" Then cod=-1
		'If (cod+0)=(curcod+0) Then
		If (cod&"")=(curcod&"") Then
			Select_bld=Select_bld&"<option selected>"&val
		Else
			Select_bld=Select_bld&"<option>"&val
		End If
	Loop
	Select_bld=Select_bld&"</select>"
End Function
</script>

<%'Radio_bld *********************************************************%>
<script runat=server language="VBscript">
Function Radio_bld(name,list,curcod,fsiz,bgcolor,perrow,script) 'build RADIO button list
	Dim bg,cod,cp,item,p,val
	If bgcolor<>"" Then
		bg=" bgcolor="&bgcolor
	Else
		bg=""
	End if 'bgcolor<>""
	Radio_bld="<table"&bg&" border=0 cellpadding=1 cellspacing=0 width=""100%"">"
	If curcod="" Then curcod=-1
	p=0
	Do While list<>""
		p=p+1
		If p>perrow Then
			Radio_bld=Radio_bld&"<tr>"
			p=1
		End If 'p>perrow
		cp=InStr(list,"|")
		If cp<1 Then cp=99
		item=Mid(list,1,cp-1)
		list=Mid(list,cp+1,9999)
		cp=InStr(item,"@")
		cod=Mid(item,1,cp-1)
		val=Mid(item,cp+1,99)
		Radio_bld=Radio_bld&"<td><font size="&fsiz&">"
		If (cod+0)=(curcod+0) Then
			Radio_bld=Radio_bld&"<input type=radio name="&name&" value="&cod&" checked"&script&">"&val&"&nbsp;"
		Else
			Radio_bld=Radio_bld&"<input type=radio name="&name&" value="&cod&script&">"&val&"&nbsp;"
		End If
		Radio_bld=Radio_bld&"</font></td>"
	Loop
	Radio_bld=Radio_bld&"</table>"
End Function
</script>
<%
Function IsPicture(str)
Dim s
  s = LCase(Right(str,4))
  IsPicture = s=".gif" or s=".jpg"
End Function

Dim Conn
Dim RS
Sub OpenConnection(s)
  Set Conn = Server.CreateObject("ADODB.Connection")
  Conn.Open DB
  Set RS = Conn.Execute(s)
End Sub

Sub CloseConnection
  RS.Close
  Set RS = Nothing
  Conn.Close
  Set Conn = Nothing
End Sub

Function GetField(Table,Column,Key,Value)
  Set RS = Conn.Execute("SELECT " & Column & " FROM " & Table & " WHERE " & Key & "='" & Value & "'")
  GetField = RS(0)
  RS.Close
End Function

Function NSlookup(strHost)
    On Error REsume Next
	Dim oShell, oFS, oTF, tempData, Data, i, Result
    'Create Shell Object
    Set oShell = Server.CreateObject("Wscript.Shell")
    'Run NSLookup via Command Prompt
    'Dump Results into a temp text file
    Result = oShell.Run ("%ComSpec% /c nslookup " & strHost _
        & "> " & Server.MapPath("/surreal/hosts/") & "\" & strHost & ".txt", 0, True)

    'Open the temp Text File and Read out the Data
    Set oFS = Server.CreateObject("Scripting.FileSystemObject")
    Set oTF = oFS.OpenTextFile(Server.MapPath("/surreal/hosts/") & "\" & strHost & ".txt")

    tempData = Null
    Data = Null
    i = 0
    Do While Not oTF.AtEndOfStream
        Data = Trim(oTF.Readline)
            If i = 3 Then ' we only want the name field
                tempData = " " & Data
				Dim arr
				arr = Split(tempData, "Name:")
				If IsArray(arr) Then
					tempData = Trim(arr(1))
				End If
            End If
        i = (i + 1)
    Loop

    'Close it
    oTF.Close
    'Delete It
    oFS.DeleteFile Server.MapPath("/surreal/hosts/") & "\" & strHost & ".txt"

    Set oFS = Nothing
    If Err.Number <> 0 Then
	nsLookup = tempData
    Else
        nsLookup = strHost
    End If
End Function




%>

<%
'  ===================================================================================

'  ===================================================================================
 function IFF(condition,ontrue,onfalse)
	if condition then
		IFF = ontrue
	else
		IFF = onfalse
	end if
 end function

function PadZero (Value,Num)
	Dif = Num - Len(CStr(Value))
	if Dif>0 then
		PadZero = Replace(Space(Dif)," ","0") & Value
	else
		PadZero = Left(CStr(Value),Num)
	end if
end function



function FUCase (ValueStr)
	if ValueStr="" then
		FUCase=""
	else
		FUCase = UCase(Left(ValueStr,1)) & LCase(Right(ValueStr,(Len(ValueStr)-1)))
	end if
end function




Function SQLS(byVal S)
	dim L,i,R,C
	
	L = Len(S)
	
	R = ""
	
	for i = 1 to L
		C = mid(S,i,1)
		if (C = "'") Then
			
			R = R & "''"
		else
			R = R & C
		end if	
	next
	SQLS = R
End function


Function JAVAS(byVal S)
	dim l,i,R,C
	
	l = Len(S)
	
	R = ""
	
	for i = 1 to l
		C = mid(S,i,1)
		if (C = "'") Then
			R = R & "/'" 
		elseif (C = "'") Then
			R = R & "/" & Chr(34)
		elseif (C = Chr(13)) Then
			R = R & "//n"
		elseif (C = Chr(10)) Then
			R = R & "//r"
		elseif (C = Chr(7)) Then
			R = R & "//t"
		else
			R = R & C
		end if	
	next
	JAVAS = R
End function



%> 


