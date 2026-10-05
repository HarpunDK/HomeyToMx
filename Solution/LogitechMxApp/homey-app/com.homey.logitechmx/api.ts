type KeypadPressPayload = {
  integrationKey?: unknown;
  buttonNumber?: unknown;
};

type ButtonPressRequest = {
  homey: {
    app: {
      handleButtonPress(payload: KeypadPressPayload): Promise<{ triggered: true }>;
    };
  };
  body: unknown;
};

function isKeypadPressPayload(body: unknown): body is KeypadPressPayload {
  return typeof body === 'object' && body !== null && !Array.isArray(body);
}

export default {
  async postButtonPress({ homey, body }: ButtonPressRequest): Promise<{ triggered: true }> {
    if (!isKeypadPressPayload(body)) {
      throw new Error('Request body must be a JSON object');
    }

    return homey.app.handleButtonPress(body);
  },
};
