<%@ LANGUAGE="JScript" %>
<% Response.Buffer = false; %>
<TITLE>Data Shaping</TITLE>
<FORM ACTION="shape_js.asp" METHOD="POST">
   <TEXTAREA NAME="txtShape" ROWS=15 COLS=100></TEXTAREA><BR><BR>
   <INPUT TYPE=SUBMIT>
</FORM>

<%
if (String(Request.Form("txtShape")) != "undefined") {
   strShape = Request.Form("txtShape");

   // ********** Configure this connection string **********
   strConnect = "Provider=MSDataShape;Data Provider=SQLOLEDB;" +
                "Initial Catalog=Northwind;Data Source=ServerName;" +
                "User ID=sa;Password=;";
   cnShape = Server.CreateObject("ADODB.Connection");

   cnShape.Open(strConnect);

   rsParent = cnShape.Execute(strShape);
   Response.Write("<BR>Results of SHAPE command <B>" +
                  strShape + "</B>:<HR>");
   RecurseChildren(rsParent);
}

function RecurseChildren(rsChild) {
%>
<TABLE BORDER=1><THEAD><TR>
<%
var enmFieldNames = new Enumerator(rsChild.Fields);
for (; !enmFieldNames.atEnd(); enmFieldNames.moveNext()) {
   Response.Write("<TH>" + enmFieldNames.item().Name + "</TH>");
}
%>
</TR></THEAD>
<TBODY>
<%
   while (!rsChild.EOF) {
      Response.Write("<TR>");
      var objField;
      var enmFields = new Enumerator(rsChild.Fields);
      for (; !enmFields.atEnd(); enmFields.moveNext()) {
         objField = enmFields.item();
         Response.Write("<TD>");
         if (objField.Type == 136) {
            Response.Write("<TABLE BORDER=1 WIDTH='100%'>");
            RecurseChildren(objField.Value);
            Response.Write("</TABLE>");
         } else {
            Response.Write(objField.Value);
         }
         Response.Write("</TD>");
      }
      rsChild.MoveNext();
      Response.Write("</TR>");
   }
}
%>
</TBODY></TABLE>