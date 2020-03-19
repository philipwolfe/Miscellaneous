<%@ LANGUAGE="JScript"%>
<HTML>
<HEAD>
<TITLE>Search Results</TITLE>
</HEAD>
<BODY>

<%

strAuthor = Request.QueryString("txtAuthor");
strTitle = Request.QueryString("txtTitle");
strKeywords = Request.QueryString("txtKeywords");
strContains = Request.QueryString("txtContains");

strPrefix = " ";
strWhereClause = "";

// Build the Where clause based on the values being passed in.
if (!strAuthor == "undefined") {
   strWhereClause = "CONTAINS(DocAuthor, '" + Chr(34) + 
                    strAuthor + Chr(34) + "')";
   strPrefix = " AND "
}

if (!strTitle == "undefined") {
   strWhereClause = strWhereClause + strPrefix +
                    "CONTAINS(DocTitle, '" +
                    Chr(34) + strTitle + Chr(34) + "')";
   strPrefix = " AND "
}

if (!strKeywords == "undefined") {
   strWhereClause = strWhereClause + strPrefix +
                    "CONTAINS(DocKeywords, '" + Chr(34) +
                    strKeywords + Chr(34) + "')";
}

if (!strContains == "undefined") {
   strWhereClause = strWhereClause + strPrefix +
                    "CONTAINS(Contents, '" + Chr(34) +
                    strContains + Chr(34) + "')";
}

// Then, build the full Query to be used
strQuery = "SELECT * FROM System..FILEINFO";

if (strWhereClause == "undefined") {
   strQuery =strQuery + " WHERE " + strWhereClause;
}

// Execute the query and assign the results to the recordset
rsResults = Server.CreateObject("ADODB.Recordset");
rsResults.Open (strQuery, "Provider=MSIDXS;");

// Then, handle the results
if (rsResults.EOF) {
%>
   <STRONG><FONT SIZE=+6 COLOR=BLUE>No Results Found<FONT></STRONG>
<%
} else {
%>
   <TABLE BORDER=0 WIDTH=100%>
      <TR>
         <TD><STRONG>File Name</STRONG></TD>
         <TD><STRONG>File Location</STRONG></TD>
      </TR>
<%
      while (!rsResults.EOF) {
%>
         <TR>
            <TD><%= rsResults.Fields(0).Value %></TD>
            <TD><A HREF="<%= rsResults.fields(1).value %>">
                <%= rsResults.fields(1).value %></A></TD>
         </TR>
<%
         rsResults.MoveNext
      }
%>
   </TABLE>
<%
}
%>

</BODY>
</HTML>
