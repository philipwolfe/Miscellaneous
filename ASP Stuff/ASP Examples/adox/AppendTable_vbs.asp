<TITLE>Appending a Table</TITLE>
<!-- METADATA TYPE="TypeLib"  VERSION="2.5"
              NAME="Microsoft ADO Ext. 2.5 for DDL and Security"
              UUID="{00000600-0000-0010-8000-00AA006D2EA4}" -->
<%
Dim strConn
Dim objCat

Set objCat = Server.CreateObject("ADOX.Catalog")
Set objTbl = Server.CreateObject("ADOX.Table")

objCat.ActiveConnection = "Provider= Microsoft.Jet.OLEDB.4.0; " & _
                          "Data Source=C:\temp\newdb.mdb"

objTbl.Name = "tblNewTable"
objTbl.Columns.Append "FirstName", adVarWChar, 25
objTbl.Columns.Append "LastName", adVarWChar, 25
objTbl.Columns.Append "Age", adInteger

Set objTbl.ParentCatalog = objCat
objTbl.Properties("Jet OLEDB:Table Validation Rule") = "[Age]>17"
objTbl.Properties("Jet OLEDB:Table Validation Text") = _
   "Age must be 18 or over"

objCat.Tables.Append objTbl

Response.Write "Table Appended!"
%>