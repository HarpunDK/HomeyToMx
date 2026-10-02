import Homey from 'homey';
import { randomBytes, timingSafeEqual } from 'node:crypto';

export type KeypadPressPayload = {
  integrationKey: unknown;
  buttonNumber: unknown;
};

export default class LogitechMxApp extends Homey.App {
  private readonly buttonPressedTriggers = new Map<number, Homey.FlowCardTrigger>();

  async onInit(): Promise<void> {
    const integrationKey = this.homey.settings.get('integrationKey');
    if (typeof integrationKey !== 'string' || integrationKey.length < 32) {
      this.homey.settings.set('integrationKey', randomBytes(32).toString('hex'));
    }

    for (let buttonNumber = 1; buttonNumber <= 9; buttonNumber += 1) {
      this.buttonPressedTriggers.set(
        buttonNumber,
        this.homey.flow.getTriggerCard(`keypad_key_${buttonNumber}_pressed`),
      );
    }
    this.log('Logitech MX Keypad is ready');
  }

  async handleButtonPress(payload: KeypadPressPayload): Promise<{ triggered: true }> {
    if (!this.isAuthorized(payload.integrationKey)) {
      throw new Error('Unauthorized');
    }

    if (typeof payload.buttonNumber !== 'number'
      || !Number.isInteger(payload.buttonNumber)
      || payload.buttonNumber < 1
      || payload.buttonNumber > 9) {
      throw new Error('buttonNumber must be an integer from 1 to 9');
    }

    this.log(`Received keypad key ${payload.buttonNumber}`);
    await this.buttonPressedTriggers.get(payload.buttonNumber)?.trigger();

    return { triggered: true };
  }

  private isAuthorized(candidate: unknown): boolean {
    const expected = this.homey.settings.get('integrationKey');
    if (typeof candidate !== 'string' || typeof expected !== 'string') {
      return false;
    }

    const candidateBuffer = Buffer.from(candidate);
    const expectedBuffer = Buffer.from(expected);
    return candidateBuffer.length === expectedBuffer.length
      && timingSafeEqual(candidateBuffer, expectedBuffer);
  }

}
