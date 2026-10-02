# Homey Actions

This Logi Actions SDK plugin adds nine keypad actions, one for each MX Creative Keypad LCD key. Each action sends its key number to the Homey Pro app over the local network.

## Help

[Logitech MX Keypad help on Homey Community](https://community.homey.app/t/pro-mx-keypad-logitech-mx-keypad/160286)

## Configure

1. Install and start the Logitech MX Keypad app on Homey Pro.
2. Open the Homey app settings and copy the integration key.
3. Copy `config.example.json` to `%APPDATA%\LogiHomey\config.json` on Windows, then replace the sample key and Homey address:

```json
{
	"baseUrl": "http://homey.local",
	"integrationKey": "paste-the-key-from-homey-here"
}
```

Use your Homey Pro's local LAN address for `baseUrl` if `homey.local` does not resolve. On macOS, use `~/Library/Application Support/LogiHomey/config.json`. Set `LOGI_HOMEY_CONFIG` to use a different file path. Keep this file private.

## Develop

```sh
npm install
npm run watch
```

The plugin runs in Logi Plugin Service and appears in Logi Options+ when the service reloads it. To create a distributable package, run `npm run build:pack`.

In watch mode, the terminal reports build and link status. Runtime messages are written by Logi Plugin Service. On Windows, follow them in PowerShell with:

```powershell
Get-Content "$env:LOCALAPPDATA\Logi\LogiPluginService\Logs\plugin_logs\LogiHomeyActions.log" -Tail 20 -Wait
```
