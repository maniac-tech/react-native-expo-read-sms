
# react-native-expo-read-sms

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

## Methods
| Method name | Description | Params | Returns |
|-------------|-------------|--------|---------|
| `checkIfHasSMSPermission` | Function which checks if the application has `READ_SMS` and `RECEIVE_SMS` permissions | - | ```{ hasReceiveSmsPermission: true/false, hasReadSmsPermission: true/false }``` |
| `requestReadSMSPermission` | Requests `READ_SMS` and `RECEIVE_SMS` permission, if missing | - | Returns `true` if granted, and `false` otherwise |
| `startReadSMS` | Starts listening for incoming messages. Note: SMS Permissions should be present. | callback fn | Incoming message body |


### Important Note:
Ensure your app has `READ_SMS`, and `RECEIVE_SMS`, failing which you'll receive error on calling the function

## Support
Tested on Expo SDK v44 & v45, and Node JS v14

## License
MIT