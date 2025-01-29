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

/**
 * Checks if the application has the necessary SMS permissions on Android.
 *
 * This function checks for the RECEIVE_SMS and READ_SMS permissions on Android devices.
 * If the Android version is below 23, it assumes that the permissions are granted.
 * Otherwise, it explicitly checks for the permissions using PermissionsAndroid.
 *
 * @returns {Promise<{ hasReceiveSmsPermission: boolean, hasReadSmsPermission: boolean }>} 
 * An object containing the status of RECEIVE_SMS and READ_SMS permissions.
 * - hasReceiveSmsPermission: boolean - Indicates if the RECEIVE_SMS permission is granted.
 * - hasReadSmsPermission: boolean - Indicates if the READ_SMS permission is granted.
 *
 * @example
 * const permissions = await checkIfHasSMSPermission();
 * console.log(permissions.hasReceiveSmsPermission); // true or false
 * console.log(permissions.hasReadSmsPermission); // true or false
 */
export const checkIfHasSMSPermission = async () => {
  if (Platform.OS === "android" && Platform.Version < 23) {
    return {
      hasReceiveSmsPermission: true,
      hasReadSmsPermission: true,
    };
  }

  try {
    const [hasReceiveSmsPermission, hasReadSmsPermission] = await Promise.all([
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS),
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS),
    ]);
  
    return {
      hasReceiveSmsPermission,
      hasReadSmsPermission,
    };
  } catch (error) {
    console.warn("Something went wrong when checking permission", error);
    return {
      hasReceiveSmsPermission: false,
      hasReadSmsPermission: false,
    };
  }
};

/**
 * Requests the necessary SMS permissions on Android.
 *
 * This function checks if the application already has the RECEIVE_SMS and READ_SMS permissions.
 * If not, it requests these permissions from the user. It handles different permission statuses
 * and logs appropriate messages based on the user's response.
 * There are three possible permission granted by Android: granted, denied and never_ask_again
 *
 * @returns {Promise<boolean>} 
 * A promise that resolves to a boolean indicating whether the permissions were granted.
 * - true: Permissions were granted.
 * - false: Permissions were denied or an error occurred.
 *
 * @example
 * const hasPermission = await requestReadSMSPermission();
 * if (hasPermission) {
 *   console.log("SMS permissions granted");
 * } else {
 *   console.log("SMS permissions denied");
 * }
 */
export async function requestReadSMSPermission() {
  if (Platform.OS === "android") {
    try {
      const hasPermission = await checkIfHasSMSPermission();
      if (hasPermission.hasReadSmsPermission && hasPermission.hasReceiveSmsPermission) {
        return true;
      }

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
    } catch (error) {
      console.error("Error requesting SMS permissions", error);
      return false;
    }
  }
  return true;
}

export function stopReadSMS() {
  if (Platform.OS === "android") {
    RNExpoReadSms.stopReadSMS();
  }
}
