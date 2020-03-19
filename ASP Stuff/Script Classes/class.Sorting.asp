<%
Sub QuickSort (ByRef A, ByVal iLo, ByVal iHi)
'*****************************************************************
' Purpose:      Sorts an array using the Quicksort algorithm
' Inputs:       A - The array to sort,
'               iLo - The low index of the array - usually 0
'               iHi - The hi index of the array - usually UBound(A)
' Returns:      Nothing; the array is passed by reference
' Author:       Noel Sampson (n********@city411.com)
' Date:         4/1/97
'*****************************************************************
	Dim Lo, Hi, Mid, T

	Lo = iLo
	Hi = iHi
	Mid = A((Lo + Hi) \ 2)
	Do
		While A(Lo) < Mid
			Lo = Lo + 1
		Wend
		While A(Hi) > Mid
			Hi = Hi - 1
		Wend
		If Lo <= Hi Then
			T = A(Lo)
			A(Lo) = A(Hi)
			A(Hi) = T
			Lo = Lo + 1
			Hi = Hi - 1
		End If
	Loop Until Lo > Hi
	If Hi > iLo Then QuickSort A, iLo, Hi
	If Lo < iHi Then QuickSort A, Lo, iHi
End Sub

Sub QuickSort2 (ByRef A, ByVal iLo, ByVal iHi)
'*****************************************************************
' Purpose:      Sorts a 2-D array using the Quicksort algorithm
' Inputs:       A - The array to sort,
'               iLo - The low index of the array - usually 0
'               iHi - The hi index of the array - usually UBound(A)
' Returns:      Nothing; the array is passed by reference
' Author:       Noel Sampson (n*******@city411.com)
' Date:         4/1/97

'*****************************************************************
	Dim Lo, Hi, Mid, T0, T1

	Lo = iLo
	Hi = iHi
	Mid = A(1,((Lo + Hi) \ 2))
	Do
		While A(1,Lo) < Mid
			Lo = Lo + 1
		Wend
		While A(1,Hi) > Mid
			Hi = Hi - 1
		Wend
		If Lo <= Hi Then
			T0 = A(0,Lo)
			T1 = A(1,Lo)
			A(0,Lo) = A(0,Hi)
			A(1,Lo) = A(1,Hi)
			A(0,Hi) = T0
			A(1,Hi) = T1
			Lo = Lo + 1
			Hi = Hi - 1
		End If
	Loop Until Lo > Hi
	If Hi > iLo Then QuickSort2 A, iLo, Hi
	If Lo < iHi Then QuickSort2 A, Lo, iHi
End Sub
<XMP>     sort( r, lo, up )
     ArrayToSort r;
     int lo, up;

     {int i, j;
     ArrayEntry tempr;
     while ( up>lo ) {
          i = lo;
          j = up;
          tempr = r[lo];
          /*** Split file in two ***/
          while ( i<j ) {
               for ( ; r[j].k > tempr.k; j-- );
               for ( r[i]=r[j]; i<j && r[i].k<=tempr.k; i++ );
               r[j] = r[i];
               }
          r[i] = tempr;
          /*** Sort recursively, the smallest first ***/
          if ( i-lo < up-i ) { sort(r,lo,i-1);  lo = i+1; }
               else    { sort(r,i+1,up);  up = i-1; }
          }
     }
</XMP>

Sub BubbleSort(inpArray(), inpList)
   Dim intRet
   Dim intCompare
   Dim intLoopTimes
   Dim strTemp

   For intLoopTimes = 1 To UBound(inpArray)
      For intCompare = LBound(inpArray) To UBound(inpArray) - 1
         intRet = StrComp(inpArray(intCompare), _
         inpArray(intCompare + 1), vbTextCompare)
         If intRet = 1 Then
            ' String1 is greater than String2
            strTemp = inpArray(intCompare)
            inpArray(intCompare) = inpArray(intCompare + 1)
            inpArray(intCompare + 1) = strTemp
         End If
      Next
   Next

   inpList.Clear

   For intCompare = 1 To UBound(inpArray)
      inpList.AddItem inpArray(intCompare)
   Next
<XMP>     sort( r, lo, up )
     ArrayToSort r;
     int lo, up;

     {int i, j;
     while (up>lo)  {
          j = lo;
          for ( i=lo; i<up; i++ )
               if ( r[i].k > r[i+1].k ) {
                    exchange( r, i, i+1 );
                    j = i;}
          up = j;
          for ( i=up; i>lo; i-- )
               if ( r[i].k < r[i-1].k ) {
                    exchange( r, i, i-1 );
                    j = i;}
          lo = j;
          }
     }
</XMP>
End Sub 


'// standard insertion sort
'function insertionSort(t, iRowStart, iRowEnd, fReverse)
'{
'    var iRowInsertRow, iRowWalkRow;
'    for ( iRowInsert = iRowStart + 1 ; iRowInsert 
'      <= iRowEnd ; iRowInsert++ )
'    {
'        textRowInsert = t.children[iRowInsert].innerText;
' 
'        for ( iRowWalk = iRowStart ; iRowWalk 
'          <= iRowInsert ; iRowWalk++ )
'        {
'            textRowCurrent = t.children[iRowWalk].innerText;
'
'            if ( (   (!fReverse && textRowInsert <= textRowCurrent)
'                 || ( fReverse && textRowInsert >= textRowCurrent) )
'                 && (iRowInsert != iRowWalk) )
'            {
'                eRowInsert = t.children[iRowInsert];
'                eRowWalk = t.children[iRowWalk];
'                t.
'insertBefore(eRowInsert, eRowWalk);
'                iRowWalk = iRowInsert; // done
'            }
'        }
'    }
'}
<XMP>     sort( r, lo, up )
     ArrayToSort r;
     int lo, up;

     {int i, j;
     ArrayEntry tempr;
     for ( i=up-1; i>=lo; i-- ) {
          tempr = r[i];
          for ( j=i+1; j<=up && (tempr.k>r[j].k); j++ )
               r[j-1] = r[j];
          r[j-1] = tempr;
          }
     };
</XMP>

shell sort
sort( r, lo, up )
     ArrayToSort r;
     int lo, up;

     {int d, i, j;
     ArrayEntry tempr;
     for ( d=up-lo+1; d>1; ) {
          if (d<5)  d = 1;
             else   d = (5*d-1)/11;
          /*** Do linear insertion sort in steps size d ***/
          for ( i=up-d; i>=lo; i-- ) {
               tempr = r[i];
               for ( j=i+d; j<=up && (tempr.k>r[j].k); j+=d )
                    r[j-d] = r[j];
               r[j-d] = tempr;
               }
          }
     }
interploation sort
   sort( r, lo, up )
     ArrayToSort r;
     int lo, up;

     {ArrayIndices iwk;
     ArrayEntry tempr;
     int i, j;

     for (i=lo; i<=up; i++)   {iwk[i] = 0;   r[i].k = -r[i].k;}
     iwk[lo] = lo-1;
     for (i=lo; i<=up; i++)   iwk[ phi(-r[i].k,lo,up) ]++;
     for (i=lo; i<up;  i++)   iwk[i+1] += iwk[i];
     for (i=up; i>=lo; i--)   if ( r[i].k<0 )
          do   {
               r[i].k = -r[i].k;
               j = iwk[ phi( r[i].k, lo, up ) ]--;
               tempr = r[i];
               r[i] = r[j];
               r[j] = tempr;
               } while ( i != j );
     for ( i=up-1; i>=lo; i-- ) {
          tempr = r[i];
          for ( j=i+1; j<=up && (tempr.k>r[j].k); j++ )
               r[j-1] = r[j];
          r[j-1] = tempr;
          }
     };
Linear probing
   sort( r, lo, up )
     ArrayToSort r;
     int lo, up;

     {ArrayToSort r1;
     int i, j, uppr;
     uppr = up + (UppBoundr-up)*3/4;
     for (j=lo; j<=up; j++)   r1[j] = r[j];
     for (j=lo; j<=UppBoundr; j++) r[j].k = NoKey;
     for (j=lo; j<=up; j++) {
          for ( i=phi(r1[j].k,lo,uppr); r[i].k != NoKey; i++) {
               if ( r1[j].k < r[i].k ) {
                    r1[j-1] = r[i];
                    r[i] = r1[j];
                    r1[j] = r1[j-1];
                    };
               if ( i > UppBoundr ) Error;
               }
          r[i] = r1[j];
          };
     for (j=i=lo; j<=UppBoundr; j++)
          if ( r[j].k != NoKey )
               r[i++] = r[j];
     while ( i <= UppBoundr )
               r[i++].k = NoKey;
     };
merge sort
    list sort( n )
     int n;

     {
     list fi, la, temp;
     extern list r;
     if ( r == NULL ) return( NULL );
     else if ( n>1 )
          return( merge( sort( n/2 ), sort( (n+1)/2 )));
     else     {
          fi = r; la = r;
          /*** Build list as long as possible ***/
          for ( r=r->next; r!=NULL; )
               if ( r->k >= la->k ) {
                    la->next = r;
                    la = r;
                    r = r->next;
                    }
               else if ( r->k <= fi->k ) {
                    temp = r;
                    r = r->next;
                    temp->next = fi;
                    fi = temp;
                    }
               else break;
          la->next = NULL;
          return( fi );
          }
     };

%>