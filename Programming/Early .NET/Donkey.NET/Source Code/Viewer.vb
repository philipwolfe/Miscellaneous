Public Class Viewer
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
    Friend WithEvents Dashboard As DonkeyNET.Dashboard

    'Required by the Windows Form Designer
    Private components As System.ComponentModel.Container

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()> Private Sub InitializeComponent()
        Me.Dashboard = New DonkeyNET.Dashboard()
        Me.SuspendLayout()
        '
        'Dashboard
        '
        Me.Dashboard.Location = New System.Drawing.Point(0, 450)
        Me.Dashboard.Name = "Dashboard"
        Me.Dashboard.Revs = 0
        Me.Dashboard.Size = New System.Drawing.Size(800, 150)
        Me.Dashboard.Speed = 0
        Me.Dashboard.SteeringWheelAngle = 0
        Me.Dashboard.TabIndex = 1
        Me.Dashboard.TabStop = False
        '
        'Viewer
        '
        Me.AutoScaleBaseSize = New System.Drawing.Size(5, 13)
        Me.ClientSize = New System.Drawing.Size(800, 600)
        Me.Controls.AddRange(New System.Windows.Forms.Control() {Me.Dashboard})
        Me.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None
        Me.Name = "Viewer"
        Me.SizeGripStyle = System.Windows.Forms.SizeGripStyle.Hide
        Me.StartPosition = System.Windows.Forms.FormStartPosition.Manual
        Me.Text = "Donkey.NET"
        Me.ResumeLayout(False)

    End Sub

#End Region

    '****************************************
    'Constants
    '****************************************

    'For joystick or steering wheel
    Private Const ZeroSteering As Single = 5000
    Private Const ZeroGas As Single = 10000
    Private Const ZeroBrake As Single = 10000
    Private Const FullLeftSteering As Single = 0
    Private Const FullRightSteering As Single = 10000
    Private Const FullGas As Single = 0
    Private Const FullBrake As Single = 0

    '****************************************
    'Internal variables
    '****************************************

    'For user interface
    Private SplashForm As SplashScreen
    Private ControlForm As ControlPanel
    Private SmallText As StdFont
    Private LargeText As StdFont
    Private LoopCount As Integer = 1

    'For control input
    Private Accelerate As Single
    Private Brake As Single
    Private Steer As Single
    Private ReviveKeyLast As Boolean = False
    Private ReviveButtonLast As Boolean = False

    'For game state
    Private Car As Car
    Private Running As Boolean = True
    Private DonkeysHit As Integer = 0
    Private MaxDonkeys As Integer = 0
    Private Donkeys() As Donkey
    Private DonkeyGroup As Integer = 0
    Private DonkeyHeight As Single = 0.5

    '****************************************
    'Event handlers
    '****************************************

    Private Sub Viewer_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles MyBase.Load
        'Set form position
        Me.Left = 15
        Me.Top = 50

        'Launch splash screen
        SplashForm = New SplashScreen()
		'SplashForm.Show()

        'Create control panel form and pass my position
        ControlForm = New ControlPanel(New Point(Me.Left + Me.Width, Me.Top + Me.Height))
        ControlForm.Show()

		'SplashForm.Hide()

        SplashForm = Nothing

        'Shape the viewer form to look like a windshield
        Dim GraphicsPath As New Drawing2D.GraphicsPath()
        Dim Points() As Point = {New Point(0, 300), New Point(1, 80), New Point(150, 55), New Point(400, 50), New Point(650, 55), New Point(799, 80), New Point(800, 300)}
        GraphicsPath.AddBeziers(Points)
        GraphicsPath.AddRectangle(New Rectangle(0, 300, 800, 300))
        Me.Region = New Region(GraphicsPath)

        'Start a separate thread to handle the 3D rendering
        Dim RenderThread As New Thread(AddressOf Render)
        RenderThread.Start()
    End Sub

    Private Sub Viewer_Closing(ByVal sender As Object, ByVal e As System.ComponentModel.CancelEventArgs) Handles MyBase.Closing
        Running = False
    End Sub

    Private Sub Viewer_Activated(ByVal sender As Object, ByVal e As System.EventArgs) Handles MyBase.Activated
        'ControlForm.BringToFront()
    End Sub

    '****************************************
    'Methods
    '****************************************

    Private Sub Render()
        'Initialize and load the 3D engine
        InitializeEngine()
        LoadTerrain()
        LoadSky()
        LoadDonkeys()
        LoadCar()
        LoadFonts()

        With Pipeline
            .Renderer_Clear()
            .Renderer_Render()
            .Renderer_Display()
        End With

        'Close the splash screen after initialization is complete
        PlayMusic()
        SplashForm.Close()
        SplashForm = Nothing
        Me.TopMost = True 'Comment this line out if you'd like to debug the application

        Do While Running
            GetControlInput()
            CheckDonkeySwap()
            MoveDonkeys()
            MoveCar()
            CheckCollisions()
            UpdateDashboard()

            Pipeline.Renderer_Clear()
            Pipeline.Renderer_Render()
            WriteText()
            Pipeline.Renderer_Display()
        Loop

        Engine.TerminateMe()
        Me.Close()
    End Sub

    Private Sub InitializeEngine()
        With Engine
            .Inf_SetFieldOfView(70)
            .Inf_SetViewDistance(500)
            .Inf_SetRenderTarget(Me.Handle.ToInt32, R3DRENDERTARGET.R3DRENDERTARGET_WINDOW)
            .Inf_ForceResolution(800, 600, 16)
            'If .InitializeMe(True) Then Me.Close()
        End With

		With Pipeline
			.SetAmbientLight(255, 255, 255)
			.SetBackColor(0, 0, 155)
			.SetDithering(True)
			.SetSpecular(True)
			.SetMipMapping(False)
			.SetFillMode(R3DFILLMODE.R3DFILLMODE_SOLID)
			.SetShadeMode(R3DSHADEMODE.R3DSHADEMODE_GOURAUD)
			.SetTextureFilter(R3DTEXTUREFILTER.R3DTEXTUREFILTER_LINEARFILTER)
			.SetFog(0, 50, 150, 50, 350)
		End With
    End Sub

    Private Sub LoadTerrain()
        TextureLib.Texture_Load("GroundTexture", Application.StartupPath & "\..\media\ground.bmp")
        PolyVox.Terrain_Generate("GroundTerrain", Application.StartupPath & "\..\media\height.jpg", "GroundTexture", "GroundMaterial", POLYVOXDETAIL.POLYVOXDETAIL_AVERANGE, 500, True, 0, 0)
    End Sub

    Private Sub LoadSky()
        With TextureLib
            .Texture_Load("SkyLeft", Application.StartupPath & "\..\media\left.bmp")
            .Texture_Load("SkyRight", Application.StartupPath & "\..\media\right.bmp")
            .Texture_Load("SkyFront", Application.StartupPath & "\..\media\front.bmp")
            .Texture_Load("SkyBack", Application.StartupPath & "\..\media\back.bmp")
            .Texture_Load("SkyUp", Application.StartupPath & "\..\media\up.bmp")
            .Texture_Load("SkyDown", Application.StartupPath & "\..\media\down.bmp")
        End With

        SkyDome.Cube_Create("SkyLeft", "SkyRight", "SkyFront", "SkyBack", "SkyUp", "SkyDown", 256, "SkyMaterial")
    End Sub

    Private Sub LoadDonkeys()
        Dim i As Integer

        Sound.Sound_Load(DonkeyGroup & "Scream", Application.StartupPath & "\..\media\scream.wav", R3D3DSOUNDPARAM.R3D3DSOUNDPARAM_NO)

        For i = 0 To 2
            ReDim Preserve Donkeys(i)
            With Donkeys(i)
                .Name = "DonkeyMDL" & i
                .Frame = 0
                .Dead = False
                'Set initial positions for donkeys
                Select Case i Mod 3
                    Case 0
                        .Position = New Value3D(194, 0, 311)
                        .Rotation = New Value3D(0, 25, 0)
                    Case 1
                        .Position = New Value3D(129, 0, 191)
                        .Rotation = New Value3D(0, 55, 0)
                    Case 2
                        .Position = New Value3D(220, 0, 155)
                        .Rotation = New Value3D(0, 235, 0)
                End Select
            End With
            With MDLSystem
                .MDL_Load(DonkeyGroup & Donkeys(i).Name, Application.StartupPath & "\..\media\donkey.mdl")
                .MDL_SetPointer(DonkeyGroup & Donkeys(i).Name)
                .MDL_SetScale(0.1, 0.1, 0.1)
                .MDL_SetPosition(Donkeys(i).Position.x, Donkeys(i).Position.y, Donkeys(i).Position.z)
                .MDL_SetRotation(Donkeys(i).Rotation.x, Donkeys(i).Rotation.y, Donkeys(i).Rotation.z)
            End With
        Next

        MaxDonkeys = UBound(Donkeys)
    End Sub

    Private Sub LoadCar()
        With Sound
            .Sound_Load("Rev", Application.StartupPath & "\..\media\rev.wav", R3D3DSOUNDPARAM.R3D3DSOUNDPARAM_NO)
            .Sound_Load("Skid", Application.StartupPath & "\..\media\skid.wav", R3D3DSOUNDPARAM.R3D3DSOUNDPARAM_NO)
            .Sound_Load("Smack", Application.StartupPath & "\..\media\smack.wav", R3D3DSOUNDPARAM.R3D3DSOUNDPARAM_NO)
            .Sound_Load("Runover", Application.StartupPath & "\..\media\runover.wav", R3D3DSOUNDPARAM.R3D3DSOUNDPARAM_NO)
        End With

        Camera.SetCoordinateSystem(R3DCOORDINATESYSTEM.R3DCOORDINATESYSTEM_WORLD)

        'Set initial position and rotation
        Car = New Car(266, 304, 275)
    End Sub

    Private Sub PlayMusic()
        With Sound
            .Sound_Load("Background", Application.StartupPath & "\..\media\background.wav", R3D3DSOUNDPARAM.R3D3DSOUNDPARAM_NO)
            .Sound_SetPointer("Background")
            .Sound_SetVolume(95)
            .Sound_Play(False)
        End With
    End Sub

    Private Sub LoadFonts()
        'Set properties for small font
        Dim SmallFont As New StdFont()
        With SmallFont
            .Name = "Arial"
            .Size = 8
        End With
        SmallText = SmallFont

        'Set properties for large font
        Dim LargeFont As New StdFont()
        With LargeFont
            .Name = "Arial"
            .Size = 24
            .Bold = True
        End With
        LargeText = LargeFont
    End Sub

    Private Sub GetControlInput()
        Dim i As Integer

        Accelerate = 0
        Brake = 0
        Steer = 0

        With Control
            'Get keyboard input
            .Keyboard_ReceiveKeys()

            'ESC will exit the game
            If .Keyboard_GetKeyState(R3DKey.R3DKEY_ESCAPE) Then
                Running = False
            End If

            'Up arrow to accelerate
            If .Keyboard_GetKeyState(R3DKey.R3DKEY_UP) Then
                Accelerate = Car.MaxAcceleration
            End If

            'Down arrow to brake
            If .Keyboard_GetKeyState(R3DKey.R3DKEY_DOWN) Then
                Brake = Car.MaxBraking
            End If

            'Left and right arrows to steer
            If .Keyboard_GetKeyState(R3DKey.R3DKEY_LEFT) Then
                Steer = Car.MaxSteering * -0.5
            End If
            If .Keyboard_GetKeyState(R3DKey.R3DKEY_RIGHT) Then
                Steer = Car.MaxSteering * 0.5
            End If

            'Revive donkeys
            If .Keyboard_GetKeyState(R3DKey.R3DKEY_R) Then
                If Not ReviveKeyLast Then
                    For i = 0 To MaxDonkeys
                        Donkeys(i).Dead = False
                    Next
                End If
                ReviveKeyLast = True
            Else
                ReviveKeyLast = False
            End If

            'Get joystick input
            Dim jX, jY, jZ As Long
            Dim jrX, jrY, jrZ As Long
            Dim jSlider0, jSlider1 As Long
            Dim jButtons() As Byte

            Try
                If .Joystick_GetState(jX, jY, jZ, jrX, jrY, jrZ, jSlider0, jSlider1, jButtons) = 1 Then
                    If jX = 0 And jY = 0 And jZ = 0 And jrX = 0 And jrY = 0 And jrZ = 0 And jSlider0 = 0 And jSlider1 = 0 Then
                        Debug.WriteLine("Control.Joystick_GetState returned bad data")
                        Exit Try
                    End If

                    'Button keys for SideWinder steering wheel:
                    'Right buttons from top to bottom -> 0,1,2
                    'Left buttons from top to bottom -> 3,4,5
                    'Left rear paddle -> 6
                    'Right rear paddle -> 7

                    'Revive donkeys
                    If jButtons(3) <> 0 Then
                        If Not ReviveButtonLast Then
                            For i = 0 To MaxDonkeys
                                Donkeys(i).Dead = False
                            Next
                        End If
                        ReviveButtonLast = True
                    Else
                        ReviveButtonLast = False
                    End If

                    'Apply steering wheel and pedal inputs
                    If (jX >= FullLeftSteering) And (jX <= FullRightSteering) Then
                        Steer = (jX - ZeroSteering) / ZeroSteering * Car.MaxSteering
                    End If
                    If (jY >= FullGas) And (jY <= ZeroGas) Then
                        Accelerate = ((ZeroGas - jY) / ZeroGas) * Car.MaxAcceleration
                    End If
                    If (jrZ >= FullBrake) And (jrZ <= ZeroBrake) Then
                        Brake = (ZeroBrake - jrZ) / ZeroBrake * Car.MaxBraking
                    End If
                Else
                    Debug.WriteLine("Joystick not found")
                End If
            Catch ex As Exception
                'If error occurs while reading from joystick, log error and continue on
                Debug.WriteLine(ex.Message)
            End Try
        End With
    End Sub

    Private Sub CheckDonkeySwap()
        Dim i As Integer

        If SwapDonkeys Then
            SwapDonkeys = False

            With MDLSystem
                'Deactivate the old MDLs
                For i = 0 To MaxDonkeys
                    .MDL_SetPointer(DonkeyGroup & Donkeys(i).Name)
                    .MDL_Activate(False)
                Next

                'Remove the old scream sounds
                Sound.Sound_SetPointer(DonkeyGroup & "Scream")
                Sound.Sound_Delete()

                'Change to the next donkey group
                DonkeyGroup += 1
                DonkeyHeight = 5.5

                'Make sure that multiple threads aren't accessing a file at the same time
                SyncLock GetType(Viewer) 'Serialize access to the shared Download files

                    'Load the new MDLs
                    For i = 0 To MaxDonkeys
                        .MDL_Load(DonkeyGroup & Donkeys(i).Name, Application.StartupPath & "\..\media\" & DownloadModel)
                        .MDL_SetPointer(DonkeyGroup & Donkeys(i).Name)
                        .MDL_SetScale(0.15, 0.15, 0.15)
                        .MDL_SetPosition(Donkeys(i).Position.x, Donkeys(i).Position.y, Donkeys(i).Position.z)
                        .MDL_SetRotation(Donkeys(i).Rotation.x, Donkeys(i).Rotation.y, Donkeys(i).Rotation.z)
                    Next

                    'Load the new sound
                    Sound.Sound_Load(DonkeyGroup & "Scream", Application.StartupPath & "\..\media\" & DownloadScream, R3D3DSOUNDPARAM.R3D3DSOUNDPARAM_NO)

                End SyncLock
            End With
        End If
    End Sub

    Private Sub MoveDonkeys()
        Dim i As Integer
        Dim FrameIncrement As Single = Tools.Val2ProcPower(0.5)

        With MDLSystem
            For i = 0 To MaxDonkeys
                .MDL_SetPointer(DonkeyGroup & Donkeys(i).Name)

                'Advance the animation sequence
                Donkeys(i).Frame += FrameIncrement

                If Donkeys(i).Dead Then
                    Select Case i Mod 3
                        Case 0
                            .MDL_SequenceSet("headshot")
                        Case 1
                            .MDL_SequenceSet("die_backwards")
                        Case 2
                            .MDL_SequenceSet("die_spin")
                    End Select

                    'Stop the animation sequence if past the end
                    If Donkeys(i).Frame >= .MDL_SequenceGetFrameCount - 1 Then
                        Donkeys(i).Frame = .MDL_SequenceGetFrameCount - 1
                    Else
                        .MDL_MoveZ(Tools.Val2ProcPower(-1), True)
                        .MDL_GetPosition(Donkeys(i).Position.x, Donkeys(i).Position.y, Donkeys(i).Position.z)
                    End If
                Else 'If the donkey is alive
                    Select Case i Mod 3
                        Case 0
                            .MDL_SequenceSet("look_idle")
                        Case 1
                            .MDL_SequenceSet("jump")
                            .MDL_RotateY(Tools.Val2ProcPower(1))
                        Case 2
                            .MDL_SequenceSet("run2")
                            .MDL_MoveZ(Tools.Val2ProcPower(0.25), True)
                            .MDL_RotateY(Tools.Val2ProcPower(1))
                    End Select

                    .MDL_GetPosition(Donkeys(i).Position.x, Donkeys(i).Position.y, Donkeys(i).Position.z)
                    .MDL_GetRotation(Donkeys(i).Rotation.x, Donkeys(i).Rotation.y, Donkeys(i).Rotation.z)

                    'Reset animation sequence if past the end
                    If Donkeys(i).Frame >= .MDL_SequenceGetFrameCount - 1 Then
                        Donkeys(i).Frame = 0
                    End If
                End If

                'Update position and animation frame of donkey
                .MDL_SequenceSetFrame(Donkeys(i).Frame)
                Donkeys(i).Position.y = PolyVox.Terrain_GetAltitude(Donkeys(i).Position.x, Donkeys(i).Position.z) + DonkeyHeight
                .MDL_SetPosition(Donkeys(i).Position.x, Donkeys(i).Position.y, Donkeys(i).Position.z)
            Next
        End With
    End Sub

    Private Sub MoveCar()
        'Call Car class to calculate physics
        Car.Move(Accelerate, Brake, Steer)
        Camera.SetPosition(Car.Position.x, Car.Position.y + Car.DriverEyeHeight, Car.Position.z)
        Camera.SetRotation(Car.Rotation.x, Car.Rotation.y, Car.Rotation.z)
    End Sub

    Private Sub CheckCollisions()
        Dim i As Integer

        With Sound
            For i = 0 To MaxDonkeys
                'If the car comes close to a live donkey
                If Not Donkeys(i).Dead AndAlso Math.CalculateDistance2D(Car.Position.x, Car.Position.z, Donkeys(i).Position.x, Donkeys(i).Position.z) < 30 Then
                    .Sound_SetPointer(DonkeyGroup & "Scream")
                    .Sound_SetVolume(100)
                    .Sound_Play(True)
                End If

                'If the car hits a donkey
                If Math.CalculateDistance2D(Car.Position.x, Car.Position.z, Donkeys(i).Position.x, Donkeys(i).Position.z) < 7 Then
                    If Donkeys(i).Dead Then
                        .Sound_SetPointer("Runover")
                        .Sound_SetVolume(100)
                        .Sound_Play(True)
                    Else 'If the donkey was alive
                        .Sound_SetPointer("Smack")
                        .Sound_SetVolume(100)
                        .Sound_Play(True)

                        DonkeysHit += 1
                        Donkeys(i).Frame = 0
                        Donkeys(i).Dead = True
                        Donkeys(i).Rotation.y = (Car.Rotation.y + 180) Mod 360

                        MDLSystem.MDL_SetPointer(DonkeyGroup & Donkeys(i).Name)
                        MDLSystem.MDL_SetRotation(Donkeys(i).Rotation.x, Donkeys(i).Rotation.y, Donkeys(i).Rotation.z)
                    End If
                End If
            Next
        End With
    End Sub

    Private Sub UpdateDashboard()
        'Only refresh the dashboard control once every three frames
        If LoopCount = 3 Then
            With Dashboard
                .SteeringWheelAngle = Car.SteeringWheel * 15
                .Speed = Car.Speedometer
                .Revs = Car.Tachometer
                LoopCount = 1
            End With
        End If
        LoopCount += 1
    End Sub

    Private Sub WriteText()
        With Interface2D
            'Write out debugging information
#If DEBUG Then
            .Primitive_SetFont(SmallText)
            .Primitive_SetDrawColor(255, 255, 255)
            .Primitive_DrawText(200, 100, "FpS:" & Trim(Str(FPS.GetFrameTime)))
            .Primitive_DrawText(200, 115, "Position:" & Car.Position.x & "," & Car.Position.y & "," & Car.Position.z)
            .Primitive_DrawText(200, 130, "Rotation:" & Car.Rotation.x & "," & Car.Rotation.y & "," & Car.Rotation.z)
            Dim HSlope, VSlope As Single
            PolyVox.Terrain_GetSlope(Car.Position.x, Car.Position.z, HSlope, VSlope, True)
            .Primitive_DrawText(200, 145, "Slope:" & HSlope & "," & VSlope)
            .Primitive_DrawText(200, 160, "Speedometer:" & Car.Speedometer)
            .Primitive_DrawText(200, 175, "Tachometer:" & Car.Tachometer & " Gear:" & (Car.CurrentGear + 1))
            .Primitive_DrawText(200, 190, "Steering Wheel:" & Car.SteeringWheel)
#End If

            'Write out hit count
            .Primitive_SetFont(LargeText)
            .Primitive_SetDrawColor(255, 255, 255)
            .Primitive_DrawText(340, 60, "Hits:")
            .Primitive_DrawText(420, 60, DonkeysHit)
        End With
    End Sub

    '****************************************
    'Structures
    '****************************************
    Private Structure Donkey
        Public Name As String
        Public Position As Value3D
        Public Rotation As Value3D
        Public Frame As Single
        Public Dead As Boolean
    End Structure
End Class
