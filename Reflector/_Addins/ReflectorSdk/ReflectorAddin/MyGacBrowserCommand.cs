// This is a small plugin to .NET Refelctor for browsing the global assembly cache (GAC).
// It's based on Mattias Sjögrens (mattias@mvps.org) GACTool code found at 
// http://www.msjogren.net/temp/gactool.zip.
// Torsten Bergmann (Torsten.Bergmann@phaidros.com)

// GACBrowser.cs
//
// Copyright (C) 2001 Torsten Bergmann based on Work by Mattias Sjögrens
//

namespace Reflector.AddIn
{
	using System;
	using System.IO;
	using System.Text;
	using System.Diagnostics;
	using System.Drawing;
	using System.Runtime.InteropServices;
	using System.Windows.Forms;
	using Reflector;
	using Reflector.ComponentModel;
	using Reflector.Library;

	public class MyGacBrowserCommand : Command
	{	
		private ListView list = new ListView();
		
		public override bool IsEnabled
		{
			get { return true; }
		}

		public override void Execute()
		{
			list.Items.Clear();
			PrintCache();

			IToolWindow toolWindow = (IToolWindow) this.Site.GetService(typeof(IToolWindow));
			toolWindow.Open(list, "Global Assembly Cache Viewer");
		}

		public MyGacBrowserCommand()
		{
			list.Dock = DockStyle.Fill;
			list.View = View.Details; 		
			list.MultiSelect = false;
			list.AllowColumnReorder = true;
			list.FullRowSelect = true;
			list.HeaderStyle = ColumnHeaderStyle.Clickable;

			ColumnHeader h0 = new ColumnHeader();
			ColumnHeader h1 = new ColumnHeader();
			ColumnHeader h2 = new ColumnHeader();
			ColumnHeader h3 = new ColumnHeader();
			ColumnHeader h4 = new ColumnHeader();
    
			h0.Text = "Assembly Name";		
			h1.Text = "Type";
			h2.Text = "Version";	
			h3.Text = "Culture";
			h4.Text = "Public Key Token";
    
			h0.Width = 250;
			h1.Width = 50;
			h2.Width = 70;
			h3.Width = 50;
			h4.Width = 150;
    
			list.Columns.Add(h0);		// add list headers 
			list.Columns.Add(h1);		
			list.Columns.Add(h2);		 
			list.Columns.Add(h3);
			list.Columns.Add(h4);
		}

		void PrintCache()
		{
			IApplicationContext ac = null;
			IAssemblyEnum ae;
			IAssemblyName an;
			uint nChars;
			StringBuilder sb;
			int nAssemblies;
			string[] info;
			string[] allInfo;
			String aName;
			String aVersion;
			String aLanguage;
			String aToken;
			String aType;

			for ( uint i = 1; i <= 2; i++ ) 
			{
				Fusion.CreateAssemblyEnum( out ae, null, null, i, 0 );
				if ( ae == null ) continue;

				if ( i == 1 )
					aType = "PreJit";
				else
					aType = "";

				nAssemblies = 0;
			
				while ( ae.GetNextAssembly( out ac, out an, 0 ) == 0 ) 
				{
					nChars = 0;
					an.GetDisplayName( null, ref nChars, 0 );

					sb = new StringBuilder( (int) nChars );
					an.GetDisplayName( sb, ref nChars, 0 );					 
					++nAssemblies;
			
					info = sb.ToString().Split( ',' );
					aName = info[0];
					aVersion = info[1].Substring(info[1].LastIndexOf('=')+1);
					aLanguage = info[2].Substring(info[2].LastIndexOf('=')+1);
					if (aLanguage.Equals("neutral")) 
						aLanguage = "";

					aToken = info[3].Substring(info[3].LastIndexOf('=')+1);

					allInfo = new string[] { aName, aType ,aVersion, aLanguage, aToken };

					list.Items.Add(new ListViewItem(allInfo));
				}
			}
		}
	}

	[
	ComImport(),
	Guid("E707DCDE-D1CD-11D2-BAB9-00C04F8ECEAE"),
	InterfaceType(ComInterfaceType.InterfaceIsIUnknown)
	]
	public interface IAssemblyCache
	{
		[PreserveSig()]
		int UninstallAssembly(
			uint dwFlags, 
			[MarshalAs(UnmanagedType.LPWStr)] string pszAssemblyName,
			IntPtr pvReserved,
			int pulDisposition);

		[PreserveSig()]
		int QueryAssemblyInfo(
			uint dwFlags,
			[MarshalAs(UnmanagedType.LPWStr)] string pszAssemblyName,
			IntPtr pAsmInfo);

		[PreserveSig()]
		int CreateAssemblyCacheItem(
			uint dwFlags,
			IntPtr pvReserved,
			out IAssemblyCacheItem ppAsmItem,
			[MarshalAs(UnmanagedType.LPWStr)] string pszAssemblyName);

		[PreserveSig()]
		int CreateAssemblyScavenger(
			out object ppAsmScavenger);

		[PreserveSig()]
		int InstallAssembly(
			uint dwFlags,
			[MarshalAs(UnmanagedType.LPWStr)] string pszManifestFilePath,
			IntPtr pvReserved);
	}


	[
	ComImport(),
	Guid("9E3AAEB4-D1CD-11D2-BAB9-00C04F8ECEAE"),
	InterfaceType(ComInterfaceType.InterfaceIsIUnknown)
	]
	public interface IAssemblyCacheItem
	{
		void CreateStream(
			[MarshalAs(UnmanagedType.LPWStr)] string pszName,
			uint dwFormat,
			uint dwFlags,
			uint dwMaxSize,
			out UCOMIStream ppStream);

		void IsNameEqual(
			IAssemblyName pName);

		void Commit(
			uint dwFlags);

		void MarkAssemblyVisible(
			uint dwFlags);

	}
  

	[
	ComImport(),
	Guid("CD193BC0-B4BC-11D2-9833-00C04FC31D2E"),
	InterfaceType(ComInterfaceType.InterfaceIsIUnknown)
	]
	public interface IAssemblyName
	{
		[PreserveSig()]
		int SetProperty(
			uint PropertyId,
			IntPtr pvProperty,
			uint cbProperty);

		[PreserveSig()]
		int GetProperty(
			uint PropertyId,
			IntPtr pvProperty,
			ref uint pcbProperty);

		[PreserveSig()]
		int Finalize();

		[PreserveSig()]
		int GetDisplayName(
			[Out(), MarshalAs(UnmanagedType.LPWStr)] StringBuilder szDisplayName,
			ref uint pccDisplayName,
			uint dwDisplayFlags);

		[PreserveSig()]
		int BindToObject(
			object refIID,
			object pAsmBindSink,
			IApplicationContext pApplicationContext,
			[MarshalAs(UnmanagedType.LPWStr)] string szCodeBase,
			long llFlags,
			int pvReserved,
			uint cbReserved,
			out int ppv);

		[PreserveSig()]
		int GetName(
			out uint lpcwBuffer,
			out int pwzName);

		[PreserveSig()]
		int GetVersion(
			out uint pdwVersionHi,
			out uint pdwVersionLow);

		[PreserveSig()]
		int IsEqual(
			IAssemblyName pName,
			uint dwCmpFlags);

		[PreserveSig()]
		int Clone(
			out IAssemblyName pName);
	}

  

	[
	ComImport(),
	Guid("7C23FF90-33AF-11D3-95DA-00A024A85B51"),
	InterfaceType(ComInterfaceType.InterfaceIsIUnknown)
	]
	public interface IApplicationContext
	{
		void SetContextNameObject(
			IAssemblyName pName);

		void GetContextNameObject(
			out IAssemblyName ppName);

		void Set(
			[MarshalAs(UnmanagedType.LPWStr)] string szName,
			int pvValue,
			uint cbValue,
			uint dwFlags);

		void Get(
			[MarshalAs(UnmanagedType.LPWStr)] string szName,
			out int pvValue,
			ref uint pcbValue,
			uint dwFlags);

		void GetDynamicDirectory(
			out int wzDynamicDir,
			ref uint pdwSize);
	}

	[
	ComImport(),
	Guid("21B8916C-F28E-11D2-A473-00C04F8EF448"),
	InterfaceType(ComInterfaceType.InterfaceIsIUnknown)
	]
	public interface IAssemblyEnum
	{
		[PreserveSig()]
		int GetNextAssembly(
			out IApplicationContext ppAppCtx,
			out IAssemblyName ppName,
			uint dwFlags);

		[PreserveSig()]
		int Reset();

		[PreserveSig()]
		int Clone(
			out IAssemblyEnum ppEnum);
	}


	[
	ComImport(),
	Guid("1D23DF4D-A1E2-4B8B-93D6-6EA3DC285A54"),
	InterfaceType(ComInterfaceType.InterfaceIsIUnknown)
	]
	public interface IHistoryReader
	{
		[PreserveSig()]
		int GetFilePath(
			[Out(), MarshalAs(UnmanagedType.LPWStr)] StringBuilder wzFilePath,
			ref uint pdwSize);

		[PreserveSig()]
		int GetApplicationName(
			[Out(), MarshalAs(UnmanagedType.LPWStr)] StringBuilder wzAppName,
			ref uint pdwSize);

		[PreserveSig()]
		int GetEXEModulePath(
			[Out(), MarshalAs(UnmanagedType.LPWStr)] StringBuilder wzExePath,
			ref uint pdwSize);

		void GetNumActivations(
			out uint pdwNumActivations);

		void GetActivationDate(
			uint dwIdx,
			out FILETIME pftDate);

		void GetRunTimeVersion(
			ref FILETIME pftActivationDate,
			[Out(), MarshalAs(UnmanagedType.LPWStr)] StringBuilder wzRunTimeVersion,
			out uint pdwSize);

		void GetNumAssemblies(
			ref FILETIME pftActivationDate,
			out uint pdwNumAsms);

		void GetHistoryAssembly(
			ref FILETIME pftActivationDate,
			uint dwIdx,
			out object ppHistAsm);



	}



  
  
	public class Fusion
	{
		// AddAssemblyToCache has the standard Rundll32 signature (Q164787),
		// and can be called from the command line with
		//
		// rundll32 fusion.dll,AddAssemblyToCache  -m "<assembly to install>"
		//
		[DllImport("fusion.dll", CharSet=CharSet.Auto)]
		public static extern int AddAssemblyToCache(
			IntPtr hwnd, 
			IntPtr hinst, 
			string lpszCmdLine,
			int nCmdShow);

		[DllImport("fusion.dll", CharSet=CharSet.Auto)]
		public static extern int CreateAssemblyCache(
			out IAssemblyCache ppAsmCache, 
			uint dwReserved);

		[DllImport("fusion.dll", CharSet=CharSet.Auto)]
		public static extern int CreateAssemblyCacheItem(
			out IAssemblyCacheItem ppasm,
			IAssemblyName pName,
			[MarshalAs(UnmanagedType.LPWStr)] string pszCodebase,
			ref FILETIME pftLastMod,
			uint dwInstaller,
			uint dwReserved);

		//
		// dwFlags: 1 = Enumerate native image (NGEN) assemblies
		//          2 = Enumerate GAC assemblies
		[DllImport("fusion.dll", CharSet=CharSet.Auto)]
		public static extern int CreateAssemblyEnum(
			out IAssemblyEnum ppEnum,
			IApplicationContext pAppCtx,
			IAssemblyName pName,
			uint dwFlags,
			int pvReserved);

		[DllImport("fusion.dll", CharSet=CharSet.Auto)]
		public static extern int CreateAssemblyNameObject(
			out IAssemblyName ppName,
			string szAssemblyName,
			uint dwFlags,
			int pvReserved);

		[DllImport("fusion.dll", CharSet=CharSet.Auto)]
		public static extern int CreateHistoryReader(
			string wzFilePath,
			out IHistoryReader ppHistReader); 

		[DllImport("fusion.dll", CharSet=CharSet.Auto)]
		public static extern int DeleteAssemblyFromTransportCache(
			string lpszAsmNameStr,
			ref int pDelCount);

		// Retrieves the path of the ApplicationHistory folder, typically
		// Documents and Settings\<user>\Local Settings\Application Data\ApplicationHistory
		// containing .ini files that can be read wíth IHistoryReader.
		// pwdSize appears to be the offset of the last backslash in the returned
		// string after the call.
		// Returns S_OK on success, error HRESULT on failure.
		// 
		[DllImport("fusion.dll", CharSet=CharSet.Unicode)]
		public static extern int GetHistoryFileDirectory(
			[MarshalAs(UnmanagedType.LPWStr)] StringBuilder wzDir,
			ref uint pdwSize);

	}
}