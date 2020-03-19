Friend Class ModelLoader

    '****************************************
    'Constants
    '****************************************

    'For models location and file extensions
    Private Const ModelPath As String = "mdl"
    Private Const ModelExtension As String = ".mdl"
    Private Const ScreamExtension As String = ".wav"
    Private Const ThumbnailExtension As String = ".bmp"

    '****************************************
    'Methods
    '****************************************

    'Get list of available models with their thumbnail pictures
    Public Shared Function Browse() As DonkeyWeb.ObstacleInfo()
        Dim Obstacles() As DonkeyWeb.ObstacleInfo
        Dim Directory As New DirectoryInfo(Application.StartupPath & "\..\" & ModelPath)
        Dim Index As Integer = 0
        Dim File As FileInfo
        Dim DownloadSize As Integer
        For Each File In Directory.GetFiles("*" & ModelExtension)
            ReDim Preserve Obstacles(Index)
            Dim Name As String = Left(File.Name, Len(File.Name) - 4)
            Obstacles(Index) = New DonkeyWeb.ObstacleInfo()
            Obstacles(Index).Name = Name
            DownloadSize = File.Length
            Try
                Obstacles(Index).Thumbnail = ReadFile(File.DirectoryName & "\" & Name & ThumbnailExtension)
            Catch 'Don't fail if there's no thumbnail image
            End Try
            Try
                Dim ScreamFile As New FileInfo(File.DirectoryName & "\" & Name & ScreamExtension)
                DownloadSize += ScreamFile.Length
            Catch 'Don't fail if there's no scream sound
            End Try
            Obstacles(Index).DownloadSize = DownloadSize
            Index += 1
        Next
        Return Obstacles
    End Function

    'Download a model with its scream sound
    Public Shared Function Load(ByVal ModelName As String) As DonkeyWeb.Obstacle
        Dim Obstacle As New DonkeyWeb.Obstacle()
        Dim DirectoryName As String = Application.StartupPath & "\..\" & ModelPath
        Obstacle.Model = ReadFile(DirectoryName & "\" & ModelName & ModelExtension)
        Try
            Obstacle.Scream = ReadFile(DirectoryName & "\" & ModelName & ScreamExtension)
        Catch 'Don't fail if there's no scream sound
        End Try
        Return Obstacle
    End Function

    'Read a file from disk into memory
    Private Shared Function ReadFile(ByVal FilePath As String) As Byte()
        Dim Stream As FileStream = File.Open(FilePath, FileMode.Open, FileAccess.Read)
        Try
            'Read file and return contents
            Dim Buffer(Stream.Length - 1) As Byte
            Stream.Read(Buffer, 0, Stream.Length)
            Return Buffer
        Finally 'Make sure that file stream is closed even if error occurs
            Stream.Close()
        End Try
    End Function

End Class
