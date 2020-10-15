
function hsvToRgb(hsv)
{
	var rgb = new Object();
	var i, f, p, q, t;


	if (hsv.s == 0)
	{
		// achromatic (grey)
		rgb.r = rgb.g = rgb.b = hsv.v;
		return rgb;
	}
	hsv.h /= 60; 		// sector 0 to 5
	i = Math.floor(hsv.h);
	f = hsv.h - i; 		// factorial part of h
	p = hsv.v * (1 - hsv.s);
	q = hsv.v * (1 - hsv.s * f);
	t = hsv.v * (1 - hsv.s * (1 - f));
	switch (i)
	{
		case 0:
			rgb.r = hsv.v;
			rgb.g = t;
			rgb.b = p;
			break;
		case 1:
			rgb.r = q;
			rgb.g = hsv.v;
			rgb.b = p;
			break;
		case 2:
			rgb.r = p;
			rgb.g = hsv.v;
			rgb.b = t;
			break;
		case 3:
			rgb.r = p;
			rgb.g = q;
			rgb.b = hsv.v;
			break;
		case 4:
			rgb.r = t;
			rgb.g = p;
			rgb.b = hsv.v;
			break;
		default: 	// case 5:
			rgb.r = hsv.v;
			rgb.g = p;
			rgb.b = q;
			break;
	}

	return rgb;
}

function ColorPicker_MouseDown(e)
{
	var evt = e || event;
	var el = evt.target || evt.srcElement;

	el.addEventListener("mousemove", ColorPicker_MouseMove, true);
	el.addEventListener("mouseup", ColorPicker_MouseUp, true);
	evt.preventDefault();

	ColorPicker_calculateRGB(evt, el);
}

function ColorPicker_MouseMove(e)
{
	var evt = e || event;
	var el = evt.target || evt.srcElement;
	
	ColorPicker_calculateRGB(evt, el);
}

function ColorPicker_MouseUp(e)
{
	var evt = e || event;
	var el = evt.target || evt.srcElement;

	el.removeEventListener("mousemove", ColorPicker_MouseMove, true);
	el.removeEventListener("mouseup", ColorPicker_MouseUp, true);
}

function ColorPicker_Change(e)
{
	var evt = e || event;
	var el = evt.target || evt.srcElement;
	
	if(el.type == "text")
	{
		
	}
}

function ColorPicker_calculateRGB(evt, el)
{
	if (evt.button == 1 || evt.button == 0)
	{
		var hsv = new Object();
		var h = el.offsetHeight;
		var y = evt.offsetY;

		hsv.h = 360 * evt.offsetX / el.offsetWidth;

		if (y > h / 2)
		{
			hsv.s = 1.0;
			hsv.v = 2 * (h - y) / h;
		}
		else
		{
			hsv.v = 1.0;
			hsv.s = y / (h / 2);
		}

		var rgb = hsvToRgb(hsv);

		var red = Math.min(Math.round(255 * rgb.r), 255);
		var green = Math.min(Math.round(255 * rgb.g), 255);
		var blue = Math.min(Math.round(255 * rgb.b), 255);

		var color = 'rgba(' + red + ', ' + green + ', ' + blue + ', 1)'; //  '#' + red.toHex() + green.toHex() + blue.toHex();

		var colorBox = document.getElementById('colorBox');
		colorBox.style.backgroundColor = color;

		var txtName = 'txtColor';
		if (el.getAttribute("txtctrl"))
			txtName = el.getAttribute('txtctrl');

		var colorText = document.getElementById(txtName);
		colorText.value = color;
	}
}