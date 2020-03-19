<%

Dim objFS                   'FileSystemObject
Dim objDrives               'Drive object collection
Dim objDrive                'Drive object
Dim objFolders              'Folder object collection
Dim objFolder               'Folder object
Dim objFiles                'File object collection
Dim objFile                 'File object


	Function ReadEntireFile(ByVal filename)
		Const ForReading = 1, ForWriting = 2, ForAppending = 8
		Dim fso, f
		
		'Response.Write("Read Entire File - " & currentroot & filename & "<BR>")
		
		Set fso = CreateObject("Scripting.FileSystemObject")
		
		if FileExists(currentroot & filename) Then	
			Set f = fso.OpenTextFile(currentroot & filename, ForReading, True)
			ReadEntireFile = f.ReadAll
			f.Close
		else
			ReadEntireFile = "You have not created the content file " & filename & " <br> " & currentroot & filename & "<br>" & Request.ServerVariables("LOCAL_ADDR")
		end if
	End Function

	Function CreateFile(ByVal filename, byVal filecontent)
		Const ForReading = 1, ForWriting = 2, ForAppending = 8
		Dim fso, f
		
		Set fso = CreateObject("Scripting.FileSystemObject")
		
		Set f = fso.OpenTextFile(filename, ForWriting, True)
		
		f.WriteLine(filecontent)
		f.Close
		
		CreateFile = true
	End Function

	

	Function FileExists(filespec)
	  Dim fso, msg
	  Set fso = CreateObject("Scripting.FileSystemObject")
	  If (fso.FileExists(filespec)) Then
	    FileExists = true
	  Else
	    FileExists = false
	  End If	  
	End Function
	

Function DateLastModified(filespec)
  Dim fso, f   
	'Response.Write("GetFileSpec " & filespec & "<br>")
  
	if FileExists(filespec)then  
		Set fso = CreateObject("Scripting.FileSystemObject")
		Set f = fso.GetFile(filespec)
		DateLastModified = f.DateLastModified
  end if
End Function


Function FileChanged(byVal DevVersion, byVal TestVersion)
		
		if (FileExists(DevVersion) and FileExists(TestVersion)) then
			FileChanged = (DateDiff("s",DateLastModified(DevVersion),DateLastModified(TestVersion)) < 0)
		else
			FileChanged = true
		end if
End Function



	Function CpReplace(ByVal source, ByVal destination)
		dim fso,a
		Response.Write("Source = " & source & "  " & "Destination = " & destination & "<BR>")
		
		if FileExists(source) then
			Set fso = CreateObject("Scripting.FileSystemObject")	
	
			if FileExists(destination) then		
				ClearFlagOnFile(destination)
				fso.DeleteFile(destination)
			end if
					
			Set a = fso.GetFile(source)
			a.Copy(destination)		
		end if
	End Function

	Function DelFile(byVal destination)
		dim fso,a
		'Response.Write("Destination = " & destination & "<BR>")
	
		Set fso = CreateObject("Scripting.FileSystemObject")	
	
		if FileExists(destination) then		
			fso.DeleteFile(destination)
		end if
		
	End Function
	


'----------------------------------------------------------- 25
   function read_file( myFilename, crash_on_nonexist )
'-----------------------------------------------------------
   Set fs = CreateObject("Scripting.FileSystemObject")
   myFile = server.mappath( myFilename )
   on error resume next
   '
   set ts_read = fs.OpenTextFile(myFile, 1) ' 1 = forReading
   errnum = err.number: errdesc=err.description: on error goto 0
   '
   if errnum <> 0 then
      err1 = "[Can't read]": err2 = errnum & "--" & errdesc
      if crash_on_nonexist = "crash" then fail_open err1, myFile, err2
      read_file = ""
      exit function
   end if
   '
   myData = ts_read.ReadAll
   ts_read.close
   '
   read_file = DisForDat( myData, "", chr(13) )

end function '--- read_file


'----------------------------------------------------------- 26
   sub writeover_file( myFilename, myData )
'-----------------------------------------------------------
   Set fs = CreateObject("Scripting.FileSystemObject")
   myFile = server.mappath( myFilename )
   on error resume next
   set ts_wo  = fs.CreateTextFile(myFile, true) ' true=overwrite
   errnum = err.number: errdesc = err.description: on error goto 0
   if errnum <> 0 then fail_open "writeover_file", myFile, errnum & "--" & errdesc
   ts_wo.write myData
   ts_wo.close
end sub


'----------------------------------------------------------- 27
   sub write_or_append_file( myFilename, myData )
'-----------------------------------------------------------
   Set fs = CreateObject("Scripting.FileSystemObject")
   myFile = server.mappath( myFilename )
   on error resume next
   set ts_append  = fs.OpenTextFile( myFile, 8, true) '--- (8 = forAppending)
   errnum = err.number: errdesc = err.description: on error goto 0
   if errnum <> 0 then fail_open "write_or_append_file", myFile, errnum & "--" & errdesc
   ts_append.write myData
   ts_append.close
end sub


'----------------------------------------------------------- 28
   function file_exists( myFilename )
'-----------------------------------------------------------
   Set fs = CreateObject("Scripting.FileSystemObject")
   myFile = server.mappath( myFilename )
   on error resume next
   '
   set ts_exist = fs.OpenTextFile(myFile, 1) ' 1 = forReading
   errnum = err.number: on error goto 0
   '
   if errnum = 0 then
      ts_exist.close
      file_exists = true
   else
      file_exists = false
   end if
end function
%>