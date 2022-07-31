import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from "react-native";

const { RNExpoReadSms } = NativeModules;

export default RNExpoReadSms;

export async function startReadSMS(callback) {
  let resultFun = (status, sms, error) => {
    if (callback) {
      callback(status, sms, error);
    }
  };
  if (Platform.OS === "android") {
    const hasPermission = await checkIfHasSMSPermission();
    if (hasPermission) {
      RNExpoReadSms.startReadSMS(
        (result) => {
          new NativeEventEmitter(RNExpoReadSms).addListener(
            "received_sms",
            (sms) => {
              resultFun("success", sms);
            }
          );
        },
        (error) => {
          resultFun("error", "", error);
        }
      );
    } else {
      resultFun("error", "", "Required RECEIVE_SMS and READ_SMS permission");
    }
  } else {
    resultFun("error", "", "ReadSms Plugin is only for android platform");
  }
}

export const checkIfHasSMSPermission = async () => {
  if (Platform.OS === "android" && Platform.Version < 23) {
    return true;
  }

  const hasReceiveSmsPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
  );
  const hasReadSmsPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_SMS
  );

  if (hasReceiveSmsPermission && hasReadSmsPermission) return true;

  return {
    hasReceiveSmsPermission,
    hasReadSmsPermission,
  };
};

export async function requestReadSMSPermission() {
  if (Platform.OS === "android") {
    const hasPermission = await checkIfHasSMSPermission();
    if (hasPermission.hasReadSmsPermission && hasPermission.hasReceiveSmsPermission) return true;
    const status = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    ]);
    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      console.log("Read Sms permission denied by user.", status);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      console.log("Read Sms permission revoked by user.", status);
    }
    return false;
  }
  return true;
}

export function stopReadSMS() {
  if (Platform.OS === "android") {
    RNExpoReadSms.stopReadSMS();
  }
}
