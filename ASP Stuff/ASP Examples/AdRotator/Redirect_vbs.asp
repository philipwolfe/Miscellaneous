<%
  'VBScript
  Dim MyAd
  Set MyAd = Server.CreateObject("MSWC.AdRotator")
  Response.Write MyAd.GetAdvertisement("new-ads/schedule.txt")
%>
