//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var kFullTextBoxString=getString("strTextBoxFull");var gDialogParent=null;function filterDialog(){event.cancelBubble=true;if(gDialogParent==null)return false;var Z;switch(event.type){case"keypress":break;case"mousedown":Z=event.srcElement;switch(Z.className){case"optionItem":setOption(Z.parentElement,Z.name);break;default:break;}while((Z!=gDialogParent) &&(Z!=null))Z=Z.parentElement;if(Z!=gDialogParent)event.returnValue=false;break;case"click":Z=event.srcElement;if((Z!=null) ||(Z.id!=null))if((Z.tagName=="INPUT") &&(Z.type=="button"))buttonCommand(Z.id);break;case"selectstart":case"selecttrack":event.returnValue=false;break;default:break;}return true;}function writeOption(Z,Y,X,W){var V="<div class='optionItem'";if(Z!=null)V+=" name="+Z;V+=" style='";if(X)V+=" color:white; background-color:darkblue;";if(W=="italic")V+=" font-style:italic;";else if(W=="bold")V+=" font-weight:bold;";return V+"'>"+Y+"</div>";}function setOption(Z,Y){if(Z==null)return;for(var X=0;X<Z.children.length;X++){var W=Z.children[X];if(W.className!="optionItem")continue;if(W.name==Y){W.style.color="white";W.style.backgroundColor="darkblue";if(Z.setHook)Z.setHook(W);}else{W.style.color="black";W.style.backgroundColor="white";}}}function getOption(Z){if(Z==null)return;for(var Y=0;Y<Z.children.length;Y++){var X=Z.children[Y];if(X.className!="optionItem")continue;if((X.style.color=="white") &&(X.style.backgroundColor=="darkblue"))return X.name;}return null;}function setSwatch(Z,Y){if(Z==null)return;Y=Y.toLowerCase();for(var X=0;X<Z.children.length;X++){var W=Z.children[X];if((W.className!="largeswatch") &&(W.className!="swatch"))continue;if(W.style.backgroundColor==Y){W.style.padding="0px";W.style.borderWidth="3px";}else if(W.style.padding=="0px"){W.style.padding="2px";W.style.borderWidth="1px";}}}function getSwatch(Z){if(Z==null)return;for(var Y=0;Y<Z.children.length;Y++){var X=Z.children[Y];if((X.className!="largeswatch") &&(X.className!="swatch"))continue;if((X.style.padding=="0px"))return X.style.backgroundColor;}return null;}function element2palette(Z){while(Z&&(Z.className!="palette"))Z=getParent(Z);return Z;}function insidePalette(Z){Z=element2palette(Z);return(Z!=null);}function updateGUI(Z){var Y=getElement("btnOverview");if(Y){if(gPageMode==kShowMode){offsetElement(Y,26,true);Y.title="Go to Overview";}else{offsetElement(Y,27,true);Y.title="Leave Overview";}}if(kMode!="design")return;var X=kindModel(Z);var W=Z;var V=retrieveModel;if(X=="frame"){W=alternateModel(Z,"fontFamily");if(kindModel(W)=="frame")V=retrieveRecursive;}var U=V(W,"fontFamily");U=U?capitalizeWords(U.split(",")[0]):"Arial";fontSpot.value=U;U=V(W,"fontSize");U=U?U:"10";sizeSpot.value=U+" pt";resetButton(bold,V(W,"fontWeight")=="bold");resetButton(italic,V(W,"fontStyle")=="italic");resetButton(underline,V(W,"textDecoration")=="underline");U=V(W,"fontColor");U=emptyColor(U)?"black":U;setStyle(fontColorMenuSpot,"backgroundColor",U);U=V(W,"textAlign");resetButton(left,U=="left");resetButton(center,U=="center");resetButton(right,U=="right");W=alternateModel(Z,"color");U=retrieveModel(W,"color");U=emptyColor(U)?"black":U;setStyle(lineColorMenuSpot,"backgroundColor",U);U=retrieveModel(W,"borderWidth");setStyle(lineSpot,"height",U);setStyle(lineSpot,"top",12-(U/2));setStyle(lineSpot,"backgroundColor",(U==null)?"lightgrey":"gray");W=alternateModel(Z,"backgroundColor");U=retrieveModel(W,"backgroundColor");U=emptyColor(U)?"white":U;setStyle(fillColorMenuSpot,"backgroundColor",U);}function resetButton(Z,Y){if(Y==true){setValue(Z,"true");offsetButton(Z,2);}else{setValue(Z,"false");offsetButton(Z,0);}}function overButton(Z){Z=element2button(Z);if(Z==null)return;if(Z.value=="true")offsetButton(Z,2);else offsetButton(Z,1);}function outButton(Z){Z=element2button(Z);if(Z==null)return;if(Z.value=="true")offsetButton(Z,2);else offsetButton(Z,0);}function downButton(Z){Z=element2button(Z);if(Z!=null)offsetButton(Z,2);return Z;}function upButton(Z){Z=element2button(Z);if(Z!=null)offsetButton(Z,1);return Z;}function insideButton(Z){Z=element2button(Z);return(Z!=null);}function element2button(Z){while((Z!=null) &&!((Z.className=="button") ||(Z.className=="spinButton")))Z=Z.parentElement;return Z;}function offsetButton(Z,Y,X){offsetElement(Z,Y);}function offsetElement(Z,Y,X){var W;switch(Z.className){case"holder":W=-16;break;default:W=-24;break;}if(X)setBackgroundX(Z,Y*W);else setBackgroundY(Z,Y*W);}function setButtonHOffset(Z,Y){offsetElement(Z,Y);}function pressButton(Z){var Y=false;var X=null;switch(Z.id){case"new":newCommand();break;case"open":openCommand();break;case"save":saveCommand();break;case"btnSave":saveCommand(false,true);break;case"print":case"btnPrint":printCommand();break;case"undo":undoCommand();break;case"redo":redoCommand();break;case"cut":cutCommand();break;case"copy":copyCommand();break;case"paste":pasteCommand();break;case"format":comingSoon();break;case"ptsizedown":bumpUtility("fontSize",-2,1,500);break;case"ptsizeup":bumpUtility("fontSize",2,1,500);break;case"bold":toggleUtility("fontWeight","bold","normal",Y);break;case"italic":toggleUtility("fontStyle","italic","normal",Y);break;case"smallcap":toggleUtility("fontVariant","small-caps","normal",Y);break;case"underline":toggleUtility("textDecoration","underline","none",Y);break;case"left":case"center":case"right":decorateUtility("textAlign",Z.id,Y);return;case"edit":postModeCommand(kEditMode);break;case"sort":postModeCommand(kSortMode);break;case"show":if(window.event.ctrlKey)outputOutline();else modeDocument(kShowMode);break;case"expandone":openModelUtility(true,false,false);break;case"collapseone":openModelUtility(false,false,false);break;case"expandall":openModelUtility(true,true,true);break;case"collapseall":openModelUtility(false,true,true);break;case"moveup":postOutlineMove(targetModel(getModel()).index,"moveUp",getString("strMoveUp"));break;case"movedown":postOutlineMove(targetModel(getModel()).index,"moveDown",getString("strMoveDown"));break;case"demote":var W=targetModel(getModel());postOutlineMove(W.index,"moveRight",getString("strDemote"));break;case"promote":postOutlineMove(targetModel(getModel()).index,"moveLeft",getString("strPromote"));break;case'btnInstruction':ShowSummary();break;case"btnEdit":EditAsPresentation();break;case"btnEmail":ShowEmail(gAppId);break;case"btnBugs":DoBugReport("presentation");break;case"btnStart":jumpUtility("first");break;case"btnPrev":jumpUtility("prev");break;case"btnNext":jumpUtility("next");break;case"btnEnd":jumpUtility("last");break;case"btnOverview":modeDocument((gPageMode==kShowMode)?kSortMode:kShowMode);break;default:comingSoon("["+Z.id+"]");break;}}function getOptionHTML(Z,Y,X){var W='<option';if(Y!=null)W+=' value="'+Y+'"';if(X)W+=' selected';W+='>';if(Z)W+=Z;return W;}function ShowSummary(){var Z=bestWindowSize(650,530);var Y=window.open(kRootUrl+gFileSummaryScript+"?read=true&id="+gAppId,"summaryWin",'width='+Z.width+',height='+Z.height+',resizable,scrollbars');Y.focus();}function ReopenInEditor(Z){if(Z){gSaveFollowUp="ReopenInEditor(false);";saveCommand();}else{resetContext();window.location.href=kRootUrl+gOpenScript+"?mode=d&id="+gAppId;}}function EditAsPresentation(){if(changedContext())hb_confirm(getString("strSaveBeforeEdit"),getString("strEditPresentation"),getString("strSave"),getString("strDontSave"),getString("strCancel"),"ReopenInEditor(true)","ReopenInEditor(false)","");else ReopenInEditor(false);}function ShowEmail(Z){if(Z!=''){var Y=bestWindowSize(550,410);var X=window.open(kRootUrl+gSendMailScript+"?srcMode=d&spreadsheetID="+Z,"emailWin",'width='+Y.width+',height='+Y.height+',resizable,scrollbars');X.focus();}else{hb_alert(getString("strSavePrBeforeEmail"),getString("strEmailPresentation"));}}function buildJumpMenu(Z){if(Z==null||Z=="")Z="jumpList";var Y=getElement(Z);if(Y==null)return;var X=descendModel(getModel(),"folder",kSlidesName);var W=countModel(X);var V,U="",T=null,S=-1;if(W==0){V=getString("strNoSlides");if(is.nav4)V="<font face='tahoma,helvetica,arial,sans-serif' point-size=9pt>"+V+"</font>";W=1;U+="<div class=largeItem style='top:0px;left:0px;height:16px;width:100%;'><i>"+V+"</i></div>";}else{var R=node2slide(targetModel());var Q=R?R.index:null;for(var P=0;P<W; ++P){var O=childModel(X,P);var N=textModel(O);var M=false;V="";N=mungeString(N,kMungePlainText);if(N=="")N="slide #"+(P+1);if(O.index==Q){T=O.index+"jump";S=P;M=true;}N=((P<9)?"&nbsp;":"")+(P+1)+".&nbsp;&nbsp;"+N;V="<div id='"+O.index+"jump' class=largeItem style='padding-left:4px;top:"+(P*16)+"px;left:2px;height:16px;width:100%;'>"+N+"</div>";if(M)V="<b>"+V+"</b>";V="<nobr>"+V+"</nobr>";U+=V;}}var L=W*16+4;if(L>(windowBounds().height-40)){L=windowBounds().height-40;U="<div id=jumpContainer class=menuContainer style='height:"+(L+12)+";'>"+U+"</div>";}setHeight(Y,L);if(U!=Y.innerHTML)writeDocumentContents(Y,U);var K=getElement('jumpContainer');if(K&&T)revealChild(K,getElement(T));}function adjustJumpMenu(Z){if(Z==null||Z=="")Z="jumpList";var Y=getElement(Z);if(Y==null)return;var X=getChild(Y,"jumpContainer");if(X==null)return;var W=descendModel(getModel(),"folder",kSlidesName);var V=countModel(W);if(V==0)return;var U=-1;var T=node2slide(targetModel());var S=T?T.index:null;var R=X.document.layers;for(var Q=0;Q<V; ++Q){var P=childModel(W,Q);if(P.index==S)U=Q;var O=R[Q];if(O){O.bgColor=(P.index==S)?"lightsteelblue":"lightgrey";setHeight(O,16);setWidth(O,200);}}if(U==-1)return;var N=V*16+2;var M=N;var L=windowBounds().height-40;var K=0;if(N>L){if(U!=-1){var J=((U+1)*16+1);var I=L/2+8;if(J>(L-48)){K=I-J;if(K+N<L)K=L-N;}}N=L;}X.top=K;var H=X.clip.height;X.clip.top=-K+1;X.clip.height=H;}function updateJumpMenu(Z,Y){if(Y==null||Y=="")Y="jumpList";var X=getElement(Y);if(X==null)return;var W=getChild(X,"jumpContainer");if(W==null)return;var V=descendModel(getModel(),"folder",kSlidesName);var U=countModel(V);if(U==0)return;var T=index2slide(Z);if(kindModel(T) !="slide")return;var S=T.index;for(var R=0;R<U; ++R){var Q=childModel(V,R);if(Q.index==S){var P=textModel(Q);P=mungeString(P,kMungePlainText);if(P=="")P="slide #"+(R+1);P=((R<9)?"&nbsp;":"")+(R+1)+".&nbsp;&nbsp;"+P;P="<font face='tahoma,helvetica,arial,sans-serif' point-size=9pt>"+"&nbsp;"+P+"</font>";var O=W.document.layers[R];if(O)writeDocumentContents(O,P,1);break;}}}var gBuzzwords={};gBuzzwords.wordList=[];gBuzzwords.isSelected=false;gBuzzwords.kDisplayNumber=10;gBuzzwords.kDisplayWidth=250;function haveEnoughBuzzwords(){return(gBuzzwords.wordList.length>=gBuzzwords.kDisplayNumber);}function createBuzzwordDialog(){var Z=currModal();if(Z!=null)return;gBuzzwords.isSelected=false;var Y='<select id=buzzwordSelect'+' size='+gBuzzwords.kDisplayNumber+' style="width:'+gBuzzwords.kDisplayWidth+'"'+'>';var X='';for(var W=0;W<gBuzzwords.kDisplayNumber;W++){if(W==0&&!haveEnoughBuzzwords()){X='loading buzzwords...';}else X='';Y+=getOptionHTML(X,W,false);}Y+='</select>';var V=[{type:'raw',value:Y}];var U=[{type:'accept',value:getString("strInsert")},{type:'other',value:"Find More",onclick:"refreshBuzzwords();"},{type:'cancel'}];openModal('buzzwordDialog','Find Buzzword','',"pasteBuzzword()","closeModal()",V,U,null);setTimeout("refreshBuzzwords();",0);}function writeBuzzwordOptions(){var Z=getElement("buzzwordSelect");var Y=gBuzzwords.wordList.length-1;for(var X=0;X<gBuzzwords.kDisplayNumber;X++){var W=Math.round(Math.random()*Y);var V=gBuzzwords.wordList[W];var U=gBuzzwords.wordList.slice(0,W);if(W<Y){U=U.concat(gBuzzwords.wordList.slice(W+1));}gBuzzwords.wordList=U;Z.options[X].text=V; --Y;}if(!gBuzzwords.isSelected){Z.options[0].selected=true;gBuzzwords.isSelected=true;}}function getBuzzwordsFromServer(){var Z=getElement("buzzwordResource");if(Z)setElementSrc(Z,"/buzzwords");}function refreshBuzzwords(){if(haveEnoughBuzzwords())writeBuzzwordOptions();else getBuzzwordsFromServer();}function loadBuzzwordsIntoJS(Z){gBuzzwords.wordList=Z;refreshBuzzwords();}function pasteBuzzword(){closeModal();var Z=getElement("buzzwordSelect");var Y=Z.options[Z.selectedIndex];var X=Y.text;if(gEditorSelection==null){postCreateCommand("textbox",X);}else{gEditorSelection.range.text=X;setTimeout("saveEditorSelection();",0);}}function firstWord(Z){var Y,X,W,V;;if(Z.text=="")Z.expand("character");if(Z.text=="")Z.moveStart("character",-1);if(Z.text=="")return"";Y=Z.text.length;X=Y;W=false;while(Z.text.charAt(0).search(/\W/)==-1){V=Z.getBookmark();Z.moveStart("character",-1);Y=Z.text.length;if(X==Y){W=true;Z.moveToBookmark(V);break;}X=Y;}if(!W)Z.moveStart("character",1);Y=Z.text.length;X=Y;while(Z.text.search(/\W/)==-1){V=Z.getBookmark();Z.moveEnd("character",1);Y=Z.text.length;if(X==Y){Z.moveToBookmark(V);break;}X=Y;}var U=Z.text.search(/\W/);if(U!=-1){Z.moveEnd("character",-(Z.text.length-U));}}function getSelectedWord(){if(gEditorSelection==null)return"pickle";var Z=gEditorSelection.range.duplicate();firstWord(Z);if(Z.text=="")return"pickle";return Z.text;}function expandSelectedWord(){if(gEditorSelection==null)return"pickle";firstWord(gEditorSelection.range);if(gEditorSelection.range.text=="")return"pickle";gEditorSelection.range.select();return gEditorSelection.range.text;}var gSelectedWord=null;function expandSelectedWord2(){if(!usingEditor() ||gEditorSelection==null)return"pickle";gSelectedWord=gEditorSelection.range.duplicate();firstWord(gSelectedWord);if(gSelectedWord.text==""){delete gSelectedWord;gSelectedWord=null;return"pickle";}return gSelectedWord.text;}function callOnKeyUp(Z,Y){if(window.event.type=="keyup"){if(window.event.keyCode==Z){window.event.cancelBubble=true;Y();}}}function modalBookLookup(Z,Y){var X=currModal();if(X!=null)return;closeEditor();var W="";var V="";V='onkeyup="callOnKeyUp( 13, bookLookup )" ';W+='<nobr>';W+='Word: ';W+='<input type="text" id="wordLookupField" class="modalInput" tabindex=-1 ';W+='value="'+Y+'" size=40 maxlength=240 ';W+=V+'>&nbsp';W+=makeModalButton("wordLookupButton","bookLookup('"+Z+"')","Lookup");W+='</nobr>';var U="";U='<div id=wordDefinitionScroller class=modalScrollable>'+'<div id=wordDefinitionOutput class=modalBigContents>'+'</div>'+'</div>';var T=[{type:'raw',value:W},{type:'raw',value:U}];var S=[{type:'accept',value:'Close'}];openModal('bookLookupDialog',Z+" lookup","","closeModal()","closeModal()",T,S,null);var R=modalDialog;if(R==null)return;R.book=Z;setTimeout("bookLookup()",0);}function bookLookup(){var Z="";var Y=currModal();if(Y==null)return;if(Y!="bookLookupDialog")return;var X=modalDialog;var W=X.book;var V=wordLookupField;if(V==null)return;Z=V.value;if(Z=="")return;var U="/dictionary?word="+Z+"&book="+W;var T=getResource(U,"foo",showBookLookup);var S=wordDefinitionOutput;setInner(S,'Looking up "'+Z+'"...');V.select();V.focus();}function showBookLookup(Z,Y){var X="";var W=getResource(Y,"foo",showBookLookup);if(W.error){X+=W.error.tooltip;}else if(W.data){X+=W.data;}else{X+="Problem finding word";}var V=wordDefinitionOutput;setInner(V,X);var U=wordLookupField;U.select();if(getVisible(U))U.focus();}function callOnKeyUp(Z,Y){if(window.event.type=="keyup"){if(window.event.keyCode==Z){window.event.cancelBubble=true;Y();}}}function modalThesaurusLookup(Z){var Y=currModal();if(Y!=null)return;var X="";X+='<nobr>';X+='Word: ';X+='<input type="text" id="wordLookupField" class="modalInput" value="'+Z+'" ';X+='size=40 maxlength=240 onkeyup="callOnKeyUp( 13, thesaurusLookup )">&nbsp';X+=makeModalButton("wordLookupButton","thesaurusLookup()","Lookup");X+='</nobr>';var W="";W+='<B>Synonyms:</B><br>';W+='<select name=synonymMenuSelect id=synonymSelect size=10 style="width:400"></select>';var V=[{type:'raw',value:X},{type:'raw',value:W}];var U=[{type:'accept',value:'Substitute'},{type:'cancel',value:'Cancel'}];openModal('thesaurusLookupDialog',"Thesaurus Lookup","","substituteSynonym2()","closeModal()",V,U,null);setTimeout("thesaurusLookup()",0);}function thesaurusLookup(){var Z="";var Y=currModal();if(Y==null)return;if(Y!="thesaurusLookupDialog")return;var X=wordLookupField;if(X==null)return;Z=X.value;if(Z=="")return;var W="/dictionary?word="+Z+"&book="+"Thesaurus";var V=getResource(W,"funggoo",showThesaurusLookup);var U=synonymSelect;if(U.options&&U.options.length!=0)U.options.length=0;U.options[0]=new Option('Looking up synonyms of "'+Z+'"...',"lookingItUp");X.select();X.focus();}function showThesaurusLookup(Z,Y){var X=getResource(Y,"funggoo",showThesaurusLookup);var W=synonymSelect;if(W.options&&W.options.length!=0)W.options.length=0;if(X.error){W.options[0]=new Option(X.error.tooltip,"error");}else if(X.data){var V=0;for(var U=0;U<X.data.length;U++){var T=X.data[U].split(',');for(var S=0;S<T.length;S++){W.options[V++]=new Option(T[S],T[S]);}}W.selectedIndex=0;}else{W.options[0]=new Option("Problem finding definition","error");}}function substituteSynonym(){closeModal();if(gEditorSelection==null)return;var Z=synonymSelect;if(Z.options==null||Z.options.length==0)return;if(Z.selectedIndex==-1)return;var Y=Z.options[Z.selectedIndex];var X=Y.text;var W=/No entries found for/;if(W.test(X))return;gEditorSelection.range.text=X;setTimeout("saveEditorSelection();",0);}function substituteSynonym2(){closeModal();if(gSelectedWord==null)return;var Z=synonymSelect;if(Z.options==null||Z.options.length==0)return;if(Z.selectedIndex==-1)return;var Y=Z.options[Z.selectedIndex];var X=Y.text;var W=/No entries found for/;if(W.test(X))return;gSelectedWord.text=X;gSelectedWord.select();setTimeout("saveEditorSelection();",0);}function lookupWord(Z,Y){var X="/dictionary?word="+Y+"&book="+Z;var W=new Function("lookupWord(\""+Z+"\",\""+Y+"\");");var V=getResource(X,"foo",W);if(V.error){hb_alert(V.error.error,Y);}else if(V.data){var U="";if(Z=="image"||Z=="Thesaurus"){var T=(Z=="image")?3:V.data.length;for(var S=0;S<T;S++){U+=V.data[S]+"\n";}}else{U=V.data;}closeModal();hb_alert("<div style='width:500;'></div>"+U,Y);}}var gMenuList=new Array();function attachMenu(Z,Y,X){var W=getElement(Z);var V=getElement(Y);var U=getElement(X);if(W!=null){if(V!=null){W.spot=V;V.menu=W;}if(U!=null&&U!=W){W.list=U;U.menu=W;}}}function overMenu(Z){Z=element2menu(Z);if(Z!=null)offsetMenu(Z,1);return Z;}function outMenu(Z){Z=element2menu(Z);if(Z!=null)offsetMenu(Z,0);return Z;}function updateMenu(Z){if(Z==null)return;switch(Z.id){case"jumpList":buildJumpMenu();break;}}function adjustMenuWidth(Z){;if(Z==null)return;var Y,X,W;Y=-1;for(X=0;X<Z.children.length;X++){W=Z.children[X];if(W.className=="largeItem"||W.className=="smallItem"){var V=getItemWidth(W);if(V>Y)Y=V;}}if(Y!=-1){for(X=0;X<Z.children.length;X++){W=Z.children[X];setWidth(W,Y);}setWidth(Z,Y+6);}}function downMenu(Z){var Y=element2menu(Z);if(Y!=null){offsetButton(Y,2);var X=Y.list;if(X==null)return;updateMenu(X);adjustMenuWidth(X);var W=getBounds(Y);var V=getBounds(X);var U=windowBounds();var T;var S;if(W.top+W.height+V.height<U.top+U.height)T=W.bottom;else if(W.top+(W.height/2)>U.top+(U.height/2))T=W.top-V.height;else T=W.bottom;if(W.left+V.width<U.left+U.width)S=W.left;else if(W.left+W.width-V.width>0)S=W.left+W.width-V.width;else S=U.left+2;switch(Y.className){case"largeMenu":T-=1;S+=1;break;case"smallMenu":T-=5;S+=3;break;case"buttonMenu":break;default:break;}setBounds(X,newBounds(T,S,T+V.height,S+V.width));setVisible(X,true);}return Y;}function upMenu(Z){var Y=element2menu(Z);if(Y!=null){offsetButton(Z,0);var X=Y.list;if(X==null)return;if(X!=null)setVisible(X,false);}return Y;}function insideMenu(Z){Z=element2menu(Z);return(Z!=null);}function element2menu(Z){while(Z!=null){switch(Z.className){case"largeMenu":case"smallMenu":case"buttonMenu":return Z;case"largeSpot":case"smallSpot":case"comboBox":return Z.menu;default:break;}Z=Z.parentElement;}return Z;}function offsetMenu(Z,Y){offsetElement(Z,Y);}function overItem(Z){Z=element2item(Z);if(Z!=null){switch(Z.className){case"largeItem":case"smallItem":case"header":case"colorheader":setForegroundColor(Z,"white");setBackgroundColor(Z,"darkblue");break;case"holder":offsetElement(Z,2);break;default:break;}}return Z;}function outItem(Z){Z=element2item(Z);if(Z!=null){switch(Z.className){case"largeItem":setForegroundColor(Z,"black");setBackgroundColor(Z,"lightgrey");break;case"header":case"colorheader":setForegroundColor(Z,"black");setBackgroundColor(Z,"white");break;case"smallItem":setForegroundColor(Z,"black");setBackgroundColor(Z,"white");break;case"holder":offsetElement(Z,0);break;default:break;}}return Z;}function downItem(Z){return overItem(Z);}function upItem(Z){return outItem(Z);}function insideItem(Z){Z=element2item(Z);return(Z!=null);}function fontValue(Z){switch(Z){case"fontArial":return"arial, helvetica, sans-serif";case"fontArialBlack":return"arial black, helvetica, sans-serif";case"fontBookman":return"bookman old style, new york, times, serif";case"fontCourier":return"courier, monaco, monospace, sans-serif";case"fontGaramond":return"garamond, new york, times, serif";case"fontConsole":return"lucida console, sans-serif";case"fontSymbol":return"symbol";case"fontTahoma":return"tahoma, new york, times, serif";case"fontTimesNewRoman":return"times new roman, new york, times, serif";case"fontTrebuchet":return"trebuchet MS, helvetica, sans-serif";case"fontVerdana":return"verdana, helvetica, sans-serif";default:hb_alert("Unknown font code: "+code+"; using Arial.");return"arial, helvetica, sans-serif";}}function selectItem(Z,Y){var X=element2item(Y);if(X==null)return;var W=X.value;if(W==null)W=X.id;if(W==null)return;var V=false;var U;switch(W){case"cmdNew":newCommand();break;case"cmdOpen":openCommand();break;case"cmdClose":closeCommand();break;case"cmdSave":saveCommand();break;case"cmdSaveAs":openSaveAs();break;case"cmdImportSlides":importSlidesUtility();break;case"cmdImportPowerPoint":window.open(kRootUrl+'ppo_upload?source=app',"_blank",'scrollbars=no,resizable=yes,status=no');break;case"cmdSlideshow":modeDocument(kShowMode);break;case"cmdPrint":printCommand();break;case"cmdSummary":summaryCommand();break;case"cmdUndo":undoCommand();break;case"cmdRedo":redoCommand();break;case"cmdCut":copyCommand();clearCommand('cut','Cut');break;case"cmdCopy":copyCommand();break;case"cmdPaste":pasteCommand();break;case"cmdClear":clearCommand();break;case"cmdDuplicate":duplicateCommand();break;case"cmdMoveForward":var T=true;case"cmdMoveBackward":if(T==null)T=false;U=targetModel();if(U){var S=T?"moveDown":"moveUp";switch(U.kind){case"slide":S=T?"moveUp":"moveDown";break;case"text":U=ascendModel(U,"frame");break;case"frame":if(textModel(U)==kTextboxName)U=ascendModel(U,"textbox");break;}if(U)postOutlineMove(U.index,S,T?"Move Forward":"Move Backward");}break;case"cmdRecalculate":U=targetModel();if(U.kind=="grid"){recalculateSheet(U);}break;case"cmdFindUp":arrowUtility("up",false,false);break;case"cmdFindDown":arrowUtility("down",false,false);break;case"cmdFindLeft":arrowUtility("left",false,false);break;case"cmdFindRight":arrowUtility("right",false,false);break;case"cmdBold":toggleUtility("fontWeight","bold","normal",V);break;case"cmdItalic":toggleUtility("fontStyle","italic","normal",V);break;case"cmdSmallcap":toggleUtility("fontVariant","small-caps","normal",V);break;case"cmdUnderline":toggleUtility("textDecoration","underline","none",V);break;case"cmdLeft":decorateUtility("textAlign","left",false);break;case"cmdCenter":decorateUtility("textAlign","center",false);break;case"cmdRight":decorateUtility("textAlign","right",false);break;case"cmdTop":decorateUtility("verticalAlign","top",false);break;case"cmdMiddle":decorateUtility("verticalAlign","middle",false);break;case"cmdBottom":decorateUtility("verticalAlign","bottom",false);break;case"cmdBuzzword":createBuzzwordDialog();break;case"cmdCliche":modalBookLookup("cliche",getSelectedWord());break;case"cmdImage":comingSoon();break;case"cmdDictionary":modalBookLookup("Dictionary",getSelectedWord());break;case"cmdThesaurus":modalThesaurusLookup(expandSelectedWord2());break;case"cmdHelpContents":ShowHelp("pr_intro");break;case"cmdHelpIntroduction":ShowHelp("pr_intro");break;case"cmdHelpBasics":ShowHelp("pr_basics");break;case"cmdHelpFiles":ShowHelp("pr_files");break;case"cmdHelpOutline":ShowHelp("pr_outline");break;case"cmdHelpSlideEditor":ShowHelp("pr_slide_editor");break;case"cmdHelpInserting":ShowHelp("pr_inserting");break;case"cmdHelpEditing":ShowHelp("pr_editing");break;case"cmdHelpTools":ShowHelp("pr_tools");break;case"cmdHelpMasters":ShowHelp("pr_masters");break;case"cmdHelpSlideshows":ShowHelp("pr_slideshows");break;case"cmdHelpSharing":ShowHelp("pr_sharing");break;case"cmdHelpMenuReference":ShowHelp("pr_menuref");break;case"cmdHelpFunctionReference":ShowHelp("bc_functionref");break;case"cmdBullet":comingSoon();break;case"cmdRevert":stripUtility(true);break;case"cmdSetBackground":backgroundCommand();break;case"cmdSetBullets":bulletsCommand();break;case"cmdNewSlide":if(usingEditor())closeEditor();postCreateCommand("slide");break;case"cmdDeleteSlide":if(usingEditor())closeEditor();selectUtility(node2slide(targetModel()));if(kindModel(targetModel())=="slide")clearCommand();break;case"cmdInsertTextBox":postCreateCommand("textbox");break;case"cmdInsertTitle":titleUtility();break;case"cmdInsertBody":itemsUtility();break;case"cmdInsertHLine":postCreateCommand("hline");break;case"cmdInsertVLine":postCreateCommand("vline");break;case"cmdInsertRectangle":postCreateCommand("shape");break;case"cmdInsertBlend":postCreateCommand("blend");break;case"cmdInsertGrid":chooseSpreadsheetUtility();break;case"cmdInsertPicture":choosePictureUtility();break;case"cmdInsertStockQuote":setEditorSelectionText("=quote(\"ticker symbol\")");if(gEditor){var R=gEditor.createTextRange();R.findText("ticker symbol");R.select();updateEditorHeight();}break;case"cmdChangeBlendStyle":blendCommand();break;case"cmdNoMaster":freeCommand();break;case"cmdFindMaster":referCommand();break;case"cmdChangeMaster":masterCommand();break;case"cmdCopyToSlide":slaveUtility();break;case"cmdCopyToMaster":masterUtility();break;case"cmdAbout":OpenAbout();break;case"cmdBugReport":DoBugReport("presentation");break;default:break;}var Q;switch(Z.id){case"fontMenu":decorateUtility("fontFamily",fontValue(X.id),false);break;case"sizeMenu":decorateUtility("fontSize",X.id.substr(5),false);break;case"fillColorMenu":decorateUtility("backgroundColor",W,false);break;case"lineColorMenu":decorateUtility("color",W,false);break;case"fontColorMenu":decorateUtility("fontColor",W,false);break;case"jumpMenu":W=deUniqueIndexName(W);closeEditor();setTimeout("jumpUtility( '"+W+"' )",0);break;case"lineMenu":Q=W.split("/");decorateUtility("borderWidth",Q[0],false);decorateUtility("borderStyle",Q[1],false);break;default:break;}finishUtility();}function element2item(Z){while(Z!=null){switch(Z.className){case"largeItem":case"smallItem":case"header":case"colorheader":case"holder":case"menuContainer":return Z;default:break;}Z=Z.parentElement;}return Z;}var gDivider=null;function setupDivider(){gDivider=getElement("divider");}function finishDivider(){}function getDivider(){return gDivider;}function insideDivider(Z){while(Z!=null){if(Z==gDivider)return true;Z=Z.parentElement;}return false;}function deltaDivider(Z,Y,X,W,V){if(W.left+Y<V.left)Y=V.left-W.left;else if(W.right+Y>V.right)Y=V.right-W.right;setBounds(Z,offsetBounds(W,Y,0));}function whereDivider(){return getBounds(gDivider);}function limitDivider(){return newBounds(0,50,gDocument.body.offsetHeight-kScrollHeight,gDocument.body.offsetWidth-kScrollWidth);}var kEditorBorder=0;var gEditor=null;var gActive=null;function setupEditor(){gEditor=getElement("editor");}function finishEditor(){}function getEditor(){return gEditor;}function focusEditor(Z){if(gEditor==null||gEditor.style.display!="block")return;gEditor.focus();if(Z){gEditor.select();saveEditorSelection();}}function allowEditor(Z){var Y=null;if(insideOutline(Z)){Y=outline2model(Z);if(Y==null)return false;switch(kindModel(Y)){case"slide":case"group":case"text":case"textbox":case"picture":case"table":case"chart":return true;default:break;}return false;}else if(insideDrawing(Z)){Y=drawing2model(Z);if(Y==null)return false;return((kindModel(Y)=="text") ||(kindModel(Y)=="slide") ||(kindModel(Y)=="textbox"));}}function calcEditorBounds(Z,Y,X,W){var V;var U=0,T=0;var S=kindModel(Z);V=getBounds(X);if(Y=="outline"){if(is.ie4){U+=-1;T+=-1;}}else{var R=getFrame(Z);var Q=model2drawing(R);var P=getBounds(Q);if(V.bottom>P.bottom){V.height-=(V.bottom-P.bottom+4);V.bottom=P.bottom-4;}if(X.offsetTop!=0){T+=-X.offsetTop;}borderWidth=parseInt(retrieveModel(R,"borderWidth",true));if(borderWidth){borderWidth--;U+=borderWidth;T+=borderWidth;}switch(W){case"left":var O=X;var N=Q.offsetWidth;while(O&&O!=Q){N-=O.offsetLeft;O=O.offsetParent?O.offsetParent:O.parentElement;}if(N>0&&Math.abs(N-V.width)>20){V.width=N;V.right=V.left+V.width;}if(!is.ie4){U+=1;T+=1;}break;case"center":V.left=P.left;V.right=P.right;V.width=P.width;if(!is.ie4)T+=1;break;case"right":V.left=P.left;V.right=P.right;V.width=P.width;if(kindModel(Z)=="slide")T+=-1;if(is.ie4){T+=1;}else{T+=2;U+=-1;}break;}}V=offsetBounds(V,U,T);if(is.ie4){V.height+=2;if(gEditor.style.fontSize!=""){var M,L;L=gEditor.style.fontSize.match(/\d+/);M=parseInt(L[0]);if(M>=9)V.height+=2;}V.bottom=V.top+V.height;}return V;}function getFrame(Z){var Y=kindModel(Z);var X;switch(Y){case"slide":X=descendModel(Z,"frame",kTitleName);break;case"textbox":X=descendModel(Z,"frame",kTextboxName);break;default:X=ascendModel(Z,"frame");break;}return X;}function openEditor(Z,Y,X){;if(gActive!=null)return;;if(Z==null||fixedModel(Z))return;if(!Y)Y=false;if(!X)X=whereEditor();var W=null;var V=kindModel(Z);var U;var T;var S;if(X!="outline"&&!(V=="slide"||V=="text"||V=="textbox"))X="outline";if(X==null||X=="")X="outline";S=(X=="outline");if(!S){W=model2drawing(Z);}else{revealModel(Z);W=model2outline(Z);if(W&&W.className=="line")W=getChild(W,"text");};if(W==null||gEditor==null)return;;if(!S){if(V=="text"&&W.parentElement)W.parentElement.style.visibility="hidden";else setVisible(W,false);}else{setVisible(W,false);var R=W.parentElement;var Q=getOutline();if((R.offsetTop+R.clientHeight-Q.scrollTop)>(Q.clientHeight-5)){Q.scrollTop+=(R.clientHeight+R.offsetTop-Q.clientHeight-Q.scrollTop);}else if(R.offsetTop<Q.scrollTop){Q.scrollTop-=(Q.scrollTop-R.offsetTop);}}U="left";if(!S){var P=getFrame(Z);if(P){U=retrieveModel(Z,"textAlign");if(U==null)U=retrieveDefault(P,"textAlign","left");}}T=calcEditorBounds(Z,X,W,U);setBounds(gEditor,T);gEditor.value=textModel(Z,true).replace(/<BR>/gi,"\n");;gEditor.newItem=Y;gEditor.where=X;gEditor.style.fontFamily=W.style.fontFamily;gEditor.style.fontSize=W.style.fontSize;gEditor.style.fontStyle=W.style.fontStyle;gEditor.style.fontWeight=W.style.fontWeight;gEditor.style.textDecoration=W.style.textDecoration;gEditor.style.color=W.style.color;gEditor.style.backgroundColor=W.style.backgroundColor;gEditor.style.padding="0px";gEditor.style.display="block";gEditor.style.textAlign=U;gEditor.style.lineHeight=(X=="drawing"?kRenderLineHeight:"");setTimeout("focusEditor( false );",0);gActive=Z;}function closeEditor(Z){if(gEditor==null)return;var Y,X=(gEditor.where=="outline")?model2outline(gActive):model2drawing(gActive);var W=gEditor.value.replace(/\r\n/gi,"<BR>");gEditor.blur();gEditor.style.display="none";gActive=null;var V=null;if(X){if(gEditor.where=="drawing"){V=drawing2model(X);if(kindModel(V)=="text"&&X.parentElement)setVisible(X.parentElement,true);else setVisible(X,true);}else{if(gEditor.where=="outline"){if(X.className=="line"){var U=getChild(X,"text");if(U)setVisible(U,true);}}V=outline2model(X);}}if(Z&&gEditor.newItem){Y=currentCommand();if(Y&&Y.id=="insertNode")undoCommand();}if(Z||X==null)return;if(V&&W!=textModel(V,true)){Y=gEditor.newItem?currentCommand():null;if(Y&&Y.id=="insertNode"){entryModel(V,W);changedModel(V,true);}else postEntryCommand(V,"entry",W,"typing","Typing");}}function toggleEditor(Z){var Y=gEditor?gEditor.style.display:"none";if(gEditor){var X=Z?"block":"none";if(gEditor.style.display!=X)gEditor.style.display=X;}return(Y!="none");}function usingEditor(){return(gEditor!=null) &&(gEditor.style.display=="block");}function insideEditor(Z){return(Z==gEditor&&gEditor!=null);}function whereEditor(){if(gEditor&&gEditor.where)return gEditor.where;return null;}function updateEditorHeight(){if(gEditor){var Z,Y,X;Z=parseInt(gEditor.style.height);Y=parseInt(gEditor.scrollHeight);if(Z>Y-4)return;X=Y;if(gEditor.where=="drawing"){var W=targetModel();var V=null;if((kindModel(W)=="slide") ||(kindModel(W)=="textbox")){V=getBounds(model2drawing(descendModel(W,"frame")));if(X>V.height)return;}else if(kindModel(W)=="text"){V=getBounds(model2drawing(ascendModel(W,"frame",kItemsName,"prefix")));if((gEditor.offsetTop+X)>V.bottom)return;}}else if(gEditor.where=="outline"){var U=model2outline(targetModel());if((U.offsetTop-getOutline().scrollTop+X)>(getOutline().clientHeight-5)){getOutline().scrollTop+=(Y-Z);gEditor.style.pixelTop-=(Y-Z);}}gEditor.style.height=X;if(gActive){var T;switch(gEditor.where){case"drawing":T=model2drawing(gActive);break;case"outline":T=model2outline(gActive);break;default:;return;break;}if(T!=null){T.style.height=X;}}}}function roomForAnotherBullet(Z){if(Z==null)return false;var Y=model2drawing(Z);var X=getBounds(Y);var W=childModel(Z,countModel(Z)-1);var V=model2drawing(W);var U=getBounds(V);return(U.bottom<(X.bottom-20));}var gInsert=null;function setupInsert(){gInsert=getElement("insert");}function finishInsert(){}function getInsert(){return gInsert;}function positionInsert(Z,Y){if(gInsert==null)return;if(Z==null||Z.element==null)bounds=newBounds(0,0,0,0);else{var X=Z.element;var W=getBounds(X);if(Y=="sorting"){if(Z.first)W=newBounds(W.top+5,W.left-1,W.bottom-5,W.left+1);else W=newBounds(W.top+5,W.right-1,W.bottom-5,W.right+1);if(W.left<0)W=offsetBounds(W,-W.left,0);}else{if(Z.first)W=newBounds(W.top-1,W.left+3,W.top+1,W.right-23);else W=newBounds(W.bottom-1,W.left+3,W.bottom+1,W.right-23);}}setBounds(gInsert,W);}function displayInsert(Z){if(gInsert){if(Z)gInsert.style.display="block";else gInsert.style.display="none";}}function OpenAbout(){var Z=["Mr.T","Steve Guttman","Don Vail","Ethan Diamond","Shawn Grunberger","Iain Lamb","Don Marzetta","Kevin Johnston","John Daggett","J.C. Lopez-Melgar","Sailaja Suresh","Mari Frediani"];var Y=Z.length;var X=randInt(0,Y-1);var W="";for(var V=X;V<Y;V++)W+=Z[V]+", ";for(V=0;V<X;V++)W+=Z[V]+", ";W=W.substring(0,W.length-2);W+=", Juan Valdez and Chase";var U='<img src="/img/blox_logo_165x50_trans.gif" width=165 height=50 border=0 alt=""><br>'+'<div style="margin-left:12px; margin-top:10px; margin-right:10px;">'+'<nobr><b>Blox.com BrainStorm v1.0</b></nobr><br><br>'+'<nobr>Copyright &copy; 1999-2000 <A HREF="http://www.alphablox.com" target="_blank">AlphaBlox Corporation.</A></nobr> All rights reserved.'+'<br><br><small><b>Created by: </b>'+W+'</small>'+'</div>';hb_alert(U,"About BrainStorm");}if(typeof JSIncludeDoneLoading!="undefined")JSIncludeDoneLoading();