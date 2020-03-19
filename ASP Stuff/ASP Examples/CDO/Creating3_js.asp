<%@ LANGUAGE = JScript %>
<!--METADATA TYPE="typelib" UUID="CD000000-8B95-11D1-82DB-00C04FB1625D"
   NAME="CDO for Windows 2000 Type Library" -->
<!--METADATA TYPE="typelib" UUID="00000205-0000-0010-8000-00AA006D2EA4"
   NAME="ADODB Type Library" -->

<%
with (objMsg) {
   To       = "\"User 33\" <user33@test-server>";
   From     = "\"User 1\" <user1@dev02>";
   Subject  = "This is the subject";
   TextBody = "JScript message.";
}


with (objMsg) {
   // The following two statements are equivalent; 
   // they both set the standard approved header of the message
   Fields.Item("urn:schemas:mailheader:approved") = 
                                           "moderator@company.com";
   //Fields.Item(CdoMailHeader.cdoApproved) = 
                                            "moderator@company.com";

   // This statement creates a custom header in the message
   Fields.Item("urn:schemas:mailheader:Custom-header") = 
                                            "This is the value";

   Fields.Update();
   Send();
}


%>