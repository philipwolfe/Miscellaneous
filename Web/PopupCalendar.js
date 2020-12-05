function _FUI_PopCal(e) {
    closeCal();

    var evt = e || window.event;
    var el = evt.target || evt.srcElement;

    var textbox = document.getElementById(el.getAttribute('txtId'));
    if (textbox == undefined)
    {
    	alert('Date text box not found for ' + el.getAttribute('txtId'));
    	return;
    }

	var f = window.parent.document.createElement('IFRAME');
    f.name = 'frmCal';
    f.id = 'frmCal';
    f.obj = textbox.id;
    f.value = textbox.value;
    f.style.zIndex = 10;
    f.frameBorder = 0;
    f.style.position = 'absolute';
	f.style.left = _FUI_Offset(textbox, 'Left') + 'px';
    f.style.top = _FUI_Offset(textbox, 'Top') + textbox.offsetHeight + 'px'; // - calDiv.style.height;
    f.style.overflow = 'hidden';
    document.body.appendChild(f);
    f.contentWindow.document.open('text/html', 'replace');
    f.contentWindow.document.write("<!DOCTYPE html><head><title>Popup Calendar</title>" + GetCalCode() + GetCalStyle() + "</head><body bgcolor='white' onload='javascript:_FUI_load();' style='overflow:hidden;'>" + GetCalendar() + "</body></html>");
    f.contentWindow.document.close();
    var cal1 = f.contentWindow.document.body.children[0];
    f.width = cal1.clientWidth + 3;
    f.height = cal1.clientHeight + 3;
    f.style.display = '';

	window.setTimeout('window.document.addEventListener("click", closeCal)', 50);
	return false;
}

function closeCal() 
{
    var frm = document.getElementsByTagName('IFRAME')['frmCal'];
    if (frm != null)
    {
    	document.body.removeChild(frm);
    	window.document.removeEventListener("click", closeCal);
    }
}

function GetCalCode()
{
	return '<script language="javascript">var textbox;var aDaysInMonth=new Array(31,28,31,30,31,30,31,31,30,31,30,31);var aMonthNames=new Array("January","Feburary","March","April","May","June","July","August","September","October","November","December");var today=new Date();var selected=new Date();var min=new Date(1,1,1);var max=new Date(3000,1,1);function _FUI_load(){textbox=parent.document.getElementById(parent.document.getElementById("frmCal").obj);if(textbox.minvalue!="")min=new Date(Date.parse(textbox.minvalue));if(textbox.maxvalue!="")max=new Date(Date.parse(textbox.maxvalue));if(parent.document.getElementById("frmCal").value=="")drawCal(today);else{var s=parent.document.getElementById("frmCal").value.split("/");if(+s[2]<2000)s[2]=2000+parseInt(s[2]);var d=new Date(+s[2],s[0]-1,+s[1]);var isDate=((Object.prototype.toString.call(d)==="[object Date]")&&(!isNaN(d.getTime())&&d.getDate()==s[1]&&d.getMonth()==(s[0]-1)));if(!isDate){drawCal(today);alert("The value you have typed is not a date.");}else{selected=d;drawCal(selected);}}}function drawCal(dt){var month=dt.getMonth();var year=dt.getFullYear();if(year<=50)year+=2000;if(year>50&&year<100)year+=1900;aDaysInMonth[1]=(((year%4==0)&&((!(year%100==0))||(year%400==0)))?29:28);var day=1;var Day1=new Date(year,month,1);for(var w=0;w<6;w++){var row=document.getElementById("Week"+w);if(w==5)row.style.display="none";for(var d=0;d<7;d++){row.cells[d].style.textDecoration="";if(w==0&&Day1.getDay()>d){if(month==0)row.cells[d].setAttribute("value","12/"+(aDaysInMonth[11]-Day1.getDay()+d+1)+"/"+(year-1));else row.cells[d].setAttribute("value",((month+11)%12+1)+"/"+(aDaysInMonth[(month+11)%12]-Day1.getDay()+d+1)+"/"+year);row.cells[d].textContent=aDaysInMonth[(month+11)%12]-Day1.getDay()+d+1;row.cells[d].className="cal_OtherMonthDayStyle";}else if(day>aDaysInMonth[month]){if(month==11)row.cells[d].setAttribute("value","1/"+(day-aDaysInMonth[month])+"/"+(year+1));else row.cells[d].setAttribute("value",(month+2)+"/"+(day-aDaysInMonth[month])+"/"+year);row.cells[d].textContent=day-aDaysInMonth[month];row.cells[d].className="cal_OtherMonthDayStyle";day++;}else{row.cells[d].setAttribute("value",("00"+(month+1)).slice(-2)+"/"+("00"+day).slice(-2)+"/"+year);row.cells[d].textContent=day;if(selected.getDate()==day&&selected.getMonth()==month&&selected.getFullYear()==year)row.cells[d].className="cal_SelectedDayStyle";else if(today.getDate()==day&&today.getMonth()==month&&today.getFullYear()==year)row.cells[d].className="cal_TodayDayStyle";else if(d==0||d==6)row.cells[d].className="cal_WeekendDayStyle";else row.cells[d].className="cal_DayStyle";if(w==5)row.style.display="";day++;}var current=new Date(Date.parse(row.cells[d].getAttribute("value")));if((current.getFullYear()*1000+current.getMonth()*100+current.getDate())<(min.getFullYear()*1000+min.getMonth()*100+min.getDate()))row.cells[d].style.textDecoration="line-through";if((current.getFullYear()*1000+current.getMonth()*100+current.getDate())>(max.getFullYear()*1000+max.getMonth()*100+max.getDate()))row.cells[d].style.textDecoration="line-through";}}document.getElementById("Month").textContent=aMonthNames[month];document.getElementById("Month").setAttribute("value",month);document.getElementById("Year").textContent=year;parent.document.getElementById("frmCal").height=document.getElementById("cal").offsetHeight;parent.document.getElementById("frmCal").width=document.getElementById("cal").offsetWidth;}function _cellOver(e){var evt=(e==null)?event:e;var obj=(evt.srcElement!=null)?evt.srcElement:evt.target;if(obj.tagName=="TD"){obj.oldClassName=obj.className;obj.className="cal_HoverStyle";evt.stopPropagation();}}function _cellOut(e){var evt=(e!=null)?e:event;var obj=(evt.srcElement!=null)?evt.srcElement:evt.target;if(obj.tagName=="TD"){obj.className=obj.oldClassName;evt.stopPropagation();}}function _cellClick(e){document.getElementById("years").style.display="none";var evt=(e!=null)?e:event;var obj=(evt.srcElement!=null)?evt.srcElement:evt.target;if(obj.tagName=="TD"){if(obj.style.textDecoration==""){textbox.value=obj.getAttribute("value");if(textbox.onchange!=null)textbox.onchange();parent.closeCal();}evt.stopPropagation();}}function _calMove(i){document.getElementById("years").style.display="none";var month=(parseInt(document.getElementById("Month").getAttribute("value"))+i);var year=parseInt(document.getElementById("Year").textContent);if(month==-1){month=11;year--;}if(month==12){month=0;year++;}drawCal(new Date(year,month,1));}function showMonths(){document.getElementById("years").style.display="none";document.all.months.style.display="";document.all.cal.style.display="none";parent.document.getElementById("frmCal").height=document.all.months.offsetHeight;parent.document.getElementById("frmCal").width=document.all.months.offsetWidth;}function _calMonth(mo){document.getElementById("months").style.display="none";document.all.cal.style.display="";drawCal(new Date(Date.parse(mo+"/1/"+parseInt(document.getElementById("Year").textContent))));}function showYears(){var years=document.getElementById("years");for(i=1;i<8;i++){var row=years.rows[i];var yr=parseInt(document.getElementById("Year").textContent)+i-4;row.cells[0].textContent=yr;if(yr==parseInt(document.getElementById("Year").textContent))row.cells[0].className="cal_SelectedDayStyle";else row.cells[0].className="cal_DayStyle";}years.style.display="";years.style.left="175px";years.style.top="24";parent.document.getElementById("frmCal").height=years.offsetHeight+parseInt(years.style.top);}function _calYear(obj){var newVal,row,yr;if(obj.textContent.trim()=="-"){newVal=parseInt(document.getElementById("years").rows[3].cells[0].textContent);for(i=1;i<8;i++){row=document.getElementById("years").rows[i];yr=newVal+i-4;row.cells[0].textContent=yr;if(yr==parseInt(document.getElementById("Year").textContent))row.cells[0].className="cal_SelectedDayStyle";else row.cells[0].className="cal_DayStyle";}}else if(obj.textContent.trim()=="+"){newVal=parseInt(document.getElementById("years").rows[5].cells[0].textContent);for(i=1;i<8;i++){row=document.getElementById("years").rows[i];yr=newVal+i-4;row.cells[0].textContent=yr;if(yr==parseInt(document.getElementById("Year").textContent))row.cells[0].className="cal_SelectedDayStyle";else row.cells[0].className="cal_DayStyle";}}else{document.getElementById("years").style.display="none";drawCal(new Date(Date.parse(parseInt(document.getElementById("Month").getAttribute("value"))+1+"/1/"+parseInt(obj.textContent))));}}</script>';
}

function GetCalStyle()
{
	return '<style>.cal_CalendarStyle{font-size: 14pt;font-family: Arial;border: solid 1px black;color: black;text-align: center;position: absolute; top: 0; left: 0;}.cal_DayHeaderStyle{background-color: #f9f8f7;}.cal_DayStyle{border: 1px solid transparent;cursor: pointer;height:30px;}.cal_NextPrevStyle{font-size: 14pt;cursor: pointer;text-align: center;font-weight: bold;width:20px;}.cal_OtherMonthDayStyle{background-color: white;color: #dbd8d1;border: 1px solid transparent;cursor: pointer;height:30px;}.cal_SelectedDayStyle{font-weight: bold;background-color: #b6bdd2;border: solid 1px #0A246A;height:30px;}.cal_SelectorStyle{background-color: #ffcc66;}.cal_TitleStyle{font-weight: bold;color: black;background-color: #dbd8d1;cursor: pointer;}.cal_TodayDayStyle{border: solid 1px #810000;color: #810000;font-weight: bold;height:30px;}.cal_WeekendDayStyle{border: 1px solid transparent;height:30px;}.cal_HoverStyle{background-color: #b6bdd2;border: solid 1px #0A246A;font-weight: bold;color: black;cursor: pointer;height:30px;}body{-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none;-ms-user-select: none; user-select: none;</style>';
}

function GetCalendar()
{
	return '<table id="cal" class="cal_CalendarStyle"><tr><td colspan="7"><table border="0" width="275px"><tr><td id="PreviousMonth" class="cal_NextPrevStyle" onclick="_calMove(-1);">&lt;</td><td id="Month" style="text-align:center;border-right: 0px; cursor: pointer;" onclick="javascript:showMonths();"></td><td id="Year" style="border-left: 0px; cursor: pointer;" onclick="javascript:showYears();"></td><td id="NextMonth" class="cal_NextPrevStyle" onclick="_calMove(1);">&gt;</td></tr></table></td></tr><tr id="DaysRow"><td class="cal_DayHeaderStyle">S</td><td class="cal_DayHeaderStyle">M</td><td class="cal_DayHeaderStyle">T</td><td class="cal_DayHeaderStyle">W</td><td class="cal_DayHeaderStyle">R</td><td class="cal_DayHeaderStyle">F</td><td class="cal_DayHeaderStyle">S</td></tr><tr id="Week0" onclick="_cellClick(event);" onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr id="Week1" onclick="_cellClick(event);" onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr id="Week2" onclick="_cellClick(event);" onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr id="Week3" onclick="_cellClick(event);" onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr id="Week4" onclick="_cellClick(event);" onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr id="Week5" onclick="_cellClick(event);" style="display: none;" onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td colspan="7" onclick="javascript:selected = today;drawCal(today);" class="cal_TitleStyle">Go To Today</td></tr></table><table id="years" style="display: none; position: absolute; top: 0; left: 0;" class="cal_CalendarStyle" bgcolor="white" bordercolor="black" border="1"><tr onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td onclick="javascript:_calYear(this);" class="cal_DayStyle" style="font-weight: bold;">-</td></tr><tr onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td onclick="javascript:_calYear(this);" class="cal_DayStyle"></td></tr><tr onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td onclick="javascript:_calYear(this);" class="cal_DayStyle"></td></tr><tr onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td onclick="javascript:_calYear(this);" class="cal_DayStyle"></td></tr><tr onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td onclick="javascript:_calYear(this);" class="cal_DayStyle"></td></tr><tr onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td onclick="javascript:_calYear(this);" class="cal_DayStyle"></td></tr><tr onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td onclick="javascript:_calYear(this);" class="cal_DayStyle"></td></tr><tr onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td onclick="javascript:_calYear(this);" class="cal_DayStyle"></td></tr><tr onmouseover="_cellOver(event);" onmouseout="_cellOut(event);"><td onclick="javascript:_calYear(this);" class="cal_DayStyle" style="font-weight: bold;">+</td></tr></table><table id="months" style="display: none; position: absolute; top: 0; left: 0;border:1px solid black;" class="cal_CalendarStyle"><tr><td onclick="javascript:_calMonth(1);" class="cal_TitleStyle">January</td><td onclick="javascript:_calMonth(2);" class="cal_TitleStyle">February</td></tr><tr><td onclick="javascript:_calMonth(3);" class="cal_TitleStyle">March</td><td onclick="javascript:_calMonth(4);" class="cal_TitleStyle">April</td></tr><tr><td onclick="javascript:_calMonth(5);" class="cal_TitleStyle">May</td><td onclick="javascript:_calMonth(6);" class="cal_TitleStyle">June</td></tr><tr><td onclick="javascript:_calMonth(7);" class="cal_TitleStyle">July</td><td onclick="javascript:_calMonth(8);" class="cal_TitleStyle">August</td></tr><tr><td onclick="javascript:_calMonth(9);" class="cal_TitleStyle">September</td><td onclick="javascript:_calMonth(10);" class="cal_TitleStyle">October</td></tr><tr><td onclick="javascript:_calMonth(11);" class="cal_TitleStyle">November</td><td onclick="javascript:_calMonth(12);" class="cal_TitleStyle">December</td></tr></table>';
}

function _FUI_Offset(o,s)
{
	var i = 0;
	while(o)
	{
		i += eval("o.offset"+s);
		o = o.offsetParent;
	}
	
	return i;
}