VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "AcctMgt"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = True
Option Explicit

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

Public Sub TransferMoney(ByVal intOrigAcct As Integer, ByVal intDestAcct As Integer, _
                         ByVal intAmount As Integer)

   Dim objContext As COMSVCSLib.ObjectContext
   Dim cnUpdateConn As ADODB.Connection

   On Error GoTo TransferMoney_Error

   Set objContext = GetObjectContext()
   Set cnUpdateConn = New ADODB.Connection

   With cnUpdateConn
      .ConnectionString = "Provider=SQLOLEDB.1;User ID=sa;" & _
                          "Initial Catalog=Bank;Data Source=Watcher"
      .Open
   
      ' Remove the money from the originating account
      .Execute "UPDATE Accounts SET AcctBalance = (Select AcctBalance " & _
               " FROM Accounts WHERE AcctID=" & intOrigAcct & ") - " & _
               intAmount & " WHERE AcctID = " & intOrigAcct
         
      ' And place it in the destination account
      .Execute "UPDATE Accounts SET AcctBalance = (Select AcctBalance" & _
               " FROM Accounts WHERE AcctID=" & intDestAcct & ") + " & _
               intAmount & " WHERE AcctID=" & intDestAcct
   End With

   If Not objContext Is Nothing Then
      objContext.SetComplete
   End If

TransferMoney_Exit:
   Set objContext = Nothing
   Exit Sub

TransferMoney_Error:
   ' Unexpected error occurred, abort
   If Not objContext Is Nothing Then
      objContext.SetAbort
   End If

   Resume TransferMoney_Exit

End Sub




