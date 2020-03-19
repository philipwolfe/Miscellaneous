csc /target:winexe Netron.cs /win32icon:Application.ico /resource:Add.cur /resource:Application.ico /resource:Cross.cur /resource:Grip.cur /resource:Move.cur /resource:Netron.png /resource:Select.cur %1
csc /target:library /r:Netron.exe Invest.cs %1
csc /target:library /r:Netron.exe Neuronal.cs %1
csc /target:library /r:Netron.exe,DatePicker.dll Family.cs %1
pause
