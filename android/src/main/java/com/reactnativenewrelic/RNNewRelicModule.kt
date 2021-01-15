package com.reactnativenewrelic

import android.util.Log
import com.facebook.react.bridge.*
import com.newrelic.agent.android.NewRelic
import com.newrelic.agent.android.metric.MetricUnit
import org.json.JSONException
import org.json.JSONObject
import java.util.*
import kotlin.collections.HashMap


class RNNewRelicModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "RNNewRelic"
  }

  override fun getConstants(): Map<String, Any> {
    return HashMap()
  }

  /**
   * Test a native crash
   */
  @ReactMethod
  fun crashNow(message: String?){
    NewRelic.crashNow(message);
  }

  /**
   * Track a method as an interaction
   */
  @ReactMethod
  fun startInteraction(interactionName: String, promise: Promise) {
    try {
      val interactionId = NewRelic.startInteraction(interactionName)
      promise.resolve(interactionId)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
  }

  /**
   * Name or rename an interaction
   */
  @ReactMethod
  fun setInteractionName(interactionName: String) {
    NewRelic.setInteractionName(interactionName)
  }

  /**
   * End an interaction
   * Required. The string ID for the interaction you want to end.
   * This string is returned when you use startInteraction().
   */
  @ReactMethod
  fun endInteraction(interactionID: String) {
    try {

      NewRelic.endInteraction(interactionID)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
    }
  }

  /**
   * VIEW_LOADING	Creating sub views, controls, and other related tasks
   * VIEW_LAYOUT	Inflation of layouts, resolving components
   * DATABASE	SQLite and other file I/O
   * IMAGE	Image loading and processing
   * JSON	JSON parsing or creation
   * NETWORK	Web service integration methods, remote resource loading
   * Create custom metrics
   */
  @ReactMethod
  fun recordMetric(name: String, category: String, readableMap: ReadableMap) {
    try {
      val count = readableMap.getInt("count")
      val totalValue = readableMap.getDouble("totalValue")
      val exclusiveValue = readableMap.getDouble("exclusiveValue")
      val countUnit = readableMap.getString("countUnit")
      val valueUnit = readableMap.getString("valueUnit")
      NewRelic.recordMetric(name, category, count, totalValue, exclusiveValue, countUnit as MetricUnit, valueUnit as MetricUnit?)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
    }
  }

  /**
   * Create or update an attribute
   */
  @ReactMethod
  fun setAttribute(name: String?, readableMap: ReadableMap?) {
    try {
      when (readableMap?.getType("value")) {
        ReadableType.Boolean -> NewRelic.setAttribute(name, readableMap.getBoolean("value"))
        ReadableType.Number -> NewRelic.setAttribute(name, readableMap.getDouble("value"))
        ReadableType.String -> NewRelic.setAttribute(name, readableMap.getString("value"))
        else -> Log.i(TAG, "setAttribute: Value type mismatch")
      }
    } catch (e: Exception) {
      e.printStackTrace();
      NewRelic.recordHandledException(e)
    }
  }

  /**
   * This method removes the attribute specified by the name string
   */
  @ReactMethod
  fun removeAttribute(name: String?) {
    try {
      NewRelic.removeAttribute(name)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
    }
  }

  /**
   * Set custom user ID for associating sessions with events and attributes
   */
  @ReactMethod
  fun setUserId(userId: String?) {
    try {
      NewRelic.setUserId(userId)
    } catch (e: Exception) {
      e.printStackTrace();
      NewRelic.recordHandledException(e)
    }
  }

  /**
   * Track app activity that may be helpful for troubleshooting crashes
   */
  @ReactMethod
  fun recordBreadcrumb(name: String?, readableMap: ReadableMap?) {
    val attributes = readableMap?.toHashMap()
    NewRelic.recordBreadcrumb(name, attributes)
  }

  /**
   * Creates and records a custom event, for use in New Relic Insights
   *
   * IMPORTANT considerations and best practices include:
   *
   * - You should limit the total number of event types to approximately five.
   * eventType is meant to be used for high-level categories.
   * For example, you might create an event type Gestures.
   *
   * - Do not use eventType to name your custom events.
   * Create an attribute to name an event or use the optional name parameter.
   * You can create many custom events; it is only event types that you should limit.
   *
   * - Using the optional name parameter has the same effect as adding a name key in the attributes dictionary.
   * name is a keyword used for displaying your events in the New Relic UI.
   * To create a useful name, you might combine several attributes.
   */
  @ReactMethod
  fun recordCustomEvent(eventType: String?, eventName: String?, readableMap: ReadableMap?) {
    try {
      val attributes = readableMap?.toHashMap()
      NewRelic.recordCustomEvent(eventType, eventName, attributes)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
    }
  }

  /**
   * Record HTTP transactions at varying levels of detail
   */
  @ReactMethod
  fun noticeHttpTransaction(url: String, readableMap: ReadableMap) {
    val httpMethod = readableMap.getString("httpMethod")
    val statusCode = readableMap.getInt("statusCode")
    val startTime = readableMap.getDouble("startTime")
    val endTime = readableMap.getDouble("endTime")
    val bytesSent = readableMap.getDouble("bytesSent")
    val bytesReceived = readableMap.getDouble("bytesReceived")
    val responseBody = readableMap.getString("responseBody")

    try {
        NewRelic.noticeHttpTransaction(url, httpMethod, statusCode, startTime.toLong(), endTime.toLong(), bytesSent.toLong(), bytesReceived.toLong(), responseBody)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
    }
  }

  @ReactMethod
  fun logSend(loglevel: String?, message: String, stack: String, lineNumber: String?, fileName: String?, columnNumber: String?, name: String) {
    val localMap: HashMap<String, Any> = HashMap()
    if (stack.isNotEmpty()) {
      localMap["stack"] = stack
    } else {
      localMap["stack"] = "No Trace"
    }
    if (name.isNotEmpty()) {
      localMap["name"] = name
    } else {
      localMap["name"] = "No Name"
    }
    if (message.isNotEmpty()) {
      localMap["message"] = message
    } else {
      localMap["message"] = "No Message"
    }
    if (loglevel != null) {
      localMap["logLevel"] = loglevel
    }
    if (lineNumber != null) {
      localMap["lineNumber"] = lineNumber
    }
    if (fileName != null) {
      localMap["fileName"] = fileName
    }
    if (columnNumber != null) {
      localMap["columnNumber"] = columnNumber
    }
    localMap["platform"] = "android"
    NewRelic.recordCustomEvent("RNError", localMap)
  }


  private fun parseJson(inJson: String?): HashMap<String, Any> {
    val mainObject: JSONObject
    var jsonName: String
    var sometext: String
    val attributes: HashMap<String, Any> = HashMap()
    var testnum = 1.0
    var numeric = false
    try {
      mainObject = JSONObject(inJson!!)
      val recLength = mainObject.length()
      if (recLength > 0) {
        val jsonArray = mainObject.names()
        for (i in 0 until mainObject.length()) {
          jsonName = jsonArray!!.getString(i)
          sometext = mainObject.getString(jsonName)
          try {
            testnum = sometext.toDouble()
          } catch (e: NumberFormatException) {
            numeric = false
          }
          when {
            numeric -> {
              attributes[jsonName] = testnum
            }
            sometext.equals("true", ignoreCase = true) -> {
              attributes[jsonName] = "true"
            }
            sometext.equals("false", ignoreCase = true) -> {
              attributes[jsonName] = "false"
            }
            else -> {
              attributes[jsonName] = sometext
            }
          }
        }
      }
      return attributes
    } catch (e: JSONException) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      return HashMap()
    }
  }

  companion object {
    private const val TAG = "RNNewRelic"
    private const val DURATION_SHORT_KEY = "SHORT"
    private const val DURATION_LONG_KEY = "LONG"
    private var timerDate: Date = Date()
    private var LastScreen = "null"
  }
}
