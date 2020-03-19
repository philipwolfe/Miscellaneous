Friend Class Car

    '****************************************
    'Constants
    '****************************************

    'For car physics
    Public Const MaxSteering As Single = 5
    Public Const MaxAcceleration As Single = 0.0015
    Public Const MaxBraking As Single = 0.01
    Public Const MaxSpeedometer As Integer = 180
    Public Const MaxTachometer As Integer = 8000
    Public Const DriverEyeHeight As Single = 4

    Protected Const MaxSpeed As Single = 1
    Protected Const RotationalInertia As Single = 0.05
    Protected Const Gravity As Single = 0.015
    Protected Const SpeedFriction As Single = 0.002
    Protected Const RoadHandling As Single = 5
    Protected Const SlippingRoadHandling As Single = RoadHandling * 0.75
    Protected Const SlippingFriction As Single = 0.75
    Protected Const IdleRevolutions As Single = 1000
    Protected Const MaxRevolutions As Single = 7000
    Protected Const NumberOfGears As Integer = 5

    '****************************************
    'Internal variables
    '****************************************

    'For car state
    Protected mPosition As New Value3D(0, 0, 0)
    Protected mRotation As New Value3D(0, 0, 0)
    Protected mMomentum As Single = 0
    Protected mSpeed As Single = 0
    Protected mRevolutions As Single = 0
    Protected mSteering As Single = 0
    Protected mSkidding As Boolean = False
    Protected mCurrentGear As Integer = 0

    'For car physics
    Protected GearData() As GearSpec = { _
            New GearSpec(0, 0.25 * MaxSpeed), _
            New GearSpec(0.25 * MaxSpeed - (0.1 * MaxSpeed), 0.5 * MaxSpeed), _
            New GearSpec(0.5 * MaxSpeed - (0.1 * MaxSpeed), 0.7 * MaxSpeed), _
            New GearSpec(0.7 * MaxSpeed - (0.1 * MaxSpeed), 0.85 * MaxSpeed), _
            New GearSpec(0.85 * MaxSpeed - (0.1 * MaxSpeed), 1 * MaxSpeed)}

    '****************************************
    'Constructors
    '****************************************

    Public Sub New()
        MyBase.New()
        Me.SetPosition(0, 0)
    End Sub

    Public Sub New(ByVal x As Single, ByVal z As Single)
        MyBase.New()
        Me.SetPosition(x, z)
    End Sub

    Public Sub New(ByVal x As Single, ByVal z As Single, ByVal Direction As Single)
        MyBase.New()
        Me.SetPosition(x, z)
        Me.SetRotation(Direction)
    End Sub

    '****************************************
    'Properties
    '****************************************

    'Position
    Public ReadOnly Property Position() As Value3D
        Get
            Return Me.mPosition
        End Get
    End Property

    Protected Sub SetPosition(ByVal x As Single, ByVal z As Single)
        'Set position on x-z plane
        Me.mPosition.x = x
        Me.mPosition.z = z

        'Reset height to terrain height
        Me.mPosition.y = PolyVox.Terrain_GetAltitude(x, z)

        'Reset car x & z rotation based on new position
        Me.SetRotation(Me.Rotation.y)
    End Sub

    'Rotation
    Public ReadOnly Property Rotation() As Value3D
        Get
            Return Me.mRotation
        End Get
    End Property

    Protected Sub SetRotation(ByVal y As Single)
        'Save old rotation
        Dim OldRotation As Value3D = Me.mRotation

        'Set new y rotation
        Me.mRotation.y = y Mod 360

        'Get horizontal and vertical terrain slopes
        Dim HSlope, VSlope As Single
        PolyVox.Terrain_GetSlope(Me.Position.x, Me.Position.z, HSlope, VSlope)

        'Reset x & z rotation based on new y rotation
        Me.mRotation.x = -VSlope * Cos(DegToRad(Me.mRotation.y)) - HSlope * Sin(DegToRad(Me.mRotation.y))
        Me.mRotation.z = HSlope * Cos(DegToRad(Me.mRotation.y)) - VSlope * Sin(DegToRad(Me.mRotation.y))

        'Dampen the car rotation to the terrain
        Dim Inertia As Single = Tools.Val2ProcPower(RotationalInertia)
        If Inertia < 1 Then
            Me.mRotation.x = OldRotation.x + (Me.mRotation.x - OldRotation.x) * Inertia
            Me.mRotation.z = OldRotation.z + (Me.mRotation.z - OldRotation.z) * Inertia
        End If
    End Sub

    'Momentum direction
    Protected Property Momentum() As Single
        Get
            Return Me.mMomentum
        End Get

        Set(ByVal Value As Single)
            Me.mMomentum = Value Mod 360
        End Set
    End Property

    'Speed (not in mph)
    Protected Property Speed() As Single
        Get
            Return Me.mSpeed
        End Get

        Set(ByVal Value As Single)
            'Put limits on speed
            If Value > MaxSpeed Then
                Me.mSpeed = MaxSpeed
            ElseIf Value < 0 Then
                Me.mSpeed = 0
            Else
                Me.mSpeed = Value
            End If
        End Set
    End Property

    'Engine RPM
    Protected ReadOnly Property Revolutions() As Single
        Get
            Return Me.mRevolutions
        End Get
    End Property

    'Speed (in mph)
    Public ReadOnly Property Speedometer() As Single
        Get
            Return (Me.mSpeed / MaxSpeed) * MaxSpeedometer
        End Get
    End Property

    'Engine RPM
    Public ReadOnly Property Tachometer() As Single
        Get
            Return Me.mRevolutions
        End Get
    End Property

    'Steering wheel position
    Public ReadOnly Property SteeringWheel() As Single
        Get
            Return Me.mSteering
        End Get
    End Property

    'Transmission gear
    Public ReadOnly Property CurrentGear() As Single
        Get
            Return Me.mCurrentGear
        End Get
    End Property

    Protected Sub ShiftUp()
        If mCurrentGear < NumberOfGears - 1 Then
            mCurrentGear += 1
        End If
    End Sub

    Protected Sub ShiftDown()
        If mCurrentGear > 0 Then
            mCurrentGear -= 1
        End If
    End Sub

    '****************************************
    'Methods
    '****************************************

    Public Sub Move(ByVal Accelerate As Single, ByVal Brake As Single, ByVal Steer As Single)
        'Save old position
        Dim OldPosition As Value3D = Me.Position

        'Set steering wheel position
        Me.mSteering = Steer

        'Apply driver input to car
        Dim Skid As Boolean = False
        Skid = Me.AccelerateCar(Accelerate)
        Skid = Me.BrakeCar(Brake) Or Skid
        Skid = Me.SteerCar(Steer) Or Skid

        'Set whether car is skidding
        Me.mSkidding = Skid

        'Change the position of the car
        Me.SetPosition(Me.Position.x + Sin(DegToRad(Me.Momentum)) * Me.Speed * Tools.Val2ProcPower(0.5), _
                Me.Position.z + Cos(DegToRad(Me.Momentum)) * Me.Speed * Tools.Val2ProcPower(0.5))

        'Adjust speed for gravity and friction
        Me.Speed -= Gravity * (Me.Position.y - OldPosition.y)
        Me.Speed -= SpeedFriction * (Me.Speed / MaxSpeed)

        With Sound
            'Start or stop skidding sound
            .Sound_SetPointer("Skid")
            If Me.mSkidding Then
                .Sound_SetVolume(((Me.Speed / MaxSpeed) * 10) + 90)
                .Sound_Play(False)
            Else
                .Sound_Stop()
            End If

            'Adjust rev'ing sound
            .Sound_SetPointer("Rev")
            .Sound_SetVolume(((Me.Revolutions / MaxRevolutions) * 5) + 95)
            .Sound_SetFrequency(((Me.Revolutions / MaxRevolutions) * 10) + 10)
            .Sound_Play(False)
        End With
    End Sub

    Protected Function AccelerateCar(ByVal Amount As Single) As Boolean
        'Add to speed, limiting by the current gear specs
        If (Me.Speed < Me.MaxAllowedSpeed(Amount)) Then
            Me.Speed += Tools.Val2ProcPower(Amount)
        End If

        'Get specs for current gear
        Dim Gear As GearSpec = GearData(Me.CurrentGear)

        'Return revs for gear and speed
        Me.mRevolutions = IdleRevolutions + ((Speed - Gear.LowerBoundSpeed) / (Gear.UpperBoundSpeed - Gear.LowerBoundSpeed) * (MaxRevolutions - IdleRevolutions))

        'Automatically shift depending on speed and acceleration
        If Me.mRevolutions >= 7 / 8 * MaxRevolutions Then Me.ShiftUp()
        If Me.mRevolutions <= IdleRevolutions Then Me.ShiftDown()
        If (Me.mRevolutions <= IdleRevolutions * 2) And (Amount / MaxAcceleration >= 0.75) Then Me.ShiftDown()

        'UNDONE: No skidding caused by acceleration
        Return False
    End Function

    Protected Function BrakeCar(ByVal Amount As Single) As Boolean
        'Remove from speed
        Me.Speed -= Tools.Val2ProcPower(Amount)

        'UNDONE: No skidding caused by braking, a.k.a. anti-lock brakes
        Return False
    End Function

    Protected Function SteerCar(ByVal Amount As Single) As Boolean
        'Rotate the car's direction
        Me.SetRotation(Me.Rotation.y + (Tools.Val2ProcPower(Amount) * Me.Speed))

        'Adjust car handling if slipping already
        Dim Handling As Single
        If Me.mSkidding Then
            Handling = SlippingRoadHandling
        Else
            Handling = RoadHandling
        End If

        'Calculate relative rotation
        Dim TurnAngle As Single = Me.Rotation.y - Me.Momentum
        Dim TurnDirection As Integer
        If TurnAngle > 180 Then
            TurnDirection = -1
            TurnAngle = 360 - TurnAngle
        ElseIf TurnAngle < -180 Then
            TurnDirection = +1
            TurnAngle = 360 + TurnAngle
        Else
            TurnDirection = Sign(TurnAngle)
            TurnAngle = Abs(TurnAngle)
        End If

        'If rotation too great, then start slipping
        If (TurnAngle > Handling) And (Me.Speed > 0) Then
            Me.Momentum += TurnDirection * Handling
            Me.Speed -= TurnAngle * Handling * Tools.Val2ProcPower(0.00005)
            Return True
        Else
            Me.Momentum = Me.Rotation.y
            Return False
        End If
    End Function

    Protected Function MaxAllowedSpeed(ByVal Accelerate As Single) As Single
        'Get specs for current gear
        Dim Gear As GearSpec = GearData(mCurrentGear)

        'Return max speed for gear and acceleration
        Return Gear.LowerBoundSpeed + (Accelerate / MaxAcceleration * (Gear.UpperBoundSpeed - Gear.LowerBoundSpeed))
    End Function

    '****************************************
    'Structures
    '****************************************

    Protected Structure GearSpec
        Public LowerBoundSpeed As Single
        Public UpperBoundSpeed As Single

        Public Sub New(ByVal LowerBoundSpeed As Single, ByVal UpperBoundSpeed As Single)
            Me.LowerBoundSpeed = LowerBoundSpeed
            Me.UpperBoundSpeed = UpperBoundSpeed
        End Sub
    End Structure

End Class
