Required Components:
--------------------

Donkey.NET requires Windows 2000 or Windows XP.

Donkey.NET requires DirectX 8.0, which may be obtained from
http://www.microsoft.com/directx.

Donkey.NET requires Visual Studio.NET and the .NET Framework (Beta 2), which
may be obtained from http://msdn.microsoft.com/vstudio/nextgen/beta.asp.

Installation Notes:
-------------------

To install the Donkey.NET game with its source code, run the DonkeySetup.msi.
To launch the game double-click the Donkey.NET shortcut located on the desktop.
The Donkey.NET project files will be installed to the Source Code folder in the
installation directory (e.g. C:\Program Files\Donkey.NET\).  Open the
Donkey.sln file to load the solution.

To install the Web Service, run the DonkeyWebSetup.msi.  To open the Web
Service source code in Visual Basic.NET, select File - Open - Project From Web
from the menu.  Then browse to the Web Folder where you installed the Web
Service (e.g. http://localhost/DonkeyWeb/).  Open the DonkeyWeb.vbproj file to
load the project.

By default, Donkey.NET loads character models from the local application folder
and does not use the Web Service.  If you would like to use the Web Service
that you installed, you must edit the app.config file in the Donkey.NET project
and rebuild.  Open the app.config file in Visual Basic.NET, and then enter the
URL to the Web Service ASMX in the Dynamic Property value.

Game Notes:
-----------

To control the game, you can use the following inputs:

    Action          Keyboard    Microsoft SideWinder Steering Wheel
    --------------- ----------- -----------------------------------
    Accelerate      UP          Accelerator Pedal
    Brake           DOWN        Brake Pedal
    Steer           LEFT/RIGHT  Steering Wheel
    Revive Donkeys  R           Top Left-Side Button
    Quit            ESC

If you would like to use more character models in the game, you can copy
Half-Life MDLs into the \mdl folder of the Donkey project or the DonkeyWeb Web
Service.  To supply a thumbnail image, add a BMP file to the folder with the
same filename (minus the extension).  To supply a scream sound, add a WAV file
to the folder with the same filename (minus the extension).
