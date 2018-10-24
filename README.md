# node-kakao-bizmessage-toast

[![npm version](https://img.shields.io/npm/v/kakao-bizmessage-toast.svg?style=flat-square)](https://www.npmjs.org/package/kakao-bizmessage-toast)
[![Build Status](https://travis-ci.org/Nyuno/node-kakao-bizmessage-toast.svg?branch=master)](https://travis-ci.org/Nyuno/node-kakao-bizmessage-toast)
[![Coverage Status](https://coveralls.io/repos/github/Nyuno/node-kakao-bizmessage-toast/badge.svg?branch=master)](https://coveralls.io/github/Nyuno/node-kakao-bizmessage-toast?branch=master)
[![npm downloads](https://img.shields.io/npm/dm/kakao-bizmessage-toast.svg?style=flat-square)](http://npm-stat.com/charts.html?package=kakao-bizmessage-toast)
[![install size](https://packagephobia.now.sh/badge?p=kakao-bizmessage-toast)](https://packagephobia.now.sh/result?p=kakao-bizmessage-toast)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

[토스트(Toast)](https://www.toast.com/)를 이용한 [카카오 비즈메세지(알림톡 / 친구톡)](https://bizmessage.kakao.com/) 전송 Client


## 기능

- 카카오톡 비즈메세지(알림톡/~친구톡/상담톡~) 전송

## 설치

npm 사용:

```bash
$ npm install kakao-bizmessage-toast
```

yarn 사용:

```bash
$ yarn add kakao-bizmessage-toast
```

## 사용 예시

```js
// 셋팅
const ToastKakaoBizmessage = require('kakao-bizmessage-toast');

const client = new ToastKakaoBizmessage({
  appKey: `${YOUR_TOAST_APP_KEY}`,
  secretKey: `${YOUR_TOAST_SECRET_KEY}`,
});
```

```js
// 일반 알림톡 전송
const templateCode = 'testTemplateCode';
const recipientList = [{
  recipientNo: '01012345678',
  content: '현호님 카플랫 이용은 어떠셨나요?',
}];

client.sendRawMessages(templateCode, recipientList);
```

```js
// 같은 알림톡 일괄 전송
const templateCode = 'testTemplateCode';
const recipientList = ['01012345678', '01087654321'];
const contet = '여러분 카플랫 이용은 어떠셨나요?';

client.sendSameRawMessagesToMultipleUsers(templateCode, recipientList, content);
```

```js
// 예약 알림톡 전송 / 취소
async someFunction(templateCode, recipientList, requestDate) {
  try {
    // requestDate 시점에 예약 전송
    const requestId = await client.sendRawMessages(templateCode, recipientList, requestDate);

    // requestId 에 해당하는 알림톡 취소
    await client.cancelToRequest(requestId);
    
    return 'success';
  } catch (err) {
    return err;
  }
}

```
