<%@ LANGUAGE = JScript %>
<%
objQuery = Server.CreateObject('IXSSO.Query');

/* Set the properties that determine the query
   and the information to return */
// use the "System" catalog
objQuery.Catalog = 'System';
// return a maximum of 100 records
objQuery.MaxRecords = 100;

// specify HTML files containing the string "jeanie" in their names
objQuery.Query = '(#filename *.htm* )and jeanie';
// return the full path of files matching criteria
objQuery.Columns = 'path';

// search for results & store as rsResults
rsResults = objQuery.CreateRecordset('sequential');  

if (rsResults.EOF) {
   Response.Write('No Results Found');
} else {
   while (!rsResults.EOF) {
      // list results to browser
      Response.Write(rsResults.fields(0).value+'<BR>');
      rsResults.MoveNext();
   }
}
%> 
