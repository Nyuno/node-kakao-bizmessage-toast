const axios = require('axios');
const debug = require('debug')('kakao-bizmessage-toast');

/**
 * Class representing a client for Toast Kakaotalk Bizmessage.
 */
class ToastKakaoBizmessage {
  /**
   * Create a new instance of ToastKakaoBizmessage.
   *
   * @param {Object} [options={}] - The options of ToastKakaoBizmessage.
   * @param {string} [options.appKey] - The appKey of Toast Kakaotalk Bizmessage.
   * @param {string} [options.secretKey] - The secretKey of Toast Kakaotalk Bizmessage.
   */
  constructor(options = {}) {
    debug('create an instance');
    this.options = Object.assign({
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
   * @param {string} recipientList[].recipientNo - The phone number to send a message.
   * @param {string} recipientList[].content - The message to send.
   * @param {Object[]} [recipientList[].buttons] - The buttons.
   * @param {Object} [options={}] - The options for request.
   * @param {string} [options.plusFriendId] - The id for kakao plus friend.
   * @param {string} [options.requestDate] - The request date with format(yyyy-MM-dd HH:mm).
   * @returns {Promise} Promise object represents the request to toast.
   */
  async sendRawMessages(templateCode, recipientList, options = {}) {
    const url = `/alimtalk/v1.1/appkeys/${this.options.appKey}/raw-messages`;

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

      if (response.data.header.isSuccessful) {
        return response.data.message;
      }
    } catch (err) {
      debug('occured error on sending message');
      debug(err);
      throw new Error('Fail to request to toast');
    }

    throw new Error(`${response.data.header.resultCode} : ${response.data.header.resultMessage}`);
  }

  /* eslint-disable max-len */
  /**
   * Send a same Kakao Alimtalk message to multiple users
   *
   *  TODO: define the rest of the params
   *
   * @param {string} templateCode - The template code in Toast.
   * @param {string[]} recipientList - The user phone number list.
   * @param {string} content - The message to send.
   * @param {Object[]} [buttons] - The buttons.
   * @param {Object} [options={}] - The options for request.
   * @param {string} [options.plusFriendId] - The id for kakao plus friend.
   * @param {string} [options.requestDate] - The request date with format(yyyy-MM-dd HH:mm).
   * @returns {Promise} Promise object represents the request to toast.
   */
  sendSameRawMessagesToMultipleUsers(templateCode, recipientList, content, buttons = [], options = {}) {
    if (!Array.isArray(recipientList)) {
      throw new TypeError('recipientList is not array');
    }

    if (!Array.isArray(buttons)) {
      throw new TypeError('buttons are not array');
    }

    // If buttons are exist then Add buttons to message object
    const message = buttons.length > 0 ? {
      content,
      buttons,
    } : { content };

    // Create data to fit format
    const data = recipientList.reduce((acc, recipientNo) => [{
      recipientNo,
      ...message,
    }, ...acc], []);

    return this.sendRawMessages(templateCode, data, options);
  }
  /* eslint-disable max-len */

  /**
   * Cancel to request to transmit Toast alimtalk
   *
   * @param {string} requestId - The indentifier to be requested.
   * @param {string} [recipientSeq=''] - The sequence number.
   * @returns {Promise} Promise object represents the request to toast
   */
  async cancelToRequest(requestId, recipientSeq = '') {
    const url = `/alimtalk/v1.1/appkeys/${this.options.appKey}/messages/${requestId}`;

    const options = recipientSeq ? {
      params: {
        recipientSeq,
      },
    } : {};

    let response;
    try {
      debug(`cancel to request ${requestId}`);
      response = await this.client.delete(url, options);

      if (response.data.header.isSuccessful) {
        return response.data.header.resultMessage;
      }
    } catch (err) {
      debug('occured error on canceling to request');
      debug(err);
      throw new Error('Fail to request to toast');
    }

    throw new Error(`${response.data.header.resultCode} : ${response.data.header.resultMessage}`);
  }
}

module.exports = ToastKakaoBizmessage;
