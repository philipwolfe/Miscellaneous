@echo ----------------------------------------------------------------
@echo Build using .NET Framework 1.0.3705 by default.
@echo Run "Build.bat 1.0" to build against the .NET Framework 1.0.3705
@echo Run "Build.bat 1.1" to build against the .NET Framework 1.1.4322
@echo ----------------------------------------------------------------
@if exist bin rd /s /q bin
@if exist obj rd /s /q obj
set FrameworkVersion=1.1.4322
if "%1" == "1.0" set FrameworkVersion=1.0.3705
if "%1" == "1.1" set FrameworkVersion=1.1.4322
copy "..\..\Build\%FrameworkVersion%\Reflector.exe" .
%SystemRoot%\Microsoft.NET\Framework\v%FrameworkVersion%\csc.exe /t:library /out:Reflector.AddIn.dll *.cs /r:Reflector.exe
