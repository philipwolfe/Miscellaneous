Attribute VB_Name = "Module1"
Public Declare Function SetTimer Lib "user32" (ByVal hWnd As Long, _
ByVal nIDEvent As Long, ByVal uElapse As Long, ByVal lpTimerFunc As Long) As Long

Public Declare Function KillTimer Lib "user32" (ByVal hWnd As Long, ByVal nIDEvent As Long) As Long

Public Const TIMER_INTERVAL = 2000 '2 seconds
Public oCallBack As Excel.IRTDUpdateEvent
Public g_TimerID As Long

Public Sub TimerCallback(ByVal hWnd As Long, ByVal uMsg As Long, ByVal idEvent As Long, ByVal dwTime As Long)
    oCallBack.UpdateNotify
End Sub


