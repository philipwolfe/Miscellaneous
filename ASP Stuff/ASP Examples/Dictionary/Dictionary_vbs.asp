<%
Dim objDictionary
Set objDictionary = Server.CreateObject("Scripting.Dictionary")

objDictionary.Item("Red") = "Rouge"

objDictionary.Add "Blue", "Bleu"
objDictionary.Key("Blue") = "NewBlue"

objDictionary.Item("Black") = "Noir"

Dim strKey
Dim strItem
strKey = "Green"
strItem = "Vert"
objDictionary.Add strKey, strItem

Dim blnRed, blnGrey
blnRed = objDictionary.Exists("Red") 
blnGrey = objDictionary.Exists("Grey") 
Response.Write "blnRed = " & blnRed & "<BR>"
Response.Write "blnGrey = " & blnGrey & "<BR>"

intCount = objDictionary.Count
Response.Write "intCount = " & intCount & "<BR>"

arrKeys = objDictionary.Keys                'get all the keys into an array
arrItems = objDictionary.Items              'get all the items into an array

For intLoop = 0 To objDictionary.Count - 1  'iterate through the array
  strThisKey = arrKeys(intLoop)             'this is the key value
  strThisItem = arrItems(intLoop)           'this is the item (data) value
  Response.Write strThisKey & " = " & strThisItem & "<BR>"
Next

' iterate the dictionary as a collection in VBScript
'For Each objItem in arrItems
'   Response.Write objItem & " = " & arrItems(objItem) & "<BR>"
'Next

objDictionary.Remove "Red" 
intCount = objDictionary.Count
Response.Write "intCount = " & intCount & "<BR>"

objDictionary.RemoveAll
intCount = objDictionary.Count
Response.Write "intCount = " & intCount & "<BR>"
%>