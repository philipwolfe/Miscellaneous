﻿'------------------------------------------------------------------------------
' <autogenerated>
'     This code was generated by a tool.
'     Runtime Version: 1.0.3705.288
'
'     Changes to this file may cause incorrect behavior and will be lost if 
'     the code is regenerated.
' </autogenerated>
'------------------------------------------------------------------------------

Option Strict Off
Option Explicit On

Imports System
Imports System.ComponentModel
Imports System.Diagnostics
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Xml.Serialization

'
'This source code was auto-generated by Microsoft.VSDesigner, Version 1.0.3705.288.
'
Namespace DonkeyWeb
    
    '<remarks/>
    <System.Diagnostics.DebuggerStepThroughAttribute(),  _
     System.ComponentModel.DesignerCategoryAttribute("code"),  _
     System.Web.Services.WebServiceBindingAttribute(Name:="ModelServiceSoap", [Namespace]:="http://www.microsoft.com/donkeyweb/modelservice")>  _
    Public Class ModelService
        Inherits System.Web.Services.Protocols.SoapHttpClientProtocol
        
        '<remarks/>
        Public Sub New()
            MyBase.New
            Me.Url = "http://localhost/donkeyweb/modelservice.asmx"
        End Sub
        
        '<remarks/>
        <System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://www.microsoft.com/donkeyweb/modelservice/Browse", RequestNamespace:="http://www.microsoft.com/donkeyweb/modelservice", ResponseNamespace:="http://www.microsoft.com/donkeyweb/modelservice", Use:=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle:=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)>  _
        Public Function Browse() As <System.Xml.Serialization.XmlArrayItemAttribute(IsNullable:=false)> ObstacleInfo()
            Dim results() As Object = Me.Invoke("Browse", New Object(-1) {})
            Return CType(results(0),ObstacleInfo())
        End Function
        
        '<remarks/>
        Public Function BeginBrowse(ByVal callback As System.AsyncCallback, ByVal asyncState As Object) As System.IAsyncResult
            Return Me.BeginInvoke("Browse", New Object(-1) {}, callback, asyncState)
        End Function
        
        '<remarks/>
        Public Function EndBrowse(ByVal asyncResult As System.IAsyncResult) As ObstacleInfo()
            Dim results() As Object = Me.EndInvoke(asyncResult)
            Return CType(results(0),ObstacleInfo())
        End Function
        
        '<remarks/>
        <System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://www.microsoft.com/donkeyweb/modelservice/Download", RequestNamespace:="http://www.microsoft.com/donkeyweb/modelservice", ResponseNamespace:="http://www.microsoft.com/donkeyweb/modelservice", Use:=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle:=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)>  _
        Public Function Download(ByVal ModelName As String) As Obstacle
            Dim results() As Object = Me.Invoke("Download", New Object() {ModelName})
            Return CType(results(0),Obstacle)
        End Function
        
        '<remarks/>
        Public Function BeginDownload(ByVal ModelName As String, ByVal callback As System.AsyncCallback, ByVal asyncState As Object) As System.IAsyncResult
            Return Me.BeginInvoke("Download", New Object() {ModelName}, callback, asyncState)
        End Function
        
        '<remarks/>
        Public Function EndDownload(ByVal asyncResult As System.IAsyncResult) As Obstacle
            Dim results() As Object = Me.EndInvoke(asyncResult)
            Return CType(results(0),Obstacle)
        End Function
    End Class
    
    '<remarks/>
    <System.Xml.Serialization.XmlTypeAttribute([Namespace]:="http://www.microsoft.com/donkeyweb/modelservice")>  _
    Public Class ObstacleInfo
        
        '<remarks/>
        Public Name As String
        
        '<remarks/>
        <System.Xml.Serialization.XmlElementAttribute(DataType:="base64Binary")>  _
        Public Thumbnail() As Byte
        
        '<remarks/>
        Public DownloadSize As Integer
    End Class
    
    '<remarks/>
    <System.Xml.Serialization.XmlTypeAttribute([Namespace]:="http://www.microsoft.com/donkeyweb/modelservice")>  _
    Public Class Obstacle
        
        '<remarks/>
        Public Name As String
        
        '<remarks/>
        <System.Xml.Serialization.XmlElementAttribute(DataType:="base64Binary")>  _
        Public Model() As Byte
        
        '<remarks/>
        <System.Xml.Serialization.XmlElementAttribute(DataType:="base64Binary")>  _
        Public Scream() As Byte
    End Class
End Namespace
