<%@ LANGUAGE="JScript" %>
<!-- You will need to substitute your own path for the output file, see last line of code -->
<%
  var xmlDoc;		//The xml document
  var xmlCat;		//The catalog of books
  var xmlBook;		//A book
  var xmlTitle;		//The title of the book
  var xmlBuy;		//A URL to buy the book

  xmldoc = Server.CreateObject("Microsoft.xmldom");
  xmlCat = xmldoc.createElement("Catalog");
  xmlBook = xmldoc.createElement("Book");
  xmlTitle = xmldoc.createElement("Title");

  // this creates a CDATASection with a URL to Amazon. Obviusly a URL could cause major parsing errors which is why I have placed it in a CDATASection
  xmlBuy = xmldoc.createCDATASection ("http://www.amazon.com/exec/obidos/ASIN/1861003234/qid=957435584/sr=1-6/104-6467696-8298828");

  // this adds an attribute which reads Author="Alex Homer"
  xmlBook.setAttribute("Author", "Alex Homer");

  // sets the text inside the <title></title> pair
  xmlTitle.text = "XML for IE5";

  // add it to our tree (to the book element)
  xmlBook.appendChild(xmlTitle);


  // add the buy URL too (book)
  xmlBook.appendChild(xmlBuy);

  // add book to the catalog
  xmlCat.appendChild(xmlBook);

// One possible implementation for the use of cloneNode is reading in Titles by author
// from a table. Rather than build the node each time, a template node can be build
// and then cloned for each author. The appropriate values can then be inserted.
  xmlBook = xmlBook.cloneNode(true);    // clone all children

  // change the books title - the author is the same
  xmlTitle = xmlBook.childNodes.item(0).text = "ASP 3.0 Programmers Rerefence";
  xmlCat.appendChild(xmlBook);

  // add this book to the catalog
  xmldoc.appendChild(xmlCat);




  Response.Write (strAuthor);
%>
Document succesfully created.