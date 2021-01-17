import { NativeModules } from 'react-native';

const { RNNewRelic } = NativeModules;

export interface NRError {
  message?: string;
  stack?: string;
  lineNumber?: string;
  fileName?: string;
  columnNumber?: string;
  name?: string;
}

enum Unit {
  PERCENT = '%',
  BYTES = 'bytes',
  SECONDS = 'sec',
  BYTES_PER_SECOND = 'bytes/second',
  OPERATIONS = 'op',
}

enum Category {
  NONE = 'None',
  VIEW_LOADING = 'View Loading',
  VIEW_LAYOUT = 'Layout',
  DATABASE = 'Database',
  IMAGE = 'Images',
  JSON = 'JSON',
  NETWORK = 'Network',
}

export type MetricUnit =
  | Unit.PERCENT
  | Unit.BYTES
  | Unit.SECONDS
  | Unit.BYTES_PER_SECOND
  | Unit.OPERATIONS;

export type MetricCategory =
  | Category.NONE
  | Category.VIEW_LAYOUT
  | Category.VIEW_LOADING
  | Category.DATABASE
  | Category.IMAGE
  | Category.JSON
  | Category.NETWORK;

export type InteractionId = string;

/**
 * Call this to initialize the SDK. Pass a name of the app's landing screen as an argument.
 */
export function nrInit(overrideConsole?: boolean) {
  ErrorUtils.setGlobalHandler(jsExceptionHandler);
  if (overrideConsole) {
    console.error = (message: any, ...error: any[]) =>
      jsExceptionHandler(error, message);
  }
}

function jsExceptionHandler(error?: any, ...optionalParams: any) {
  // TODO: record error
  console.log(optionalParams);
  RNNewRelic.reportJSException(error);
}

/**
 * Call this to associate a user with custom events
 * @param message
 */
export function crashNow(message?: string) {
  RNNewRelic.crashNow(message);
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
  RNNewRelic.setInteractionName(interactionName);
}

/**
 * End an interaction
 * Required. The string ID for the interaction you want to end.
 * This string is returned when you use startInteraction().
 */
export function endInteraction(id: InteractionId) {
  RNNewRelic.endInteraction(id);
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
export function nrRecordMetric(
  name: string,
  category: MetricCategory | string,
  args?:
    | { count: number }
    | { totalValue: number }
    | { count: number; totalValue: number; exclusiveValue: number }
    | {
        count: number;
        totalValue: number;
        exclusiveValue: number;
        countUnit: MetricUnit;
        valueUnit: MetricUnit;
      }
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
  RNNewRelic.recordMetric(name, category, params);
}

/**
 * Create or update an attribute
 */
export function setAttribute(name: string, value: boolean | number | string) {
  RNNewRelic.setAttribute(name, { value });
}

/**
 * This method removes the attribute specified by the name string
 */
export function removeAttribute(name: string) {
  RNNewRelic.removeAttribute(name);
}

/**
 * Set custom user ID for associating sessions with events and attributes
 */
export function setUserId(userId: string) {
  RNNewRelic.setUserId(userId);
}

/**
 * Track app activity/screen that may be helpful for troubleshooting crashes
 */
export function recordBreadcrumb(
  name: string,
  attributes?: { [key: string]: boolean | number | string }
) {
  RNNewRelic.recordBreadcrumb(name, attributes);
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
  attributes?: { [key: string]: boolean | number | string }
) {
  RNNewRelic.recordCustomEvent(eventName, eventType, attributes);
}

/**
 * Record HTTP transactions at varying levels of detail
 */
export function noticeNetworkRequest(
  url: string,
  options: {
    httpMethod:
      | 'GET'
      | 'POST'
      | 'PUT'
      | 'HEAD'
      | 'DELETE'
      | 'PATCH'
      | 'OPTIONS';
    statusCode: number;
    startTime?: number; // in milliseconds
    endTime?: number; // in milliseconds
    bytesSent?: number;
    bytesReceived?: number;
    responseHeader?: any;
    responseBody?: string; // json string
    params?: { [key: string]: any };
  }
) {
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

  RNNewRelic.noticeNetworkRequest(url, attributes);
}

/**
 * Record HTTP transactions at varying levels of detail
 */
export function noticeNetworkFailure(
  url: string,
  options: {
    httpMethod:
      | 'GET'
      | 'POST'
      | 'PUT'
      | 'HEAD'
      | 'DELETE'
      | 'PATCH'
      | 'OPTIONS';
    statusCode: number;
    startTime?: number; // in milliseconds
    endTime?: number; // in milliseconds
    bytesSent?: number;
    bytesReceived?: number;
    responseHeader?: { [key: string]: boolean | number | string };
    responseBody?: string;
    params?: { [key: string]: any };
  }
) {
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
  RNNewRelic.noticeNetworkFailure(url, attributes);
}
