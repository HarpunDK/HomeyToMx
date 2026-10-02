import { PluginSDK } from '@logitech/plugin-sdk';
import { HomeyButtonAction } from './src/homey-actions';

const pluginSDK = new PluginSDK();

for (let buttonNumber = 1; buttonNumber <= 9; buttonNumber += 1) {
	pluginSDK.registerAction(new HomeyButtonAction(buttonNumber));
}

await pluginSDK.connect();
