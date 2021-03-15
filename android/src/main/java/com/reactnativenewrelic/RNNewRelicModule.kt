package com.reactnativenewrelic

import android.util.Log
import com.facebook.react.bridge.*
import com.newrelic.agent.android.NewRelic
import com.newrelic.agent.android.metric.MetricUnit


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
  fun crashNow(message: String?, promise: Promise) {
    try {
      NewRelic.crashNow(message)
      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
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
  fun setInteractionName(interactionName: String, promise: Promise) {
    try {
      NewRelic.setInteractionName(interactionName)
      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
  }

  /**
   * End an interaction
   * Required. The string ID for the interaction you want to end.
   * This string is returned when you use startInteraction().
   */
  @ReactMethod
  fun endInteraction(interactionID: String, promise: Promise) {
    try {
      NewRelic.endInteraction(interactionID)
      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
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
  fun recordMetric(category: String, name: String, readableMap: ReadableMap, promise: Promise) {
    try {
      val count = readableMap.getInt("count")
      val totalValue = readableMap.getDouble("totalValue")
      val exclusiveValue = readableMap.getDouble("exclusiveValue")
      val countUnit = readableMap.getString("countUnit")
      val valueUnit = readableMap.getString("valueUnit")
      NewRelic.recordMetric(name, category, count, totalValue, exclusiveValue, countUnit as MetricUnit?, valueUnit as MetricUnit?)
      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
  }

  /**
   * Create or update an attribute
   */
  @ReactMethod
  fun setAttribute(name: String?, readableMap: ReadableMap?, promise: Promise) {
    try {
      when (readableMap?.getType("value")) {
        ReadableType.Boolean -> NewRelic.setAttribute(name, readableMap.getBoolean("value"))
        ReadableType.Number -> NewRelic.setAttribute(name, readableMap.getDouble("value"))
        ReadableType.String -> NewRelic.setAttribute(name, readableMap.getString("value"))
        else -> Log.i(TAG, "setAttribute: Value type mismatch")
      }
      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
  }


  /**
   * Create or update multiple attributes
   */
  @ReactMethod
  fun setAttributes(attributes: ReadableMap, promise: Promise) {
    try {
      attributes.toHashMap().forEach { (k, _) ->
        if (attributes.getType(k) == ReadableType.Boolean) {
          NewRelic.setAttribute(k, attributes.getBoolean(k))
        }
        if (attributes.getType(k) == ReadableType.Number) {
          NewRelic.setAttribute(k, attributes.getDouble(k))
        }
        if (attributes.getType(k) == ReadableType.String) {
          NewRelic.setAttribute(k, attributes.getString(k))
        }
      }
      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
  }


  /**
   * This method removes the attribute specified by the name string
   */
  @ReactMethod
  fun removeAttribute(name: String?, promise: Promise) {
    try {
      NewRelic.removeAttribute(name)
      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
  }

  /**
   * Set custom user ID for associating sessions with events and attributes
   */
  @ReactMethod
  fun setUserId(userId: String?, promise: Promise) {
    try {
      NewRelic.setUserId(userId)
      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
  }

  /**
   * Track app activity that may be helpful for troubleshooting crashes
   */
  @ReactMethod
  fun recordBreadcrumb(name: String?, readableMap: ReadableMap?, promise: Promise) {
    try {
      val attributes = readableMap?.toHashMap()
      NewRelic.recordBreadcrumb(name, attributes)
      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
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
  fun recordCustomEvent(eventType: String?, eventName: String?, readableMap: ReadableMap?, promise: Promise) {
    try {
      val attributes = readableMap?.toHashMap()
      NewRelic.recordCustomEvent(eventType, eventName, attributes)
      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
  }

  /**
   * Record HTTP transactions at varying levels of detail
   */
  @ReactMethod
  fun noticeNetworkRequest(url: String, readableMap: ReadableMap, promise: Promise) {
    try {
      val httpMethod = readableMap.getString("httpMethod")
      val statusCode = readableMap.getDouble("statusCode").toInt()
      val startTime = readableMap.getDouble("startTime")
      val endTime = readableMap.getDouble("endTime")
      val bytesSent = readableMap.getDouble("bytesSent")
      val bytesReceived = readableMap.getDouble("bytesReceived")
      val responseBody = readableMap.getString("responseBody")

      NewRelic.noticeHttpTransaction(url, httpMethod, statusCode, startTime.toLong(), endTime.toLong(), bytesSent.toLong(), bytesReceived.toLong(), responseBody)
      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
  }

  /**
   * Record HTTP transactions at varying levels of detail
   */
  @ReactMethod
  fun noticeNetworkFailure(url: String, readableMap: ReadableMap, promise: Promise) {
    try {
      val httpMethod = readableMap.getString("httpMethod")
      val statusCode = readableMap.getInt("statusCode")
      val startTime = readableMap.getDouble("startTime")
      val endTime = readableMap.getDouble("endTime")
      val bytesSent = readableMap.getDouble("bytesSent")
      val bytesReceived = readableMap.getDouble("bytesReceived")
      val responseBody = readableMap.getString("responseBody")
      NewRelic.noticeHttpTransaction(url, httpMethod, statusCode, startTime.toLong(), endTime.toLong(), bytesSent.toLong(), bytesReceived.toLong(), responseBody)
      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
  }

  @ReactMethod
  fun recordHandledException(error: ReadableMap, params: ReadableMap?, promise: Promise) {
    try {
      val message: String? = error.getString("message")
      val stackFrames: ReadableArray = error.getArray("stack")!!
      val customException: java.lang.Exception = Exception(message)

      val stackTraceElements = arrayOfNulls<StackTraceElement>(stackFrames.size())

      for (i in 0 until stackFrames.size()) {
        val stackFrame: ReadableMap = stackFrames.getMap(i)!!
        val fn = stackFrame.getString("methodName")
        val file = stackFrame.getString("file")
        stackTraceElements[i] = StackTraceElement("", fn, file, -1)
      }
      customException.stackTrace = stackTraceElements
      val attributes = params?.toHashMap()

      NewRelic.recordHandledException(customException, attributes)

      promise.resolve(true)
    } catch (e: Exception) {
      e.printStackTrace()
      NewRelic.recordHandledException(e)
      promise.reject(e)
    }
  }

  companion object {
    private const val TAG = "RNNewRelic"
  }
}
