<%@ LANGUAGE="JScript"%>
<%
  //JScript
  MyAd = Server.CreateObject("MSWC.AdRotator");
  MyAd.Clickable = False;
  Response.Write (MyAd.GetAdvertisement("new-ads/schedule.txt"));
%>
