<%@ LANGUAGE=JScript %>
<%
var objDictionary = Server.CreateObject('Scripting.Dictionary');

objDictionary.Item('Red') = 'Rouge';

objDictionary.Add('Blue', 'Bleu');
objDictionary.Key('Blue') = 'NewBlue';

objDictionary.Item('Black') = 'Noir';

var strKey = 'Green';
var strItem = 'Vert';
objDictionary.Add(strKey, strItem);

var blnRed = objDictionary.Exists('Red');
var blnGrey = objDictionary.Exists('Grey');
Response.Write('blnRed = ' + blnRed + '<BR>');
Response.Write('blnGrey = ' + blnGrey + '<BR>');

var intCount = objDictionary.Count;
Response.Write ('intCount = ' + intCount + '<BR>');

// get VB-style arrays using the Keys() and Items() methods
var arrKeys = new VBArray(objDictionary.Keys()).toArray();
var arrItems = new VBArray(objDictionary.Items()).toArray();
for (intLoop = 0; intLoop < objDictionary.Count; intLoop++) {
  // Iterate through the arrays
  strThisKey = arrKeys[intLoop];        // this is the key value
  strThisItem = arrItems[intLoop];      // this is the item (data) value
  Response.Write(strThisKey + ' = ' + strThisItem + '<BR>')
}

objDictionary.Remove("Red");
var intCount = objDictionary.Count;
Response.Write ('intCount = ' + intCount + '<BR>');

objDictionary.RemoveAll();
var intCount = objDictionary.Count;
Response.Write ('intCount = ' + intCount + '<BR>');
%>