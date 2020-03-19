Set WshShell = WScript.CreateObject("WScript.Shell")

WshShell.RegWrite "HKEY_CURRENT_USER\Software\Microsoft\Office\Common\Smart Tag\Actions\" & inputbox("What is the ProgID of the class that implements the ISmartTagAction Interface?","Smart Tag Registration","AcronymInfo.SmartTagAction") & "\", ""

WshShell.RegWrite "HKEY_CURRENT_USER\Software\Microsoft\Office\Common\Smart Tag\Recognizers\" & inputbox("What is the ProgID of the class that implements the ISmartTagRecognizer Interface?","Smart Tag Registration","AcronymInfo.SmartTagRecognizer") & "\", ""

Set WshShell = Nothing