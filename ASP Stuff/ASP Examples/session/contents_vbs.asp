<%
For Each objItem in Session.Contents
   If IsObject(Session.Contents(objItem)) Then
      Response.Write "Object reference: '" & objItem & "'<BR>"
   ElseIf IsArray(Session.Contents(objItem)) Then
      Response.Write "Array: '" & objItem & "' contents are:<BR>"
      varArray = Session.Contents(objItem)
      'Note: the following only works with a one-dimensional array
      For intLoop = 0 To UBound(varArray)
         Response.Write "&nbsp; Index(" & intLoop & ") = " _
                         & varArray(intLoop) & "<BR>"
      Next
   Else
      Response.Write "Variable: '" & objItem & "' = " & Session.Contents(objItem) & "<BR>"
   End If
Next
%>