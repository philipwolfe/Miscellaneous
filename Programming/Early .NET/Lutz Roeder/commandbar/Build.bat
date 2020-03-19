@echo off
csc /target:library /out:CommandBar.dll CommandBar.cs %1
csc /target:exe /out:Example.exe Example.cs /r:CommandBar.dll %1
REM vbc /target:exe /out:Example.exe Example.vb /r:CommandBar.dll /r:System.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll %1