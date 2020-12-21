package com.reactnativenewrelic

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.json.JSONException
import org.json.JSONObject
import java.util.*


import android.util.Log;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactContext;
import com.newrelic.agent.android.NewRelic;

import org.json.JSONArray;

import java.util.Date;
import java.util.HashMap;


class NewrelicModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "Newrelic"
  }

  private val DURATION_SHORT_KEY = "SHORT"
  private val DURATION_LONG_KEY = "LONG"
  private var timerDate: Date = Date()
  private var LastScreen = "null"

  override fun getConstants(): Map<String, Any>? {
    return HashMap()
  }

  @ReactMethod
  fun nrInit(FirstScreen: String) {
    timerDate = Date()
    LastScreen = FirstScreen
  }

  @ReactMethod
  fun addUserId(userId: String?) {
    val localMap: MutableMap<*, *> = HashMap<Any, Any>()
    localMap["UserId"] = userId
    NewRelic.recordCustomEvent("RnUserId", localMap)
  }

  @ReactMethod
  fun recordMetric(inEventType: String?, inJson: String?) {
    val mainObject: JSONObject
    var jsonName = ""
    var sometext: String
    val attributes: MutableMap<*, *> = HashMap<Any?, Any?>()
    var testnum = 1.0
    var numeric = false
    try {
      mainObject = JSONObject(inJson)
      val recLength = mainObject.length()
      if (recLength > 0) {
        val jsonArray = mainObject.names()
        for (i in 0 until mainObject.length()) {
          jsonName = jsonArray.getString(i)
          sometext = mainObject.getString(jsonName)
          try {
            testnum = sometext.toDouble()
          } catch (e: NumberFormatException) {
            numeric = false
          }
          if (numeric) {
            attributes[jsonName] = testnum
          } else if (sometext.equals("true", ignoreCase = true)) {
            attributes[jsonName] = "true"
          } else if (sometext.equals("false", ignoreCase = true)) {
            attributes[jsonName] = "false"
          } else {
            attributes[jsonName] = sometext
          }
        }
      }
      NewRelic.recordCustomEvent(inEventType, attributes)
    } catch (e: JSONException) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
    }
  }

  @ReactMethod
  fun interaction(screen: String?) {
    val now = Date()
    val elapsedtime: Long = now.getTime() - timerDate.getTime()
    val attributes: MutableMap<*, *> = HashMap<Any?, Any?>()
    attributes["Screen"] = screen
    attributes["duration"] = elapsedtime
    NewRelic.recordCustomEvent("RNInteraction", attributes)
  }

  @ReactMethod
  fun logSend(loglevel: String?, message: String, stack: String, lineNumber: String?, fileName: String?, columnNumber: String?, name: String) {
    val localMap: MutableMap<*, *> = HashMap<Any, Any>()
    if (stack.length > 0) {
      localMap["stack"] = stack
    } else {
      localMap["stack"] = "No Trace"
    }
    if (name.length > 0) {
      localMap["name"] = name
    } else {
      localMap["name"] = "No Name"
    }
    if (message.length > 0) {
      localMap["message"] = message
    } else {
      localMap["message"] = "No Message"
    }
    localMap["logLevel"] = loglevel
    localMap["platform"] = "andorid"
    NewRelic.recordCustomEvent("RNError", localMap)
  }

}
