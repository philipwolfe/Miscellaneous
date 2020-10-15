//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var gValidLocales = ["en", "fr", "de", "ja"];
var kNoBreakSpace = "\u00A0";
var gLocaleButtonShifts = 
{
    fr : [{
        button : "bold", offset : 52
    }, 
    {
        button : "underline",
        offset : 55
    }],
    de : [{
        button : "bold",
        offset : 53
    }, 
    {
        button : "italic",
        offset : 54
    }]
};
var gLocaleSaveCloseBoxSize = 
{
    en : [125, 300], fr : [140, 300],
    de : [135, 300],
    ja : [135, 300]
};
var kFontNameMSPGothic = "\uFF2D\uFF33\u0020\uFF30\u30B4\u30B7\u30C3\u30AF";
var kFontNameMSPMincho = "\uFF2D\uFF33\u0020\uFF30\u660E\u671D";
var kFontNameHGPGothicE = "HGP\uFF7A\uFF9E\uFF7C\uFF6F\uFF78E";
var kFontNameHGSoeikakupoptai = "HG\u5275\u82F1\u89D2\uFF8E\uFF9F\uFF6F\uFF8C\uFF9F\u4F53";
var kFontNameHGMaruGothicMPRO = "HG\u4E38\uFF7A\uFF9E\uFF7C\uFF6F\uFF78M-PRO";
var kFontNameHGSeikaishotaiPRO = "HG\u6B63\u6977\u66F8\u4F53-PRO";
var gFontMappings = 
{
    fontArial : 
    {
        fontname : "Arial", fontfamily : "arial, helvetica, sans-serif"
    },
    fontBookman : 
    {
        fontname : "Bookman",
        fontfamily : "'bookman old style', 'new york', times, serif"
    },
    fontCourier : 
    {
        fontname : "Courier",
        fontfamily : "courier, monaco, monospace, sans-serif"
    },
    fontGaramond : 
    {
        fontname : "Garamond",
        fontfamily : "garamond, 'new york', times, serif"
    },
    fontConsole : 
    {
        fontname : "Lucida Console",
        fontfamily : "'lucida console', sans-serif"
    },
    fontSymbol : 
    {
        fontname : "Symbol",
        fontfamily : "symbol"
    },
    fontTahoma : 
    {
        fontname : "Tahoma",
        fontfamily : "tahoma, 'new york', times, serif"
    },
    fontTimesNewRoman : 
    {
        fontname : "Times New Roman",
        fontfamily : "'times new roman', new york, times, serif"
    },
    fontTrebuchet : 
    {
        fontname : "Trebuchet MS",
        fontfamily : "'trebuchet ms', helvetica, sans-serif"
    },
    fontVerdana : 
    {
        fontname : "Verdana",
        fontfamily : "verdana, helvetica, sans-serif"
    },
    fontHGPGothicE : 
    {
        fontname : kFontNameHGPGothicE,
        fontfamily : kFontNameHGPGothicE + ", '" + kFontNameMSPGothic + "', sans-serif"
    },
    fontHGSoeikakupoptai : 
    {
        fontname : kFontNameHGSoeikakupoptai,
        fontfamily : kFontNameHGSoeikakupoptai + ", '" + kFontNameMSPGothic + "', sans-serif"
    },
    fontHGMaruGothicMPRO : 
    {
        fontname : kFontNameHGMaruGothicMPRO,
        fontfamily : kFontNameHGMaruGothicMPRO + ", '" + kFontNameMSPGothic + "', sans-serif"
    },
    fontHGSeikaishotaiPRO : 
    {
        fontname : kFontNameHGSeikaishotaiPRO,
        fontfamily : kFontNameHGSeikaishotaiPRO + ", '" + kFontNameMSPMincho + "', serif"
    },
    fontMSPGothic : 
    {
        fontname : kFontNameMSPGothic,
        fontfamily : "'" + kFontNameMSPGothic + "', sans-serif"
    },
    fontMSPMincho : 
    {
        fontname : kFontNameMSPMincho,
        fontfamily : "'" + kFontNameMSPMincho + "', serif"
    }
};
var gFontMenuItems = 
{
    ja : 
    {
        pre : ["fontMSPGothic", "fontMSPMincho", "fontHGPGothicE", "fontHGSoeikakupoptai", "fontHGMaruGothicMPRO", "fontHGSeikaishotaiPRO"]
    }, defaultFonts : ["fontArial", "fontBookman", "fontCourier", "fontGaramond", "fontConsole", "fontSymbol", "fontTahoma", "fontTimesNewRoman", "fontTrebuchet", "fontVerdana"]
};
var gDefaultFont = 
{
    en : "fontArial", fr : "fontArial",
    de : "fontArial",
    ja : "fontMSPGothic"
};
var gFormatMenuItems = 
{
    en : [{
        format : "number_0", text : "8,901"
    }, 
    {
        format : "number_1",
        text : "8,901.2"
    }, 
    {
        format : "number_2",
        text : "8,901.22"
    }, 0, 
    {
        format : "currency_usd_0",
        text : "$2,345"
    }, 
    {
        format : "currency_usd_2",
        text : "$2,345.67"
    }, 0, 
    {
        format : "percentage_0",
        text : "6%"
    }, 
    {
        format : "percentage_1",
        text : "6.7%"
    }, 
    {
        format : "percentage_2",
        text : "6.78%"
    }, 
    {
        format : "percentage_3",
        text : "6.789%"
    }, 0, 
    {
        format : "shortMonthDay",
        text : "m/d"
    }, 
    {
        format : "shortDate",
        text : "m/d/yy"
    }, 
    {
        format : "longDate",
        text : "m/d/yyyy"
    }, 
    {
        format : "shortDate_dmy",
        text : "d/m/yy"
    }, 
    {
        format : "longDate_dmy",
        text : "d/m/yyyy"
    }, 0, 
    {
        format : "time12",
        text : "h:mm AM/PM"
    }, 
    {
        format : "time24_padded",
        text : "hh:mm"
    }],
    fr : [{
        format : "number_0",
        text : "8\xA0901"
    }, 
    {
        format : "number_1",
        text : "8\xA0901,2"
    }, 
    {
        format : "number_2",
        text : "8\xA0901,22"
    }, 0, 
    {
        format : "currency_fr_0",
        text : "2\xA0345\xA0F"
    }, 
    {
        format : "currency_fr_2",
        text : "2\xA0345,67\xA0F"
    }, 
    {
        format : "currency_euro_after_0",
        text : "2\xA0345\xA0\u20ac"
    }, 
    {
        format : "currency_euro_after_2",
        text : "2\xA0345,67\xA0\u20ac"
    }, 0, 
    {
        format : "percentage_0",
        text : "6%"
    }, 
    {
        format : "percentage_1",
        text : "6,7%"
    }, 
    {
        format : "percentage_2",
        text : "6,78%"
    }, 
    {
        format : "percentage_3",
        text : "6,789%"
    }, 0, 
    {
        format : "shortMonthDay",
        text : "18/3"
    }, 
    {
        format : "shortDate",
        text : "18/3/01"
    }, 
    {
        format : "longDate",
        text : "18/3/2001"
    }, 0, 
    {
        format : "time24_padded",
        text : "14:35"
    }, 
    {
        format : "time24_h",
        text : "14 h 35"
    }],
    de : [{
        format : "number_0",
        text : "8.901"
    }, 
    {
        format : "number_1",
        text : "8.901,2"
    }, 
    {
        format : "number_2",
        text : "8.901,22"
    }, 0, 
    {
        format : "currency_de_0",
        text : "2.345\xA0DM"
    }, 
    {
        format : "currency_de_2",
        text : "2.345,67\xA0DM"
    }, 
    {
        format : "currency_euro_after_0",
        text : "2.345\xA0\u20ac"
    }, 
    {
        format : "currency_euro_after_2",
        text : "2.345,67\xA0\u20ac"
    }, 0, 
    {
        format : "percentage_0",
        text : "6%"
    }, 
    {
        format : "percentage_1",
        text : "6,7%"
    }, 
    {
        format : "percentage_2",
        text : "6,78%"
    }, 
    {
        format : "percentage_3",
        text : "6,789%"
    }, 0, 
    {
        format : "shortMonthDay",
        text : "18.3"
    }, 
    {
        format : "shortDate",
        text : "18.3.01"
    }, 
    {
        format : "longDate",
        text : "18.3.2001"
    }, 0, 
    {
        format : "time24_padded",
        text : "14:35"
    }, 
    {
        format : "time24_Uhr",
        text : "14.35 Uhr"
    }],
    ja : [{
        format : "number_0",
        text : "8,901"
    }, 
    {
        format : "number_1",
        text : "8,901.2"
    }, 
    {
        format : "number_2",
        text : "8,901.22"
    }, 0, 
    {
        format : "currency_jpn_0",
        text : "\xA52,345"
    }, 
    {
        format : "currency_jpn_yen_0",
        text : "2,345\u00A0\u5186"
    }, 
    {
        format : "currency_usd_2",
        text : "$2,345.67"
    }, 0, 
    {
        format : "percentage_0",
        text : "6%"
    }, 
    {
        format : "percentage_1",
        text : "6.7%"
    }, 
    {
        format : "percentage_2",
        text : "6.78%"
    }, 
    {
        format : "percentage_3",
        text : "6.789%"
    }, 0, 
    {
        format : "shortMonthDay",
        text : "3/18"
    }, 
    {
        format : "shortMonthDay_jpn",
        text : "3\u670818\u65E5"
    }, 
    {
        format : "longDate",
        text : "2001/3/18"
    }, 
    {
        format : "longDate_jpn",
        text : "2001\u5E743\u670818\u65E5"
    }, 
    {
        format : "longDate_jpn_calendar",
        text : "\u5E73\u621013\u5E743\u670818\u65E5"
    }, 0, 
    {
        format : "time12",
        text : "2:35 PM"
    }, 
    {
        format : "time24_padded",
        text : "14:35"
    }, 
    {
        format : "time24_jpn",
        text : "14\u664235\u5206"
    }, 
    {
        format : "time12_jpn",
        text : "\u5348\u5F8C2:35"
    }]
};
var gLocaleDefaults = 
{
    en : 
    {
        decimalSeparator : ".", groupingSeparator : ",",
        negativeStyle : "minusBefore",
        currencyNegativeStyle : "paren",
        dateSeparator : "/",
        ymdOrder : "mdy",
        timeSeparator : ":",
        ampm : true,
        amIndicator : "AM",
        pmIndicator : "PM",
        ampmStyle : "after"
    },
    fr : 
    {
        decimalSeparator : ",",
        groupingSeparator : kNoBreakSpace,
        negativeStyle : "minusBefore",
        dateSeparator : "/",
        ymdOrder : "dmy",
        timeSeparator : ":",
        ampm : false,
        amIndicator : "AM",
        pmIndicator : "PM",
        ampmStyle : "after"
    },
    de : 
    {
        decimalSeparator : ",",
        groupingSeparator : ".",
        negativeStyle : "minusBefore",
        dateSeparator : ".",
        ymdOrder : "dmy",
        timeSeparator : ":",
        ampm : false,
        amIndicator : "AM",
        pmIndicator : "PM",
        ampmStyle : "after"
    },
    ja : 
    {
        decimalSeparator : ".",
        groupingSeparator : ",",
        negativeStyle : "minusBefore",
        dateSeparator : "/",
        ymdOrder : "ymd",
        timeSeparator : ":",
        ampm : false,
        amIndicator : "AM",
        pmIndicator : "PM",
        ampmStyle : "after"
    }
};
var gFormatList = 
{
    num : 
    {
        parent : "localeDefault", type : "number",
        requiredDigits : 0
    },
    number_0 : 
    {
        parent : "num",
        requiredDigits : 1,
        requiredDecimals :- 1
    },
    number_1 : 
    {
        parent : "num",
        requiredDigits : 1,
        requiredDecimals : 1
    },
    number_2 : 
    {
        parent : "num",
        requiredDigits : 1,
        requiredDecimals : 2
    },
    number_3 : 
    {
        parent : "num",
        requiredDigits : 1,
        requiredDecimals : 3
    },
    curr : 
    {
        parent : "num",
        type : "currency",
        requiredDigits : 1
    },
    currency_usd : 
    {
        parent : "curr",
        currencySymbol : "$",
        currencyDesc : "USD",
        currencyStyle : "before"
    },
    currency_usd_0 : 
    {
        parent : "currency_usd",
        requiredDecimals :- 1
    },
    currency_usd_2 : 
    {
        parent : "currency_usd",
        requiredDecimals : 2
    },
    currency_euro : 
    {
        parent : "curr",
        currencySymbol : "\u20ac",
        currencyDesc : "EURO",
        currencyStyle : "before"
    },
    currency_euro_0 : 
    {
        parent : "currency_euro",
        requiredDecimals :- 1
    },
    currency_euro_2 : 
    {
        parent : "currency_euro",
        requiredDecimals : 2
    },
    currency_euro_after : 
    {
        parent : "currency_euro",
        currencyStyle : "afterSpace"
    },
    currency_euro_after_0 : 
    {
        parent : "currency_euro_after",
        requiredDecimals :- 1
    },
    currency_euro_after_2 : 
    {
        parent : "currency_euro_after",
        requiredDecimals : 2
    },
    currency_fr : 
    {
        parent : "curr",
        currencySymbol : "F",
        currencyDesc : "FRF",
        currencyStyle : "afterSpace"
    },
    currency_fr_0 : 
    {
        parent : "currency_fr",
        requiredDecimals :- 1
    },
    currency_fr_2 : 
    {
        parent : "currency_fr",
        requiredDecimals : 2
    },
    currency_de : 
    {
        parent : "curr",
        currencySymbol : "DM",
        currencyDesc : "DEM",
        currencyStyle : "afterSpace"
    },
    currency_de_0 : 
    {
        parent : "currency_de",
        requiredDecimals :- 1
    },
    currency_de_2 : 
    {
        parent : "currency_de",
        requiredDecimals : 2
    },
    currency_jpn : 
    {
        parent : "curr",
        currencySymbol : "\u00a5",
        currencyDesc : "JPY",
        currencyStyle : "before"
    },
    currency_jpn_0 : 
    {
        parent : "currency_jpn",
        requiredDecimals :- 1
    },
    currency_jpn_yen_0 : 
    {
        parent : "currency_jpn_0",
        locale : "ja",
        currencySymbol : "\u5186",
        currencyStyle : "afterSpace"
    },
    percent : 
    {
        parent : "num",
        requiredDigits : 1,
        multiplier : 100,
        suffix : "%"
    },
    percentage_0 : 
    {
        parent : "percent",
        requiredDecimals :- 1
    },
    percentage_1 : 
    {
        parent : "percent",
        requiredDecimals : 1
    },
    percentage_2 : 
    {
        parent : "percent",
        requiredDecimals : 2
    },
    percentage_3 : 
    {
        parent : "percent",
        requiredDecimals : 3
    },
    dateAndTime : 
    {
        parent : "localeDefault",
        type : "dateTime",
        showYear : true,
        showMonth : true,
        showDay : true,
        yearType : "longNumber",
        showHour : true,
        showMinute : true,
        showSecond : false,
        padMinute : true
    },
    date : 
    {
        parent : "dateAndTime",
        showYear : true,
        showMonth : true,
        showDay : true
    },
    shortDate : 
    {
        parent : "dateAndTime",
        type : "shortDate",
        yearType : "shortNumber"
    },
    shortDate_padded : 
    {
        parent : "shortDate",
        padMonth : true,
        padDay : true
    },
    shortMonthDay : 
    {
        parent : "shortDate",
        showYear : false
    },
    shortMonthDay_jpn : 
    {
        parent : "shortMonthDay",
        locale : "ja",
        dateSeparator : "none",
        monthSuffix : "\u6708",
        daySuffix : "\u65E5"
    },
    shortMonthYear : 
    {
        parent : "shortDate",
        showDay : false
    },
    shortDate_dmy : 
    {
        parent : "shortDate",
        locale : "en",
        ymdOrder : "dmy"
    },
    shortDate_dmy_padded : 
    {
        parent : "shortDate_dmy",
        locale : "en",
        padMonth : true,
        padDay : true
    },
    longDate : 
    {
        parent : "dateAndTime",
        type : "longDate",
        yearType : "longNumber"
    },
    longDate_padded : 
    {
        parent : "longDate",
        padMonth : true,
        padDay : true
    },
    longMonthYear : 
    {
        parent : "longDate",
        showDay : false
    },
    longMonthYear_jpn : 
    {
        parent : "longMonthYear",
        locale : "ja",
        dateSeparator : "none",
        yearSuffix : "\u5E74",
        monthSuffix : "\u6708"
    },
    longDate_dmy : 
    {
        parent : "longDate",
        locale : "en",
        ymdOrder : "dmy"
    },
    longDate_dmy_padded : 
    {
        parent : "longDate_dmy",
        locale : "en",
        padMonth : true,
        padDay : true
    },
    longDate_jpn : 
    {
        parent : "longDate",
        locale : "ja",
        dateSeparator : "none",
        yearSuffix : "\u5E74",
        monthSuffix : "\u6708",
        daySuffix : "\u65E5"
    },
    longDate_jpn_calendar : 
    {
        parent : "longDate_jpn",
        locale : "ja",
        yearType : "jpn"
    },
    time : 
    {
        parent : "dateAndTime",
        type : "time"
    },
    time12 : 
    {
        parent : "time",
        ampm : true
    },
    time12_seconds : 
    {
        parent : "time12",
        showSecond : true
    },
    time12_jpn : 
    {
        parent : "time12",
        locale : "ja",
        ampmStyle : "before",
        amIndicator : "\u5348\u524D",
        pmIndicator : "\u5348\u5F8C"
    },
    time24 : 
    {
        parent : "time",
        ampm : false
    },
    time24_padded : 
    {
        parent : "time24",
        padHour : true
    },
    time24_seconds : 
    {
        parent : "time24_padded",
        showSecond : true
    },
    time24_h : 
    {
        parent : "time24",
        locale : "fr",
        hourSuffix : "\u00A0h\u00A0",
        timeSeparator : "none"
    },
    time24_Uhr : 
    {
        parent : "time24_padded",
        locale : "de",
        timeSeparator : ".",
        minuteSuffix : "\u00A0Uhr"
    },
    time24_jpn : 
    {
        parent : "time24",
        locale : "ja",
        timeSeparator : "none",
        hourSuffix : "\u6642",
        minuteSuffix : "\u5206"
    },
    comma : 
    {
        parent : "number_0"
    },
    comma_1 : 
    {
        parent : "number_1"
    },
    comma_2 : 
    {
        parent : "number_2"
    },
    comma_3 : 
    {
        parent : "number_3"
    },
    currency : 
    {
        parent : "currency_usd_0"
    },
    currency_2 : 
    {
        parent : "currency_usd_2"
    },
    percentage : 
    {
        parent : "percentage_0"
    },
    dateTime : 
    {
        parent : "shortDate"
    },
    dateMDYY : 
    {
        parent : "shortDate"
    },
    dateMDYYYY : 
    {
        parent : "longDate"
    },
    dateDMYY : 
    {
        parent : "shortDate_dmy"
    },
    dateDMYYYY : 
    {
        parent : "longDate_dmy"
    },
    dateMMDDYY : 
    {
        parent : "shortDate_padded"
    },
    dateMMDDYYYY : 
    {
        parent : "longDate_padded"
    },
    dateDDMMYY : 
    {
        parent : "shortDate_dmy_padded"
    },
    dateDDMMYYYY : 
    {
        parent : "longDate_dmy_padded"
    },
    timeHMMAP : 
    {
        parent : "time12"
    },
    timeHHMM : 
    {
        parent : "time24_padded"
    },
    timeHMMSSAP : 
    {
        parent : "time12_seconds"
    },
    timeHHMMSS : 
    {
        parent : "time24_seconds"
    },
    longDatePadded : 
    {
        parent : "longDate_padded"
    },
    clockTime : 
    {
        parent : "time12"
    },
    clockTime_jpn : 
    {
        parent : "time12_jpn"
    },
    fullTime : 
    {
        parent : "time24"
    },
    fullTimePadded : 
    {
        parent : "time24_padded"
    },
    fullTime_h : 
    {
        parent : "time24_h"
    },
    fullTime_Uhr : 
    {
        parent : "time24_Uhr"
    },
    fullTime_jpn : 
    {
        parent : "time24_jpn"
    }
};
function lookupFormat(Z){
    var Y = gFormatList[Z];
    if(Y == "undefined")
        return null;
    return Y;
}
function resolveFormat(Z, Y){
    var X;
    if(Z == "undefined"){
        return null;
    }
    if(Z == "localeDefault"){
        X = new Object();
        mergeObject(Y, X);
    }
    else{
        var W = lookupFormat(Z);
        if(W == null)
            return null;
        X = resolveFormat(W.parent, Y);
        mergeObject(W, X);
    }
    return X;
}
function getFormat(Z, Y){
    return resolveFormat(Z, gLocaleDefaults[Y]);
}
function isValidLocale(Z){
    var Y;
    for(Y = 0; Y < gValidLocales.length; Y ++ ){
        if(Z == gValidLocales[Y])
            return true;
    }
    return false;
}