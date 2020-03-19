Imports System.Drawing.Drawing2D

Public Class Dashboard
    Inherits Control

    '****************************************
    'Internal variables
    '****************************************

    'For bitmaps
    Private dashBmp As Bitmap           'Dashboard picture
    Private wheelBmp As Bitmap          'Inside of steering wheel
    Private rotatedwheelBmp As Bitmap   'Inside of steering wheel rotated by steering wheel angle

    'Storage for properties
    Private mySteeringWheelAngle As Integer = 0
    Private mySpeed As Integer = 0
    Private myRevs As Integer = 0
    Private mySpeedIndex As Integer = 35
    Private myRevsIndex As Integer = 40

    'Rectangles etc. for Speedo, Wheel, RevCounter
    Private mySpeedoRect As Rectangle
    Private myWheelRect As Rectangle
    Private myRevCounterRect As Rectangle
    Private myRevCounterRadius As Integer
    Private myRevCounterCenter As Point
    Private mySpeedoRadius As Integer
    Private mySpeedoCenter As Point

    'Used for position calculates for hands on face of dials                               
    Private Shared HandPositions As Integer = CircleTable.NumPoints

    'Constants used for drawing
    Private LargeDotSize As Integer = 4
    Private SmallDotSize As Integer = 2

    '****************************************
    'Constructors & Dispose
    '****************************************

    Public Sub New()
        MyBase.New()

        SetStyle(ControlStyles.ResizeRedraw, True) 'Easy & expensive way to force redraw on resize 
        SetStyle(ControlStyles.DoubleBuffer, True) 'Double buffer the control to get fast drawing

        'Load the bitmaps we are going to use                                             
        dashBmp = New Bitmap([Assembly].GetExecutingAssembly().GetManifestResourceStream("DonkeyNET.Dashboard.bmp"))
        wheelBmp = New Bitmap([Assembly].GetExecutingAssembly().GetManifestResourceStream("DonkeyNET.SteeringWheel.bmp"))
        wheelBmp.MakeTransparent(Color.FromArgb(255, 0, 255))

        'Calculate initial offsets for painting onto bitmap
        CalculatePaintingRects(dashBmp.Height)

        'Paint dials so that we don't have to do this on every invalidate                                                               
        Dim gbmp As Graphics = Nothing
        Try
            gbmp = Graphics.FromImage(dashBmp)
            gbmp.SmoothingMode = SmoothingMode.AntiAlias
            DrawSpeedoDial(gbmp)
            DrawRevCounterDial(gbmp)
        Finally
            If Not (gbmp Is Nothing) Then gbmp.Dispose()
        End Try

        'Paint initial rotation of steering wheel spokes
        DrawSpokes()

        'Set the default size of the control
        Me.Size = New Size(dashBmp.Width, dashBmp.Height)

        'Shape the control to look like a dashboard
        Dim GraphicsPath As New Drawing2D.GraphicsPath()
        Dim Points() As Point = {New Point(0, 100), New Point(45, 75), New Point(100, 1), New Point(400, 0), New Point(700, 1), New Point(755, 75), New Point(800, 100)}
        GraphicsPath.AddBeziers(Points)
        GraphicsPath.AddRectangle(New Rectangle(0, 100, 800, 50))
        Me.Region = New Region(GraphicsPath)
    End Sub

    Protected Overloads Overrides Sub Dispose(ByVal disposing As Boolean)
        If (disposing) Then
            dashBmp.Dispose()
            dashBmp = Nothing
            wheelBmp.Dispose()
            wheelBmp = Nothing
            rotatedwheelBmp.Dispose()
            rotatedwheelBmp = Nothing
        End If
    End Sub

    '****************************************
    'Properties
    '****************************************

    'The angle to display the steering wheel at                                                    
    Public Property SteeringWheelAngle() As Integer
        Get
            Return mySteeringWheelAngle
        End Get

        Set(ByVal Value As Integer)
            If (mySteeringWheelAngle <> Value) Then
                mySteeringWheelAngle = Value

                'Draw the spokes rotated
                'Do it here rather than on every invalidate to speed things up
                DrawSpokes()
                Invalidate(myWheelRect)
            End If
        End Set
    End Property

    'The current speed in mph
    Public Property Speed() As Integer
        Get
            Return mySpeed
        End Get

        Set(ByVal Value As Integer)
            If (mySpeed <> Value And Value <= Car.MaxSpeedometer) Then
                mySpeed = Value

                'As we only have 60 positions for the speedo needle 
                'we end up on the same position for a range of speed
                'values. Cache the index and only invalidate if it changes
                Dim oldSpeedIndex As Integer = mySpeedIndex
                mySpeedIndex = (mySpeed * 45 / Car.MaxSpeedometer) + 35

                If (mySpeedIndex > 59) Then
                    mySpeedIndex = mySpeedIndex - 59
                End If

                If (mySpeedIndex <> oldSpeedIndex) Then
                    Invalidate(mySpeedoRect)
                End If
            End If
        End Set
    End Property

    'The current rpm
    Public Property Revs() As Integer
        Get
            Return myRevs
        End Get

        Set(ByVal Value As Integer)
            If (myRevs <> Value And Value <= Car.MaxTachometer) Then
                myRevs = Value

                'As we only have 60 positions for the rev counter needle 
                'we end up on the same position for a range of rev
                'values. Cache the index and only invalidate if it changes
                Dim oldRevsIndex As Integer = myRevsIndex
                myRevsIndex = (myRevs * 40 / Car.MaxTachometer) + 40

                If (myRevsIndex > 59) Then
                    myRevsIndex = myRevsIndex - 59
                End If

                If (myRevsIndex <> oldRevsIndex) Then
                    Invalidate(myRevCounterRect)
                End If
            End If
        End Set

    End Property

    '****************************************
    'Methods
    '****************************************

    'Handle layout to capture control positions
    Protected Overrides Sub OnLayout(ByVal le As LayoutEventArgs)
        CalculatePaintingRects(ClientRectangle.Bottom)
    End Sub

    'Paint Logic
    Protected Overrides Sub OnPaint(ByVal pe As PaintEventArgs)
        MyBase.OnPaint(pe)

        Dim g As Graphics = pe.Graphics

        g.FillRectangle(Brushes.Black, ClientRectangle)

        DrawDash(g)

        'Set smoothing mode to anti-alias - gives the nicest curves but 
        'expensive to draw - offset by double buffering
        g.SmoothingMode = SmoothingMode.AntiAlias

        DrawSpeedoNeedle(g)

        DrawRevCounterNeedle(g)

        DrawWheel(g)
    End Sub


    'Calculate positions of everything based on where the dash board bitmap starts on the screen
    'We calculate on start up and on layout (resize)
    Private Sub CalculatePaintingRects(ByVal localBottom As Integer)
        mySpeedoRect = New Rectangle(330, localBottom - 118, 70, 70)
        myRevCounterRect = New Rectangle(405, localBottom - 118, 70, 70)
        myWheelRect = New Rectangle(67, localBottom - 118, 216, 216)

        myRevCounterRadius = CInt(myRevCounterRect.Width / 2 - CInt(Sqrt((2 * Pow(LargeDotSize / 2 + 1, 2)))) - 2)
        myRevCounterCenter = New Point(CInt(myRevCounterRect.Width / 2), CInt(myRevCounterRect.Height / 2))

        mySpeedoRadius = CInt(mySpeedoRect.Width / 2 - CInt(Sqrt((2 * Pow(LargeDotSize / 2 + 1, 2)))) - 2)
        mySpeedoCenter = New Point(CInt(mySpeedoRect.Width / 2), CInt(mySpeedoRect.Height / 2))
    End Sub

    'Draw the dash board       
    Private Sub DrawDash(ByVal g As Graphics)
        g.DrawImage(dashBmp, 0, ClientRectangle.Bottom - dashBmp.Height)
    End Sub

    'Draw the marks on the face of a dial
    Private Sub DrawFace(ByVal g As Graphics, ByVal dialRect As Rectangle, ByVal startPos As Integer, ByVal dialCenter As Point, ByVal dialRadius As Integer)
        Dim rc As New Rectangle()
        Dim pos As Integer

        For pos = 0 To 20
            rc.X = CInt(CircleTable.GetPoint(pos).X * dialRadius / CircleTable.SCALE + dialCenter.X) + dialRect.X
            rc.Y = CInt(CircleTable.GetPoint(pos).Y * dialRadius / CircleTable.SCALE + dialCenter.Y) + dialRect.Y

            If pos Mod 5 <> 0 Then
                rc.Width = CInt(SmallDotSize / 3)
                rc.Height = rc.Width
                rc.X -= CInt(rc.Width / 2)
                rc.Y -= CInt(rc.Height / 2)
                DrawSmallDot(g, rc)
            Else
                rc.Width = LargeDotSize
                rc.Height = rc.Width
                rc.X -= CInt(rc.Width / 2)
                rc.Y -= CInt(rc.Height / 2)
                DrawLargeDot(g, rc)
            End If
        Next pos

        For pos = startPos To HandPositions - 1
            rc.X = CInt(CircleTable.GetPoint(pos).X * dialRadius / CircleTable.SCALE + dialCenter.X) + dialRect.X
            rc.Y = CInt(CircleTable.GetPoint(pos).Y * dialRadius / CircleTable.SCALE + dialCenter.Y) + dialRect.Y

            If pos Mod 5 <> 0 Then
                rc.Width = CInt(SmallDotSize / 3)
                rc.Height = rc.Width
                rc.X -= CInt(rc.Width / 2)
                rc.Y -= CInt(rc.Height / 2)
                DrawSmallDot(g, rc)
            Else
                rc.Width = LargeDotSize
                rc.Height = rc.Width
                rc.X -= CInt(rc.Width / 2)
                rc.Y -= CInt(rc.Height / 2)
                DrawLargeDot(g, rc)
            End If
        Next pos
    End Sub

    'Draw a hand on the dial
    Private Sub DrawHand(ByVal g As Graphics, ByVal dialRect As Rectangle, ByVal pos As Integer, ByVal dialCenter As Point, ByVal dialRadius As Integer)
        Dim rect As New Rectangle(dialCenter.X + dialRect.X - 2, dialCenter.Y + dialRect.Y - 2, 4, 4)
        g.FillEllipse(Brushes.Gray, rect)
        g.DrawEllipse(Pens.White, rect)

        Dim p As New Pen(Color.White)
        p.Width = 2
        g.DrawLine(p, _
                   dialCenter.X + dialRect.X, _
                   dialCenter.Y + dialRect.Y, _
                   CInt(dialCenter.X + (CircleTable.GetPoint(pos).X * dialRadius) / CircleTable.SCALE) + dialRect.X, _
                   CInt(dialCenter.Y + (CircleTable.GetPoint(pos).Y * dialRadius) / CircleTable.SCALE) + dialRect.Y)
    End Sub

    'Draw the large dots on the face of the dial
    Private Sub DrawLargeDot(ByVal g As Graphics, ByVal rc As Rectangle)
        g.FillRectangle(New SolidBrush(Color.Chartreuse), rc)
    End Sub

    'Draw the Rev Counter Dial - only called during start up       
    Private Sub DrawRevCounterDial(ByVal g As Graphics)
        'Draw the circles                            
        Dim p1 As New Pen(SystemColors.ControlLightLight)
        p1.Width = 3
        g.DrawEllipse(p1, myRevCounterRect)
        g.FillEllipse(Brushes.Black, myRevCounterRect)

        'Draw Red bit on high end of revs
        Dim p2 = New Pen(Color.Crimson)
        p2.Width = 4
        Dim rc3 As Rectangle = myRevCounterRect
        rc3.Inflate(-8, -8)
        g.DrawArc(p2, rc3, 15, 20)

        Dim p3 As New Pen(SystemColors.ControlDark)
        p3.Width = 1
        Dim rc2 As Rectangle = myRevCounterRect
        rc2.Inflate(-2, -2)
        g.DrawEllipse(p3, rc2)

        'Draw marks on the face    
        DrawFace(g, myRevCounterRect, 40, myRevCounterCenter, myRevCounterRadius)
    End Sub

    'Draw the Rev Counter Needle - called on every invalidate
    Private Sub DrawRevCounterNeedle(ByVal g As Graphics)
        'Draw the needle
        DrawHand(g, myRevCounterRect, myRevsIndex, myRevCounterCenter, myRevCounterRadius)
    End Sub

    'Draw the small dots on the face of the dial
    Private Sub DrawSmallDot(ByVal g As Graphics, ByVal rc As Rectangle)
        g.FillRectangle(Brushes.White, rc)
    End Sub

    'Draw the Speedometer dial - only called during start up
    Private Sub DrawSpeedoDial(ByVal g As Graphics)
        'Draw the circles                            
        Dim p1 As New Pen(SystemColors.ControlLightLight)
        p1.Width = 3
        g.DrawEllipse(p1, mySpeedoRect)
        g.FillEllipse(Brushes.Black, mySpeedoRect)

        Dim p2 As New Pen(SystemColors.ControlDark)
        p2.Width = 1
        Dim rc2 As Rectangle = mySpeedoRect
        rc2.Inflate(-2, -2)
        g.DrawEllipse(p2, rc2)

        'Draw marks on the face    
        DrawFace(g, mySpeedoRect, 35, mySpeedoCenter, mySpeedoRadius)
    End Sub

    'Draw the Speedometer needle - called on every invalidate
    Private Sub DrawSpeedoNeedle(ByVal g As Graphics)
        'Draw the speedo needle                                                 
        DrawHand(g, mySpeedoRect, mySpeedIndex, mySpeedoCenter, mySpeedoRadius)
    End Sub

    'Draw the spokes for the steering wheel rotated by the steering wheel angle
    'These are cached at the given angle so we don't have to redraw when the 
    'wheel has not changed angle
    Private Sub DrawSpokes()
        If Not (rotatedwheelBmp Is Nothing) Then
            rotatedwheelBmp.Dispose()
            rotatedwheelBmp = Nothing
        End If

        rotatedwheelBmp = New Bitmap(wheelBmp.Width, wheelBmp.Height)

        Dim gbmp As Graphics = Nothing
        Try
            gbmp = Graphics.FromImage(rotatedwheelBmp)
            Dim myMatrix As New Matrix()
            myMatrix.RotateAt(mySteeringWheelAngle, New PointF(wheelBmp.Height / 2, wheelBmp.Height / 2))
            gbmp.Transform = myMatrix
            gbmp.DrawImage(wheelBmp, 0, 0)
        Finally
            If Not (gbmp Is Nothing) Then gbmp.Dispose()
        End Try
    End Sub

    'Draw the steerin wheel
    Private Sub DrawWheel(ByVal g As Graphics)
        'Draw the spokes                                       
        If Not (rotatedwheelBmp Is Nothing) Then
            g.DrawImage(rotatedwheelBmp, 60, ClientRectangle.Bottom - CInt(wheelBmp.Height / 2) - 10)
        End If

        'Draw the wheel
        Dim p As Pen = New Pen(Color.Black)
        p.Width = 23
        g.DrawEllipse(p, myWheelRect)

        p = New Pen(Color.FromArgb(20, Color.White))
        p.Width = 16

        g.DrawEllipse(p, myWheelRect)

        p = New Pen(Color.FromArgb(25, Color.White))
        p.Width = 13
        g.DrawEllipse(p, myWheelRect)

        p = New Pen(Color.FromArgb(28, Color.White))
        p.Width = 8
        g.DrawEllipse(p, myWheelRect)

        p = New Pen(Color.FromArgb(35, Color.White))
        p.Width = 5
        g.DrawEllipse(p, myWheelRect)

        p = New Pen(SystemColors.ControlDark)
        p.Width = 1
        Dim rc2 As Rectangle = myWheelRect
        rc2.Inflate(-2, -2)
        g.DrawEllipse(p, rc2)
    End Sub

    '****************************************
    'Classes
    '****************************************

    Private Class CircleTable
        Public Shared SCALE As Integer = 8000

        Private Shared circleTable As Point() = { _
            New Point(0, -7999), New Point(836, -7956), _
            New Point(1663, -7825), New Point(2472, -7608), _
            New Point(3253, -7308), New Point(3999, -6928), _
            New Point(4702, -6472), New Point(5353, -5945), _
            New Point(5945, -5353), New Point(6472, -4702), _
            New Point(6928, -4000), New Point(7308, -3253), _
            New Point(7608, -2472), New Point(7825, -1663), _
            New Point(7956, -836), New Point(8000, 0), _
            New Point(7956, 836), New Point(7825, 1663), _
            New Point(7608, 2472), New Point(7308, 3253), _
            New Point(6928, 4000), New Point(6472, 4702), _
            New Point(5945, 5353), New Point(5353, 5945), _
            New Point(4702, 6472), New Point(3999, 6928), _
            New Point(3253, 7308), New Point(2472, 7608), _
            New Point(1663, 7825), New Point(836, 7956), _
            New Point(0, 7999), New Point(-836, 7956), _
            New Point(-1663, 7825), New Point(-2472, 7608), _
            New Point(-3253, 7308), New Point(-4000, 6928), _
            New Point(-4702, 6472), New Point(-5353, 5945), _
            New Point(-5945, 5353), New Point(-6472, 4702), _
            New Point(-6928, 3999), New Point(-7308, 3253), _
            New Point(-7608, 2472), New Point(-7825, 1663), _
            New Point(-7956, 836), New Point(-7999, 0), _
            New Point(-7956, -836), New Point(-7825, -1663), _
            New Point(-7608, -2472), New Point(-7308, -3253), _
            New Point(-6928, -4000), New Point(-6472, -4702), _
            New Point(-5945, -5353), New Point(-5353, -5945), _
            New Point(-4702, -6472), New Point(-3999, -6928), _
            New Point(-3253, -7308), New Point(-2472, -7608), _
            New Point(-1663, -7825), New Point(-836, -7956) _
        }

        Public Shared ReadOnly Property NumPoints() As Integer
            Get
                Return circleTable.Length
            End Get
        End Property

        Public Shared Function GetPoint(ByVal index As Integer) As Point
            Return circleTable(index)
        End Function

    End Class

End Class
