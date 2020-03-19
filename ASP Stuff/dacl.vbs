Option Explicit

' Set Filesystem and Registry ACL
' ===============================
'
' Author: Tobias Oetiker <oetiker@ee.ethz.ch> 
'         based on code by Nick Pearce, Craig Paterson and Rich Ellis
'
' Version: 1.2 -- 2001/05/08
'
' Changes: 1.1 Handle non-existing registry keys gracefully.
' Changes: 1.2 Added "K" option for simulating 1777 permission
'
' The purpose of this script is to allow ACL maniputlations
' to be performed by Microsoft Installer Packages (.msi)
'
' Add your ACL modification instructions to this script
' and integrate it as a Custom Action into the MSI.
'
' SETUP
' =====
'
' Note aclfix needs ADsSecurity.dll and RegObj.dll to work. 
' You can get ADsSecurity from ADSI SDK 2.5 under (/ResourceKit/ADsSecurity.dll)
'
' Get the sdk from
' http://msdownload.microsoft.com:80/msdownload/adsi/2.5/sdk/x86/en/Sdk.zip
' copy the dll to a place in your path and run 
'
' RegObj.dll is included in Office 2000 SR2 or also available directly from
' MS for registered VB users.
'
' regsvr32 regobj.dll
' regsvr32 adssecurity.dll 
'
' Usage with WISE for Windows Installer
' =====================================
' * add a copy of the two dlls to the package and install them somewhere
'   below the INSTALLDIR of the package. Make sure you click Self register in
'   the file property dialog
'
' * customize the dacl.vbs according to the needs of the application and add it
'   to the msi somewhere below INSTALLDIR. Maybe next to the dlls
' 
' * Add a custom action: Type:    Call Exe File
'                        Source:  File on destination machine
'                        Name:    DACL
'                        InstDir: SystemFolder
'                        Exe Cmd: wscript.exe "[!dacl.vbs]"  
'                        Sequenc: Install Execute Sequence (Before InstallFinalize)'                        
'			 Condition: NOT REMOVE~="ALL"
'                        I-S Opt: System Context
'                        Process: Asynch, Wait at end of sequence
'
' TODO
' ====
' Using Add with the Registry creates working results, but somehow the ACEs are
' not in the proper order, and regedt32 complains when you look at them ...
' it also seems that maybe I am not adding all the reg entries necessary ...
' lack of docu ... sorry ... help appreciated. I guess it has something todo
' with inheritance ... 
'
' USAGE
' -----
'
' DACL function, url, "ace, ace, ..."
'
' function -- Add, Rm, Set
'
' url -- FILE://....       change this File/Folder
'        FILE://c:\home\   change this Folder and everything below
'        FILE://c:\home\\  change this Folder and Folders below
'        RGY://\HKEY_LOCAL_MACHINE\SOFTWARE    change this property
'        RGY://...\  and RGY://\...\\ are the same as indiviual
'                    registry values have no acls assigned
'
' ace -- account:rights
'
' account -- user or group
'
' rights (file) --  F - Full
'		    C - Change
'		    L - List
'		    R - Read
'		    W - Write
'		    X - Execute
'		    D - Delete
'		    P - Change Permissions
'		    0 - Take Ownership
'
'		    Y - Read + Execute
'                   Z - Read + Write + Execute
'		    A - Read + Write + Execute + Delete
'		    B - Read + Execute + List
'                   K - Special Case, like 1777. Create file and work with your own only


' rights (registry) --  F - Full, R - Read
'
' EXAMPLES
' --------
' DACL "Add", "FILE://w:\hello.txt", "users:F,moetiker:F"
' DACL "Add", "FILE://w:\hello\",    "users:R,oetiker:F,moetiker:F"
' DACL "Rm",  "FILE://w:\oops.txt",  "user"   'remove whatever is there under user
' DACL "Add",  "FILE://w:\oops.txt",  "user:F" ' add Full control for user
' DACL "Add", "RGY://\HKEY_CURRENT_USER\SOFTWARE\ipswitch\ws_ftp\", "users:F"
'=============================================================================
'DumpAcl "FILE://C:"
'DACL "Rm", "FILE://C:", "users,CREATOR OWNER"
'DACL "Add", "FILE://C:", "users:R"
'DACL "Add", "FILE://C:", "users:K"
'DumpAcl "FILE://C:"
'=============================================================================
' Implementation
' --------------
Sub DumpAcl (url)
    Dim sd, dacl, ace, sec
    Print url
    Set sec = Wscript.CreateObject("ADsSecurity")
    Set sd = sec.GetSecurityDescriptor( CStr(url) )
    Set dacl = sd.DiscretionaryAcl
    For Each ace In dacl
        Print "   " & ace.trustee & _
              " Type: " & ace.AceType & _
              " Mask: " & ace.AccessMask & _
              " AceFlags: " & ace.AceFlags & _
              " Flags: " & ace.Flags & _
	      " OType: " & ace.ObjectType & _
	      " IOTyp: " & ace.InheritedObjectType

    Next

    set sec = Nothing
    set sd = Nothing
    set dacl = Nothing
    
End Sub

Sub AclEdit( action, url, acl, UType )
    Dim acls, dacl, dummy, sec, sd, ace, acea, usera, user, perm, acsplit

    Print "Edit: " & action & " " & url & " " & acl & " " & utype
    acls = split(acl,",")
    
    Set sec = Wscript.CreateObject("ADsSecurity")
    on error resume Next

    ' without cstr this will break ... !!!
    Set sd = sec.GetSecurityDescriptor( CStr(url) )

    If ErrHandler("Get SD for " & url ) Then
        On Error GoTo 0
        Exit Sub
    End If

    Set dacl = sd.DiscretionaryAcl
    dummy = dacl.AceCount ' this will throw an error if there is no DACL    
    If ErrHandler("Get DACL for " & url ) Then
        On Error GoTo 0
        Exit Sub
    End If

    ' DumpAcl url

'    If action = "Rm" Or action = "Add" Then
    If action = "Rm" Then
        ' for Add we remove the ACEs for the folks for who need new ones
        For Each ace In dacl
            acea = split (LCase(ace.trustee & "\" & ace.trustee),"\")
            If acea(0) <> "nt authority" Then
                For Each user In acls
                    usera = split (LCase(user),":")        
                    If acea(1) = usera(0) Then
                        Print "Remove ACE: " & ace.trustee
                        dacl.RemoveACE ace                    
                        ErrHandler("Remove ACE for " & ace.trustee & _
                                   " from " & url)
                    End If
                Next
            End if
        Next

    ElseIf action = "Set" Then
        For Each ace In dacl
            acea = split (LCase(ace.trustee & "\" & ace.trustee),"\")
            If acea(0) <> "nt authority" Then
                dacl.RemoveACE ace
                ErrHandler("Remove ACE for " & ace.Trustee & " from " & url)
                Print "Remove ACE: " & ace.trustee
            End if
        Next    
    Elseif action <> "Add" Then
        Wscript.Echo "Unknown Action: " & action
    End If
    
    If action = "Set" Or action = "Add" Then
        For Each dummy In acls
            acsplit = split (dummy,":")
            user = acsplit(0)
            perm = acsplit(1)
            Print action & " " & utype & " " & user & " " & perm
            Select Case UType
                Case "DIRECTORY"
                    ' folders require 2 aces for user (to do with inheritance)
                    AddFileAce dacl, user, perm, ADS_ACETYPE_ACCESS_ALLOWED, ADS_ACEFLAG_SUB_NEW
                    AddFileAce dacl, user, perm, ADS_ACETYPE_ACCESS_ALLOWED, ADS_ACEFLAG_INHERIT_ACE
                case "FILE"
                    AddFileAce dacl, user, perm, ADS_ACETYPE_ACCESS_ALLOWED,0
                case "REGISTRY"
                    AddRegAce dacl, user, perm, ADS_ACETYPE_ACCESS_ALLOWED, ADS_ACEFLAG_INHERIT_ACE
            End Select
        Next

    End If

    sd.DiscretionaryAcl = dacl

    call ReorderDacl(dacl)

    sd.DiscretionaryAcl = dacl

    If ErrHandler("Get SD for " & url ) Then    
        On Error GoTo 0
        Exit Sub
    End If

    sec.SetSecurityDescriptor sd    
   
    If ErrHandler("Get SD for " & url ) Then
        On Error GoTo 0
        Exit Sub
    End If
    
    Set sd = Nothing
    Set dacl = Nothing
    Set sec = Nothing

    ' DumpAcl url

    On Error GoTo 0  
End Sub

Sub AddRegACE(dacl, user, perm , acetype, aceflags)
    ' Add registry ACE
    Dim ace
    
    Const ADS_ACETYPE_ACCESS_ALLOWED = 0
    Const RIGHT_REG_READ = &H20019
    Const RIGHT_REG_FULL = &HF003F

    
    Set ace = CreateObject("AccessControlEntry")
    ace.Trustee = user
    
    Select Case UCase(perm)
        ' specified rights so far only include FC & R. Could be expanded though
        Case "F"
            ace.AccessMask = RIGHT_REG_FULL
        Case "R"
            ace.AccessMask = RIGHT_REG_READ
    End Select
    
    ace.AceType = acetype
    ace.AceFlags = aceflags
    dacl.AddAce ace
    ErrHandler("Add Ace for " & user )

    set ace=Nothing

End Sub

Sub AddFileAce(dacl,user, perm, acetype, aceflags)
    ' add ace to the specified dacl
    Dim ace
    
    Set ace = CreateObject("AccessControlEntry")
    ace.Trustee = user
    
    select case ucase(perm)
	case "F"
		ace.AccessMask = ADS_RIGHT_GENERIC_ALL
	case "C"
		ace.AccessMask = ADS_RIGHT_GENERIC_READ or ADS_RIGHT_GENERIC_WRITE Or ADS_RIGHT_GENERIC_EXECUTE or ADS_RIGHT_DELETE
	case "L"
		ace.AccessMask = ADS_RIGHT_ACTRL_DS_LIST
	case "R"
		ace.AccessMask = ADS_RIGHT_GENERIC_READ
	case "W"
		ace.AccessMask = ADS_RIGHT_GENERIC_WRITE
	case "X"
		ace.AccessMask = ADS_RIGHT_GENERIC_EXECUTE
	case "D"
		ace.AccessMask = ADS_RIGHT_DELETE
	case "P"
		ace.AccessMask = ADS_RIGHT_WRITE_DAC
        case "0"
 		ace.AccessMask = ADS_RIGHT_WRITE_OWNER
        case "Y"
		ace.AccessMask = ADS_RIGHT_GENERIC_READ or ADS_RIGHT_GENERIC_EXECUTE
        case "Z"
		ace.AccessMask = ADS_RIGHT_GENERIC_READ or ADS_RIGHT_GENERIC_WRITE or ADS_RIGHT_GENERIC_EXECUTE
        case "A"
		ace.AccessMask = ADS_RIGHT_GENERIC_READ or ADS_RIGHT_GENERIC_WRITE or ADS_RIGHT_GENERIC_EXECUTE or ADS_RIGHT_DELETE
	case "B"
		ace.AccessMask = ADS_RIGHT_GENERIC_READ or ADS_RIGHT_GENERIC_EXECUTE or ADS_RIGHT_ACTRL_DS_LIST

        case "K" ' User can Create and work files in the dir specified and nothing else
            ace.AceType = 0
            ace.AccessMask = 1048582 ' create files
	    ace.AceFlags = 0
            dacl.AddAce ace
            set ace=Nothing
            Set ace = CreateObject("AccessControlEntry")    
            ace.Trustee = "CREATOR OWNER"
            ace.AccessMask = ADS_RIGHT_GENERIC_ALL
            acetype=0
            aceflags=ADS_ACEFLAG_SUB_NEW
	case else
	    print "Error in AddFileAce.  Permission: " & perm & " is not recognized."
    end select
    
    ace.AceType = acetype
    ace.AceFlags = aceflags
    dacl.AddAce ace
    ErrHandler("Add Ace for " & user )

    set ace=Nothing

End Sub
   
Sub DACL(action,url,acl)
    Dim argarry, utype, upath, walk, ftype, fs, rfldr, file, sfldr
    Dim ro, rk, regval,skey
    argarry = split(url,"://")
    utype = argarry(0)
    upath = argarry(1)

    Print "Action: " & action & " " & utype & "--" & upath & " " & acl

    If Right(upath,2) = "\\" Then
        walk = "\\" ' folders only 
        upath = Left(upath, Len(upath)-2)
    ElseIf Right(upath,1) = "\" Then
        walk = "\" ' files and folders
        upath = left(upath, len(upath)-1)      
    End If
    
    If utype = "FILE" Then
        
        Set fs=Wscript.CreateObject("Scripting.FileSystemObject")
        Print "---" & upath
        If fs.FileExists(upath) Then
            Set rfldr=fs.GetFile(upath)
            ftype = "FILE" 'directory
        ElseIf fs.FolderExists(upath) Then
            Set rfldr=fs.GetFolder(upath)
            ftype = "DIRECTORY" 'file
        Else
            ' its neither file nor folder ... maybe it does not exist ...
            wscript.echo "Can't find " & upath
            Exit Sub
        End If
        
        AclEdit action, "FILE://" & rfldr.path, acl, ftype

        If ftype = "FILE" Then 'if this is a file our work is done
            Exit Sub
        End If
        
        If walk = "\" then
            For Each file In rfldr.files
                AclEdit action, "FILE://" & file , acl, "FILE"
            Next
        End If
        
        if walk = "\" or walk = "\\" then 
            for each sfldr in rfldr.subfolders
                DACL action, "FILE://" & sfldr & walk, acl
            next
        end if
        
    elseif utype = "RGY" Then

        Set ro = CreateObject("RegObj.Registry")
        on error resume Next
        Set rk = ro.RegKeyFromString( upath )
        If ErrHandler("Get Registry Key " & upath ) Then
            On Error GoTo 0
            Exit Sub
        End If
        
        AclEdit action, "RGY://" & rk.FullName, acl,"REGISTRY"  
                        
        if walk = "\" or walk = "\\" then
            for each skey in rk.Subkeys
                DACL action,"RGY://" &  skey.FullName & walk, acl
            next
        end If
        
    else
        Wscript.Echo "Unsupported URL Type: " & utype
    end If
    On Error GoTo 0
    
End Sub

Function ErrHandler(what)
    If Err.Number > 0 Then
        WScript.Echo what & " Error " & Err.Number & ": " & Err.Description
        Err.Clear
        Return True
    End If
    ErrHandler = False
End Function

Sub Print(Str)
    'strip when debugging
    'wscript.echo Str
End Sub






'    http://support.microsoft.com/default.aspx?scid=KB;EN-US;Q279682&
'
' Define a ADS_RIGHTS_ENUM constants:
'

'http://msdn.microsoft.com/library/default.asp?url=/library/en-us/netdir/adsi/ads_acetype_enum.asp
  const ADS_RIGHT_DELETE                 = &h10000    'The right to delete the object. 
  const ADS_RIGHT_READ_CONTROL           = &h20000    'The right to read data from the security descriptor of the object, not including the data in the SACL.
  const ADS_RIGHT_WRITE_DAC              = &h40000    'The right to modify the discretionary access-control list (DACL) in the object security descriptor. 
  const ADS_RIGHT_WRITE_OWNER            = &h80000    'The right to assume ownership of the object. The user must be an object trustee. The user cannot transfer the ownership to other users. 
  const ADS_RIGHT_SYNCHRONIZE            = &h100000   'The right to use the object for synchronization. This enables a thread to wait until the object is in the signaled state. 
  const ADS_RIGHT_ACCESS_SYSTEM_SECURITY = &h1000000  'The right to get or set the SACL in the object security descriptor. 
  const ADS_RIGHT_GENERIC_READ           = &h80000000 'The right to read permissions on this object, read all the properties on this object, list this object name when the parent container is listed, and list the contents of this object if it is a container. 
  const ADS_RIGHT_GENERIC_WRITE          = &h40000000 'The right to read permissions on this object, write all the properties on this object, and perform all validated writes to this object. 
  const ADS_RIGHT_GENERIC_EXECUTE        = &h20000000 'The right to read permissions on, and list the contents of, a container object. 
  const ADS_RIGHT_GENERIC_ALL            = &h10000000 'The right to create or delete children, delete a subtree, read and write properties, examine children and the object itself, add and remove the object from the directory, and read or write with an extended right. 
  const ADS_RIGHT_DS_CREATE_CHILD        = &h1        'The right to create children of the object. The ObjectType member of an ACE can contain a GUID that identifies the type of child object whose creation is controlled. If ObjectType does not contain a GUID, the ACE controls the creation of all child object types. 
  const ADS_RIGHT_DS_DELETE_CHILD        = &h2        'The right to delete children of the object. The ObjectType member of an ACE can contain a GUID that identifies a type of child object whose deletion is controlled. If ObjectType does not contain a GUID, the ACE controls the deletion of all child object types. 
  const ADS_RIGHT_ACTRL_DS_LIST          = &h4        'The right to list children of this object. 
  const ADS_RIGHT_DS_SELF                = &h8        'The right to perform an operation controlled by a validated write access right. The ObjectType member of an ACE can contain a GUID that identifies the validated write. If ObjectType does not contain a GUID, the ACE controls the rights to perform all valided write operations associated with the object.
  const ADS_RIGHT_DS_READ_PROP           = &h10       'The right to read properties of the object. The ObjectType member of an ACE can contain a GUID that identifies a property set or property. If ObjectType does not contain a GUID, the ACE controls the right to read all of the object properties.
  const ADS_RIGHT_DS_WRITE_PROP          = &h20       'The right to write properties of the object. The ObjectType member of an ACE can contain a GUID that identifies a property set or property. If ObjectType does not contain a GUID, the ACE controls the right to write all of the object properties.
  const ADS_RIGHT_DS_DELETE_TREE         = &h40       'The right to delete all children of this object, regardless of the permissions of the children.
  const ADS_RIGHT_DS_LIST_OBJECT         = &h80       'The right to list a particular object. If the user is not granted such a right, and the user does not have ADS_RIGHT_ACTRL_DS_LIST set on the object parent, the object is hidden from the user.
  const ADS_RIGHT_DS_CONTROL_ACCESS      = &h100      'The right to perform an operation controlled by an extended access right. The ObjectType member of an ACE can contain a GUID that identifies the extended right. If ObjectType does not contain a GUID, the ACE controls the right to perform all extended right operations associated with the object.
'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
' 
' ADS_ACETYPE_ENUM
' Ace Type definitions
'
  const ADS_ACETYPE_ACCESS_ALLOWED           = 0   'The ACE is of the standard ACCESS ALLOWED type, where the ObjectType and InheritedObjectType fields are NULL
  const ADS_ACETYPE_ACCESS_DENIED            = &h1 'The ACE is of the standard system-audit type, where the ObjectType and InheritedObjectType fields are NULL.
  const ADS_ACETYPE_SYSTEM_AUDIT             = &h2 'The ACE is of the standard system type, where the ObjectType and InheritedObjectType fields are NULL
  const ADS_ACETYPE_ACCESS_ALLOWED_OBJECT    = &h5 'The ACE grants access to an object or a subobject of the object, such as a property set or property. ObjectType or InheritedObjectType or both contain a GUID that identifies a property set, property, extended right, or type of child object
  const ADS_ACETYPE_ACCESS_DENIED_OBJECT     = &h6 'The ACE denies access to an object or a subobject of the object, such as a property set or property. ObjectType or InheritedObjectType or both contain a GUID that identifies a property set, property, extended right, or type of child object
  const ADS_ACETYPE_SYSTEM_AUDIT_OBJECT      = &h7 'The ACE audits access to an object or a subobject of the object, such as a property set or property. ObjectType or InheritedObjectType or both contain a GUID that identifies a property set, property, extended right, or type of child object
'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
'
' ADS_ACEFLAGS_ENUM
' Ace Flag Constants
'
  Const ADS_ACEFLAG_SUB_NEW = 9  '???
  const ADS_ACEFLAG_UNKNOWN                  = &h1  '
  const ADS_ACEFLAG_INHERIT_ACE              = &h2  'Child objects will inherit this access-control entry (ACE). The inherited ACE is inheritable unless the ADS_ACEFLAG_NO_PROPAGATE_INHERIT_ACE flag is set
  const ADS_ACEFLAG_NO_PROPAGATE_INHERIT_ACE = &h4  'The system will clear the ADS_ACEFLAG_INHERIT_ACE flag for the inherited ACEs of child objects. This prevents the ACE from being inherited by subsequent generations of objects
  const ADS_ACEFLAG_INHERIT_ONLY_ACE         = &h8  'Indicates an inherit-only ACE that does not exercise access control on the object to which it is attached. If this flag is not set, the ACE is an effective ACE that exerts access control on the object to which it is attached
  const ADS_ACEFLAG_INHERITED_ACE            = &h10 'Indicates whether or not the ACE was inherited. The system sets this bit
  const ADS_ACEFLAG_VALID_INHERIT_FLAGS      = &h1f 'Indicates whether the inherit flags are valid. The system sets this bit
  const ADS_ACEFLAG_SUCCESSFUL_ACCESS        = &h40 'Generates audit messages for successful access attempts, used with ACEs that audit the system in a system access-control list (SACL)
  const ADS_ACEFLAG_FAILED_ACCESS            = &h80 'Generates audit messages for failed access attempts, used with ACEs that audit the system in a SACL

'==========================================================================
'--------------------------------------------------------------------------
' Delete the EveryOne Ace from the DACL
'
sub DeleteEveryoneAce ( oSd )
  dim oDacl
  set oDacl = oSd.DiscretionaryACL
  for each ace in oDacl
     if( ace.Trustee = "Everyone" ) then
         oDacl.RemoveAce ace
     end if
  next 
  oSd.DiscretionaryACL = oDacl
end Sub
'==========================================================================
' Sub to reorder an ACL
' Comments in the subroutine explain how the ACL should be ordered.
' The IADsAccessControlList::AddAce method makes not attempt to properly
' order the ACE being added.
'
Sub ReorderDacl( dacl )
   '
   ' Initialize all of the new ACLs
   '
   ' VBS methods of creating the ACL bins
   '
   dim newdacl, ImpDenyDacl, InheritedDacl, ImpAllowDacl, InhAllowDacl, ImpDenyObjectDacl, ImpAllowObjectDacl
   Set newdacl = CreateObject("AccessControlList")
   Set ImpDenyDacl = CreateObject("AccessControlList")
   Set InheritedDacl = CreateObject("AccessControlList")
   Set ImpAllowDacl = CreateObject("AccessControlList")
   Set InhAllowDacl = CreateObject("AccessControlList")
   Set ImpDenyObjectDacl = CreateObject("AccessControlList")
   Set ImpAllowObjectDacl = CreateObject("AccessControlList")
   '
   ' Sift the DACL into 5 bins:
   ' Inherited Aces
   ' Implicit Deny Aces
   ' Implicit Deny Object Aces
   ' Implicit Allow Aces
   ' Implicit Allow object aces
   '
	dim ace
   For Each ace In dacl 
      ' 
      ' Sort the original ACEs into their appropriate 
      ' ACLs 
      '
      If ((ace.AceFlags And ADS_ACEFLAG_INHERITED_ACE) = ADS_ACEFLAG_INHERITED_ACE)Then    
         '    
         ' Don't really care about the order of inherited aces.  Since we are    
         ' adding them to the top of a new list, when they are added back    
         ' to the Dacl for the object, they will be in the same order as    
         ' they were originally.  Just a positive side affect of adding items    
         ' of a LIFO ( Last In First Out) type list.    
         '
         InheritedDacl.AddAce ace 
      Else
         '    
         ' We have an Implicit ACE, lets put it the proper pool
         '    
         Select Case ace.AceType    
         Case ADS_ACETYPE_ACCESS_ALLOWED       
            '
            ' We have an implicit allow ace       
            '       
            ImpAllowDacl.AddAce ace    
         Case ADS_ACETYPE_ACCESS_DENIED       
            '
            ' We have a implicit Deny ACE       
            '       
            ImpDenyDacl.AddAce ace    
         Case ADS_ACETYPE_ACCESS_ALLOWED_OBJECT       
            '       
            ' We have an object allowed ace       
            ' Does it apply to a property? or an Object?       
            '       
            impAllowObjectDacl.AddAce ace    
         Case ADS_ACETYPE_ACCESS_DENIED_OBJECT        
            '       
            ' We have a object Deny ace       
            '       
            ImpDenyObjectDacl.AddAce ace    
         Case Else       
            '       
            ' Missed a bin?       
            '       
         End Select
      End If
   Next
   '
   ' Combine the ACEs in the proper order
   ' Implicit Deny
   ' Implicit Deny Object
   ' Implicit Allow
   ' Implicit Allow Object
   ' Inherited aces
   '
   ' Implicit Deny
   '
   For Each ace In ImpDenyDacl 
       newdacl.AddAce ace 
   Next
   '
   ' Implicit Deny Object
   '
   For Each ace In ImpDenyObjectDacl 
        newdacl.AddAce ace
   Next
   '
   ' Implicit Allow
   '
   For Each ace In ImpAllowDacl
        newdacl.AddAce ace
   Next 
   '
   ' Implicit Allow Object
   '
   For Each ace In impAllowObjectDacl
      newdacl.AddAce ace
   Next 
   '
   ' Inherited Aces
   '
   For Each ace In InheritedDacl
        newdacl.AddAce ace 
   Next
   '
   ' Clean up
   '
   Set InheritedDacl     = Nothing
   Set ImpAllowDacl      = Nothing
   Set ImpDenyObjectDacl = Nothing
   Set ImpDenyDacl       = Nothing
   '
   ' Set the appropriate revision level
   '  for the DACL
   '
   newdacl.AclRevision = dacl.AclRevision
   '
   ' Replace the Security Descriptor
   '
   Set dacl = nothing
   Set dacl = newdacl
end Sub
'==========================================================================
' Sub to display the aces in an acl, Based on "-Show"
' as a second argument
'
sub DisplayDacl( Dacl )
  dim sDisplayText
  WScript.Echo "Aces: "
  for Each Ace in Dacl
     sDisplayText = "Trustee: " & ace.Trustee & vbCrLf
     sDisplayText = sDisplayText & "Ace Type: "
         Select Case ace.AceType    
         Case ADS_ACETYPE_ACCESS_ALLOWED       
            '
            ' We have an implicit allow ace       
            '       
            sDisplayText = sDisplayText & "ACCESS_ALLOWED" & vbCrLf  
         Case ADS_ACETYPE_ACCESS_DENIED       
            '
            ' We have a implicit Deny ACE       
            '       
            sDisplayText = sDisplayText & "ACCESS_DENIED" & vbCrLf     
         Case ADS_ACETYPE_ACCESS_ALLOWED_OBJECT       
            '       
            ' We have an object allowed ace       
            ' Does it apply to a property? or an Object?       
            '       
            sDisplayText = sDisplayText & "ACCESS_ALLOWED_OBJECT" & vbCrLf    
         Case ADS_ACETYPE_ACCESS_DENIED_OBJECT        
            '       
            ' We have a object Deny ace       
            '       
            sDisplayText = sDisplayText & "ACCESS_DENIED_OBJECT" & vbCrLf
         CASE Default
            '
            ' This has to be some kind of mistake
            '
            sDisplayText = sDisplayText & "ACCESS_UNKOWN!" & vbCrLf       
        End Select 
        wscript.echo sDisplayText
    next
end sub





