
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
| `startReadSMS` | lorem impsum | callback fn | lorem impsum |
| `checkIfHasSMSPermission` | lorem impsum | - | lorem impsum |
| `requestReadSMSPermission` | lorem impsum | - | lorem impsum |
| `stopReadSMS` | lorem impsum | - | lorem impsum |


### Important Note:
Ensure your app has `READ_SMS`, and `RECEIVE_SMS`, failing which you'll receive error on calling the function

## License
MIT