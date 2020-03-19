@echo off
csc /target:library /out:Mapack.dll /doc:Mapack.xml Mapack.cs
csc Example.cs /r:Mapack.dll
