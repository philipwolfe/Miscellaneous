<% 	@ LANGUAGE="JScript" 		%>

<!--METADATA TYPE="typelib" 
uuid="00000205-0000-0010-8000-00AA006D2EA4" -->

<%
	// This example calls the ByRoyalty stored procedure 
	// installed with the PUBS database with Microsoft SQL Server.

	// This sample assumes that SQL Server is running on the local machine
%>


<HTML>
    <HEAD>
        <TITLE>Using Stored Procedures</TITLE>
    </HEAD>

    <BODY bgcolor="white" topmargin="10" leftmargin="10">
        
        <!-- Display Header -->

        <font size="4" face="Arial, Helvetica">
        <b>Using Stored Procedures</b></font><p>   

		<%
			var oConn;		
			var oCmd;		
			var oRs;
			var strConn;	

			oConn = Server.CreateObject("ADODB.Connection");
			oCmd = Server.CreateObject("ADODB.Command");

			
			// Open ADO Connection using account "sa"
			// and blank password
			
			strConn="Provider=SQLOLEDB;User ID=sa;Initial Catalog=pubs;Data Source=" + Request.ServerVariables("SERVER_NAME");
			oConn.Open(strConn);
			oCmd.ActiveConnection = oConn;


			// Setup Call to Stored Procedure and append parameters

			oCmd.CommandText = "{call byroyalty(?)}";
			oCmd.Parameters.Append(oCmd.CreateParameter("@Percentage", adInteger, adParamInput));


			// Assign value to input parameter
	
			oCmd("@Percentage") = 75;		
			
			
			// Fire the Stored Proc and assign resulting recordset
			// to our previously created object variable
			
			oRs = oCmd.Execute();			
		%>

		Author ID = <% Response.Write(oRs("au_id")) %><BR>

    </BODY>
</HTML>
