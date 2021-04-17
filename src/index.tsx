import { NativeModules } from 'react-native';
import { parse } from 'stacktrace-parser';
import type {
  Attribute,
  EventAttributes,
  InteractionId,
  MetricAttributes,
  MetricCategory,
  RequestOptions,
} from './types';

const { RNNewRelic } = NativeModules;

/**
 * Call this to enable auto record js uncaught exception
 */
export function enableAutoRecordJSUncaughtException() {
  ErrorUtils.setGlobalHandler((error, _isFatal) => {
    if (_isFatal) recordHandledException(error);
  });
}

/**
 * Records a js handled exception.
 * Optionally takes map with additional attributes showing context.
 * @param error
 * @param attributes
 */
export function recordHandledException(
  error: any,
  attributes?: EventAttributes
) {
  const jSException = pareJSException(error);
  return RNNewRelic.recordHandledException(jSException, attributes);
}

/**
 * Test with a native exception
 * @param message
 */
export function crashNow(message?: string) {
  return RNNewRelic.crashNow(message);
}

/**
 * Track a method as an interaction
 */
export async function startInteraction(
  interactionName: string
): Promise<InteractionId> {
  return await RNNewRelic.startInteraction(interactionName);
}

/**
 * ANDROID ONLY
 * Name or rename an interaction
 */
export function setInteractionName(interactionName: string) {
  return RNNewRelic.setInteractionName(interactionName);
}

/**
 * End an interaction
 * Required. The string ID for the interaction you want to end.
 * This string is returned when you use startInteraction().
 */
export function endInteraction(id: InteractionId) {
  return RNNewRelic.endInteraction(id);
}

/**
 * Metrics Categories:
 *  VIEW_LOADING	Creating sub views, controls, and other related tasks
 *  VIEW_LAYOUT	Inflation of layouts, resolving components
 *  DATABASE	SQLite and other file I/O
 *  IMAGE	Image loading and processing
 *  JSON	JSON parsing or creation
 *  NETWORK	Web service integration methods, remote resource loading
 * Create custom metrics
 */
export function recordMetric(
  category: MetricCategory | string,
  name: string,
  args?: MetricAttributes
) {
  const params = Object.assign(
    {
      count: 1,
      totalValue: 1.0,
      exclusiveValue: 0,
    },
    args
  );
  if (params.exclusiveValue === 0) {
    params.exclusiveValue = params.totalValue;
  }
  return RNNewRelic.recordMetric(name, category, params);
}

/**
 * Create or update an attribute
 */
export function setAttribute(
  name: string | Attribute,
  value: boolean | number | string
) {
  return RNNewRelic.setAttribute(name, { value });
}

/**
 * Create or update multiple attributes
 */
export function setAttributes(attributes: EventAttributes) {
  return RNNewRelic.setAttributes(attributes);
}

/**
 * This method removes the attribute specified by the name string
 */
export function removeAttribute(name: string) {
  return RNNewRelic.removeAttribute(name);
}

/**
 * Set custom user ID for associating sessions with events and attributes
 */
export function setUserId(userId: string) {
  return RNNewRelic.setUserId(userId);
}

/**
 * Track app activity/screen that may be helpful for troubleshooting crashes
 */
export function recordBreadcrumb(name: string, attributes?: EventAttributes) {
  return RNNewRelic.recordBreadcrumb(name, attributes);
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
export function recordCustomEvent(
  eventType: string,
  eventName?: string,
  attributes?: EventAttributes
) {
  return RNNewRelic.recordCustomEvent(eventType, eventName, attributes);
}

/**
 * Record HTTP transactions at varying levels of detail
 */
export function noticeNetworkRequest(url: string, options: RequestOptions) {
  const attributes = Object.assign(
    {
      httpMethod: 'GET',
      statusCode: 0,
      startTime: 0, // in milliseconds
      endTime: 0, // in milliseconds
      bytesSent: 0,
      bytesReceived: 0,
      responseHeader: {},
      responseBody: '',
      params: {},
    },
    options
  );

  return RNNewRelic.noticeNetworkRequest(url, attributes);
}

/**
 * Record HTTP error transactions at varying levels of detail
 */
export function noticeNetworkFailure(url: string, options: RequestOptions) {
  const attributes = Object.assign(
    {
      httpMethod: 'GET',
      statusCode: 0,
      startTime: 0, // in milliseconds
      endTime: 0, // in milliseconds
      bytesSent: 0,
      bytesReceived: 0,
      responseHeader: {},
      responseBody: '',
      params: {},
    },
    options
  );
  return RNNewRelic.noticeNetworkFailure(url, attributes);
}

function parseErrorStack(e: any): Array<any> {
  if (!e || !e.stack) {
    return [];
  }
  return Array.isArray(e.stack)
    ? e.stack
    : parse(e.stack).map((frame) => ({
        ...frame,
        column: frame.column != null ? frame.column - 1 : null,
      }));
}

function pareJSException(error?: any, isFatal?: boolean): any {
  const stack = parseErrorStack(error);
  const currentExceptionID = new Date().getTime();
  const originalMessage = error.message || '';
  let message = originalMessage;
  if (error.componentStack != null) {
    message += `\n\nThis error is located at:${error.componentStack}`;
  }
  const namePrefix =
    error.name == null || error.name === '' ? '' : `${error.name}: `;

  if (!message.startsWith(namePrefix)) {
    message = namePrefix + message;
  }

  message =
    error.jsEngine == null
      ? message
      : `${message}, js engine: ${error.jsEngine}`;

  const isHandledByLogBox = error.forceRedbox !== true;

  const jSException = {
    message,
    originalMessage: message === originalMessage ? null : originalMessage,
    name: error.name == null || error.name === '' ? null : error.name,
    componentStack:
      typeof error.componentStack === 'string' ? error.componentStack : null,
    stack,
    id: currentExceptionID,
    isFatal,
    extraData: {
      jsEngine: error.jsEngine,
      rawStack: error.stack,

      // Hack to hide native redboxes when in the LogBox experiment.
      // This is intentionally untyped and stuffed here, because it is temporary.
      suppressRedBox: isHandledByLogBox,
    },
  };

  if (__DEV__) {
    // we feed back into console.error, to make sure any methods that are
    // monkey patched on top of console.error are called when coming from
    // handleException
    console.error(jSException.message);
  }
  return jSException;
}

export type {
  Attribute,
  EventAttributes,
  InteractionId,
  MetricAttributes,
  MetricCategory,
  RequestOptions,
};
