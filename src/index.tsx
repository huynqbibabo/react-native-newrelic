import { NativeModules } from 'react-native';
import parseErrorStack from 'react-native/Libraries/Core/Devtools/parseErrorStack';

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

/**
 * Call this to initialize the SDK. Pass a name of the app's landing screen as an argument.
 * @param firstScreen
 */
export function nrInit(firstScreen: string) {
  ErrorUtils.setGlobalHandler(jsExceptionHandler);
  console.error = (_message: any, ...error: any[]) => jsExceptionHandler(error);
  RNNewRelic.nrInit(firstScreen);
}

function jsExceptionHandler(_error?: any) {
  // TODO: record error

  parseErrorStack(_error);
}

/**
 * Call this to associate a user with custom events
 * @param userId
 */
export function nrAddUserId(userId: string) {
  RNNewRelic.addUserId(userId);
}

/**
 * With this method, you can record arbitrary custom metrics to give more detail about app activity
 * that is not tracked by New Relic automatically.
 * The call accepts several sets of parameters for optional levels of detail.
 * To get the most out of your metrics, follow these guidelines to create clear, concise metric names:
 *  - Use case and whitespace characters appropriate for display in the user interface. Metric names are rendered as-is.
 *  - Capitalize the metric name.
 *  - Avoid using the characters / ] [ | * when naming metrics.
 *  - Avoid multi-byte characters.
 *  The category is also required; it is displayed in the UI and is useful for organizing custom metrics if you have many of them.
 *  It can be a custom category or it can be a predefined category using the MetricCategory enum.
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
      // countUnit: null,
      // valueUnit: null,
    },
    args
  );
  if (params.exclusiveValue === 0) {
    params.exclusiveValue = params.totalValue;
  }
  RNNewRelic.recordMetric(name, category, params);
}

/**
 * Call this to record an interaction event.
 * @param screen is screen name
 */
export function nrInteraction(screen: string) {
  RNNewRelic.interaction(screen);
}

/**
 * Call this to record a custom error event.
 * @param inError is JavaScript exception
 */
export function nrLog(inError: NRError) {
  RNNewRelic.logSend(
    'log',
    inError.message,
    inError.stack,
    inError.lineNumber,
    inError.fileName,
    inError.columnNumber,
    inError.name
  );
}

/**
 * Call this to record a custom error event at error level
 * @param inError is JavaScript exception
 */
export function nrError(inError: NRError) {
  RNNewRelic.logSend(
    'error',
    inError.message,
    inError.stack,
    inError.lineNumber,
    inError.fileName,
    inError.columnNumber,
    inError.name
  );
}

/**
 * Call this to record a custom error event at warning level
 * @param inError is JavaScript exception
 */
export function nrWarning(inError: NRError) {
  RNNewRelic.logSend(
    'warning',
    inError.message,
    inError.stack,
    inError.lineNumber,
    inError.fileName,
    inError.columnNumber,
    inError.name
  );
}

/**
 * Call this to record a custom error event at critical level
 * @param inError is JavaScript exception
 */
export function nrCritical(inError: NRError) {
  RNNewRelic.logSend(
    'critical',
    inError.message,
    inError.stack,
    inError.lineNumber,
    inError.fileName,
    inError.columnNumber,
    inError.name
  );
}
