VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "RTDFunctions"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = True
Option Explicit

Implements IRtdServer  'Interface allows Excel to contact this RealTimeData server

Private m_colTopics As Collection
    
Private Function IRtdServer_ConnectData(ByVal TopicID As Long, Strings() As Variant, GetNewValues As Boolean) As Variant
    '** ConnectData is called whenever a new RTD topic is requested
    
    'Create a new topic class with the given TopicId and string and add it to the
    'm_colTopics collection
    Dim oTopic As New Topic 'topic is located in this dll
    m_colTopics.Add oTopic, CStr(TopicID)
    oTopic.TopicID = TopicID
    oTopic.TopicString = Strings(0)
    If UBound(Strings) >= 1 Then oTopic.SetIncrement Strings(1)
    
    'For this example, the initial value for a new topic is always 0
    IRtdServer_ConnectData = oTopic.TopicValue
    
    Debug.Print "ConnectData", TopicID
End Function

Private Sub IRtdServer_DisconnectData(ByVal TopicID As Long)
   '** DisconnectData is called whenever a specific topic is not longer needed
   
   'Remove the topic from the collection
   m_colTopics.Remove CStr(TopicID)
   
   Debug.Print "DisconnectData", TopicID
End Sub

Private Function IRtdServer_Heartbeat() As Long
    '** Called by Excel if the heartbeat interval has elapsed since the last time
    '   Excel was called with UpdateNotify.
    Debug.Print "HeartBeat"
End Function

Private Function IRtdServer_RefreshData(TopicCount As Long) As Variant()
    '** Called when Excel is requesting a refresh on topics. RefreshData will be called
    '   after an UpdateNotify has been issued by the server. This event should:
    '   - supply a value for TopicCount (number of topics to update)
    '   - return a two dimensional variant array containing the topic ids and the
    '     new values of each.
   
    Dim oTopic As Topic, n As Integer
    ReDim aUpdates(0 To 1, 0 To m_colTopics.Count - 1) As Variant
    For Each oTopic In m_colTopics
        oTopic.Update
        aUpdates(0, n) = oTopic.TopicID
        aUpdates(1, n) = oTopic.TopicValue
        n = n + 1
    Next
    TopicCount = m_colTopics.Count
    IRtdServer_RefreshData = aUpdates
   
   Debug.Print "RefreshData", TopicCount & " topics updated"
End Function

Private Function IRtdServer_ServerStart(ByVal CallbackObject As Excel.IRTDUpdateEvent) As Long
    '** ServerStart is called when the first RTD topic is requested
    
    Set oCallBack = CallbackObject
    Set m_colTopics = New Collection
    g_TimerID = SetTimer(0, 0, TIMER_INTERVAL, AddressOf TimerCallback)
    If g_TimerID > 0 Then IRtdServer_ServerStart = 1       'Any value <1 indicates failure.
    
    Debug.Print "ServerStart"
End Function

Private Sub IRtdServer_ServerTerminate()
    '** ServerTerminate is called when no more topics are needed by Excel.
    
    KillTimer 0, g_TimerID

    '** Cleanup any remaining topics. This is done here since
    '   IRtdServer_DisconnectData is only called if a topic is disconnected
    '   while the book is open. Items left in the collection when we terminate
    '   are those topics left running when the workbook was closed.

    Dim oTopic As Topic
    For Each oTopic In m_colTopics
        m_colTopics.Remove CStr(oTopic.TopicID)
        Set oTopic = Nothing
    Next

    Debug.Print "ServerTerminate"
  
End Sub

