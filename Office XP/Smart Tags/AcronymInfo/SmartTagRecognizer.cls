VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "SmartTagRecognizer"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = True
'This informs Visual Basic that you intend to implement all methods
'of the smart tag action interface. Implementing the ISmartTagAction
'interface ensures that you will implement all the smart tag interfaces
'according to the smart tag action standard.

Implements ISmartTagRecognizer

Dim terms() As String
Dim numTerms As Integer

Public Sub Class_Initialize()
   
    ' Sub to load some values from a Access Database to use for the
    ' Word Lookup
    
    Dim cnn As ADODB.Connection
    Dim rs As ADODB.Recordset
    Dim counter As Integer
    Dim recordsize As Integer
    
    
    Set cnn = New ADODB.Connection
    Set rs = New ADODB.Recordset
    With cnn
        .Provider = "Microsoft.Jet.OLEDB.4.0"
        .ConnectionString = App.Path & "\Acro.mdb"
        .Open
    End With
    
    rs.Open "Select * from Acronyms", cnn, adOpenKeyset, adLockOptimistic
    numTerms = rs.RecordCount
    
    ReDim terms(numTerms)
    
    For counter = 1 To rs.RecordCount
        terms(counter) = rs.Fields(0).Value
        rs.MoveNext
    Next counter
    
    Set rs = Nothing
    Set cnn = Nothing
End Sub
 
Public Property Get ISmartTagRecognizer_ProgId() As String
  ' Create a unique identifier for this recognizer
  ' that corresponds to the ProgID of this dll.

  ISmartTagRecognizer_ProgId = "AcronymInfo.SmartTagRecognizer"
End Property

Public Property Get ISmartTagRecognizer_Name(ByVal LocaleID As Long) As String
  ' Add a short phrase that describes this recognizer that will be
  ' shown in the Tools>Autocorrect Option>Smart Tags
  ' dialog box in both Word and Excel.
  ISmartTagRecognizer_Name = "Computer Industry Acronym Recognizer"
End Property

Public Property Get ISmartTagRecognizer_Desc(ByVal LocaleID As Long) As String
  ' Create a longer description of this recognizer.
  ISmartTagRecognizer_Desc = "The Computer Industry Acronym Info Recognizer"
End Property

Public Property Get ISmartTagRecognizer_SmartTagCount() As Long
  ' Specify the number of smart tag types this recognizer supports,
  ' which is 1 in this case.
  ISmartTagRecognizer_SmartTagCount = 1
End Property

Public Property Get ISmartTagRecognizer_SmartTagName(ByVal SmartTagID As Long) As String
' Provide the name of the smart tag type supported.
' SmartTag names are always in the format of
' namespaceURI#tagname.

ISmartTagRecognizer_SmartTagName = "schemas-Quilogy-com/UserGroup#AcronymInfo"

End Property

Public Property Get ISmartTagRecognizer_SmartTagDownloadURL(ByVal SmartTagID As Long) As String
  ' For this particular smart tag type, there is no Web site
  ' to support a smart tag download URL, so return null.
  ISmartTagRecognizer_SmartTagDownloadURL = Null
End Property

Public Sub ISmartTagRecognizer_Recognize(ByVal Text As String, ByVal DataType As SmartTagLib.IF_TYPE, ByVal LocaleID As Long, ByVal RecognizerSite As SmartTagLib.ISmartTagRecognizerSite)
    Dim i As Integer
    Dim index As Integer, termlen As Integer
    Dim propbag As SmartTagLib.ISmartTagProperties
    Text = LCase(Text)
    For i = 1 To numTerms
        index = InStr(Text, terms(i))
        termlen = Len(terms(i))
        While (index > 0)
            ' Ask the recognizer site for a property bag
            Set propbag = RecognizerSite.GetNewPropertyBag
            ' Commit the smart tag to the application
            RecognizerSite.CommitSmartTag "schemas-Quilogy-com/UserGroup#AcronymInfo", index, termlen, propbag
            ' Look for another smart tag in the string
            index = InStr(index + termlen, Text, terms(i))
        Wend
    Next i
End Sub



