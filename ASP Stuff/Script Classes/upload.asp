<%
' http://www.planet-source-code.com/vb/scripts/ShowCode.asp?lngWId=4&txtCodeId=6226
Option Explicit
'FUNCTIONS
Function getString(StringBin)
	dim intCount
	getString =""
	For intCount = 1 To LenB(StringBin)
		getString = getString & chr(AscB(MidB(StringBin,intCount,1))) 
	Next
End Function

Function getByteString(StringStr)
	dim char
	For i = 1 To Len(StringStr)
		char = Mid(StringStr, i, 1)
		getByteString = getByteString & chrB(AscB(char))
	Next
End Function

Function BuildUploadRequest(RequestBin)
	Dim scrDict, PosBeg, PosEnd, boundary, boundaryPos
	dim Pos, Name, PosFile, PosBound, ContentType, Value
	Set scrDict = Server.CreateObject("Scripting.Dictionary")
	PosBeg = 1
	PosEnd = InstrB(PosBeg,RequestBin,getByteString(chr(13)))
	boundary = MidB(RequestBin,PosBeg,PosEnd-PosBeg)
	boundaryPos = InstrB(1,RequestBin,boundary)
	Do until (boundaryPos=InstrB(RequestBin,boundary & getByteString("--")))
		Dim UploadControl
		Set UploadControl = CreateObject("Scripting.Dictionary")
		Pos = InstrB(BoundaryPos,RequestBin, getByteString("Content-Disposition"))
		Pos = InstrB(Pos,RequestBin,getByteString("name="))
		PosBeg = Pos+6
		PosEnd = InstrB(PosBeg,RequestBin,getByteString(chr(34)))
		Name = getString(MidB(RequestBin,PosBeg,PosEnd-PosBeg))
		PosFile=InstrB(BoundaryPos,RequestBin,getByteString("filename="))
		PosBound = InstrB(PosEnd,RequestBin,boundary)
		If PosFile<>0 AND (PosFile<PosBound) Then
			PosBeg = PosFile + 10
			PosEnd = InstrB(PosBeg,RequestBin,getByteString(chr(34)))
			FileName = getString(MidB(RequestBin,PosBeg,PosEnd-PosBeg))
			UploadControl.Add "FileName", FileName
			Pos = InstrB(PosEnd,RequestBin,getByteString("Content-Type:"))
			PosBeg = Pos+14
			PosEnd = InstrB(PosBeg,RequestBin,getByteString(chr(13)))
			ContentType = getString(MidB(RequestBin,PosBeg,PosEnd-PosBeg))
			UploadControl.Add "ContentType",ContentType
			PosBeg = PosEnd+4
			PosEnd = InstrB(PosBeg,RequestBin,boundary)-2
			Value = MidB(RequestBin,PosBeg,PosEnd-PosBeg)
		Else
			Pos = InstrB(Pos,RequestBin,getByteString(chr(13)))
			PosBeg = Pos+4
			PosEnd = InstrB(PosBeg,RequestBin,boundary)-2
			Value = getString(MidB(RequestBin,PosBeg,PosEnd-PosBeg))
		End If
		UploadControl.Add "Value" , Value
		scrDict.Add Name, UploadControl
		BoundaryPos=InstrB(BoundaryPos+LenB(boundary),RequestBin,boundary)
	Loop
    	
	Set BuildUploadRequest = scrDict
	Set scrDict = Nothing
    	
End Function

Function ParseFileFromPath(iStr)
	Dim tPos
	tPos = InStrRev(iStr, "\")
	If tPos = 0 Or IsNull(tPos) Then
		ParseFileFromPath = iStr
		Exit Function
	End If
	ParseFileFromPath = Right(iStr, Len(iStr) - tPos)
End Function
'END FUNCTIONS

Dim tBytes
Dim binData
Dim Dict
Dim fileName
Dim fso
Dim fsoFile
Dim binaryFileContent
Dim i
tBytes = Request.TotalBytes
binData = Request.BinaryRead(tBytes)
Set Dict = BuildUploadRequest(binData)
fileName = Dict.Item("fName").Item("FileName")
binaryFileContent = Dict.Item("fName").Item("Value")
fileName = ParseFileFromPath(fileName)
fileName = Server.MapPath(fileName)
'==constructing the filepath of the root
'     on server 
Set fso = Server.CreateObject("Scripting.FileSystemObject")
Set fsoFile = fso.CreateTextFile(fileName, True)
For i = 1 To LenB(binaryFileContent)
fsoFile.Write Chr(AscB(MidB(binaryFileContent, i, 1)))
Next 
fsoFile.Close
Set fso = Nothing
%>
<html><body>
tBytes <%= tBytes%>
<br>
Your file <%= filename%> has been uploaded
</body></html>