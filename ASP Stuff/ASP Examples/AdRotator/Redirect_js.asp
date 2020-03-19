<%@ LANGUAGE="JScript"%>
<%
  //JScript
  MyAd = Server.CreateObject("MSWC.AdRotator");
  Response.Write (MyAd.GetAdvertisement("new-ads/schedule.txt"));
%>
