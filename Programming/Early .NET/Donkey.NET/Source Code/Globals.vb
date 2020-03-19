Friend Module Globals

    '****************************************
    'Constants
    '****************************************

    'For downloaded file names
    Public Const DownloadModel As String = "Download.mdl"
    Public Const DownloadScream As String = "Download.wav"

    '****************************************
    'Global variables
    '****************************************

    'For 3D engine objects
    Public Engine As New Rev3D_Engine()
	Public Pipeline As Rev3D_Pipeline = New Rev3D_Pipeline()
    Public TextureLib As New Rev3D_TextureLib()
    Public MaterialLib As New Rev3D_MaterialLib()
    Public MeshBuilder As New Rev3D_MeshBuilder()
    Public PolyVox As New Rev3D_PolyVox()
    Public SkyDome As New Rev3D_SkyDome()
    Public MDLSystem As New Rev3D_MDLSystem()
    Public Interface2D As New Rev3D_Interface2D()
    Public Camera As New Rev3D_Camera()
    Public Sound As New Rev3D_Sound()
    Public Control As New Rev3D_Control()
    Public FPS As New Rev3D_FpS()
    Public Tools As New Rev3D_Tools()
    Public Math As New Rev3D_Math()

    'For game state
    Public SwapDonkeys As Boolean = False

    '****************************************
    'Global functions
    '****************************************

    'Math conversions
    Public Function DegToRad(ByVal Degree As Single) As Single
        Return Degree * (pi / 180)
    End Function
    
    Public Function RadToDeg(ByVal Radian As Single) As Single
        Return Radian * (180 / pi)
    End Function

End Module

'****************************************
'Structures
'****************************************

'For three dimensional values
Friend Structure Value3D
    Public x As Single
    Public y As Single
    Public z As Single

    Public Sub New(ByVal x As Single, ByVal y As Single, ByVal z As Single)
        Me.x = x
        Me.y = y
        Me.z = z
    End Sub
End Structure
