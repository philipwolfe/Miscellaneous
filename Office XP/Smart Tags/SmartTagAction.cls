VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "SmartTagAction"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = True
'This informs Visual Basic that you intend to implement all methods
'of the smart tag action interface. Implementing the ISmartTagAction
'interface ensures that you will implement all the smart tag interfaces
'according to the smart tag action standard.

Implements ISmartTagAction


Public Property Get ISmartTagAction_ProgId() As String
    ' Create a unique identifier for this action provider
    ' that corresponds to the ProgID of this dll.
    ISmartTagAction_ProgId = "AcronymInfo.SmartTagAction"
End Property

Public Property Get ISmartTagAction_Name(ByVal LocaleID As Long) As String
  ' Add a short phrase that describes this action provider DLL.
  ISmartTagAction_Name = "MidNET User Group Acronym Actions"
End Property

Public Property Get ISmartTagAction_Desc(ByVal LocaleID As Long) As String
  ' Create a longer description of this action.
  ISmartTagAction_Desc = "Provides actions for Lookup of data"
End Property

Public Property Get ISmartTagAction_SmartTagCount() As Long
    ' Specify the number of smart tag types this recognizer
    ' supports, which is 1 in this case.
    ISmartTagAction_SmartTagCount = 1
End Property

Public Property Get ISmartTagAction_SmartTagName(ByVal SmartTagID As Long) As String
    ' Provide the name of the smart tag type supported.
    ' SmartTag type names are always in the format of
    ' namespaceURI#tagname.
    ' Note that the SmartTagID = 1 check isn't strictly necessary
    ' since only 1 smart tag type is supported and will only get
    ' called once.

    ISmartTagAction_SmartTagName = "schemas-Quilogy-com/UserGroup#AcronymInfo"

End Property

Public Property Get ISmartTagAction_SmartTagCaption(ByVal SmartTagID As Long, ByVal LocaleID As Long) As String
  ' Specify the title caption to be displayed in the smart tag UI.
  ISmartTagAction_SmartTagCaption = "Acronym Actions"
End Property
    
Public Property Get ISmartTagAction_VerbCount(ByVal SmartTagName As String) As Long
    ' Specify the number of verbs supported for a given smart tag
    ' type.
    ISmartTagAction_VerbCount = 2
End Property

Public Property Get ISmartTagAction_VerbID(ByVal SmartTagName As String, ByVal VerbIndex As Long) As Long
  ' For this simple action provider, VerbID is returned back
  ' to the action client as the unique ID.
  ISmartTagAction_VerbID = VerbIndex
End Property

Public Property Get ISmartTagAction_VerbCaptionFromID(ByVal VerbID As Long, ByVal ApplicationName As String, ByVal LocaleID As Long) As String
  ' Again, this If statement is technically unnecessary since the
  ' calls should only be with the IDs supplied in the VerbID
  ' property. Still, it's better to be robust and prevent unintended
  ' behavior by misbehaving action clients.
  If (VerbID = 1) Then
    ISmartTagAction_VerbCaptionFromID = "Display Description"
  ElseIf (VerbID = 2) Then
    ISmartTagAction_VerbCaptionFromID = "Insert Description"
  End If
End Property

Public Property Get ISmartTagAction_VerbNameFromID(ByVal VerbID As Long) As String
  ' This string is the name for the string that is used
  ' internally in Excel to represent the VerbID.
   If (VerbID = 1) Then
        ISmartTagAction_VerbNameFromID = "Display Description"
   ElseIf (VerbID = 2) Then
        ISmartTagAction_VerbNameFromID = "Insert Description"
   End If
   
End Property

Public Sub ISmartTagAction_InvokeVerb(ByVal VerbID As Long, ByVal ApplicationName As String, ByVal Target As Object, ByVal Properties As SmartTagLib.ISmartTagProperties, ByVal Text As String, ByVal XML As String)
    Dim ie
    Dim sDefinition As String
    
 Select Case ApplicationName
    Case "Word.Application.10"
         Select Case VerbID
           Case 1
              sDefinition = GetDefinition(Text)
              MsgBox sDefinition
           Case 2
              sDefinition = GetDefinition(Text)
              'ActiveDocument.Content.InsertAfter Text:=" - (" + sDefinition + ")"
              Selection.TypeText Text:=sDefinition
        End Select
    
   Case "Excel.Application.10"
       Select Case VerbID
           Case 1
              sDefinition = GetDefinition(Text)
              MsgBox sDefinition
        End Select
  End Select
End Sub

Public Function GetDefinition(sActionWord As String) As String
    ' This is a Sub for getting a definition out of the database that correspondes
    ' to the Action Word
    Dim cnn As ADODB.Connection
    Dim rs As ADODB.Recordset
    Dim sSql As String
        
    Set cnn = New ADODB.Connection
    Set rs = New ADODB.Recordset
    
    With cnn
        .Provider = "Microsoft.Jet.OLEDB.4.0"
        .ConnectionString = App.Path & "\Acro.mdb"
        .Open
    End With
    
    sSql = "Select * from Acronyms Where Acronym = " & "'" & sActionWord & "'"
    rs.Open sSql, cnn, adOpenKeyset, adLockOptimistic
          
    GetDefinition = rs.Fields(1).Value
    
    Set rs = Nothing
    Set cnn = Nothing
End Function
