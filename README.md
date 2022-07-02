
# react-native-expo-read-sms

## Getting started

`$ npm install react-native-expo-read-sms --save`

### Mostly automatic installation

`$ react-native link react-native-expo-read-sms`

### Manual installation


#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNExpoReadSmsPackage;` to the imports at the top of the file
  - Add `new RNExpoReadSmsPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-expo-read-sms'
  	project(':react-native-expo-read-sms').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-expo-read-sms/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-expo-read-sms')
  	```


## Usage
```javascript
import RNExpoReadSms from 'react-native-expo-read-sms';

// TODO: What to do with the module?
RNExpoReadSms;
```
  