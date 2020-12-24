import { NativeModules } from 'react-native';

console.log(NativeModules);
const { RNNewRelic } = NativeModules;

interface NRError {
  message?: string;
  stack?: string;
  lineNumber?: string;
  fileName?: string;
  columnNumber?: string;
  name?: string;
}

/**
 * Call this to initialize the SDK. Pass a name of the app's landing screen as an argument.
 * @param firstScreen
 */
export function nrInit(firstScreen: string) {
  RNNewRelic.nrInit(firstScreen);
}

/**
 * Call this to associate a user with custom events
 * @param userId
 */
export function nrAddUserId(userId: string) {
  RNNewRelic.addUserId(userId);
}

/**
 * Call this to record a custom metric
 * @param inEventType
 * @param inJson metric data will convert to json type
 */
export function nrRecordMetric(inEventType: string, inJson: any) {
  RNNewRelic.recordMetric(inEventType, JSON.stringify(inJson));
}

/**
 * Call this to record an interaction event.
 * @param screen is screen name
 */
export function nrInteraction(screen: string) {
  console.log(screen);
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
