VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "Topic"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Option Explicit

Private m_TopicID As Long
Private m_TopicString As String
Private m_Value As Variant
Private m_IncrementVal As Long

Private Sub Class_Initialize()
    m_Value = 0
    m_IncrementVal = 2
    Randomize
End Sub

Friend Property Let TopicID(ID As Long)
    m_TopicID = ID
End Property

Friend Property Get TopicID() As Long
    TopicID = m_TopicID
End Property

Friend Property Let TopicString(s As String)
    s = UCase(s)
    If s = "AAA" Or s = "BBB" Or s = "CCC" Or s = "DDD" Then
        m_TopicString = s
    Else
        m_Value = CVErr(xlErrValue) 'Return #VALUE if not one of the listed topics
    End If
End Property

Friend Sub Update()
    On Error Resume Next 'the next operation will fail if m_Value is an error (like #NUM or #VALUE)
    Debug.Print (Fix(Rnd(2) * 10) Mod 2)
    If (Fix(Rnd(2) * 10) Mod 2) = 1 Then
        m_Value = m_Value + m_IncrementVal
    Else
        m_Value = m_Value - m_IncrementVal
    End If
End Sub

Friend Sub SetIncrement(v As Variant)
    On Error Resume Next
    m_IncrementVal = CLng(v)
    If Err <> 0 Then
        m_Value = CVErr(xlErrNum) 'Return #NUM if Increment value is not numeric
    End If
End Sub

Friend Property Get TopicValue() As Variant
    If Not (IsError(m_Value)) Then
        TopicValue = m_Value 'm_TopicString & ": " & m_Value
    Else
        TopicValue = m_Value
    End If
End Property

