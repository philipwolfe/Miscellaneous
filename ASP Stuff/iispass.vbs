Dim IIsObject
Set IIsObject = GetObject ("IIS://localhost/w3svc")
WScript.Echo "AnonymousUserName = " & IIsObject.Get("AnonymousUserName") & vbCrlf & _ 
"AnonymousUserPass = " & IIsObject.Get("AnonymousUserPass") &vbCrlf &vbCrlf &_ 
"WAMUserName = " & IIsObject.Get("WAMUserName") & vbCrlf & _
"WAMUserPass = " & IIsObject.Get("WAMUserPass") 
Set IIsObject = Nothing