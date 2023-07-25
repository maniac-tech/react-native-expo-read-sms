import {
  NativeEventEmitter,
  NativeModules,
  Permission,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { CheckIfHasSMSPermission, RequestSMSPermissions, SMSPermissions, StartReadSMS } from "./types";

const { RNExpoReadSms } = NativeModules;

export default RNExpoReadSms;

export const startReadSMS: StartReadSMS = async (callback) => {
  if (Platform.OS === "android") {
    const permissions = await checkIfHasSMSPermission();
    if (!permissions.READ_SMS || !permissions.RECEIVE_SMS) await requestSMSPermissions(permissions)
    else {
      RNExpoReadSms.startReadSMS(
        (result) => {
          new NativeEventEmitter(RNExpoReadSms).addListener(
            "received_sms",
            (sms) => {
              callback("success", sms);
            }
          );
        },
        (error) => {
          callback("error", "", error);
        }
      );
    }
  }
}

export function stopReadSMS() {
  if (Platform.OS === "android") {
    RNExpoReadSms.stopReadSMS();
  }
};

export const checkIfHasSMSPermission: CheckIfHasSMSPermission = async () => {
  const hasPermissions = {
    RECEIVE_SMS: true,
    READ_SMS: true,
  };

  if (Platform.OS === "android" && Platform.Version < 23) return hasPermissions;

  const RECEIVE_SMS = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
  );
  const READ_SMS = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_SMS
  );

  if (RECEIVE_SMS && READ_SMS) return hasPermissions;

  return {
    RECEIVE_SMS,
    READ_SMS,
  };
};

export const requestSMSPermissions: RequestSMSPermissions = async (permissions: SMSPermissions) => {
  try {
    if (Platform.OS === "android") {
      const permissionsToAsk: Permission[] = [];
      for (const [key, value] of Object.entries(permissions)) {
        if (value) permissionsToAsk.push(PermissionsAndroid.PERMISSIONS[key])
      }
      await PermissionsAndroid.requestMultiple(permissionsToAsk);
    };
  } catch (error) {
    console.log(error.message);
  };
};