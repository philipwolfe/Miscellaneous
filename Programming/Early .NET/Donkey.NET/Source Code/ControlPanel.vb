Public Class ControlPanel
    Inherits System.Windows.Forms.Form

#Region " Windows Form Designer generated code "

    'Form overrides dispose to clean up the component list.
    Protected Overloads Overrides Sub Dispose(ByVal disposing As Boolean)
        If disposing Then
            If Not (components Is Nothing) Then
                components.Dispose()
            End If
        End If
        MyBase.Dispose(disposing)
    End Sub
    Friend WithEvents PanelLogo As System.Windows.Forms.PictureBox
    Friend WithEvents Loading As System.Windows.Forms.Label
    Friend WithEvents ItemLabel2 As System.Windows.Forms.Label
    Friend WithEvents NextPage As System.Windows.Forms.Button
    Friend WithEvents PreviousPage As System.Windows.Forms.Button
    Friend WithEvents ItemLabel1 As System.Windows.Forms.Label
    Friend WithEvents ItemPicture1 As System.Windows.Forms.Button
    Friend WithEvents ItemPicture2 As System.Windows.Forms.Button
    Friend WithEvents ItemPanel As System.Windows.Forms.Panel
    Private components As System.ComponentModel.IContainer

    'Required by the Windows Form Designer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()> Private Sub InitializeComponent()
        Me.ItemPanel = New System.Windows.Forms.Panel()
        Me.ItemPicture2 = New System.Windows.Forms.Button()
        Me.ItemPicture1 = New System.Windows.Forms.Button()
        Me.ItemLabel2 = New System.Windows.Forms.Label()
        Me.NextPage = New System.Windows.Forms.Button()
        Me.PreviousPage = New System.Windows.Forms.Button()
        Me.ItemLabel1 = New System.Windows.Forms.Label()
        Me.Loading = New System.Windows.Forms.Label()
        Me.PanelLogo = New System.Windows.Forms.PictureBox()
        Me.ItemPanel.SuspendLayout()
        Me.SuspendLayout()
        '
        'ItemPanel
        '
        Me.ItemPanel.Controls.AddRange(New System.Windows.Forms.Control() {Me.ItemPicture2, Me.ItemPicture1, Me.ItemLabel2, Me.NextPage, Me.PreviousPage, Me.ItemLabel1})
        Me.ItemPanel.Name = "ItemPanel"
        Me.ItemPanel.Size = New System.Drawing.Size(100, 320)
        Me.ItemPanel.TabIndex = 6
        Me.ItemPanel.Visible = False
        '
        'ItemPicture2
        '
        Me.ItemPicture2.FlatStyle = System.Windows.Forms.FlatStyle.Flat
        Me.ItemPicture2.ForeColor = System.Drawing.Color.White
        Me.ItemPicture2.Location = New System.Drawing.Point(10, 160)
        Me.ItemPicture2.Name = "ItemPicture2"
        Me.ItemPicture2.Size = New System.Drawing.Size(80, 95)
        Me.ItemPicture2.TabIndex = 7
        Me.ItemPicture2.TabStop = False
        '
        'ItemPicture1
        '
        Me.ItemPicture1.FlatStyle = System.Windows.Forms.FlatStyle.Flat
        Me.ItemPicture1.ForeColor = System.Drawing.Color.White
        Me.ItemPicture1.Location = New System.Drawing.Point(10, 35)
        Me.ItemPicture1.Name = "ItemPicture1"
        Me.ItemPicture1.Size = New System.Drawing.Size(80, 95)
        Me.ItemPicture1.TabIndex = 7
        Me.ItemPicture1.TabStop = False
        '
        'ItemLabel2
        '
        Me.ItemLabel2.Font = New System.Drawing.Font("Arial", 11!, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.ItemLabel2.ForeColor = System.Drawing.Color.GhostWhite
        Me.ItemLabel2.Location = New System.Drawing.Point(10, 260)
        Me.ItemLabel2.Name = "ItemLabel2"
        Me.ItemLabel2.Size = New System.Drawing.Size(80, 20)
        Me.ItemLabel2.TabIndex = 3
        Me.ItemLabel2.Text = "Tracks"
        Me.ItemLabel2.TextAlign = System.Drawing.ContentAlignment.MiddleCenter
        '
        'NextPage
        '
        Me.NextPage.FlatStyle = System.Windows.Forms.FlatStyle.Flat
        Me.NextPage.Font = New System.Drawing.Font("Arial", 8.25!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.NextPage.ForeColor = System.Drawing.Color.White
        Me.NextPage.Location = New System.Drawing.Point(32, 282)
        Me.NextPage.Name = "NextPage"
        Me.NextPage.Size = New System.Drawing.Size(38, 19)
        Me.NextPage.TabIndex = 4
        Me.NextPage.TabStop = False
        Me.NextPage.Text = "Next"
        Me.NextPage.Visible = False
        '
        'PreviousPage
        '
        Me.PreviousPage.FlatStyle = System.Windows.Forms.FlatStyle.Flat
        Me.PreviousPage.Font = New System.Drawing.Font("Arial", 8.25!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.PreviousPage.ForeColor = System.Drawing.Color.White
        Me.PreviousPage.Location = New System.Drawing.Point(32, 12)
        Me.PreviousPage.Name = "PreviousPage"
        Me.PreviousPage.Size = New System.Drawing.Size(38, 19)
        Me.PreviousPage.TabIndex = 4
        Me.PreviousPage.TabStop = False
        Me.PreviousPage.Text = "Prev"
        Me.PreviousPage.Visible = False
        '
        'ItemLabel1
        '
        Me.ItemLabel1.Font = New System.Drawing.Font("Arial", 11!, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.ItemLabel1.ForeColor = System.Drawing.Color.GhostWhite
        Me.ItemLabel1.Location = New System.Drawing.Point(10, 135)
        Me.ItemLabel1.Name = "ItemLabel1"
        Me.ItemLabel1.Size = New System.Drawing.Size(80, 20)
        Me.ItemLabel1.TabIndex = 3
        Me.ItemLabel1.Text = "Obstacles"
        Me.ItemLabel1.TextAlign = System.Drawing.ContentAlignment.MiddleCenter
        '
        'Loading
        '
        Me.Loading.ForeColor = System.Drawing.Color.White
        Me.Loading.Location = New System.Drawing.Point(0, 150)
        Me.Loading.Name = "Loading"
        Me.Loading.Size = New System.Drawing.Size(100, 20)
        Me.Loading.TabIndex = 5
        Me.Loading.Text = "Loading"
        Me.Loading.TextAlign = System.Drawing.ContentAlignment.MiddleCenter
        '
        'PanelLogo
        '
        Me.PanelLogo.BackColor = System.Drawing.Color.Transparent
        Me.PanelLogo.Location = New System.Drawing.Point(105, 24)
        Me.PanelLogo.Name = "PanelLogo"
        Me.PanelLogo.Size = New System.Drawing.Size(68, 272)
        Me.PanelLogo.TabIndex = 0
        Me.PanelLogo.TabStop = False
        '
        'ControlPanel
        '
        Me.AutoScaleBaseSize = New System.Drawing.Size(8, 19)
        Me.BackColor = System.Drawing.Color.Black
        Me.ClientSize = New System.Drawing.Size(200, 320)
        Me.Controls.AddRange(New System.Windows.Forms.Control() {Me.Loading, Me.ItemPanel, Me.PanelLogo})
        Me.Font = New System.Drawing.Font("Arial", 12!, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None
        Me.Name = "ControlPanel"
        Me.ShowInTaskbar = False
        Me.Text = "Donkey.NET"
        Me.ItemPanel.ResumeLayout(False)
        Me.ResumeLayout(False)

    End Sub

#End Region

    '****************************************
    'Constants
    '****************************************

    Private Const PageSize As Integer = 2

    '****************************************
    'Internal variables
    '****************************************

    Private xMin As Integer
    Private xMax As Integer
    Private y As Integer
    Private ControlPanelExtended As Boolean = False
    Private ObstacleList() As DonkeyWeb.ObstacleInfo
    Private CurrentPage As Integer

    '****************************************
    'Constructors
    '****************************************

    Public Sub New(ByVal ParentLowerRight As Point)
        MyBase.New()

        'This call is required by the Windows Form Designer.
        InitializeComponent()

        'Initialize position relative to parent form
        xMin = ParentLowerRight.X - 100
        xMax = ParentLowerRight.X
        y = ParentLowerRight.Y - 320
    End Sub

    '****************************************
    'Event handlers
    '****************************************

    Private Sub AdminPanel_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        'Set form position
        Me.Left = xMin
        Me.Top = y

        'Shape the control panel to look like a tab
        Dim GraphicsPath As New Drawing2D.GraphicsPath()
        Dim Points() As Point = {New Point(0, 0), _
                                 New Point(198, 1), _
                                 New Point(199, 1), _
                                 New Point(200, 320 / 2), _
                                 New Point(199, 320 - 1), _
                                 New Point(198, 320 - 1), _
                                 New Point(0, 320)}
        GraphicsPath.AddBeziers(Points)
        Me.Region = New Region(GraphicsPath)

        'Set the control panel logo image
        PanelLogo.Image = New Bitmap([Assembly].GetExecutingAssembly().GetManifestResourceStream("DonkeyNET.PanelLogo.bmp"))
    End Sub

    Private Sub PanelLogo_MouseEnter(ByVal sender As Object, ByVal e As System.EventArgs) Handles PanelLogo.MouseEnter
        'Set the control panel logo to the highlighted image
        PanelLogo.Image = New Bitmap([Assembly].GetExecutingAssembly().GetManifestResourceStream("DonkeyNET.PanelLogoHiLite.bmp"))
        PanelLogo.Update()
    End Sub

    Private Sub PanelLogo_MouseLeave(ByVal sender As Object, ByVal e As System.EventArgs) Handles PanelLogo.MouseLeave
        'Set the control panel logo to the normal image
        PanelLogo.Image = New Bitmap([Assembly].GetExecutingAssembly().GetManifestResourceStream("DonkeyNET.PanelLogo.bmp"))
        PanelLogo.Update()
    End Sub

    Private Sub PanelLogo_MouseDown(ByVal sender As Object, ByVal e As System.Windows.Forms.MouseEventArgs) Handles PanelLogo.MouseDown
        'Toggle whether the control panel is opened or closed
        If Not ControlPanelExtended Then
            OpenPanel()
        Else
            ClosePanel()
        End If
    End Sub

    Private Sub ButtonMouseEnter(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles PreviousPage.MouseEnter, NextPage.MouseEnter, ItemPicture1.MouseEnter, ItemPicture2.MouseEnter
        'Highlight the button
        Dim b As Button = CType(sender, Button)
        b.ForeColor = Color.Yellow
    End Sub

    Private Sub Button_MouseLeave(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles PreviousPage.MouseLeave, NextPage.MouseLeave, ItemPicture1.MouseLeave, ItemPicture2.MouseLeave
        'Don't highlight the button
        Dim b As Button = CType(sender, Button)
        b.ForeColor = Color.White
    End Sub

    Private Sub Button_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles PreviousPage.Click, NextPage.Click, ItemPicture1.Click, ItemPicture2.Click
        Dim b As Button = CType(sender, Button)
        'Change page or select model, depending on the button pressed
        If b Is PreviousPage Then
            CurrentPage -= 1
            DisplayObstacles()
        ElseIf b Is NextPage Then
            CurrentPage += 1
            DisplayObstacles()
        ElseIf b Is ItemPicture1 Then
            SwapModel((CurrentPage - 1) * PageSize)
            ClosePanel()
        ElseIf b Is ItemPicture2 Then
            SwapModel((CurrentPage - 1) * PageSize + 1)
            ClosePanel()
        End If
    End Sub

    Private Sub OpenPanel()
        Dim i As Integer

        'Slide the control panel out
        For i = xMin To xMax
            Me.Left = i
        Next
        Me.Update()

        'Load the list of obstacles
        CurrentPage = 1
        Try
            Dim ws As New DonkeyWeb.ModelService()
            If ws.Url = "" Then 'Use local model directory
                ObstacleList = ModelLoader.Browse()
            Else 'Use web service if URL is set in configuration file
                ObstacleList = ws.Browse()
            End If
        Catch
        Finally
            If ObstacleList Is Nothing Then
                ObstacleList = ModelLoader.Browse
            End If
        End Try

        DisplayObstacles()

        'Show the contols
        Loading.Visible = False
        ItemPanel.Visible = True

        ControlPanelExtended = True
    End Sub

    Private Sub ClosePanel()
        Dim i As Integer

        ControlPanelExtended = False

        'Slide the control panel in
        For i = xMax To xMin Step -1
            Me.Left = i
        Next
        'Rehide the controls
        ItemPanel.Visible = False
        Loading.Visible = True
    End Sub

    Private Sub DisplayObstacles()
        'Determine item numbers of displayed obstacles
        Dim Index1 As Integer = (CurrentPage - 1) * PageSize
        Dim Index2 As Integer = (CurrentPage - 1) * PageSize + 1

        'Show the first obstacle if present
        If ObstacleList.Length > Index1 Then
            ItemPicture1.Visible = True
            If ObstacleList(Index1).Thumbnail Is Nothing Then
                ItemPicture1.Image = New Bitmap(Image.FromStream([Assembly].GetExecutingAssembly().GetManifestResourceStream("DonkeyNET.DefaultThumbnail.bmp")), ItemPicture1.Size)
            Else
                ItemPicture1.Image = New Bitmap(Image.FromStream(New MemoryStream(ObstacleList(Index1).Thumbnail)), ItemPicture1.Size)
            End If
            ItemLabel1.Text = ObstacleList(Index1).Name
        Else
            ItemPicture1.Visible = False
            ItemPicture1.Image = Nothing
            ItemLabel1.Text = ""
        End If

        'Show the second obstacle if present
        If ObstacleList.Length > Index2 Then
            ItemPicture2.Visible = True
            If ObstacleList(Index2).Thumbnail Is Nothing Then
                ItemPicture2.Image = New Bitmap(Image.FromStream([Assembly].GetExecutingAssembly().GetManifestResourceStream("DonkeyNET.DefaultThumbnail.bmp")), ItemPicture2.Size)
            Else
                ItemPicture2.Image = New Bitmap(Image.FromStream(New MemoryStream(ObstacleList(Index2).Thumbnail)), ItemPicture2.Size)
            End If
            ItemLabel2.Text = ObstacleList(Index2).Name
        Else
            ItemPicture2.Visible = False
            ItemPicture2.Image = Nothing
            ItemLabel2.Text = ""
        End If

        'Determine whether to show the Previous button
        If CurrentPage > 1 Then
            PreviousPage.Visible = True
        Else
            PreviousPage.Visible = False
        End If

        'Determine whether to show the Next button
        If ObstacleList.Length > CurrentPage * PageSize Then
            NextPage.Visible = True
        Else
            NextPage.Visible = False
        End If
    End Sub

    Private Sub SwapModel(ByVal ModelIndex As Integer)
        'Download obstacle files
        Dim ws As New DonkeyWeb.ModelService()
        Dim Obstacle As DonkeyWeb.Obstacle
        If ws.Url = "" Then 'Use local model directory
            Obstacle = ModelLoader.Load(ObstacleList(ModelIndex).Name)
        Else 'Use web service if URL is set in configuration file
            Obstacle = ws.Download(ObstacleList(ModelIndex).Name)
        End If

        'Make sure that multiple threads aren't accessing a file at the same time
        SyncLock GetType(Viewer) 'Serialize access to the shared Download files

            'Save the model to disk
            Dim ModelStream As FileStream = File.Create(Application.StartupPath & "\..\media\" & DownloadModel)
            Try
                ModelStream.Write(Obstacle.Model, 0, Obstacle.Model.Length)
            Finally 'Make sure that file stream is closed even if error occurs
                ModelStream.Close()
            End Try

            'Save the scream to disk
            Dim ScreamStream As FileStream = File.Create(Application.StartupPath & "\..\media\" & DownloadScream)
            Try
                If Obstacle.Scream Is Nothing Then
                    Dim TempStream As Stream = [Assembly].GetExecutingAssembly().GetManifestResourceStream("DonkeyNET.DefaultScream.wav")
                    Dim Buffer(TempStream.Length - 1) As Byte
                    TempStream.Read(Buffer, 0, TempStream.Length - 1)
                    ScreamStream.Write(Buffer, 0, Buffer.Length)
                Else
                    ScreamStream.Write(Obstacle.Scream, 0, Obstacle.Scream.Length)
                End If
            Finally 'Make sure that file stream is closed even if error occurs
                ScreamStream.Close()
            End Try
        End SyncLock

        'Tell rendering thread to swap out donkeys
        SwapDonkeys = True
    End Sub

End Class
