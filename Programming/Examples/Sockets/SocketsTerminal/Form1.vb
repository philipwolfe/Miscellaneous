Imports System.Net
Imports System.Net.Sockets

Public Class Form1
    Inherits System.Windows.Forms.Form

#Region " Windows Form Designer generated code "

    Public Sub New()
        MyBase.New()

        'This call is required by the Windows Form Designer.
        InitializeComponent()

        'Add any initialization after the InitializeComponent() call

    End Sub

    'Form overrides dispose to clean up the component list.
    Protected Overloads Overrides Sub Dispose(ByVal disposing As Boolean)
        If disposing Then
            If Not (components Is Nothing) Then
                components.Dispose()
            End If
        End If
        MyBase.Dispose(disposing)
    End Sub

    'Required by the Windows Form Designer
    Private components As System.ComponentModel.IContainer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    Friend WithEvents txtSend As System.Windows.Forms.TextBox
    Friend WithEvents btnConnect As System.Windows.Forms.Button
    Friend WithEvents txtAddress As System.Windows.Forms.TextBox
    Friend WithEvents txtPort As System.Windows.Forms.TextBox
    Friend WithEvents Label1 As System.Windows.Forms.Label
    Friend WithEvents Label2 As System.Windows.Forms.Label
    Friend WithEvents txtReceive As System.Windows.Forms.TextBox
    Friend WithEvents btnSend As System.Windows.Forms.Button
    <System.Diagnostics.DebuggerStepThrough()> Private Sub InitializeComponent()
        Me.txtSend = New System.Windows.Forms.TextBox()
        Me.btnConnect = New System.Windows.Forms.Button()
        Me.txtAddress = New System.Windows.Forms.TextBox()
        Me.txtPort = New System.Windows.Forms.TextBox()
        Me.Label1 = New System.Windows.Forms.Label()
        Me.Label2 = New System.Windows.Forms.Label()
        Me.txtReceive = New System.Windows.Forms.TextBox()
        Me.btnSend = New System.Windows.Forms.Button()
        Me.SuspendLayout()
        '
        'txtSend
        '
        Me.txtSend.Anchor = ((System.Windows.Forms.AnchorStyles.Bottom Or System.Windows.Forms.AnchorStyles.Left) _
                    Or System.Windows.Forms.AnchorStyles.Right)
        Me.txtSend.Font = New System.Drawing.Font("Arial", 9.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.txtSend.Location = New System.Drawing.Point(8, 376)
        Me.txtSend.Multiline = True
        Me.txtSend.Name = "txtSend"
        Me.txtSend.ScrollBars = System.Windows.Forms.ScrollBars.Vertical
        Me.txtSend.Size = New System.Drawing.Size(664, 88)
        Me.txtSend.TabIndex = 3
        Me.txtSend.Text = ""
        '
        'btnConnect
        '
        Me.btnConnect.Anchor = (System.Windows.Forms.AnchorStyles.Top Or System.Windows.Forms.AnchorStyles.Right)
        Me.btnConnect.Font = New System.Drawing.Font("Arial", 9.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.btnConnect.Location = New System.Drawing.Point(688, 144)
        Me.btnConnect.Name = "btnConnect"
        Me.btnConnect.Size = New System.Drawing.Size(72, 24)
        Me.btnConnect.TabIndex = 2
        Me.btnConnect.Text = "Connect"
        '
        'txtAddress
        '
        Me.txtAddress.Anchor = (System.Windows.Forms.AnchorStyles.Top Or System.Windows.Forms.AnchorStyles.Right)
        Me.txtAddress.Font = New System.Drawing.Font("Arial", 9.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.txtAddress.Location = New System.Drawing.Point(688, 40)
        Me.txtAddress.Name = "txtAddress"
        Me.txtAddress.Size = New System.Drawing.Size(144, 25)
        Me.txtAddress.TabIndex = 0
        Me.txtAddress.Text = ""
        '
        'txtPort
        '
        Me.txtPort.Anchor = (System.Windows.Forms.AnchorStyles.Top Or System.Windows.Forms.AnchorStyles.Right)
        Me.txtPort.Font = New System.Drawing.Font("Arial", 9.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.txtPort.Location = New System.Drawing.Point(688, 104)
        Me.txtPort.Name = "txtPort"
        Me.txtPort.Size = New System.Drawing.Size(80, 25)
        Me.txtPort.TabIndex = 1
        Me.txtPort.Text = ""
        '
        'Label1
        '
        Me.Label1.Anchor = (System.Windows.Forms.AnchorStyles.Top Or System.Windows.Forms.AnchorStyles.Right)
        Me.Label1.Font = New System.Drawing.Font("Arial", 9.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.Label1.Location = New System.Drawing.Point(688, 16)
        Me.Label1.Name = "Label1"
        Me.Label1.Size = New System.Drawing.Size(136, 16)
        Me.Label1.TabIndex = 5
        Me.Label1.Text = "Server Name:"
        '
        'Label2
        '
        Me.Label2.Anchor = (System.Windows.Forms.AnchorStyles.Top Or System.Windows.Forms.AnchorStyles.Right)
        Me.Label2.Font = New System.Drawing.Font("Arial", 9.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.Label2.Location = New System.Drawing.Point(688, 80)
        Me.Label2.Name = "Label2"
        Me.Label2.Size = New System.Drawing.Size(136, 16)
        Me.Label2.TabIndex = 6
        Me.Label2.Text = "Port:"
        '
        'txtReceive
        '
        Me.txtReceive.Anchor = (((System.Windows.Forms.AnchorStyles.Top Or System.Windows.Forms.AnchorStyles.Bottom) _
                    Or System.Windows.Forms.AnchorStyles.Left) _
                    Or System.Windows.Forms.AnchorStyles.Right)
        Me.txtReceive.Font = New System.Drawing.Font("Arial", 9.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.txtReceive.Location = New System.Drawing.Point(8, 8)
        Me.txtReceive.Multiline = True
        Me.txtReceive.Name = "txtReceive"
        Me.txtReceive.ScrollBars = System.Windows.Forms.ScrollBars.Vertical
        Me.txtReceive.Size = New System.Drawing.Size(664, 360)
        Me.txtReceive.TabIndex = 7
        Me.txtReceive.TabStop = False
        Me.txtReceive.Text = ""
        '
        'btnSend
        '
        Me.btnSend.Anchor = (System.Windows.Forms.AnchorStyles.Bottom Or System.Windows.Forms.AnchorStyles.Right)
        Me.btnSend.Enabled = False
        Me.btnSend.Font = New System.Drawing.Font("Arial", 9.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.btnSend.Location = New System.Drawing.Point(688, 376)
        Me.btnSend.Name = "btnSend"
        Me.btnSend.TabIndex = 4
        Me.btnSend.Text = "Send"
        '
        'Form1
        '
        Me.AutoScaleBaseSize = New System.Drawing.Size(6, 15)
        Me.ClientSize = New System.Drawing.Size(848, 472)
        Me.Controls.AddRange(New System.Windows.Forms.Control() {Me.btnSend, Me.txtReceive, Me.Label2, Me.Label1, Me.txtPort, Me.txtAddress, Me.btnConnect, Me.txtSend})
        Me.Name = "Form1"
        Me.Text = "Sockets Terminal"
        Me.ResumeLayout(False)

    End Sub

#End Region

    Private ClientSocket As Socket
    Private ASCII As New System.Text.ASCIIEncoding()

    Private Sub btnConnect_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnConnect.Click
        '-- Resolve the Server Name or IP address
        Dim Addr As IPAddress = _
          Dns.Resolve(txtAddress.Text).AddressList(0)
        '-- Create an endpoint
        Dim EP As New IPEndPoint(Addr, CInt(txtPort.Text))
        '-- Create a socket
        ClientSocket = New Socket(AddressFamily.InterNetwork, _
          SocketType.Stream, ProtocolType.Tcp)
        '-- Display the hourglass while connecting
        Cursor = Cursors.WaitCursor
        '-- Attempt to connect
        Try
            ClientSocket.BeginConnect(EP, _
              AddressOf ConnectCallback, Nothing)
        Catch ex As Exception
            Cursor = Cursors.WaitCursor
            MsgBox(ex.Message)
        End Try
    End Sub

    Private Sub ConnectCallback(ByVal ar As IAsyncResult)
        '-- Restore cursor
        Cursor = Cursors.Default
        '-- End the connect action
        ClientSocket.EndConnect(ar)
        '-- Tell the user we've connected
        Dim dlg As New GenericDelegate(AddressOf Connected)
        Me.Invoke(dlg)
        '-- Start Receiving Data
        Dim receive(4095) As Byte
        '-- Begin receiving data
        ClientSocket.BeginReceive(receive, 0, _
          receive.Length, SocketFlags.None, _
          AddressOf ReceiveCallback, receive)
    End Sub

    Private Sub btnSend_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnSend.Click
        '-- Convert the string to send into an array of bytes 
        Dim bytes() As Byte = ASCII.GetBytes(txtSend.Text & vbCrLf)
        '-- Send the data as a byte array
        ClientSocket.Send(bytes)
        '-- Clear the textbox
        txtSend.Clear()
    End Sub

    Private Sub ReceiveCallback(ByVal ar As IAsyncResult)
        '-- Get a reference to the receive buffer
        Dim receive() As Byte = CType(ar.AsyncState, Byte())
        '-- Return the number of bytes received
        Dim numbytes As Int32 = ClientSocket.EndReceive(ar)
        '-- If no more data is to be received, numbytes will be 0
        If numbytes = 0 Then
            '-- Shut down the socket
            ClientSocket.Shutdown(SocketShutdown.Both)
            ClientSocket.Close()
            '-- Tell the user we're disconnected
            Dim dlg As New GenericDelegate(AddressOf Disconnected)
            Me.Invoke(dlg)
        Else
            '-- Convert the received data into a string
            Dim ReceiveData As String = ASCII.GetString(receive, _
             0, numbytes)
            '-- Clear the receive buffer (not really necessary)
            Array.Clear(receive, 0, receive.Length)
            '-- Display ReceiveData
            Dim dlg As New DisplayDataDelegate(AddressOf DisplayData)
            Dim args() As Object = {ReceiveData}
            Me.Invoke(dlg, args)
            '-- Receive again
            ClientSocket.BeginReceive(receive, 0, _
              receive.Length, SocketFlags.None, _
              AddressOf ReceiveCallback, receive)
        End If
    End Sub

    Private Sub DisplayData(ByVal Data As String)
        '-- Append text to textbox
        With txtReceive
            .SelectionStart = .Text.Length
            .SelectedText = Data
        End With
    End Sub

    Private Delegate Sub DisplayDataDelegate(ByVal Data As String)

    Private Sub Disconnected()
        '-- UI code when we've disconnected
        btnConnect.Enabled = True
        Me.Text = "Not connected"
        btnSend.Enabled = False
        btnConnect.Focus()
    End Sub

    Private Sub Connected()
        '-- UI code for when we've connected
        txtReceive.Clear()
        btnConnect.Enabled = False
        Me.Text = "Connected!"
        txtSend.Focus()
        btnSend.Enabled = True
    End Sub

    Private Delegate Sub GenericDelegate()
End Class
