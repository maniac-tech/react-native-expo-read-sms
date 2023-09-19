//Types for start read SMS function
export type Status = 'success' | 'error';
export type Callback = (status: Status, sms: string, error? : any) => void | Promise<void>;
export type StartReadSMS = (callback: Callback) => Promise<void>;

//Types for check if has SMS permission function
export type SMSPermissions = {
    RECEIVE_SMS: boolean,
    READ_SMS: boolean,
};
export type CheckIfHasSMSPermission = () => Promise<SMSPermissions>;

//Types for request SMS permissions function
export type RequestSMSPermissions = (permissions: SMSPermissions) => Promise<void>;


