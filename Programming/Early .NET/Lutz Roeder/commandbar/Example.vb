' Windows Forms CommandBar controls for .NET.
' Copyright (C) 2001-2002 Lutz Roeder. All rights reserved.
' http://www.aisto.com/roeder
' ******@aisto.com

Imports System
Imports System.Drawing
Imports System.Drawing.Imaging
Imports System.Windows.Forms

Class Example 
	Inherits Form 

		<STAThread()> Shared Sub Main()
			System.Windows.Forms.Application.Run(New Example())
		End Sub

		Private reBar As New ReBar
		Private toolBar As New CommandBar(CommandBarStyle.ToolBar)
		
		Public Sub New()
			MyBase.New
			Me.Icon = SystemIcons.Application
			Me.Text = "Example"
			Me.Size = new Size(400, 350)

			Me.toolBar.Items.Add(new CommandBarItem(Images.Back, "&Back", Nothing, Keys.Alt Or Keys.Left))
			Me.toolBar.Items.Add(new CommandBarItem(Images.Forward, "&Open...", Nothing, Keys.Alt Or Keys.Right))
			Me.toolBar.Items.Add(new CommandBarItem(Images.Abort, "&Stop", Nothing, Keys.Escape))
			Me.toolBar.Items.Add(new CommandBarItem(Images.Refresh, "&Refresh", Nothing, Keys.F5))
			Me.toolBar.Items.Add(new CommandBarItem(Images.Home, "&Home", new EventHandler(AddressOf Home_Click), Nothing))
			Me.toolBar.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator))
			Me.toolBar.Items.Add(new CommandBarItem(Images.Search, "&Search", Nothing))
			Me.toolBar.Items.Add(new CommandBarItem(Images.Bookmarks, "&Favorites", Nothing))
			Me.toolBar.Items.Add(new CommandBarItem(Images.Culture, "&Culture", Nothing))
			Me.toolBar.Items.Add(new CommandBarItem(Images.History, "&History", Nothing))
			Me.toolBar.Items.Add(new CommandBarItem(CommandBarItemStyle.Separator))
			Me.toolBar.Items.Add(new CommandBarItem(Images.Mail, "&Mail", Nothing))

			Me.reBar.Bands.Add(toolBar)
			Me.Controls.Add(reBar)
		End Sub
			
		Private Sub Home_Click(s As Object, e As EventArgs)
	
		End Sub

End Class

Class Images

	Private Shared images() As Image

	' ImageList.Images[int index] does not preserve alpha channel.
	Shared Sub New()
		
		' TODO alpha channel PNG loader is not working on .NET Service RC1
		Dim bitmap As New Bitmap("Example16.tif")

		Dim count As Integer
		count = (bitmap.Width / bitmap.Height)
		Console.WriteLine(count)
		
		Redim images(count)
		
		Dim rectangle As new Rectangle(0, 0, bitmap.Height, bitmap.Height)
		Dim i As Integer
		For i = 1 To Count
				images(i) = bitmap.Clone(rectangle, bitmap.PixelFormat)
				rectangle.X += bitmap.Height
		Next i

	End Sub

	Public ReadOnly Shared Property Back As Image
		Get
			Back = images(18)
		End Get
	End Property

	Public ReadOnly Shared Property Forward As Image
		Get
			Forward = images(19)
		End Get
	End Property

	Public ReadOnly Shared Property Abort As Image
		Get
			Abort = images(22)
		End Get
	End Property

	Public ReadOnly Shared Property Refresh As Image
		Get
			Refresh = images(23)
		End Get
	End Property

	Public ReadOnly Shared Property Home As Image
		Get
			Home = images(24)
		End Get
	End Property

	Public ReadOnly Shared Property Search As Image
		Get
			Search = images(13)
		End Get
	End Property

	Public ReadOnly Shared Property Bookmarks As Image
		Get
			Bookmarks = images(20)
		End Get
	End Property

	Public ReadOnly Shared Property Culture As Image
		Get
			Culture = images(32)
		End Get
	End Property

	Public ReadOnly Shared Property History As Image
		Get
			History = images(34)
		End Get
	End Property

	Public ReadOnly Shared Property Mail As Image
		Get
			Mail = images(35)
		End Get
	End Property

End Class

