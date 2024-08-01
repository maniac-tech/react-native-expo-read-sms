
<h1 align="center">
  <br>
  <a href="https://maniac-tech.com/expo-read-sms/" alt="Markdownify" width="200">
    <img src="https://maniac-tech.com/images/expo-read-sms.png" height="300px">
  </a>
  <br>
  react-native-expo-read-sms
  <br>
</h1>

<h4 align="center">Reading SMS made simple in <a href="https://reactnative.dev/" target="_blank">react-native</a> on Android</h4>

<!-- # react-native-expo-read-sms / [Webpage](http://maniac-tech.com/expo-read-sms/) -->

## Maintainers

[maniac-tech](https://github.com/maniac-tech/) Active maintainer

## Installation

Install this in your managed Expo project by running this command:

`$ npm install @maniac-tech/react-native-expo-read-sms --save`

## Usage

1. Import the startReadSMS function after installation

	`import { startReadSMS } from "@maniac-tech/react-native-expo-read-sms";`

2. Pass Success and Error callbacks
	`startReadSMS(successCallbackFn, errorCallbackFn)`

3. Everytime an SMS has been received `successCallbackFn` will be called with the sms

## Example

You may refer to this sample application for how to use the library: [GitHub Repo](https://github.com/maniac-tech/ExpoReadSMS-TestApp)

## Methods
| Method name | Description | Params | Returns |
|-------------|-------------|--------|---------|
| `checkIfHasSMSPermission` | Function which checks if the application has `READ_SMS` and `RECEIVE_SMS` permissions | - | ```{ hasReceiveSmsPermission: true/false, hasReadSmsPermission: true/false }``` |
| `requestReadSMSPermission` | Requests `READ_SMS` and `RECEIVE_SMS` permission, if missing | - | Returns `true` if granted, and `false` otherwise |
| `startReadSMS` | Starts listening for incoming messages. Note: SMS Permissions should be present. | callback fn | Return a string with message orginating address, and message body. Example: `[+919999999999, this is a sample message body]` |


### Important Note:
Ensure your app has `READ_SMS`, and `RECEIVE_SMS`, failing which you'll receive error on calling the function

## Support
Tested on Expo SDK v44, v45 & v47, v48, v49, v50 and Node JS v18

## License
MIT

<!-- MARKDOWN LINKS & IMAGES -->
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/maniac-tech/react-native-expo-read-sms/network/members