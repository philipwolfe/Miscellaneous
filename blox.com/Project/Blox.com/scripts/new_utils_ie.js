//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
function MM_findObj(Z,Y){var X,W,V;if(!Y)Y=document;if((X=Z.indexOf("?"))>0&&parent.frames.length){Y=parent.frames[Z.substring(X+1)].document;Z=Z.substring(0,X);}if(!(V=Y[Z]) &&Y.all)V=Y.all[Z];for(W=0;!V&&W<Y.forms.length;W++)V=Y.forms[W][Z];for(W=0;!V&&Y.layers&&W<Y.layers.length;W++)V=MM_findObj(Z,Y.layers[W].document);return V;}function MM_showHideLayers(){var Z,Y,X,W,V=MM_showHideLayers.arguments;for(Z=0;Z<(V.length-2);Z+=3)if((W=MM_findObj(V[Z])) !=null){X=V[Z+2];if(W.style){W=W.style;X=(X=='show')?'visible':(X='hide')?'hidden':X;}W.visibility=X;}}if(typeof JSIncludeDoneLoading!="undefined")JSIncludeDoneLoading();