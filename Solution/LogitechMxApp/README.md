# Logitech MX Keypad

This workspace contains two parts of the integration:

- `logi-homey-actions/` is the Logitech Actions SDK plugin for MX Creative Keypad. It exposes nine Logi Options+ actions, one for each keypad key.
- `homey-app/com.homey.logitechmx/` is the Homey Pro app. It receives authenticated key events and exposes nine separate Flow triggers, one for each keypad key.

The Logitech plugin runs on the computer that runs Logi Options+. The Homey app runs on Homey Pro. Install both, then use the Homey app's settings page to copy its local endpoint and generated integration key into the plugin configuration described in `logi-homey-actions/README.md`.

The Homey endpoint is a public local API route protected by a randomly generated 256-bit key. Keep the key private and only use the endpoint on your trusted local network. Homey Cloud is not supported by this first version because it cannot expose this local app API route.