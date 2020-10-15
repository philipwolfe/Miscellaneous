Global_run_event_hook = true;
Global_combo_array    = new Array();
Global_ie = document.all != null;

Array.prototype.remove=function(dx)
{ 
    if(isNaN(dx)||dx>this.length){self.status='Array_remove:invalid request-'+dx;return false}
    for(var i=0,n=0;i<this.length;i++)
    {  
        if(this[i]!=this[dx])
        {
            this[n++]=this[i]
        }
    }
    this.length-=1
}

function ComboBox_make()
{
    var bt,nm;
    nm = this.name+"txt"; 
    
    this.txtview = document.createElement("INPUT")
    this.txtview.type = "text";
    this.txtview.name = nm;
    this.txtview.id = nm;
    this.txtview.className = "combo-input"
    this.view.appendChild(this.txtview);
        
    this.valcon = document.createElement("INPUT");
    this.valcon.type = "hidden";
    this.view.appendChild(this.valcon)
   
    var tmp = document.createElement("IMG");
    tmp.src = "___";
    tmp.style.width = "1px";
    tmp.style.height = "0";
    this.view.appendChild(tmp);
    
    var tmp = document.createElement("BUTTON");
    tmp.className = "combo-button";
    if(Global_ie){tmp.innerHTML = '<span style="font-family:webdings;font-size:8pt">6</span>';}
	else{tmp.style.height='24px'}
    
	this.view.appendChild(tmp);
    
    if(Global_ie)
    {
    	tmp.onfocus = function ()
        {
		    this.blur();
    	};
    }
	tmp.onclick = new Function ("", this.name + ".toggle()");
}

function ComboBox_choose(realval,txtval)
{
    this.value         = realval;
    var samstring = this.name+".view.childNodes[0].value='"+txtval+"'"
    //alert(samstring)
    window.setTimeout(samstring,1)
    //this.view.childNodes[0].value = txtval;
    this.valcon.value  = realval;
}

function ComboBox_mouseDown()
{
    var obj,len,el,i;
    el   = window.event.srcElement
    elcl = el.className
    if(elcl.indexOf("combo-")!=0)
    {
        len=Global_combo_array.length
        for(i=0;i<len;i++)
        {
            curobj = Global_combo_array[i]
            if(curobj.opslist)
            {
                curobj.opslist.style.display='none'
            }
        }
    }
}

function ComboBox_handleKey()
{
    var key,obj,eobj,el,strname;
    eobj = window.event;
    key  = eobj.keyCode;
    el   = eobj.srcElement
    elcl = el.className
    if(elcl.indexOf("combo-")==0)
    {
        if(elcl.split("-")[1]=="input")
        {
            strname = el.id.split("txt")[0]
            // erik modify //jared modify
            //obj = window.eval(el.id.split("txt")[0])//obj = window[el.id.split("txt")[0]];
            obj = window[strname];
			// end erik //end jared
			
            obj.expops.length=0
            obj.update();
            obj.build(obj.expops);
            if(obj.expops.length==1&&obj.expops[0].text=="(No matches)"){}//empty
            else{obj.opslist.style.display='block'}
            obj.value = el.value;
            obj.valcon.value = el.value;
        }
     }
}

function ComboBox_update()
{
    var opart,astr,alen,opln,i,boo;
    boo=false;
    opln = this.options.length
    astr = this.txtview.value
    alen = astr.length
    if(alen==0)
    {
        for(i=0;i<opln;i++)
        {
            this.expops[this.expops.length]=this.options[i];boo=true;
        }
    }
    else
    {
        for(i=0;i<opln;i++)
        {
            opart=this.options[i].text.substring(0,alen)
            if(astr==opart)
            {
                this.expops[this.expops.length]=this.options[i];boo=true;
            }
        }
    }
    if(!boo){this.expops[0]=new ComboBoxItem("(No matches)","")}
}


function ComboBox_remove(index)
{
    this.options.remove(index)
}

function ComboBox_add()
{
    var i,arglen;
    arglen=arguments.length
    for(i=0;i<arglen;i++)
    {
        this.options[this.options.length]=arguments[i]
    }
}

function ComboBox_build(arr)
{
    var str,arrlen
    arrlen=arr.length;str=''
    str +='<table class="combo-list-width" cellpadding=0 cellspacing=0>'
	//str +='<table cellpadding=0 style="width:153" cellspacing=0>'
    for(var i=0;i<arrlen;i++)
    {
        str += '<tr>'
        str += '<td class="combo-item" onClick="'+this.name+'.choose(\''+arr[i].value+'\',\''+arr[i].text+'\');'+this.name+'.opslist.style.display=\'none\';"'
        str += 'onMouseOver="this.className=\'combo-hilite\';" onMouseOut="this.className=\'combo-item\'" >&nbsp;'+arr[i].text+'&nbsp;</td>'
        str +='</tr>'
    }
    str +='</table>'
    
    if(this.opslist){this.view.removeChild(this.opslist);}
    
    this.opslist = document.createElement("DIV")
    this.opslist.innerHTML=str;	
    this.opslist.style.display='none';
	this.opslist.className="combo-list"
    this.opslist.onselectstart=returnFalse;
    this.view.appendChild(this.opslist);    
}

function ComboBox_toggle()
{
    if(this.opslist)
    {
        if(this.opslist.style.display=="block")
        {
            this.opslist.style.display="none"
        }
        else
        {
            this.update();
            this.build(this.options);
			this.view.style.zIndex = ++ComboBox.prototype.COMBOBOXZINDEX
            this.opslist.style.display="block"
        }
    }
    else
    {
        this.update();
        this.build(this.options);
		this.view.style.zIndex = ++ComboBox.prototype.COMBOBOXZINDEX
        this.opslist.style.display="block"
    }
}

function ComboBox()
{
    if(arguments.length==0)
    {
        self.status="ComboBox invalid - no name arg"
    }

    this.name     = arguments[0];
    this.par      = arguments[1]||document.body
    this.view     = document.createElement("DIV");
    this.view.style.position='absolute';    
    this.options  = new Array();
    this.expops   = new Array();
    this.value    = ""

    this.build  = ComboBox_build
    this.make   = ComboBox_make;
    this.choose = ComboBox_choose;
    this.add    = ComboBox_add;
    this.toggle = ComboBox_toggle;
    this.update = ComboBox_update;
    this.remove = ComboBox_remove;

    this.make()
    this.txtview = this.view.childNodes[0]
    this.valcon  = this.view.childNodes[1]
    
    this.par.appendChild(this.view)
	/*
    var span = document.createElement("SPAN");
    span.style.width = "152px";
    this.view.parentNode.insertBefore(span, this.view);
	*/
    Global_combo_array[Global_combo_array.length]=this;
    if(Global_run_event_hook){ComboBox_init()}
}

ComboBox.prototype.COMBOBOXZINDEX = 1000 //change this if you must

function ComboBox_init() 
{
    document.body.attachEvent("onkeyup",ComboBox_handleKey)
    document.body.attachEvent("onmousedown",ComboBox_mouseDown)
    Global_run_event_hook = false;
}

function returnFalse(){return false}

function ComboBoxItem(text,value)
{
    this.text  = text;
    this.value = value;
}

document.write('<link rel="STYLESHEET" type="text/css" href="ComboBox.css">')