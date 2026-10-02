type KeypadPressPayload = {
  integrationKey: unknown;
  buttonNumber: unknown;
};

type ButtonPressRequest = {
  homey: {
    app: {
      handleButtonPress(payload: KeypadPressPayload): Promise<{ triggered: true }>;
    };
  };
  body: KeypadPressPayload;
};

export default {
  async postButtonPress({ homey, body }: ButtonPressRequest): Promise<{ triggered: true }> {
    return homey.app.handleButtonPress(body);
  },
};
