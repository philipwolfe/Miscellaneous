<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta name="GENERATOR" content="Microsoft FrontPage 4.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
<title>New Page 1</title>
<!--mstheme--><link rel="stylesheet" type="text/css" href="_themes/blank/blan1011.css"><meta name="Microsoft Theme" content="blank 1011, default">
</head>

<body>
<%	
 		
 
   'session("my_array(uppera+1,upperb)")	
   session("my_array(0,0)")="Hi!"
   session("my_array(0,1)")="How are You"
   
   
   
   session("my_array(1,0)") = "replacement"
   
  
   
   session("my_array(0,1)") = ""
   
   
   'lowcount=lbound(session("my_array()"))
   'highcount=ubound(session("my_array()"))
   'response.write "lowcount=" & lowcount & ";highcount=" & highcount & "<p>"
   
   response.write session("my_array(0,0)")
   response.write session("my_array(0,1)")
   
   'for counter=lowcount to highcount
   '   If Not IsNumeric(session("my_array(counter)")) Then
   '   		response.write counter & "&nbsp;&nbsp;&nbsp;" 
   '   		response.write session("my_array(counter)") & "<br>"
   '   	End If
   'next	
   
	
	
	
%>

<p>&nbsp;</body>

</html>
