<%@ LANGUAGE="JScript" %>
<%
   var ForReading = 1, ForWriting = 2, ForAppending = 3;
   var TristateUseDefault = -2, TristateTrue = -1, TristateFalse = 0;
   var strPathInfo, strPhysicalPath;
   strPathInfo = Request.QueryString("FileName");
   strPhysicalPath = Server.MapPath(strPathInfo);
   var objFSO, objFile;
   objFSO = Server.CreateObject("Scripting.FileSystemObject");
   objFile = objFSO.GetFile(strPhysicalPath);
%>
<%
   var objFileTextStream = objFile.OpenAsTextStream(ForReading,
                                                    TristateUseDefault);
   var strLine, strFileLine;
   while (!objFileTextStream.atEndOfStream) {
      strFileLine = objFileTextStream.ReadLine();
      strLine = Server.HTMLEncode(strFileLine);
      objRE = /\t/g;
      strLine.replace(objRE, "&nbsp;&nbsp;&nbsp;&nbsp;");
      Response.Write(strLine);
      Response.Write("<BR>\n");
   }
   objFileTextStream.Close();
%>
