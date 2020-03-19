<%
'----------------------------------------------------------- 5
   sub log
'-----------------------------------------------------------
   url        = Request.ServerVariables("URL")
   ip_address = Request.ServerVariables("REMOTE_ADDR")
   browser    = Request.ServerVariables("HTTP_USER_AGENT")
   language   = Request.ServerVariables("HTTP_ACCEPT_LANGUAGE")
   where_from = Request.ServerVariables("HTTP_REFERER")
   '
   '--- filter out what we don't want
   '
   filter_out = "207.149.222"
   if file_exists("/utility/stats/filter_off.txt") then filter_out = "nothing"
   if mid(ip_address,1,11) = filter_out then exit sub
   '
   '--- edit out crap from browser info
   '
   spot = instr(browser,"compatible; ")
   if spot > 0 then 
      browser = mid(browser,spot+12)        ' zap Mozilla compatible
      browser = mid(browser,1,len(browser)-1) ' zap trailing parenthesis
   end if
   '
   if lcase(mid( where_from, 1, 7)) = "http://" then 
      where_from = mid( where_from, 8)
   end if
   '
   '----- format info line
   '
   s = "  "
   url        = mid("<" & url        & ">                            ", 1, 35)
   myTime     = mid("<" & now()      & ">                            ", 1, 22)
   ip_address = mid("<" & ip_address & ">                            ", 1, 17)
   browser    = mid("<" & browser    & ">                            ", 1, 45)
   language   = mid("<" & language   & ">                            ", 1, 20)
   where_from = "<" & where_from & ">"
   '
   my_info = url & s & myTime & s & ip_address & s & browser & s & language & s & where_from
   my_info = my_info & CrLf
   '
   myFilename = "/utility/stats/log__" & mid(timestamp_fn,1,8) & ".txt"
   '
   write_or_append_file   myFilename, my_info

end sub

%>