//Types for start read SMS function
type Status = 'success' | 'error';
export type Callback = (status: Status, sms: any, error?: any) => void | Promise<void>;
export type StartReadSMS = (callback: Callback) => Promise<void>;

//Types for check if has SMS permission function
type CheckIfHasSMSPermissionReturn = {
    hasReceiveSmsPermission: boolean,
    hasReadSmsPermission: boolean,
};
export type CheckIfHasSMSPermission = () => Promise<CheckIfHasSMSPermissionReturn>;

//Types for request SMS permissions function
export type RequestSMSPermissions = {}


