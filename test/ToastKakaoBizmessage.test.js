const ToastKakaoBizmessage = require('../lib/ToastKakaoBizmessage');

describe('ToastKakaoBizmessage', () => {
  describe('constructor(options)', () => {
    it('should create an instance of ToastKakaoBizmessage', () => {
      expect(new ToastKakaoBizmessage()).toBeInstanceOf(ToastKakaoBizmessage);
    });
  });
});
