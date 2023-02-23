
package com.reactlibrary;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RNExpoReadSmsModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private BroadcastReceiver msgReceiver;
  public static final String NAME = "RNExpoReadSms";

  public RNExpoReadSmsModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void startReadSMS(final Callback success, final Callback error) {
    try{
      if (ContextCompat.checkSelfPermission(reactContext, Manifest.permission.RECEIVE_SMS) == PackageManager.PERMISSION_GRANTED
              && ContextCompat.checkSelfPermission(reactContext, Manifest.permission.READ_SMS) == PackageManager.PERMISSION_GRANTED) {
        msgReceiver = new BroadcastReceiver() {
          @Override
          public void onReceive(Context context, Intent intent) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("received_sms", getMessageFromMessageIntent(intent));
          }
        };
        String SMS_RECEIVED_ACTION = "android.provider.Telephony.SMS_RECEIVED";
        reactContext.registerReceiver(msgReceiver, new IntentFilter(SMS_RECEIVED_ACTION));
        success.invoke("Start Read SMS successfully");
      } else {
        // Permission has not been granted
        error.invoke("Required RECEIVE_SMS and READ_SMS permission");
      }
    } catch (Exception e){
      e.printStackTrace();
    }
  }

  @ReactMethod
  public void stopReadSMS() {
    try {
      if (reactContext != null && msgReceiver != null) {
        reactContext.unregisterReceiver(msgReceiver);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private String getMessageFromMessageIntent(Intent intent) {
    final Bundle bundle = intent.getExtras();
    
    /*
      Index 0 - to have originating Address
      Index 1 - to have message body
    */

    String SMSReturnValues = new String [2];
    String currentMessageUserData = "";

    try {
      if (bundle != null) {
        final Object[] pdusObj = (Object[]) bundle.get("pdus");
        if (pdusObj != null) {
          for (Object aPdusObj : pdusObj) {
            SmsMessage currentMessage = SmsMessage.createFromPdu((byte[]) aPdusObj);
            SMSReturnValues[0] = currentMessage.getDisplayOriginatingAddress();
            SMSReturnValues[1] = currentMessage.getDisplayMessageBody();
            currentMessageUserData = currentMessage.getUserData();
          }
        }
      }
      Log.i("ReadSMSModule", "SMS Originating Address received is:"+SMSReturnValues[0]);
      Log.i("ReadSMSModule", "SMS received is:"+SMSReturnValues[1]);
      Log.i("ReadSMSModule", "SMS useData is:"+new String(currentMessageUserData, "UTF-8"))
    } catch (Exception e) {
      e.printStackTrace();
    }
    return SMSReturnValues;
  }
}