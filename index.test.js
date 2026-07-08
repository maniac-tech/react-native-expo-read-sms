const mockAddListener = jest.fn();
const mockStartReadSMS = jest.fn();
const mockStopReadSMS = jest.fn();
const mockCheck = jest.fn();
const mockRequestMultiple = jest.fn();

jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
    Version: 30,
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      RECEIVE_SMS: "android.permission.RECEIVE_SMS",
      READ_SMS: "android.permission.READ_SMS",
    },
    RESULTS: {
      GRANTED: "granted",
      DENIED: "denied",
      NEVER_ASK_AGAIN: "never_ask_again",
    },
    check: mockCheck,
    requestMultiple: mockRequestMultiple,
  },
  NativeModules: {
    RNExpoReadSms: {
      startReadSMS: mockStartReadSMS,
      stopReadSMS: mockStopReadSMS,
    },
  },
  NativeEventEmitter: jest.fn().mockImplementation(() => ({
    addListener: mockAddListener,
  })),
}));

const { Platform, PermissionsAndroid } = require("react-native");
const {
  checkIfHasSMSPermission,
  requestReadSMSPermission,
  startReadSMS,
  stopReadSMS,
} = require("./index");

beforeEach(() => {
  jest.clearAllMocks();
  Platform.OS = "android";
  Platform.Version = 30;
});

describe("checkIfHasSMSPermission", () => {
  it("assumes granted on Android below API 23 without calling PermissionsAndroid", async () => {
    Platform.Version = 22;

    const result = await checkIfHasSMSPermission();

    expect(result).toEqual({
      hasReceiveSmsPermission: true,
      hasReadSmsPermission: true,
    });
    expect(mockCheck).not.toHaveBeenCalled();
  });

  it("checks both permissions independently on Android API 23+", async () => {
    mockCheck.mockImplementation((permission) =>
      Promise.resolve(permission === PermissionsAndroid.PERMISSIONS.RECEIVE_SMS)
    );

    const result = await checkIfHasSMSPermission();

    expect(result).toEqual({
      hasReceiveSmsPermission: true,
      hasReadSmsPermission: false,
    });
    expect(mockCheck).toHaveBeenCalledWith(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
    expect(mockCheck).toHaveBeenCalledWith(PermissionsAndroid.PERMISSIONS.READ_SMS);
  });

  it("returns both permissions as false and warns when PermissionsAndroid.check throws", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    mockCheck.mockRejectedValue(new Error("boom"));

    const result = await checkIfHasSMSPermission();

    expect(result).toEqual({
      hasReceiveSmsPermission: false,
      hasReadSmsPermission: false,
    });
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});

describe("requestReadSMSPermission", () => {
  it("returns true immediately on non-Android platforms", async () => {
    Platform.OS = "ios";

    const result = await requestReadSMSPermission();

    expect(result).toBe(true);
    expect(mockCheck).not.toHaveBeenCalled();
    expect(mockRequestMultiple).not.toHaveBeenCalled();
  });

  it("skips requestMultiple when permissions are already granted", async () => {
    Platform.Version = 22; // checkIfHasSMSPermission short-circuits to granted

    const result = await requestReadSMSPermission();

    expect(result).toBe(true);
    expect(mockRequestMultiple).not.toHaveBeenCalled();
  });

  it("returns true when the user grants both permissions", async () => {
    mockCheck.mockResolvedValue(false);
    mockRequestMultiple.mockResolvedValue({
      [PermissionsAndroid.PERMISSIONS.RECEIVE_SMS]: PermissionsAndroid.RESULTS.GRANTED,
      [PermissionsAndroid.PERMISSIONS.READ_SMS]: PermissionsAndroid.RESULTS.GRANTED,
    });

    const result = await requestReadSMSPermission();

    expect(mockRequestMultiple).toHaveBeenCalledWith([
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    ]);
    expect(result).toBe(true);
  });

  it("returns false when only one of the two permissions is granted", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    mockCheck.mockResolvedValue(false);
    mockRequestMultiple.mockResolvedValue({
      [PermissionsAndroid.PERMISSIONS.RECEIVE_SMS]: PermissionsAndroid.RESULTS.GRANTED,
      [PermissionsAndroid.PERMISSIONS.READ_SMS]: PermissionsAndroid.RESULTS.DENIED,
    });

    const result = await requestReadSMSPermission();

    expect(result).toBe(false);

    logSpy.mockRestore();
  });

  it("returns false and logs when the user denies the permission request", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    mockCheck.mockResolvedValue(false);
    mockRequestMultiple.mockResolvedValue({
      [PermissionsAndroid.PERMISSIONS.RECEIVE_SMS]: PermissionsAndroid.RESULTS.DENIED,
      [PermissionsAndroid.PERMISSIONS.READ_SMS]: PermissionsAndroid.RESULTS.DENIED,
    });

    const result = await requestReadSMSPermission();

    expect(result).toBe(false);
    expect(logSpy).toHaveBeenCalledWith(
      "Read Sms permission denied by user.",
      expect.anything()
    );

    logSpy.mockRestore();
  });

  it("returns false and logs when the user permanently revokes the permission", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    mockCheck.mockResolvedValue(false);
    mockRequestMultiple.mockResolvedValue({
      [PermissionsAndroid.PERMISSIONS.RECEIVE_SMS]: PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
      [PermissionsAndroid.PERMISSIONS.READ_SMS]: PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
    });

    const result = await requestReadSMSPermission();

    expect(result).toBe(false);
    expect(logSpy).toHaveBeenCalledWith(
      "Read Sms permission revoked by user.",
      expect.anything()
    );

    logSpy.mockRestore();
  });

  it("returns false when PermissionsAndroid.requestMultiple throws", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockCheck.mockResolvedValue(false);
    mockRequestMultiple.mockRejectedValue(new Error("boom"));

    const result = await requestReadSMSPermission();

    expect(result).toBe(false);
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});

describe("startReadSMS", () => {
  it("reports an error on non-Android platforms", async () => {
    Platform.OS = "ios";
    const callback = jest.fn();

    await startReadSMS(callback);

    expect(callback).toHaveBeenCalledWith(
      "error",
      "",
      "ReadSms Plugin is only for android platform"
    );
    expect(mockStartReadSMS).not.toHaveBeenCalled();
  });

  it("reports an error when SMS permissions are missing", async () => {
    mockCheck.mockResolvedValue(false);
    const callback = jest.fn();

    await startReadSMS(callback);

    expect(callback).toHaveBeenCalledWith(
      "error",
      "",
      "Required RECEIVE_SMS and READ_SMS permission"
    );
    expect(mockStartReadSMS).not.toHaveBeenCalled();
  });

  it("emits success when the native module registers and an SMS is received", async () => {
    Platform.Version = 22; // short-circuit permission check to granted
    mockStartReadSMS.mockImplementation((success) => {
      success("Start Read SMS successfully");
    });
    const callback = jest.fn();

    await startReadSMS(callback);

    expect(mockAddListener).toHaveBeenCalledWith("received_sms", expect.any(Function));

    const [, handler] = mockAddListener.mock.calls[0];
    handler("[+15551234567, Hello world]");

    expect(callback).toHaveBeenCalledWith(
      "success",
      "[+15551234567, Hello world]",
      undefined
    );
  });

  it("reports the native error when the native module fails to register", async () => {
    Platform.Version = 22;
    mockStartReadSMS.mockImplementation((success, error) => {
      error("native registration failed");
    });
    const callback = jest.fn();

    await startReadSMS(callback);

    expect(callback).toHaveBeenCalledWith("error", "", "native registration failed");
  });
});

describe("stopReadSMS", () => {
  it("calls the native stopReadSMS on Android", () => {
    stopReadSMS();

    expect(mockStopReadSMS).toHaveBeenCalled();
  });

  it("does nothing on non-Android platforms", () => {
    Platform.OS = "ios";

    stopReadSMS();

    expect(mockStopReadSMS).not.toHaveBeenCalled();
  });
});
