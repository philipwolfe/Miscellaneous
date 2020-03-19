<%@ WebService Language="VB" Class="ShippingRateQuote"%>

Imports System
Imports System.Web.Services

<WebService(Namespace:="http://www.iiitb.ac.in/webservices/")> Public Class ShippingRateQuote : Inherits WebService

   <WebMethod()> Public Function GetRate(city1 as string, city2 as string) as Integer
Select Case city1
    Case "Greenville"
        Select Case city2
            Case "San Francisco"
                Return 10
            Case "Denver"
                Return 8
	    Case "Chicago"
                Return 6
            Case "Dallas"
                Return 5
	    Case "New York"
                Return 14
        End Select
    Case "Memphis"
        Select Case city2
            Case "San Francisco"
                Return 6
            Case "Denver"
                Return 5
	    Case "Chicago"
                Return 4
            Case "Dallas"
                Return 3
	    Case "New York"
                Return 6
        End Select
     Case "Flagstaff"
        Select Case city2
            Case "San Francisco"
                Return 3
            Case "Denver"
                Return 4
	    Case "Chicago"
                Return 5
            Case "Dallas"
                Return 5
	    Case "New York"
                Return 9
        End Select   
 End Select
End Function
End Class