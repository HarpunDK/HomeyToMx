import { CommandAction } from '@logitech/plugin-sdk';
import { sendButtonPress } from './homey-client';

export class HomeyButtonAction extends CommandAction {
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly groupName = 'Homey';

  constructor(private readonly buttonNumber: number) {
    super();
    this.name = `homey_key_${buttonNumber}`;
    this.displayName = `Trigger ${buttonNumber}`;
    this.description = `Trigger a Homey Flow when keypad key ${buttonNumber} is pressed`;
  }

  async onKeyDown(): Promise<void> {
    console.info(`[Logi Homey Actions] Keypad key ${this.buttonNumber} pressed.`);
    await sendButtonPress(this.buttonNumber);
  }
}