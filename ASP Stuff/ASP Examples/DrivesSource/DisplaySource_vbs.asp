<%
   Const ForReading = 1, ForWriting = 2, ForAppending = 3
   Const TristateUseDefault = -2, TristateTrue = -1, TristateFalse = 0
   Dim strPathInfo, strPhysicalPath
   strPathInfo = Request.QueryString("FileName")
   strPhysicalPath = Server.MapPath(strPathInfo)
   Dim objFSO, objFile
   Set objFSO = CreateObject("Scripting.FileSystemObject")
   set objFile = objFSO.GetFile(strPhysicalPath)
%>
<%
   Dim objFileTextStream
   set objFileTextStream = objFile.OpenAsTextStream(ForReading, _
                                                    TristateUseDefault)
   Dim strLine, strFileLine
   Do While objFileTextStream.AtEndOfStream <> True
      strFileLine = objFileTextStream.ReadLine
      strLine = Server.HTMLEncode(strFileLine)
      strLine = Replace (strLine, Chr(9), "&nbsp;&nbsp;&nbsp;&nbsp;")
      Response.Write strLine
      Response.Write "<BR>" + vbCrLf
   Loop
   objFileTextStream.Close
%>
