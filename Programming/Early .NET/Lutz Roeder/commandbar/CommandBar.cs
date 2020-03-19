// Windows Forms CommandBar controls for .NET.
// Copyright (C) 2001-2002 Lutz Roeder. All rights reserved.
// http://www.aisto.com/roeder
// ******@aisto.com

namespace System.Windows.Forms
{
	using System;
	using System.Collections;
	using System.ComponentModel;
	using System.Drawing;
	using System.Drawing.Imaging;
	using System.Runtime.InteropServices;
	using System.Security;
	using System.Windows.Forms;

	public class CommandBar : Control, IChevron
	{
		CommandBarItemCollection items = new CommandBarItemCollection();
		CommandBarStyle style = CommandBarStyle.ToolBar;

		CommandContextMenu contextMenu = new CommandContextMenu();
		IntPtr hookHandle = IntPtr.Zero;
		Point lastMousePosition = new Point(0, 0);
		int trackHotItem = -1;
		int trackNextItem = -1;
		bool trackEscapePressed = false;
		enum State { None, Hot, HotTracking }
		State state = State.None;
		State lastState = State.None;
		ImageList imageList; 
		CommandBarItem[] handledItems = new CommandBarItem[0];
		bool[] handledItemsVisible = new bool[0];
	
		public CommandBar()
		{
			SetStyle(ControlStyles.UserPaint, false);
	
			TabStop = false;
			Font = SystemInformation.MenuFont;
			Dock = DockStyle.Top;

			items.Changed += new EventHandler(Items_Changed);
			Attach();
		}	

		~CommandBar()
		{
			Detach();
			items.Changed -= new EventHandler(Items_Changed);
		}
	
		public CommandBar(CommandBarStyle style) : this()
		{
			this.style = style;
		}
	
		public CommandBarStyle Style
		{
			set { style = value; UpdateItems(); }
			get { return style; }
		}
	
		public CommandBarItemCollection Items
		{
			get { return items; }
		}

		protected override Size DefaultSize
		{
			get { return new Size(100, 22); }
		}
	
		protected override void CreateHandle() 
		{
			if (!RecreatingHandle)
			{
				Win32.INITCOMMONCONTROLSEX icex = new Win32.INITCOMMONCONTROLSEX();
				icex.dwICC = Win32.ICC_BAR_CLASSES | Win32.ICC_COOL_CLASSES;
				Win32.InitCommonControlsEx(icex);
			}

			base.CreateHandle();
		}
	
		protected override CreateParams CreateParams
		{
			get
			{
				CreateParams createParams = base.CreateParams;
				createParams.ClassName = Win32.TOOLBARCLASSNAME;
				createParams.ExStyle = 0;
				createParams.Style = Win32.WS_CHILD | Win32.WS_VISIBLE | Win32.WS_CLIPCHILDREN | Win32.WS_CLIPSIBLINGS;
				createParams.Style |= Win32.CCS_NODIVIDER | Win32.CCS_NORESIZE | Win32.CCS_NOPARENTALIGN;
				createParams.Style |= Win32.TBSTYLE_TOOLTIPS | Win32.TBSTYLE_FLAT | Win32.TBSTYLE_TRANSPARENT;
				if (Style == CommandBarStyle.Menu) createParams.Style |= Win32.TBSTYLE_LIST;
				return createParams;
			}
		}
	
		protected override void OnHandleCreated(EventArgs e)
		{
			Win32.SendMessage(Handle, Win32.TB_BUTTONSTRUCTSIZE, Marshal.SizeOf(typeof(Win32.TBBUTTON)), 0);

			int extendedStyle = Win32.TBSTYLE_EX_HIDECLIPPEDBUTTONS | Win32.TBSTYLE_EX_DOUBLEBUFFER;
			if (style == CommandBarStyle.ToolBar) extendedStyle |= Win32.TBSTYLE_EX_DRAWDDARROWS;
			Win32.SendMessage(Handle, Win32.TB_SETEXTENDEDSTYLE, 0, extendedStyle);

			RealizeItems();

			base.OnHandleCreated(e);
		}

		public override bool PreProcessMessage(ref Message message)
		{
			if (message.Msg == Win32.WM_KEYDOWN || message.Msg == Win32.WM_SYSKEYDOWN)
			{
				// Process shortcuts.
				Keys keyData = (Keys)(int) message.WParam | ModifierKeys;
				if (state == State.None)
				{
					CommandBarItem[] shortcutHits = items[keyData];
					if (shortcutHits.Length > 0)
					{
						shortcutHits[0].RaiseClick();
						return true;
					}
				}
			}

			// All the following code is for MenuBar only.
			if (Style != CommandBarStyle.Menu) return false;

			if ((message.Msg >= Win32.WM_LBUTTONDOWN) && (message.Msg <= Win32.WM_MOUSELAST))
			{
				// Check if user clicked outside the MenuBar and end tracking.
				if ((message.HWnd != Handle) && (this.state != State.None))
					SetState(State.None, -1);
			}
			else if ((message.Msg == Win32.WM_SYSKEYUP) || (message.Msg == Win32.WM_KEYDOWN) || (message.Msg == Win32.WM_SYSKEYDOWN))
			{
				Keys keyData = ((Keys) (int) message.WParam) | ModifierKeys;
				Keys keyCode = ((Keys) (int) message.WParam);
				if ((keyData == Keys.F10) || (keyCode == Keys.Menu))
				{
					if (message.Msg == Win32.WM_SYSKEYUP)
					{
						if ((this.state == State.Hot) || (this.lastState == State.HotTracking))
							SetState(State.None, 0);
						else if (state == State.None)
							SetState(State.Hot, 0);
						return true;
					}
				}		
				else if (message.Msg == Win32.WM_KEYDOWN || message.Msg == Win32.WM_SYSKEYDOWN)			
				{
					if (PreProcessKeyDown(ref message)) 
						return true;
				}
			}

			return false;
		}

		protected override void OnMouseDown(MouseEventArgs e)
		{
			if (this.Style == CommandBarStyle.Menu)
			{
				if ((e.Button == MouseButtons.Left) && (e.Clicks == 1))
				{
					Point point = new Point(e.X, e.Y);
					int index = this.HitTest(point);
					if (this.IsValid(index))
					{
						this.TrackDropDown(index);
						return;
					}
				}
			}
			
			base.OnMouseDown(e);
		}

		protected override void OnMouseMove(MouseEventArgs e)
		{
			if (this.Style == CommandBarStyle.Menu)
			{
				Point point = new Point(e.X, e.Y);
				if (this.state == State.Hot)
				{
					int index = this.HitTest(point);
					if ((this.IsValid(index)) && (point != lastMousePosition))
						this.SetHotItem(index);
					return;
				}
				
				lastMousePosition = point;
			}
			
			base.OnMouseMove(e);
		}

		bool PreProcessKeyDown(ref Message message)
		{
			Keys keyData = (Keys)(int) message.WParam | ModifierKeys;
			if (state == State.Hot)
			{
				if (keyData == Keys.Left)
				{
					SetHotItem(GetPreviousItem(GetHotItem()));
					return true;
				}

				if (keyData == Keys.Right)
				{
					SetHotItem(GetNextItem(GetHotItem()));
					return true;
				}

				if ((keyData == Keys.Up) || (keyData == Keys.Down) || (keyData == Keys.Enter))
				{
					TrackDropDown(GetHotItem());
					return true;
				}

				if (keyData == Keys.Escape)
				{
					SetState(State.None, -1);
					return true;
				}
			}

			bool alt = ((keyData & Keys.Alt) != 0) && ((keyData & Keys.Control) == 0);
			if ((state == State.Hot) || (alt))
			{
				Keys keyCode = keyData & Keys.KeyCode;
				char key = (char) (int) keyCode;
				if ((Char.IsDigit(key) || (Char.IsLetter(key))))
				{
					// Process mnemonics.
					if (PreProcessMnemonic(keyCode)) 
						return true;

					if ((state == State.Hot) && (!alt))			
					{
						Win32.MessageBeep(0);
						return true;
					}
				}
			}

			// return to default state if not handled
			if (state != State.None) SetState(State.None, -1);

			return false;
		}

		bool PreProcessMnemonic(Keys keyCode)
		{
			char mnemonic = (char) (int) keyCode;
			CommandBarItem[] mnemonicHits = items[mnemonic];
			if (mnemonicHits.Length > 0)
			{
				int index = items.IndexOf(mnemonicHits[0]);
				this.TrackDropDown(index);
				return true;
			}
			
			return false;
		}

		bool IsValid(int index)
		{
			int count = Win32.SendMessage(Handle, Win32.TB_BUTTONCOUNT, 0, 0);
			return ((index >= 0) && (index < count));
		}

		int HitTest(Point point)
		{
			Win32.POINT pt = new Win32.POINT();
			pt.x = point.X;
			pt.y = point.Y;
			int hit = Win32.SendMessage(Handle, Win32.TB_HITTEST, 0, ref pt);
			if (hit > 0)
			{
				point = this.PointToScreen(point);
				Rectangle bounds = this.RectangleToScreen(new Rectangle(0, 0, Width, Height));
				if (!bounds.Contains(point)) return -1;
			}

			return hit;
		}

		int GetNextItem(int index)
		{
			if (index == -1) throw new Exception();
			int count = Win32.SendMessage(Handle, Win32.TB_BUTTONCOUNT, 0, 0);
			index++;
			if (index >= count) index = 0;
			return index;
		}
			
		int GetPreviousItem(int index)
		{
			if (index == -1) throw new Exception();
			int count = Win32.SendMessage(Handle, Win32.TB_BUTTONCOUNT, 0, 0);
			index--;
			if (index < 0) index = count - 1;
			return index;
		}

		int GetHotItem()
		{
			return Win32.SendMessage(Handle, Win32.TB_GETHOTITEM, 0, 0);
		}
		
		void SetHotItem(int index)
		{
			Win32.SendMessage(Handle, Win32.TB_SETHOTITEM, index, 0);
		}

		void SetState(State state, int index)
		{
			if (this.state != state)
			{
				if (state == State.None)
					index = -1;
					
				SetHotItem(index);
				
				if (state == State.HotTracking)
				{
					trackEscapePressed = false;
					trackHotItem = index;
				}
			}

			this.lastState = this.state;
			this.state = state;
		}

		void TrackDropDownNext(int index)
		{
			if (index != trackHotItem)
			{
				Win32.PostMessage(Handle, Win32.WM_CANCELMODE, 0, 0);
				this.trackNextItem = index;
			}
		}

		void TrackDropDown(int index)
		{
			while (index >= 0)
			{
				this.trackNextItem = -1;

				BeginUpdate();

				// Raise event
				CommandBarItem item = (CommandBarItem) items[index];
				item.RaiseDropDown();
				this.contextMenu.Mnemonics = true;
				this.contextMenu.Items = item.Items;

				// Item state
				Win32.SendMessage(Handle, Win32.TB_PRESSBUTTON, index, -1);

				// Trick to get the first menu item selected
				Win32.PostMessage(Handle, Win32.WM_KEYDOWN, (int) Keys.Down, 1);
				Win32.PostMessage(Handle, Win32.WM_KEYUP, (int) Keys.Down, 1);

				this.SetState(State.HotTracking, index);

				// Hook
				Win32.HookProc hookProc = new Win32.HookProc(DropDownHook);
				GCHandle hookProcHandle = GCHandle.Alloc(hookProc);
				this.hookHandle = Win32.SetWindowsHookEx(Win32.WH_MSGFILTER, hookProc, IntPtr.Zero, Win32.GetCurrentThreadId());
				if (hookHandle == IntPtr.Zero) throw new SecurityException();

				// Ask for position
				Win32.RECT rect = new Win32.RECT();
				Win32.SendMessage(Handle, Win32.TB_GETRECT, index, ref rect);
				Point position = new Point(rect.left, rect.bottom);
				
				EndUpdate();
				Update();
				
				this.contextMenu.Show(this, position);

				// Unhook		
				Win32.UnhookWindowsHookEx(hookHandle);
				hookProcHandle.Free();
				this.hookHandle = IntPtr.Zero;

				// Item state
				Win32.SendMessage(Handle, Win32.TB_PRESSBUTTON, index, 0);
				this.SetState(trackEscapePressed ? State.Hot : State.None, index);
				
				index = trackNextItem;
			}
		}				

		void IChevron.Show(Control control, Point point)
		{
			CommandBarItemCollection chevronItems = new CommandBarItemCollection();
			Size size = ClientSize;
			for (int i = 0; i < items.Count; i++)
			{
				Win32.RECT rect = new Win32.RECT();
				Win32.SendMessage(Handle, Win32.TB_GETITEMRECT, i, ref rect);
				if (rect.right > size.Width)
				{
					CommandBarItem item = items[i];
					if (item.Visible) 
						if ((item.Style != CommandBarItemStyle.Separator) || (chevronItems.Count != 0))
							chevronItems.Add(item);
				}
			}

			this.contextMenu.Mnemonics = false;
			this.contextMenu.Items = chevronItems;
			this.contextMenu.Show(control, point);
		}

		bool DropDownFilter(ref Message message)
		{
			if (state != State.HotTracking) throw new Exception();

			// comctl32 sometimes steals the hot item for unknown reasons.
			SetHotItem(this.trackHotItem);

			if (message.Msg == Win32.WM_KEYDOWN)
			{
				Keys keyData = (Keys)(int) message.WParam | ModifierKeys;

				if (keyData == Keys.Left)
				{
					this.TrackDropDownNext(GetPreviousItem(trackHotItem));
					return true;
				}

				// Only move right if there is no submenu on the current selected item.
				if ((keyData == Keys.Right) && ((this.contextMenu.SelectedMenuItem == null) || (this.contextMenu.SelectedMenuItem.MenuItems.Count == 0)))
				{
					this.TrackDropDownNext(GetNextItem(trackHotItem));
					return true;
				}

				if (keyData == Keys.Escape)
				{
					trackEscapePressed = true;
				}
			}
			else if ((message.Msg == Win32.WM_MOUSEMOVE) || (message.Msg == Win32.WM_LBUTTONDOWN))
			{
				Point point = new Point(((int) message.LParam) & 0xffff, ((int) message.LParam) >> 16);
				point = this.PointToClient(point);

				if (message.Msg == Win32.WM_MOUSEMOVE)
				{
					if (point != lastMousePosition)
					{
						int index = HitTest(point);
						if ((this.IsValid(index)) && (index != trackHotItem))
							this.TrackDropDownNext(index);

						lastMousePosition = point;
					}
				}
				else if (message.Msg == Win32.WM_LBUTTONDOWN)
				{
					if (HitTest(point) == trackHotItem)
					{
						this.TrackDropDownNext(-1);
						return true;
					}
				}
			}

			return false;
		}

		IntPtr DropDownHook(int code, IntPtr wparam, IntPtr lparam) 
		{
			if (code == Win32.MSGF_MENU)
			{
				Win32.MSG msg = (Win32.MSG) Marshal.PtrToStructure(lparam, typeof(Win32.MSG));
				Message message = Message.Create(msg.hwnd, msg.message, msg.wParam, msg.lParam);
				if (DropDownFilter(ref message))
					return (IntPtr) 1;
			}
	
			return Win32.CallNextHookEx(hookHandle, code, wparam, lparam);
		}
	
		protected override void WndProc(ref Message message)
		{
			base.WndProc(ref message);

			switch (message.Msg)
			{
				case Win32.WM_COMMAND + Win32.WM_REFLECT:
					int index = (int) message.WParam & 0xFFFF;
					CommandBarItem item = items[index];
					item.RaiseClick();
					base.WndProc(ref message);
					ResetMouseEventArgs();
					break;

				case Win32.WM_MENUCHAR:
					WmMenuChar(ref message);
					break;
	
				case Win32.WM_NOTIFY:
				case Win32.WM_NOTIFY + Win32.WM_REFLECT:
					Win32.NMHDR note = (Win32.NMHDR) message.GetLParam(typeof(Win32.NMHDR));
	
				switch (note.code)
				{
					case Win32.TTN_NEEDTEXTA:
						NotifyNeedTextA(ref message);
						break;
	
					case Win32.TTN_NEEDTEXTW:
						NotifyNeedTextW(ref message);
						break;				
	
					case Win32.TBN_QUERYINSERT:
						message.Result = (IntPtr) 1;
						break;
	
					case Win32.TBN_DROPDOWN:
						NotifyDropDown(ref message);
						break;
						
					case Win32.NM_CUSTOMDRAW:
						NotifyCustomDraw(ref message);
						break;

					case Win32.TBN_HOTITEMCHANGE:
						break;
				}

					break;
			}
		}

		void NotifyCustomDrawMenuBar(ref Message m)		
		{
			m.Result = (IntPtr) Win32.CDRF_DODEFAULT;
			Win32.LPNMTBCUSTOMDRAW tbcd = (Win32.LPNMTBCUSTOMDRAW) m.GetLParam(typeof(Win32.LPNMTBCUSTOMDRAW));

			bool hot = ((tbcd.nmcd.uItemState & Win32.CDIS_HOT) != 0);
			bool selected = ((tbcd.nmcd.uItemState & Win32.CDIS_SELECTED) != 0);

			if (hot || selected)
			{
				Graphics g = Graphics.FromHdc(tbcd.nmcd.hdc);
				int index = tbcd.nmcd.dwItemSpec;
				Font font = Font;
				string text = items[index].Text;
				Size size = Win32.TextHelper.GetTextSize(g, text, font);
				Win32.RECT rc = tbcd.nmcd.rc;
				Point point = new Point(rc.left + ((rc.right - rc.left - size.Width) / 2), rc.top + ((rc.bottom - rc.top - size.Height) / 2));
				g.FillRectangle(SystemBrushes.Highlight, rc.left, rc.top, rc.right - rc.left, rc.bottom - rc.top);
				Win32.TextHelper.DrawText(g, text, point, font, SystemColors.HighlightText);
				m.Result = (IntPtr) Win32.CDRF_SKIPDEFAULT;
			}
		}

		void NotifyCustomDrawToolBar(ref Message m)
		{
			m.Result = (IntPtr) Win32.CDRF_DODEFAULT;
			if (Win32.ImageHelper.Version.Major >= 6) return;

			Win32.LPNMTBCUSTOMDRAW tbcd = (Win32.LPNMTBCUSTOMDRAW) m.GetLParam(typeof(Win32.LPNMTBCUSTOMDRAW));
			Win32.RECT rc = tbcd.nmcd.rc;

			Rectangle rectangle = new Rectangle(rc.left, rc.top, rc.right - rc.left, rc.bottom - rc.top);

			Graphics g = Graphics.FromHdc(tbcd.nmcd.hdc);
			int index = tbcd.nmcd.dwItemSpec;
			CommandBarItem item = items[index];

			bool hot = ((tbcd.nmcd.uItemState & Win32.CDIS_HOT) != 0);
			bool selected = ((tbcd.nmcd.uItemState & Win32.CDIS_SELECTED) != 0);
			bool disabled = ((tbcd.nmcd.uItemState & Win32.CDIS_DISABLED) != 0);
	
			if (item.Checked)
				ControlPaint.DrawBorder3D(g, rectangle, Border3DStyle.SunkenOuter);
			else if (selected)
				ControlPaint.DrawBorder3D(g, rectangle, Border3DStyle.SunkenOuter);
			else if (hot)
				ControlPaint.DrawBorder3D(g, rectangle, Border3DStyle.RaisedInner);

			Image image = item.Image;
			if (image != null)
			{
				Size size = image.Size;
				Point point = new Point(rc.left + ((rc.right - rc.left - size.Width) / 2), rc.top + ((rc.bottom - rc.top - size.Height) / 2));
				Win32.ImageHelper.DrawImage(g, image, point, disabled);
			}

			m.Result = (IntPtr) Win32.CDRF_SKIPDEFAULT;
		}

		void NotifyCustomDraw(ref Message m)
		{
			m.Result = (IntPtr) Win32.CDRF_DODEFAULT;
			Win32.LPNMTBCUSTOMDRAW tbcd = (Win32.LPNMTBCUSTOMDRAW) m.GetLParam(typeof(Win32.LPNMTBCUSTOMDRAW));

			switch (tbcd.nmcd.dwDrawStage)
			{
				case Win32.CDDS_PREPAINT:
					m.Result = (IntPtr) Win32.CDRF_NOTIFYITEMDRAW;
					break;
	
				case Win32.CDDS_ITEMPREPAINT:
					if (Style == CommandBarStyle.Menu) NotifyCustomDrawMenuBar(ref m);
					if (style == CommandBarStyle.ToolBar) NotifyCustomDrawToolBar(ref m);
					break;
			}
		}

		void WmMenuChar(ref Message message)
		{
			Menu menu = contextMenu.FindMenuItem(MenuItem.FindHandle, message.LParam);
			if (contextMenu.Handle == message.LParam) menu = contextMenu;

			if (menu != null)
			{
				char key = char.ToUpper((char) ((int) message.WParam & 0x0000FFFF));
				int index = 0;
				foreach (MenuItem menuItem in menu.MenuItems)
				{
					if ((menuItem != null) && (menuItem.OwnerDraw) && (menuItem.Mnemonic == key))
					{
						message.Result = (IntPtr) ((Win32.MNC_EXECUTE << 16) | index);
						return;
					}
					
					if (menuItem.Visible) index++;
				}
			}
		}

		void NotifyDropDown(ref Message m)
		{
			if (Style != CommandBarStyle.ToolBar) return;

			Win32.NMTOOLBAR nmtb = (Win32.NMTOOLBAR) m.GetLParam(typeof(Win32.NMTOOLBAR));
			int index = nmtb.iItem;
			this.TrackDropDown(index);
		}

		void NotifyNeedTextA(ref Message m)
		{
			if (Style == CommandBarStyle.Menu) return;
			Win32.TOOLTIPTEXTA ttt = (Win32.TOOLTIPTEXTA) m.GetLParam(typeof(Win32.TOOLTIPTEXTA));
			CommandBarItem item = (CommandBarItem) items[ttt.hdr.idFrom];
			ttt.szText = item.Text;
			if (item.Shortcut != Keys.None) ttt.szText += " (" + TypeDescriptor.GetConverter(typeof(Keys)).ConvertToString(item.Shortcut) + ")";
			ttt.hinst = IntPtr.Zero;
			if (RightToLeft == RightToLeft.Yes)	ttt.uFlags |= Win32.TTF_RTLREADING;
			Marshal.StructureToPtr(ttt, m.LParam, true);
			m.Result = (IntPtr) 1;
		}
	
		void NotifyNeedTextW(ref Message m)
		{
			if (Style == CommandBarStyle.Menu) return;
			if (Marshal.SystemDefaultCharSize != 2) return;
	
			// this code is a duplicate of NotifyNeedTextA
			Win32.TOOLTIPTEXT ttt = (Win32.TOOLTIPTEXT) m.GetLParam(typeof(Win32.TOOLTIPTEXT));
			CommandBarItem item = (CommandBarItem) items[ttt.hdr.idFrom];
			ttt.szText = item.Text;
			if (item.Shortcut != Keys.None) ttt.szText += " (" + TypeDescriptor.GetConverter(typeof(Keys)).ConvertToString(item.Shortcut) + ")";
			ttt.hinst = IntPtr.Zero;
			if (RightToLeft == RightToLeft.Yes) ttt.uFlags |= Win32.TTF_RTLREADING;
			Marshal.StructureToPtr(ttt, m.LParam, true);
			m.Result = (IntPtr) 1;
		}
	
		protected override void OnFontChanged(EventArgs e) 
		{
			base.OnFontChanged(e);
			UpdateItems();
		}

		void Attach()
		{
			int count = Items.Count;
			handledItems = new CommandBarItem[count];
			handledItemsVisible = new bool[count];

			for (int i = 0; i < count; i++)
			{
				CommandBarItem item = Items[i];
				item.Changed += new EventHandler(Item_Changed);
				item.Items.Changed += new EventHandler(Item_Changed);
				handledItems[i] = item;
				handledItemsVisible[i] = item.Visible;
			}
		}

		void Detach()
		{
			foreach (CommandBarItem item in handledItems)
			{
				item.Changed -= new EventHandler(Item_Changed);
				item.Items.Changed -= new EventHandler(Item_Changed);
			}

			handledItems = null;
			handledItemsVisible = null;
		}

		void Items_Changed(Object s, EventArgs e)
		{
			UpdateItems();
		}

		void Item_Changed(Object s, EventArgs e)
		{
			CommandBarItem[] handledItems = this.handledItems;
			foreach (CommandBarItem item in handledItems)
			{
				if ((item.Items == s) || (item == s))
				{
					if (item == null) return;
					int index = items.IndexOf(item);
					if (index == -1) return;
					UpdateItem(index);
				}
			}
		}
	
		void BeginUpdate()
		{
			Win32.SendMessage(Handle, Win32.WM_SETREDRAW, 0, 0);	
		}
	
		void EndUpdate()
		{
			Win32.SendMessage(Handle, Win32.WM_SETREDRAW, 1, 0);
		}

		void UpdateItems()
		{
			Detach();
			Attach();
			contextMenu.Font = Font;
			if (IsHandleCreated) RecreateHandle();
		}
	
		Win32.TBBUTTONINFO GetButtonInfo(int index)
		{
			CommandBarItem item = items[index];

			Win32.TBBUTTONINFO tbi = new Win32.TBBUTTONINFO();
			tbi.cbSize = Marshal.SizeOf(typeof(Win32.TBBUTTONINFO));

			tbi.dwMask = Win32.TBIF_IMAGE | Win32.TBIF_STATE | Win32.TBIF_STYLE | Win32.TBIF_COMMAND;
			tbi.idCommand = index;			
			tbi.iImage = Win32.I_IMAGECALLBACK;
			tbi.fsState = 0;
			tbi.fsStyle = Win32.BTNS_BUTTON | Win32.BTNS_AUTOSIZE;
			tbi.cx = 0;
			tbi.lParam = IntPtr.Zero;
			tbi.pszText = IntPtr.Zero;
			tbi.cchText = 0;

			if (!item.Visible)
				tbi.fsState |= Win32.TBSTATE_HIDDEN;
						
			if (item.Style == CommandBarItemStyle.Separator)
			{
				tbi.fsStyle |= Win32.BTNS_SEP;
			}			
			else
			{
				if (item.Enabled)
					tbi.fsState |= Win32.TBSTATE_ENABLED;

				if (item.Items.Count > 0)
					tbi.fsStyle |= Win32.BTNS_DROPDOWN;

				if (style == CommandBarStyle.ToolBar)
					if (item.Style == CommandBarItemStyle.DropDown)
						tbi.fsStyle |= Win32.BTNS_WHOLEDROPDOWN;

				if (item.Style == CommandBarItemStyle.Command)
					if (item.Checked) 
						tbi.fsState |= Win32.TBSTATE_CHECKED;
			}

			if (item.Style == CommandBarItemStyle.Separator)
				tbi.iImage = Win32.I_IMAGENONE;
			else if (item.Image != null)
				tbi.iImage = index;

			if ((Style == CommandBarStyle.Menu) && (item.Text != null) && (item.Text != string.Empty))
			{
				tbi.dwMask |= Win32.TBIF_TEXT;
				tbi.pszText = Marshal.StringToHGlobalUni(item.Text + "\0");
				tbi.cchText = item.Text.Length;
			}

			return tbi;				
		}

		void RealizeItems()
		{
			UpdateImageList();
			
			for (int i = 0; i < items.Count; i++)
			{
				Win32.TBBUTTON button = new Win32.TBBUTTON();
				button.idCommand = i;
				Win32.SendMessage(Handle, Win32.TB_INSERTBUTTON, i, ref button);
	
				Win32.TBBUTTONINFO tbi = GetButtonInfo(i);
				Win32.SendMessage(Handle, Win32.TB_SETBUTTONINFO, i, ref tbi);
			}

			SetButtonSize();
			UpdateSize();
		}

		void UpdateImageList()
		{
			Size size = new Size(8, 8);
			for (int i = 0; i < items.Count; i++)
			{
				Image image = items[i].Image;
				if (image != null)
				{
					if (image.Width > size.Width) size.Width = image.Width;
					if (image.Height > size.Height) size.Height = image.Height;
				}
			}
	
			imageList = new ImageList();
			imageList.ImageSize = size;
			imageList.ColorDepth = ColorDepth.Depth32Bit;		

			for (int i = 0; i < items.Count; i++)
			{
				Image image = items[i].Image;
				imageList.Images.Add((image != null) ? image : new Bitmap(size.Width, size.Height));
			}
	
			IntPtr handle = (Style == CommandBarStyle.Menu) ? IntPtr.Zero : imageList.Handle;
			Win32.SendMessage(Handle, Win32.TB_SETIMAGELIST, 0, handle);
		}

		void SetButtonSize()
		{
			if (style == CommandBarStyle.Menu)
			{
				int fontHeight = Font.Height;
				
				Graphics g = CreateGraphics();
				foreach (CommandBarItem item in items)
				{
					Size textSize = Win32.TextHelper.GetTextSize(g, item.Text, Font);
					if (fontHeight < textSize.Height) fontHeight = textSize.Height;
				}

				Win32.SendMessage(Handle, Win32.TB_SETBUTTONSIZE, 0, (fontHeight << 16) | 0xffff);
			}
		}
		
		void UpdateSize()
		{
			Size size = new Size(0, 0);
			for (int i = 0; i < items.Count; i++)
			{
				Win32.RECT rect = new Win32.RECT();
				Win32.SendMessage(Handle, Win32.TB_GETRECT, i, ref rect);
				int height = rect.bottom - rect.top;
				if (height > size.Height) size.Height = height;
				size.Width += rect.right - rect.left;
			}

			Size = size;
		}

		void UpdateItem(int index)
		{
			if (!IsHandleCreated) return;
				
			if (items[index].Visible == handledItemsVisible[index])
			{
				Win32.TBBUTTONINFO tbi = GetButtonInfo(index);
				Win32.SendMessage(Handle, Win32.TB_SETBUTTONINFO, index, ref tbi);

				UpdateImageList();
				SetButtonSize();
				UpdateSize();
			}			
			else
			{
				UpdateItems();
			}
		}
	}

	public enum CommandBarStyle
	{
		Menu,
		ToolBar
	}

	public class CommandBarItemCollection : IEnumerable
	{
		public event EventHandler Changed;
		ArrayList items = new ArrayList();

		public IEnumerator GetEnumerator()
		{
			return items.GetEnumerator();		
		}
	
		public int Count
		{
			get { return items.Count; } 
		}
	
		public void Clear()
		{
			while (Count > 0)
				RemoveAt(0);
		}
	
		public void Add(CommandBarItem item)
		{
			items.Add(item);
			RaiseChanged();
		}
	
		public void AddRange(CommandBarItem[] items)
		{
			foreach (CommandBarItem item in items)
				this.items.Add(item);

			RaiseChanged();
		}
	
		public void Insert(int index, CommandBarItem item)
		{
			items.Insert(index, item);
			RaiseChanged();
		}
	
		public void RemoveAt(int index)
		{
			CommandBarItem item = (CommandBarItem) items[index];
			items.RemoveAt(index);
			RaiseChanged();
		}
	
		public void Remove(CommandBarItem item)
		{
			if (!items.Contains(item)) return;
			items.Remove(item);
			RaiseChanged();
		}
	
		public bool Contains(CommandBarItem item)
		{
			return items.Contains(item);
		}
	
		public int IndexOf(CommandBarItem item)
		{
			return items.IndexOf(item);
		}
	
		public CommandBarItem this[int index]
		{
			get { return (CommandBarItem) items[index]; }
		}
	
		internal CommandBarItem[] this[Keys shortcut]
		{
			get
			{
				ArrayList list = new ArrayList();
	
				foreach (CommandBarItem item in items)
					if ((item.Shortcut == shortcut) && (item.Enabled) && (item.Visible))
						list.Add(item);
				
				foreach (CommandBarItem item in items)
					list.AddRange(item.Items[shortcut]);
	
				return (CommandBarItem[]) list.ToArray(typeof(CommandBarItem));
			}
		}

		internal CommandBarItem[] this[char mnemonic]
		{
			get
			{
				ArrayList list = new ArrayList();
				
				foreach (CommandBarItem item in items)
				{
					string text = item.Text;
					for (int i = 0; i < text.Length; i++)
					{
						if ((text[i] == '&') && (i + 1 < text.Length) && (text[i + 1] != '&'))
							if (mnemonic == Char.ToUpper(text[i + 1]))
								list.Add(item);
					}
				}
				
				return (CommandBarItem[]) list.ToArray(typeof(CommandBarItem));
			}
		}	
	
		void RaiseChanged()
		{
			if (Changed != null) Changed(this, null);
		}
	}
	
	public class CommandBarItem
	{
		public event EventHandler Changed;
		public event EventHandler Click;
		public event EventHandler DropDown;
		
		Image image = null;
		string text = null;
		bool enabled = true;
		bool check = false;
		bool visible = true;
		CommandBarItemStyle style = CommandBarItemStyle.Command;
		Keys shortcut = Keys.None;
		CommandBarItemCollection items = new CommandBarItemCollection();

		public CommandBarItem()
		{
		}
	
		public CommandBarItem(CommandBarItemStyle style)
		{
			this.style = style;
		}
	
		public CommandBarItem(string text)
		{
			this.text = text;
		}
	
		public CommandBarItem(string text, EventHandler clickHandler)
		{
			this.text = text;
			this.Click += clickHandler;
		}
	
		public CommandBarItem(string text, EventHandler clickHandler, Keys shortcut)
		{
			this.text = text;
			this.Click += clickHandler;
			this.shortcut = shortcut;
		}
	
		public CommandBarItem(Image image, EventHandler handler)
		{
			this.image = image;
			this.Click += handler;
		}
	
		public CommandBarItem(Image image, EventHandler handler, Keys shortcut)
		{
			this.image = image;
			this.Click += handler;
			this.shortcut = shortcut;
		}
	
		public CommandBarItem(Image image, string text, EventHandler clickHandler)
		{
			this.Click += clickHandler;
			this.image = image;
			this.text = text;
		}
	
		public CommandBarItem(Image image, string text, EventHandler clickHandler, Keys shortcut)
		{
			this.Click += clickHandler;
			this.image = image;
			this.text = text;
			this.shortcut = shortcut;
		}
	
		public bool Visible
		{
			set { visible = value; RaiseChanged(); }
			get { return visible; }
		}
	
		public Image Image
		{
			set { image = value; RaiseChanged(); }
			get { return image; }
		}
		
		public string Text
		{
			set { if (text != value) { text = value; RaiseChanged(); } }
			get { return text; }
		}
	
		public Keys Shortcut
		{
			set { if (shortcut != value) { shortcut = value; RaiseChanged(); } }
			get { return shortcut; }
		}
	
		public bool Enabled
		{
			set { if (enabled != value) { enabled = value; RaiseChanged(); } }
			get { return enabled; }
		}
	
		public bool Checked
		{
			set { if (check != value) { check = value; RaiseChanged(); } }
			get { return check; }
		}
	
		public CommandBarItemStyle Style
		{
			set { if (style != value) { style = value; RaiseChanged(); } }
			get { return style; }
		}
	
		public CommandBarItemCollection Items
		{
			set { if (items != value) { items = value; RaiseChanged(); } }
			get { return items; }
		}
		
		void RaiseChanged()
		{
			if (Changed != null) Changed(this, EventArgs.Empty);
		}

		internal void RaiseClick()
		{
			if (Click != null) Click(this, EventArgs.Empty);
		}
	
		internal void RaiseDropDown()
		{
			if (DropDown != null)	DropDown(this, EventArgs.Empty);
		}
	}
	
	public enum CommandBarItemStyle
	{
		Command = 1,
		Separator = 2,
		DropDown = 3
	}

	public class ReBar : Control, IMessageFilter
	{
		ReBarBandCollection bands = new ReBarBandCollection();
	
		public ReBar()
		{
			SetStyle(ControlStyles.UserPaint, false);
			TabStop = false;
			Dock = DockStyle.Top;
			bands.Changed += new EventHandler(Bands_Changed);
		}

		protected override void Dispose(bool disposing)
		{
			bands.Changed -= new EventHandler(Bands_Changed);
		}
	
		public ReBarBandCollection Bands
		{
			get { return bands; }
		}
	
		public override bool PreProcessMessage(ref Message msg)
		{
			foreach (Control band in bands)
				if (band.PreProcessMessage(ref msg))
					return true;

			return false;
		}
		
		protected override void OnParentChanged(EventArgs e)
		{
			if (Parent != null)
				Application.AddMessageFilter(this);
			else
				Application.RemoveMessageFilter(this);	
		}

		protected override Size DefaultSize
		{
			get { return new Size(100, 22 * 2); }
		}

		protected override void CreateHandle() 
		{
			if (!RecreatingHandle)
			{
				Win32.INITCOMMONCONTROLSEX icex = new Win32.INITCOMMONCONTROLSEX();
				icex.dwSize = Marshal.SizeOf(typeof(Win32.INITCOMMONCONTROLSEX));
				icex.dwICC = Win32.ICC_BAR_CLASSES | Win32.ICC_COOL_CLASSES;
				Win32.InitCommonControlsEx(icex);
			}
			
			base.CreateHandle();
		}
	
		protected override CreateParams CreateParams
		{
			get
			{
				CreateParams createParams = base.CreateParams;
				createParams.ClassName = Win32.REBARCLASSNAME;
				createParams.Style = Win32.WS_CHILD | Win32.WS_VISIBLE | Win32.WS_CLIPCHILDREN | Win32.WS_CLIPSIBLINGS;
				createParams.Style |= Win32.CCS_NODIVIDER  | Win32.CCS_NOPARENTALIGN | Win32.CCS_NORESIZE;
				createParams.Style |= Win32.RBS_VARHEIGHT | Win32.RBS_BANDBORDERS | Win32.RBS_AUTOSIZE;
				return createParams;
			}
		}

		protected override void OnHandleCreated(EventArgs e)
		{
			base.OnHandleCreated(e);
			RealizeBands();
		}

		protected override void WndProc(ref Message m) 
		{
			base.WndProc(ref m);

			switch (m.Msg)
			{
				case Win32.WM_NOTIFY:
				case Win32.WM_NOTIFY + Win32.WM_REFLECT:
				{
					Win32.NMHDR note = (Win32.NMHDR) m.GetLParam(typeof(Win32.NMHDR));
					switch (note.code)
					{
						case Win32.RBN_HEIGHTCHANGE:
							UpdateSize();
							break;

						case Win32.RBN_CHEVRONPUSHED:
							NotifyChevronPushed(ref m);
							break;
					}
				}
					break;
			}
		}

		void NotifyChevronPushed(ref Message m)
		{
			Win32.NMREBARCHEVRON nrch = (Win32.NMREBARCHEVRON) m.GetLParam(typeof(Win32.NMREBARCHEVRON));	
			Control band = (Control) bands[nrch.uBand];
			if (band is IChevron)
			{			
				Point point = new Point(nrch.rc.left, nrch.rc.bottom);
				(band as IChevron).Show(this, point);
			}
		}

		void BeginUpdate()
		{
			Win32.SendMessage(Handle, Win32.WM_SETREDRAW, 0, 0);
		}

		void EndUpdate()
		{
			Win32.SendMessage(Handle, Win32.WM_SETREDRAW, 1, 0);
		}

		bool IMessageFilter.PreFilterMessage(ref Message message)
		{
			ArrayList handles = new ArrayList();

			IntPtr handle = Handle;
			while (handle != IntPtr.Zero)
			{
				handles.Add(handle);
				handle = Win32.GetParent(handle);	
			}

			handle = message.HWnd;
			while (handle != IntPtr.Zero)
			{
				if (handles.Contains(handle)) 
					return PreProcessMessage(ref message);
				handle = Win32.GetParent(handle);
			}

			return false;
		}
	
		void RealizeBands()
		{
			ReleaseBands();

			BeginUpdate();
		
			for (int i = 0; i < bands.Count; i++)
			{
				Win32.REBARBANDINFO bandInfo = GetBandInfo(i);
				Win32.SendMessage(Handle, Win32.RB_INSERTBAND, i, ref bandInfo);
			}

			UpdateSize();
			EndUpdate();

			CaptureBands();
		}

		void UpdateBand(int index)
		{
			if (!IsHandleCreated) return;
				
			BeginUpdate();

			Win32.REBARBANDINFO rbbi = GetBandInfo(index);
			Win32.SendMessage(Handle, Win32.RB_SETBANDINFO, index, ref rbbi);

			UpdateSize();
			EndUpdate();
		}

		void UpdateSize()
		{
			Height = Win32.SendMessage(Handle, Win32.RB_GETBARHEIGHT, 0, 0) + 1;
		}
		
		Win32.REBARBANDINFO GetBandInfo(int index)
		{
			Control band = bands[index];

			Win32.REBARBANDINFO rbbi = new Win32.REBARBANDINFO();
			rbbi.cbSize = Marshal.SizeOf(typeof(Win32.REBARBANDINFO));
			rbbi.fMask = 0;
			rbbi.clrFore = 0;
			rbbi.clrBack = 0;
			rbbi.iImage = 0;
			rbbi.hbmBack = IntPtr.Zero;
			rbbi.lParam = 0;
			rbbi.cxHeader = 0;

			rbbi.fMask |= Win32.RBBIM_ID;
			rbbi.wID = 0xEB00 + index;
	
			if ((band.Text != null) && (band.Text != string.Empty))
			{
				rbbi.fMask |= Win32.RBBIM_TEXT;
				rbbi.lpText = Marshal.StringToHGlobalUni(band.Text);
				rbbi.cch = (band.Text == null) ? 0 : band.Text.Length;
			}
	
			rbbi.fMask |= Win32.RBBIM_STYLE;
			rbbi.fStyle = Win32.RBBS_CHILDEDGE | Win32.RBBS_FIXEDBMP | Win32.RBBS_GRIPPERALWAYS;
			rbbi.fStyle |= Win32.RBBS_BREAK;
			rbbi.fStyle |= (band is IChevron) ? Win32.RBBS_USECHEVRON : 0;

			rbbi.fMask |= Win32.RBBIM_CHILD;
			rbbi.hwndChild = band.Handle; 

			rbbi.fMask |= Win32.RBBIM_CHILDSIZE;
			rbbi.cyMinChild = band.Height;
			rbbi.cxMinChild = 0;
			rbbi.cyChild = 0;
			rbbi.cyMaxChild = 0; 
			rbbi.cyIntegral = 0;
			
			rbbi.fMask |= Win32.RBBIM_SIZE;
			rbbi.cx = band.Width;

			rbbi.fMask |= Win32.RBBIM_IDEALSIZE;
			rbbi.cxIdeal = band.Width;
			
			return rbbi;				
		}

		void UpdateBands()
		{
			if (IsHandleCreated) RecreateHandle();
		}

		void Bands_Changed(Object s, EventArgs e)
		{
			UpdateBands();
		}

		void Band_HandleCreated(Object s, EventArgs e)
		{
			ReleaseBands();
				
			Control band = (Control) s;
			UpdateBand(bands.IndexOf(band));
			
			CaptureBands();
		}
		
		void Band_TextChanged(Object s, EventArgs e)
		{
			Control band = (Control) s;
			UpdateBand(bands.IndexOf(band));
		}

		void CaptureBands()
		{
			foreach (Control band in bands)
			{
				band.HandleCreated += new EventHandler(Band_HandleCreated);
				band.TextChanged += new EventHandler(Band_TextChanged);
			}
		}
		
		void ReleaseBands()
		{
			foreach (Control band in bands)
			{
				band.HandleCreated -= new EventHandler(Band_HandleCreated);
				band.TextChanged -= new EventHandler(Band_TextChanged);
			}
		}
	}
	
	public class ReBarBandCollection : IEnumerable
	{
		public event EventHandler Changed;
		ArrayList bands = new ArrayList();
		
		public IEnumerator GetEnumerator()
		{
			return bands.GetEnumerator();		
		}
	
		public int Count
		{
			get { return bands.Count; }
		}	
	
		public int Add(Control control)
		{
			if (Contains(control)) return -1;
			int index = bands.Add(control);
			RaiseChanged();
			return index;
		}

		public void Clear()
		{
			while (Count > 0) RemoveAt(0);
		}

		public bool Contains(Control control)
		{
			return bands.Contains(control);
		}
	
		public int IndexOf(Control control)
		{
			return bands.IndexOf(control);
		}
	
		public void Remove(Control control)
		{
			bands.Remove(control);
			RaiseChanged();		
		}
		
		public void RemoveAt(int index)
		{
			bands.RemoveAt(index);
			RaiseChanged();
		}
		
		public Control this[int index]
		{
			get { return (Control) bands[index]; }
		}
	
		void RaiseChanged()
		{
			if (Changed != null) Changed(this, null);
		}
	}

	public interface IChevron
	{
		void Show(Control control, Point point);
	}

	public class CommandContextMenu : ContextMenu
	{
		CommandBarItemCollection items = new CommandBarItemCollection();
		Font font = SystemInformation.MenuFont;
		Menu selectedMenuItem = null;
		bool mnemonics = true;

		public Font Font
		{
			set { font = value;	Attach(); }
			get { return font; }
		}
	
		public CommandBarItemCollection Items
		{
			set { items = value; Attach(); }
			get { return items; }
		}

		protected override bool ProcessCmdKey(ref Message msg, Keys keyData)
		{
			CommandBarItem[] hits = items[keyData];
			if (hits.Length == 0)
				return base.ProcessCmdKey(ref msg, keyData);
			hits[0].RaiseClick();
			return true;
		}

		void Attach()
		{
			while (MenuItems.Count > 0)
				MenuItems[0].Dispose();

			Size imageSize = GetImageSize(items);
			foreach (CommandBarItem item in items)
				MenuItems.Add(new MenuBarItem(item, imageSize, font, mnemonics));
			
			this.selectedMenuItem = null;
		}

		internal bool Mnemonics
		{
			set { mnemonics = value; }
			get { return mnemonics; }
		}

		internal Menu SelectedMenuItem
		{
			set { this.selectedMenuItem = value; }
			get { return this.selectedMenuItem; }
		}

		static Size GetImageSize(CommandBarItemCollection commandItems)
		{
			Size imageSize = new Size(16, 16);
			for (int i = 0; i < commandItems.Count; i++)
			{
				Image image = commandItems[i].Image;
				if (image != null)
				{
					if (image.Width > imageSize.Width) imageSize.Width = image.Width;
					if (image.Height > imageSize.Height) imageSize.Height = image.Height;
				}
			}

			return imageSize;			
		}
	
		class MenuBarItem : MenuItem
		{
			CommandBarItem item;
			Size imageSize;
			Font font;
			bool mnemonics;
				
			public MenuBarItem(CommandBarItem item, Size imageSize, Font font, bool mnemonics)
			{
				this.item = item;
				this.imageSize = imageSize;
				this.font = font;
				this.mnemonics = mnemonics;
				Attach();
			}

			void Attach()
			{
				Enabled = this.item.Enabled;
				Visible = this.item.Visible;
				OwnerDraw = true;

				if (this.item.Style != CommandBarItemStyle.Separator)
					Text = (mnemonics) ? this.item.Text : this.item.Text.Replace("&", "");
				else
					Text = "-";					

				Size imageSize = GetImageSize(this.item.Items);
				foreach (CommandBarItem item in this.item.Items)
					MenuItems.Add(new MenuBarItem(item, imageSize, font, mnemonics));
			}

			protected override void OnClick(EventArgs e)
			{
				base.OnClick(e);
				if (item != null) item.RaiseClick();
			}

			protected override void OnSelect(EventArgs e)
			{
				Menu parent = this.Parent;
				while (!(parent is CommandContextMenu))
				{
					if (parent is MenuItem)
						parent = (parent as MenuItem).Parent;
					else
						throw new Exception();
				}
				
				(parent as CommandContextMenu).SelectedMenuItem = this;

				base.OnSelect(e);
			}

			bool IsFlatMenu
			{
				get
				{
					if (Environment.OSVersion.Version < new Version(5, 1, 0, 0))
						return false;

					int data = 0;
					Win32.SystemParametersInfo(Win32.SPI_GETFLATMENU, 0, ref data, 0);
					return (data != 0);
				}
			}
			
			protected override void OnMeasureItem(MeasureItemEventArgs e)
			{
				base.OnMeasureItem(e);
				Graphics g = e.Graphics;
				
				if (item.Style == CommandBarItemStyle.Separator)
				{
					e.ItemWidth = 0;
					e.ItemHeight = SystemInformation.MenuHeight / 2;
				}
				else
				{
					Size size = new Size(0, 0);
					size.Width += 3 + imageSize.Width + 3 + 3 + 1 + 3 + imageSize.Width + 3;
					size.Height += 3 + imageSize.Height + 3;
		
					string text = item.Text;
					if (item.Shortcut != Keys.None) text += TypeDescriptor.GetConverter(typeof(Keys)).ConvertToString(item.Shortcut);
					Size textSize = Win32.TextHelper.GetTextSize(g, text, font);
					size.Width += textSize.Width;
					textSize.Height += 8;
					if (textSize.Height > size.Height) size.Height = textSize.Height;
			
					e.ItemWidth = size.Width;
					e.ItemHeight = size.Height;
				}
			}
		
			protected override void OnDrawItem(DrawItemEventArgs e)
			{
				base.OnDrawItem(e);
				Graphics g = e.Graphics;
	
				Rectangle bounds = e.Bounds;

				bool selected = ((e.State & DrawItemState.Selected) != 0);
				bool disabled = ((e.State & DrawItemState.Disabled) != 0);
	
				if (item.Style == CommandBarItemStyle.Separator)
				{
					Rectangle r = new Rectangle(bounds.X, bounds.Y + (bounds.Height / 2), bounds.Width, bounds.Height);
					ControlPaint.DrawBorder3D(g, r, Border3DStyle.Etched, Border3DSide.Top);
				}
				else
				{
					DrawImage(g, bounds, selected, disabled);

					int width = 6 + imageSize.Width;
					DrawBackground(g, new Rectangle(bounds.X + width, bounds.Y, bounds.Width - width, bounds.Height), selected);

					if ((Text != null) && (Text != ""))
					{
						Size size = Win32.TextHelper.GetTextSize(g, Text, font);
						Point point = new Point();
						point.X = bounds.X + 3 + imageSize.Width + 6;
						point.Y = bounds.Y + ((bounds.Height - size.Height) / 2);
						DrawText(g, Text, point, selected, disabled);
					}

					if (item.Shortcut != Keys.None)
					{
						string text = TypeDescriptor.GetConverter(typeof(Keys)).ConvertToString(item.Shortcut);
						Size size = Win32.TextHelper.GetTextSize(g, text, font);
						Point point = new Point();
						point.X = bounds.X + bounds.Width - 3 - imageSize.Width - 3 - size.Width;
						point.Y = bounds.Y + ((bounds.Height - size.Height) / 2);
						DrawText(g, text, point, selected, disabled);
					}
				}
			}

			void DrawBackground(Graphics g, Rectangle rectangle, bool selected)
			{
				Brush background = (selected) ? SystemBrushes.Highlight : SystemBrushes.Menu;
				g.FillRectangle(background, rectangle);
			}

			void DrawCheck(Graphics g, Rectangle rectangle, Color color)
			{
				Bitmap image = new Bitmap(rectangle.Width, rectangle.Height);
				Graphics graphics = Graphics.FromImage(image);
				ControlPaint.DrawMenuGlyph(graphics, 0, 0, rectangle.Width, rectangle.Height, MenuGlyph.Checkmark);
				graphics.Flush();
				image.MakeTransparent(Color.White);
				ImageAttributes attributes = new ImageAttributes();
				ColorMap colorMap = new ColorMap();
				colorMap.OldColor = Color.Black;
				colorMap.NewColor = color;
				attributes.SetRemapTable(new ColorMap[] { colorMap });
				g.DrawImage(image, rectangle, 0, 0, rectangle.Width, rectangle.Height, GraphicsUnit.Pixel, attributes);
			}

			void DrawImage(Graphics g, Rectangle bounds, bool selected, bool disabled)
			{
				Rectangle rectangle = new Rectangle(bounds.X, bounds.Y, imageSize.Width + 6, bounds.Height);

				Size checkSize = SystemInformation.MenuCheckSize;
				Rectangle checkRectangle = new Rectangle(bounds.X + 1 + ((imageSize.Width + 6 - checkSize.Width) / 2), bounds.Y + ((bounds.Height - checkSize.Height) / 2), checkSize.Width, checkSize.Height);

				if (IsFlatMenu)
				{
					DrawBackground(g, rectangle, selected);
			
					if (item.Checked)
					{
						int height = bounds.Height - 2;
						g.DrawRectangle(SystemPens.Highlight, new Rectangle(bounds.X + 1, bounds.Y + 1, imageSize.Width + 3, height - 1));
						g.FillRectangle(SystemBrushes.Menu, new Rectangle(bounds.X + 2, bounds.Y + 2, imageSize.Width + 2, height - 2));
					}
					
					Image image = item.Image;
					if (image != null)
					{
						Point point = new Point(bounds.X + 3, bounds.Y + ((bounds.Height - image.Height) / 2));
						Win32.ImageHelper.DrawImage(g, image, point, disabled);
					}
					else
					{
						if (item.Checked)
						{
							Color color = (disabled ? SystemColors.GrayText : SystemColors.MenuText);
							DrawCheck(g, checkRectangle, color);
						}
					}
				}
				else
				{
					Image image = item.Image;
					if (image == null)
					{
						DrawBackground(g, rectangle, selected);

						if (item.Checked)
						{
							Color color = (disabled ? (selected ? SystemColors.GrayText : SystemColors.ControlDark) : (selected ? SystemColors.HighlightText : SystemColors.MenuText));	
							DrawCheck(g, checkRectangle, color);
						}
					}
					else
					{
						DrawBackground(g, rectangle, false);
						if (item.Checked)
							ControlPaint.DrawBorder3D(g, rectangle, Border3DStyle.SunkenOuter);
						else if (selected)
							ControlPaint.DrawBorder3D(g, rectangle, Border3DStyle.RaisedInner);

						Point point = new Point(bounds.X + 3, bounds.Y + ((bounds.Height - image.Height) / 2));
						Win32.ImageHelper.DrawImage(g, image, point, disabled);
					}
				}
			}

			void DrawText(Graphics graphics, string text, Point point, bool selected, bool disabled)
			{
				Color color = (disabled ? (selected ? SystemColors.GrayText : SystemColors.ControlDark) : (selected ? SystemColors.HighlightText : SystemColors.MenuText));	
				if (!IsFlatMenu)
					if (disabled && !selected)
						Win32.TextHelper.DrawText(graphics, text, new Point(point.X + 1, point.Y + 1), font, SystemColors.ControlLightLight);
	
				Win32.TextHelper.DrawText(graphics, text, point, font, color);
			}
		}
	}

	struct Win32
	{
		public const string TOOLBARCLASSNAME = "ToolbarWindow32";

		public const int WS_CHILD = 0x40000000;
		public const int WS_VISIBLE = 0x10000000;
		public const int WS_CLIPCHILDREN = 0x2000000;
		public const int WS_CLIPSIBLINGS = 0x4000000;
		public const int WS_BORDER = 0x800000;
	
		public const int CCS_NODIVIDER = 0x40;
		public const int CCS_NORESIZE = 0x4;
		public const int CCS_NOPARENTALIGN = 0x8;

		public const int I_IMAGECALLBACK = -1;
		public const int I_IMAGENONE = -2;

		public const int TBSTYLE_TOOLTIPS = 0x100;
		public const int TBSTYLE_FLAT = 0x800;
		public const int TBSTYLE_LIST = 0x1000;
		public const int TBSTYLE_TRANSPARENT = 0x8000;

		public const int TBSTYLE_EX_DRAWDDARROWS = 0x1;
		public const int TBSTYLE_EX_HIDECLIPPEDBUTTONS = 0x10;
		public const int TBSTYLE_EX_DOUBLEBUFFER = 0x80;
	
		public const int CDRF_DODEFAULT = 0x0;
		public const int CDRF_SKIPDEFAULT = 0x4;
		public const int CDRF_NOTIFYITEMDRAW = 0x20;
		public const int CDDS_PREPAINT = 0x1;
		public const int CDDS_ITEM = 0x10000;
		public const int CDDS_ITEMPREPAINT = CDDS_ITEM | CDDS_PREPAINT;

		public const int CDIS_HOT = 0x40;
		public const int CDIS_SELECTED = 0x1;
		public const int CDIS_DISABLED = 0x4;
	
		public const int WM_SETREDRAW = 0x000B;
		public const int WM_CANCELMODE = 0x001F;
		public const int WM_NOTIFY = 0x4e;
		public const int WM_KEYDOWN = 0x100;
		public const int WM_KEYUP = 0x101;
		public const int WM_CHAR = 0x0102;
		public const int WM_SYSKEYDOWN = 0x104;
		public const int WM_SYSKEYUP = 0x105;
		public const int WM_COMMAND = 0x111;
		public const int WM_MENUCHAR = 0x120;
		public const int WM_MOUSEMOVE = 0x200;
		public const int WM_LBUTTONDOWN = 0x201;
		public const int WM_MOUSELAST = 0x20a;
		public const int WM_USER = 0x0400;
		public const int WM_REFLECT = WM_USER + 0x1c00;

		public const int NM_CUSTOMDRAW = -12;	

		public const int TTN_NEEDTEXTA = ((0-520)-0);
		public const int TTN_NEEDTEXTW = ((0-520)-10);

		public const int TBN_QUERYINSERT = ((0-700)-6);
		public const int TBN_DROPDOWN = ((0-700)-10);
		public const int TBN_HOTITEMCHANGE = ((0 - 700) - 13);

		public const int TBIF_IMAGE = 0x1;
		public const int TBIF_TEXT = 0x2;
		public const int TBIF_STATE = 0x4;
		public const int TBIF_STYLE = 0x8;
		public const int TBIF_COMMAND = 0x20;

		public const int MNC_EXECUTE = 2;

		[StructLayout(LayoutKind.Sequential, Pack = 1)]
			public class INITCOMMONCONTROLSEX 
		{
			public int dwSize = 8;
			public int dwICC;
		}

		public const int ICC_BAR_CLASSES = 4;
		public const int ICC_COOL_CLASSES = 0x400;

		[DllImport("comctl32.dll")]
		public static extern bool InitCommonControlsEx(INITCOMMONCONTROLSEX icc);

		[StructLayout(LayoutKind.Sequential)]
			public struct POINT
		{
			public int x;
			public int y;
		}

		[StructLayout(LayoutKind.Sequential)]
			public struct RECT
		{
			public int left;
			public int top;
			public int right;
			public int bottom;
		}

		[StructLayout(LayoutKind.Sequential)]
			public struct NMHDR
		{
			public IntPtr hwndFrom;
			public int idFrom;
			public int code;
		}

		[StructLayout(LayoutKind.Sequential)]
			public struct NMTOOLBAR
		{
			public NMHDR hdr;
			public int iItem;
			public TBBUTTON tbButton;
			public int cchText;
			public IntPtr pszText;
		}
	
		[StructLayout(LayoutKind.Sequential)]
			public struct NMCUSTOMDRAW
		{
			public NMHDR hdr;
			public int dwDrawStage;
			public IntPtr hdc;
			public RECT rc;
			public int dwItemSpec;
			public int uItemState;
			public int lItemlParam;
		}
	
		[StructLayout(LayoutKind.Sequential)]
			public struct LPNMTBCUSTOMDRAW
		{
			public NMCUSTOMDRAW nmcd;
			public IntPtr hbrMonoDither;
			public IntPtr hbrLines;
			public IntPtr hpenLines;
			public int clrText;
			public int clrMark;
			public int clrTextHighlight;
			public int clrBtnFace;
			public int clrBtnHighlight;
			public int clrHighlightHotTrack;
			public RECT rcText;
			public int nStringBkMode;
			public int nHLStringBkMode;
		}

		public const int TTF_RTLREADING = 0x0004;
	
		[StructLayout(LayoutKind.Sequential, CharSet=CharSet.Auto)]
			public struct TOOLTIPTEXT
		{
			public NMHDR hdr;
			public IntPtr lpszText;
			[MarshalAs(UnmanagedType.ByValTStr, SizeConst=80)]
			public string szText;
			public IntPtr hinst;
			public int uFlags;
		}

		[StructLayout(LayoutKind.Sequential, CharSet=CharSet.Ansi)]
			public struct TOOLTIPTEXTA
		{
			public NMHDR hdr;
			public IntPtr lpszText;
			[MarshalAs(UnmanagedType.ByValTStr, SizeConst=80)]
			public string szText;
			public IntPtr hinst;
			public int uFlags;
		}

		public const int TB_PRESSBUTTON = WM_USER + 3;	
		public const int TB_INSERTBUTTON = WM_USER + 21;
		public const int TB_BUTTONCOUNT = WM_USER + 24;
		public const int TB_GETITEMRECT = WM_USER + 29;
		public const int TB_BUTTONSTRUCTSIZE = WM_USER + 30;	
		public const int TB_SETBUTTONSIZE = WM_USER + 32;
		public const int TB_SETIMAGELIST = WM_USER + 48;
		public const int TB_GETRECT = WM_USER + 51;
		public const int TB_SETBUTTONINFO = WM_USER + 64;
		public const int TB_HITTEST = WM_USER +69;
		public const int TB_GETHOTITEM = WM_USER + 71;
		public const int TB_SETHOTITEM = WM_USER + 72;
		public const int TB_SETEXTENDEDSTYLE = WM_USER + 84;

		public const int TBSTATE_CHECKED = 0x01;
		public const int TBSTATE_ENABLED = 0x04;
		public const int TBSTATE_HIDDEN = 0x08;
	
		public const int BTNS_BUTTON = 0;
		public const int BTNS_SEP = 0x1;
		public const int BTNS_DROPDOWN = 0x8;	
		public const int BTNS_AUTOSIZE = 0x10;
		public const int BTNS_WHOLEDROPDOWN = 0x80;

		[StructLayout(LayoutKind.Sequential, Pack=1)]
			public struct TBBUTTON 
		{
			public int iBitmap;
			public int idCommand;
			public byte fsState;
			public byte fsStyle;
			public byte bReserved0;
			public byte bReserved1;
			public int dwData;
			public int iString;
		}

		[StructLayout(LayoutKind.Sequential, CharSet=CharSet.Auto)]
			public struct TBBUTTONINFO
		{
			public int cbSize;
			public int dwMask;
			public int idCommand;
			public int iImage;
			public byte fsState;
			public byte fsStyle;
			public short cx;
			public IntPtr lParam;
			public IntPtr pszText;
			public int cchText;
		}

		[DllImport("user32.dll", ExactSpelling=true, CharSet=CharSet.Auto)]
		public static extern IntPtr GetParent(IntPtr hWnd);

		[DllImport("user32.dll", CharSet=CharSet.Auto)]
		public static extern int SendMessage(IntPtr hWnd, int msg, int wParam, int lParam);

		[DllImport("user32.dll", CharSet=CharSet.Auto)]
		public static extern IntPtr SendMessage(IntPtr hWnd, int msg, int wParam, IntPtr lParam);

		[DllImport("user32.dll", CharSet=CharSet.Auto)]
		public static extern void SendMessage(IntPtr hWnd, int msg, int wParam, ref RECT lParam);

		[DllImport("user32.dll", CharSet=CharSet.Auto)]
		public static extern int SendMessage(IntPtr hWnd, int msg, int wParam, ref POINT lParam);

		[DllImport("user32.dll", CharSet=CharSet.Auto)]
		public static extern void SendMessage(IntPtr hWnd, int msg, int wParam, ref TBBUTTON lParam);
	
		[DllImport("user32.dll", CharSet=CharSet.Auto)]
		public static extern void SendMessage(IntPtr hWnd, int msg, int wParam, ref TBBUTTONINFO lParam);

		[DllImport("user32.dll", CharSet=CharSet.Auto)]
		public static extern void SendMessage(IntPtr hWnd, int msg, int wParam, ref REBARBANDINFO lParam);
	
		[DllImport("user32.dll", CharSet=CharSet.Auto)]
		public static extern IntPtr PostMessage(IntPtr hWnd, int msg, int wParam, int lParam);
	
		[DllImport("kernel32.dll", ExactSpelling=true, CharSet=CharSet.Auto)]
		public static extern int GetCurrentThreadId();

		public delegate IntPtr HookProc(int nCode, IntPtr wParam, IntPtr lParam);
	
		public const int WH_MSGFILTER = -1;
		public const int MSGF_MENU = 2;
		
		[DllImport("user32.dll", CharSet=CharSet.Auto)]
		public static extern IntPtr SetWindowsHookEx(int hookid, HookProc pfnhook, IntPtr hinst, int threadid);
		
		[DllImport("user32.dll", CharSet=CharSet.Auto, ExactSpelling=true)]
		public static extern bool UnhookWindowsHookEx(IntPtr hhook);
	
		[DllImport("user32.dll", CharSet=CharSet.Auto, ExactSpelling=true)]
		public static extern IntPtr CallNextHookEx(IntPtr hhook, int code, IntPtr wparam, IntPtr lparam);
	
		[StructLayout(LayoutKind.Sequential)]
			public struct MSG 
		{
			public IntPtr hwnd;
			public int message;
			public IntPtr wParam;
			public IntPtr lParam;
			public int time;
			public int pt_x;
			public int pt_y;
		}

		public const string REBARCLASSNAME = "ReBarWindow32";		
	
		public const int RBS_VARHEIGHT = 0x200;
		public const int RBS_BANDBORDERS = 0x400;
		public const int RBS_AUTOSIZE = 0x2000;
	
		public const int RBN_FIRST = -831;
		public const int RBN_HEIGHTCHANGE = RBN_FIRST - 0;
		public const int RBN_AUTOSIZE = RBN_FIRST - 3;
		public const int RBN_CHEVRONPUSHED = RBN_FIRST - 10;
	
		public const int RB_SETBANDINFO = WM_USER + 6;
		public const int RB_GETRECT = WM_USER + 9;
		public const int RB_INSERTBAND = WM_USER + 10;
		public const int RB_GETBARHEIGHT = WM_USER + 27;
	
		[StructLayout(LayoutKind.Sequential)]
			public struct REBARBANDINFO
		{
			public int cbSize;
			public int fMask;
			public int fStyle;
			public int clrFore;
			public int clrBack;
			public IntPtr lpText;
			public int cch;
			public int iImage;
			public IntPtr hwndChild;
			public int cxMinChild;
			public int cyMinChild;
			public int cx;
			public IntPtr hbmBack;
			public int wID;
			public int cyChild;
			public int cyMaxChild;
			public int cyIntegral;
			public int cxIdeal;
			public int lParam;
			public int cxHeader;
		}

		public const int RBBIM_CHILD = 0x10;
		public const int RBBIM_CHILDSIZE = 0x20;
		public const int RBBIM_STYLE = 0x1;
		public const int RBBIM_ID = 0x100;
		public const int RBBIM_SIZE = 0x40;
		public const int RBBIM_IDEALSIZE = 0x200;
		public const int RBBIM_TEXT = 0x4;
	
		public const int RBBS_BREAK = 0x1;
		public const int RBBS_CHILDEDGE = 0x4;
		public const int RBBS_FIXEDBMP = 0x20;
		public const int RBBS_GRIPPERALWAYS = 0x80;
		public const int RBBS_USECHEVRON = 0x200;

		[StructLayout(LayoutKind.Sequential)]
			public struct NMREBARCHEVRON
		{
			public NMHDR hdr;
			public int uBand;
			public int wID;
			public int lParam;
			public RECT rc;
			public int lParamNM;
		}

		[StructLayout(LayoutKind.Sequential)]
			public struct IMAGELISTDRAWPARAMS 
		{
			public int cbSize;
			public IntPtr himl;
			public int i;
			public IntPtr hdcDst;
			public int x;
			public int y;
			public int cx;
			public int cy;
			public int xBitmap;
			public int yBitmap;
			public int rgbBk;
			public int rgbFg;
			public int fStyle;
			public int dwRop;
			public int fState;
			public int Frame;
			public int crEffect;				
		}

		public const int ILD_TRANSPARENT = 0x1;
		public const int ILS_SATURATE = 0x4;

		[DllImport("comctl32.dll", CharSet=CharSet.Auto)]
		public static extern bool ImageList_DrawIndirect(ref IMAGELISTDRAWPARAMS pimldp);
		
		[StructLayout(LayoutKind.Sequential)]
			public struct DLLVERSIONINFO
		{
			public int cbSize;
			public int dwMajorVersion;
			public int dwMinorVersion;
			public int dwBuildNumber;
			public int dwPlatformID;
		}
			
		[DllImport("comctl32.dll")]
		public extern static int DllGetVersion(ref DLLVERSIONINFO dvi);

		public const int SPI_GETFLATMENU = 0x1022;

		[DllImport("user32.dll", CharSet=CharSet.Auto)]
		public extern static int SystemParametersInfo(int nAction, int nParam, ref int value, int ignore);

		public const int DT_SINGLELINE = 0x20;
		public const int DT_LEFT = 0x0;
		public const int DT_VCENTER = 0x4;
		public const int DT_CALCRECT = 0x400;

		[DllImport("user32.dll")]
		public extern static int DrawText(IntPtr hdc, string lpString, int nCount, ref RECT lpRect, int uFormat);

		public const int TRANSPARENT = 1;	

		[DllImport("gdi32.dll")]
		public extern static int SetBkMode(IntPtr hdc, int iBkMode);
	
		[DllImport("gdi32.dll")]
		public extern static int SetTextColor(IntPtr hdc, int crColor);
	
		[DllImport("gdi32.dll")]
		public extern static IntPtr SelectObject(IntPtr hdc, IntPtr hgdiobj);

		[DllImport("gdi32.dll", ExactSpelling=true, CharSet=CharSet.Auto)]
		public static extern bool DeleteObject(IntPtr hObject);

		[DllImport("user32.dll", ExactSpelling=true, CharSet=CharSet.Auto)]
		public static extern bool MessageBeep(int type);

		public class TextHelper
		{
			public static Size GetTextSize(Graphics graphics, string text, Font font)
			{
				IntPtr hdc = graphics.GetHdc();
				IntPtr fontHandle = font.ToHfont();
				IntPtr currentFontHandle = Win32.SelectObject(hdc, fontHandle);
			
				Win32.RECT rect = new Win32.RECT();
				rect.left = 0;
				rect.right = 0;
				rect.top = 0;
				rect.bottom = 0;
		
				Win32.DrawText(hdc, text, text.Length, ref rect, Win32.DT_SINGLELINE | Win32.DT_LEFT | Win32.DT_CALCRECT);
		
				Win32.SelectObject(hdc, currentFontHandle);
				Win32.DeleteObject(fontHandle);
				graphics.ReleaseHdc(hdc);
				
				return new Size(rect.right - rect.left, rect.bottom - rect.top);
			}
		
			public static void DrawText(Graphics graphics, string text, Point point, Font font, Color color)
			{
				Size size = GetTextSize(graphics, text, font);
		
				IntPtr hdc = graphics.GetHdc();
				IntPtr fontHandle = font.ToHfont();
				IntPtr currentFontHandle = Win32.SelectObject(hdc, fontHandle);
		
				int currentBkMode = Win32.SetBkMode(hdc, Win32.TRANSPARENT);
				int currentCrColor = Win32.SetTextColor(hdc, Color.FromArgb(0, color.R, color.G, color.B).ToArgb());
		
				Win32.RECT rc = new Win32.RECT();
				rc.left = point.X;
				rc.top = point.Y;
				rc.right = rc.left + size.Width;
				rc.bottom = rc.top + size.Height;
		
				Win32.DrawText(hdc, text, text.Length, ref rc, Win32.DT_SINGLELINE | Win32.DT_LEFT);			
		
				Win32.SetTextColor(hdc, currentCrColor);
				Win32.SetBkMode(hdc, currentBkMode);
	
				Win32.SelectObject(hdc, currentFontHandle);
				Win32.DeleteObject(fontHandle);
				graphics.ReleaseHdc(hdc);
			}
		}
	
		public class ImageHelper
		{
			static Version version = null;
	
			static ImageHelper()
			{
				Win32.DLLVERSIONINFO dvi = new Win32.DLLVERSIONINFO();
				dvi.cbSize = Marshal.SizeOf(typeof(Win32.DLLVERSIONINFO));
				Win32.DllGetVersion(ref dvi);
				version = new Version(dvi.dwMajorVersion, dvi.dwMinorVersion, dvi.dwBuildNumber, 0);
			}
	
			public static Version Version
			{
				get { return version; }
			}
	
			public static void DrawImage(Graphics graphics, Image image, Point point, bool disabled)
			{
				if (!disabled)
				{
					Rectangle destination = new Rectangle(point, image.Size);
					graphics.DrawImage(image, destination, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel);
					return;					
				}
					
				// Painting a disabled gray scale image is done using ILS_SATURATE on WinXP.
				// This code emulates that behaviour if comctl32 version 6 is not availble.
				if (version.Major < 6)
				{
					ImageAttributes attributes = new ImageAttributes();
					Rectangle destination = new Rectangle(point, image.Size);
					float[][] matrix = new float[5][];
					matrix[0] = new float[] { 0.2222f, 0.2222f, 0.2222f, 0.0000f, 0.0000f };
					matrix[1] = new float[] { 0.2222f, 0.2222f, 0.2222f, 0.0000f, 0.0000f };
					matrix[2] = new float[] { 0.2222f, 0.2222f, 0.2222f, 0.0000f, 0.0000f };
					matrix[3] = new float[] { 0.3333f, 0.3333f, 0.3333f, 0.7500f, 0.0000f };
					matrix[4] = new float[] { 0.0000f, 0.0000f, 0.0000f, 0.0000f, 1.0000f };
					attributes.SetColorMatrix(new ColorMatrix(matrix));
					graphics.DrawImage(image, destination, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, attributes);
				}
				else
				{
					ImageList imageList = new ImageList();
					imageList.ImageSize = image.Size;
					imageList.ColorDepth = ColorDepth.Depth32Bit;		
					imageList.Images.Add(image);
	
					IntPtr hdc = graphics.GetHdc();
					Win32.IMAGELISTDRAWPARAMS ildp = new Win32.IMAGELISTDRAWPARAMS();
					ildp.cbSize = Marshal.SizeOf(typeof(Win32.IMAGELISTDRAWPARAMS));
					ildp.himl = imageList.Handle;
					ildp.i = 0; // image index
					ildp.hdcDst = hdc;
					ildp.x = point.X;
					ildp.y = point.Y;
					ildp.cx = 0;
					ildp.cy = 0;
					ildp.xBitmap = 0;
					ildp.yBitmap = 0;
					ildp.fStyle = Win32.ILD_TRANSPARENT;
					ildp.fState = Win32.ILS_SATURATE;
					ildp.Frame = -100;
					Win32.ImageList_DrawIndirect(ref ildp);
					graphics.ReleaseHdc(hdc);
					return;
				}
			}
		}
	}
}
