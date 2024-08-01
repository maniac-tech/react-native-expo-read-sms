
<h1 align="center">
  <br>
  <a href="https://maniac-tech.com/expo-read-sms/" alt="Markdownify" width="200">
    <img src="https://maniac-tech.com/images/expo-read-sms.png" height="300px">
  </a>
  <br>
  react-native-expo-read-sms
  <br>
</h1>

<h4 align="center">Reading SMS made simple in <a href="https://reactnative.dev/" target="_blank">React Native</a> on Android</h4>

<p align="center">
  <a href="https://react-native-expo-read-sms.vercel.app/docs/category/getting-started">Documentation</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#example">Example</a> •
  <a href="#methods">Methods</a> •
  <a href="#license">License</a>
</p>

<img src="https://maniac-tech.com/expo-read-sms/static/images/code.png" height="600px">

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

## Maintainers
[maniac-tech](https://github.com/maniac-tech/) Active maintainer

<a href="https://buymeacoffee.com/maniac_tech" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>