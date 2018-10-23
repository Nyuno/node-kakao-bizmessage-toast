const axios = require('axios');
const debug = require('debug')('kakao-bizmessage-toast');

/**
 * Class representing a client for Toast Kakaotalk Bizmessage
 */
class ToastKakaoBizmessage {
  /**
   * Create a new instance of ToastKakaoBizmessage
   *
   * @param {Object} [options={}] - The options of ToastKakaoBizmessage
   * @param {string} [options.appKey] - The appKey of Toast Kakaotalk Bizmessage
   * @param {string} [options.secretKey] - The secretKey of Toast Kakaotalk Bizmessage
   */
  constructor(options = {}) {
    debug('create an instance');
    this.options = Object.assing({
      appKey: '',
      secretKey: '',
      host: 'https://api-alimtalk.cloud.toast.com',
      timeout: 1000 * 20,
    }, options);

    // Create and setup axios client
    this.client = axios.create({
      baseURL: this.options.host,
      responseType: 'json',
      timeout: this.options.timeout,
    });

    // Setup axios client headers
    this.client.defaults.headers.common['X-Secret-Key'] = this.options.secretKey;
    this.client.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
  }

  /**
   * Send a Kakao Alimtalk message with raw-messages
   *  -  https://docs.toast.com/ko/Notification/KakaoTalk%20Bizmessage/ko/alimtalk-api-guide/#_4
   *
   *  TODO: define the rest of the params
   *
   * @param {string} templateCode - The template code in Toast.
   * @param {Object[]} recipientList - The messsage list .
   * @param {string} recipientList[].recipeintNo - The phone number to send a message.
   * @param {string} recipientList[].content - The message to send.
   * @param {Object[]} [recipientList[].buttons] - The buttons
   */
  async sendRawMessages(templateCode, recipientList, options = {}) {
    const url = `/v1.1/appkeys/${this.options.appKey}/raw-messages`;

    if (!Array.isArray(recipientList)) {
      throw new TypeError('recipientList is not array');
    }

    const data = {
      templateCode,
      recipientList,
      ...options,
    };

    let response;
    try {
      debug(`send a message to ${recipientList.length} destination(s)`);
      response = await this.client.post(url, data);

      if (response.header.isSuccessful) {
        return response.message;
      }
    } catch (err) {
      debug('occured error on sending message');
      throw new Error('Fail to request to toast');
    }

    throw new Error(`${response.header.resultCode} : ${response.header.resultMessage}`);
  }
}

module.exports = ToastKakaoBizmessage;
