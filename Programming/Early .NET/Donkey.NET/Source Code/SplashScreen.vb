Public Class SplashScreen
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
    Friend WithEvents LoadingTimer As System.Windows.Forms.Timer
    Friend WithEvents SplashPanel As System.Windows.Forms.Panel
    Friend WithEvents DonkeyPicture As System.Windows.Forms.PictureBox
    Friend WithEvents Copyright As System.Windows.Forms.Label
    Friend WithEvents Disclaimer As System.Windows.Forms.Label
    Friend WithEvents DonkeyLogo As System.Windows.Forms.PictureBox
    Friend WithEvents Revolution3DLogo As System.Windows.Forms.PictureBox
    Friend WithEvents PoweredBy As System.Windows.Forms.Label
    Friend WithEvents VisualBasicLogo As System.Windows.Forms.PictureBox
    Friend WithEvents Loading As System.Windows.Forms.Label
    Private components As System.ComponentModel.IContainer

    'Required by the Windows Form Designer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()> Private Sub InitializeComponent()
        Me.components = New System.ComponentModel.Container()
        Dim resources As System.Resources.ResourceManager = New System.Resources.ResourceManager(GetType(SplashScreen))
        Me.VisualBasicLogo = New System.Windows.Forms.PictureBox()
        Me.DonkeyLogo = New System.Windows.Forms.PictureBox()
        Me.LoadingTimer = New System.Windows.Forms.Timer(Me.components)
        Me.DonkeyPicture = New System.Windows.Forms.PictureBox()
        Me.Revolution3DLogo = New System.Windows.Forms.PictureBox()
        Me.Disclaimer = New System.Windows.Forms.Label()
        Me.Copyright = New System.Windows.Forms.Label()
        Me.SplashPanel = New System.Windows.Forms.Panel()
        Me.Loading = New System.Windows.Forms.Label()
        Me.PoweredBy = New System.Windows.Forms.Label()
        Me.SplashPanel.SuspendLayout()
        Me.SuspendLayout()
        '
        'VisualBasicLogo
        '
        Me.VisualBasicLogo.Image = CType(resources.GetObject("VisualBasicLogo.Image"), System.Drawing.Bitmap)
        Me.VisualBasicLogo.Location = New System.Drawing.Point(472, 264)
        Me.VisualBasicLogo.Name = "VisualBasicLogo"
        Me.VisualBasicLogo.Size = New System.Drawing.Size(184, 32)
        Me.VisualBasicLogo.TabIndex = 1
        Me.VisualBasicLogo.TabStop = False
        '
        'DonkeyLogo
        '
        Me.DonkeyLogo.Image = CType(resources.GetObject("DonkeyLogo.Image"), System.Drawing.Bitmap)
        Me.DonkeyLogo.Location = New System.Drawing.Point(400, 104)
        Me.DonkeyLogo.Name = "DonkeyLogo"
        Me.DonkeyLogo.Size = New System.Drawing.Size(328, 128)
        Me.DonkeyLogo.TabIndex = 0
        Me.DonkeyLogo.TabStop = False
        '
        'LoadingTimer
        '
        Me.LoadingTimer.Interval = 500
        '
        'DonkeyPicture
        '
        Me.DonkeyPicture.Image = CType(resources.GetObject("DonkeyPicture.Image"), System.Drawing.Bitmap)
        Me.DonkeyPicture.Location = New System.Drawing.Point(64, 104)
        Me.DonkeyPicture.Name = "DonkeyPicture"
        Me.DonkeyPicture.Size = New System.Drawing.Size(288, 288)
        Me.DonkeyPicture.TabIndex = 0
        Me.DonkeyPicture.TabStop = False
        '
        'Revolution3DLogo
        '
        Me.Revolution3DLogo.Image = CType(resources.GetObject("Revolution3DLogo.Image"), System.Drawing.Bitmap)
        Me.Revolution3DLogo.Location = New System.Drawing.Point(496, 296)
        Me.Revolution3DLogo.Name = "Revolution3DLogo"
        Me.Revolution3DLogo.Size = New System.Drawing.Size(136, 24)
        Me.Revolution3DLogo.TabIndex = 3
        Me.Revolution3DLogo.TabStop = False
        '
        'Disclaimer
        '
        Me.Disclaimer.Font = New System.Drawing.Font("Arial", 12!, (System.Drawing.FontStyle.Bold Or System.Drawing.FontStyle.Italic), System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.Disclaimer.ForeColor = System.Drawing.Color.Red
        Me.Disclaimer.Location = New System.Drawing.Point(104, 432)
        Me.Disclaimer.Name = "Disclaimer"
        Me.Disclaimer.Size = New System.Drawing.Size(584, 24)
        Me.Disclaimer.TabIndex = 5
        Me.Disclaimer.Text = "Disclaimer: Only one donkey was hurt during the making of this game"
        Me.Disclaimer.TextAlign = System.Drawing.ContentAlignment.MiddleCenter
        '
        'Copyright
        '
        Me.Copyright.Location = New System.Drawing.Point(408, 384)
        Me.Copyright.Name = "Copyright"
        Me.Copyright.Size = New System.Drawing.Size(312, 16)
        Me.Copyright.TabIndex = 4
        Me.Copyright.Text = "Copyright Microsoft Corporation 2001"
        Me.Copyright.TextAlign = System.Drawing.ContentAlignment.MiddleCenter
        '
        'SplashPanel
        '
        Me.SplashPanel.Anchor = System.Windows.Forms.AnchorStyles.None
        Me.SplashPanel.Controls.AddRange(New System.Windows.Forms.Control() {Me.Loading, Me.DonkeyPicture, Me.Copyright, Me.Disclaimer, Me.DonkeyLogo, Me.Revolution3DLogo, Me.PoweredBy, Me.VisualBasicLogo})
        Me.SplashPanel.Location = New System.Drawing.Point(-8, -26)
        Me.SplashPanel.Name = "SplashPanel"
        Me.SplashPanel.Size = New System.Drawing.Size(800, 600)
        Me.SplashPanel.TabIndex = 6
        '
        'Loading
        '
        Me.Loading.Location = New System.Drawing.Point(336, 488)
        Me.Loading.Name = "Loading"
        Me.Loading.Size = New System.Drawing.Size(344, 16)
        Me.Loading.TabIndex = 4
        Me.Loading.TextAlign = System.Drawing.ContentAlignment.MiddleLeft
        '
        'PoweredBy
        '
        Me.PoweredBy.Location = New System.Drawing.Point(512, 240)
        Me.PoweredBy.Name = "PoweredBy"
        Me.PoweredBy.Size = New System.Drawing.Size(104, 24)
        Me.PoweredBy.TabIndex = 2
        Me.PoweredBy.Text = "Powered by:"
        Me.PoweredBy.TextAlign = System.Drawing.ContentAlignment.MiddleCenter
        '
        'SplashScreen
        '
        Me.AutoScaleBaseSize = New System.Drawing.Size(8, 19)
        Me.BackColor = System.Drawing.Color.White
        Me.ClientSize = New System.Drawing.Size(800, 600)
        Me.ControlBox = False
        Me.Controls.AddRange(New System.Windows.Forms.Control() {Me.SplashPanel})
        Me.Font = New System.Drawing.Font("Arial", 12!, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None
        Me.MaximizeBox = False
        Me.MinimizeBox = False
        Me.Name = "SplashScreen"
        Me.ShowInTaskbar = False
        Me.SizeGripStyle = System.Windows.Forms.SizeGripStyle.Hide
        Me.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen
        Me.Text = "Donkey.NET"
        Me.TopMost = True
        Me.WindowState = System.Windows.Forms.FormWindowState.Maximized
        Me.SplashPanel.ResumeLayout(False)
        Me.ResumeLayout(False)

    End Sub

#End Region

    '****************************************
    'Event handlers
    '****************************************

    Private Sub SplashScreen_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles MyBase.Load
        Me.Size = Me.MaximumSize
        Me.Show()
        Me.Update()

        'Flash the disclaimer
        Dim i, j As Integer
        For i = 1 To 3
            For j = 250 To 0 Step -10
                Disclaimer.ForeColor = Color.FromArgb(255, j, j)
                Disclaimer.Update()
                Threading.Thread.CurrentThread.Sleep(10)
            Next
            For j = 0 To 250 Step 10
                Disclaimer.ForeColor = Color.FromArgb(255, j, j)
                Disclaimer.Update()
                Threading.Thread.CurrentThread.Sleep(10)
            Next
        Next
        For j = 250 To 0 Step -10
            Disclaimer.ForeColor = Color.FromArgb(255, j, j)
            Disclaimer.Update()
            Threading.Thread.CurrentThread.Sleep(10)
        Next

        'Start the timer to increment the loading indicator
        LoadingTimer.Enabled = True
        Loading.Text = "Loading"
    End Sub

    Private Sub LoadingTimer_Tick(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles LoadingTimer.Tick
        Loading.Text &= "."
    End Sub

End Class
