VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "AcctMgt2"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = True
Option Explicit

Public Sub TransferMoney(ByVal intOrigAcct As Integer, ByVal intDestAcct As Integer, _
                         ByVal intAmount As Integer)

   Dim objQueueInfo As New MSMQ.MSMQQueueInfo
   Dim objTransferQueue As New MSMQ.MSMQQueue
   Dim objMessage As New MSMQ.MSMQMessage
   Dim objContext As COMSVCSLib.ObjectContext

On Error GoTo Error_handler

Set objContext = GetObjectContext
   ' First, open the Transfer queue
   With objQueueInfo
      .PathName = ".\Transfers"
      Set objTransferQueue = objQueueInfo.Open(MQ_SEND_ACCESS, MQ_DENY_NONE)
   End With

   ' Then create and send the message
   With objMessage
      .Body = intOrigAcct & ";" & intDestAcct & ";" & intAmount
      .Label = "AcctTransfer"
      .Send objTransferQueue, MQ_TRANSACTIONAL
   End With
   
   If Not objContext Is Nothing Then
      objContext.SetComplete
   End If

Exit_handler:
   Set objContext = Nothing
   Exit Sub
   
Error_handler:

   If Not objContext Is Nothing Then
      objContext.SetAbort
   End If
   Resume Exit_handler
End Sub

Public Function GetAccountList(ByVal strAccountName As String) As ADODB.Recordset
   Dim objContext As COMSVCSLib.ObjectContext
   Dim rsAccountList As ADODB.Recordset

   On Error GoTo GetAccountList_Error

   Set objContext = GetObjectContext()
   Set rsAccountList = New ADODB.Recordset

   With rsAccountList
      .ActiveConnection = "Provider=SQLOLEDB.1;User ID=sa;" & _
                          "Initial Catalog = Bank;Data Source=Watcher"
      .CursorLocation = adUseClient
      .CursorType = adOpenStatic
      .LockType = adLockReadOnly
      .Source = "Select * from Accounts WHERE OwnerName = '" & strAccountName & "'"
      .Open

      Set .ActiveConnection = Nothing    ' Release the connection
   End With

   Set GetAccountList = rsAccountList

   If Not objContext Is Nothing Then
      objContext.SetComplete
   End If

GetAccountList_Exit:
   Set objContext = Nothing
   Exit Function

GetAccountList_Error:
   ' Unexpected error occurred, abort
   If Not objContext Is Nothing Then
      objContext.SetAbort
   End If

   Resume GetAccountList_Exit

End Function


