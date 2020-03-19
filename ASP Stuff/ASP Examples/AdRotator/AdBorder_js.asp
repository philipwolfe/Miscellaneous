<%@ LANGUAGE="JScript"%>
<%
  //JScript
  MyAd = Server.CreateObject("MSWC.AdRotator");
  MyAd.Border = 3;
  Response.Write (MyAd.GetAdvertisement("new-ads/schedule.txt"));
%>
