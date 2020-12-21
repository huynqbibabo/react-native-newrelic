import { NativeModules } from 'react-native';

const { Newrelic } = NativeModules;

interface NRError {
  message?: string;
  stack?: string;
  lineNumber?: string;
  fileName?: string;
  columnNumber?: string;
  name?: string;
}

export function nrInit(firstScreen: string) {
  Newrelic.nrInit(firstScreen);
}

export function nrAddUserId(userId: string) {
  Newrelic.addUserId(userId);
}

export function nrRecordMetric(inEventType: string, inJson: string) {
  Newrelic.recordMetric(inEventType, JSON.stringify(inJson));
}

export function nrInteraction(screen: string) {
  console.log(screen);
  Newrelic.interaction(screen);
}

export function nrLog(inError: NRError) {
  Newrelic.logSend(
    'log',
    inError.message,
    inError.stack,
    inError.lineNumber,
    inError.fileName,
    inError.columnNumber,
    inError.name
  );
}

export function nrError(inError: NRError) {
  Newrelic.logSend(
    'error',
    inError.message,
    inError.stack,
    inError.lineNumber,
    inError.fileName,
    inError.columnNumber,
    inError.name
  );
}

export function nrWarning(inError: NRError) {
  Newrelic.logSend(
    'warning',
    inError.message,
    inError.stack,
    inError.lineNumber,
    inError.fileName,
    inError.columnNumber,
    inError.name
  );
}

export function nrCritical(inError: NRError) {
  Newrelic.logSend(
    'critical',
    inError.message,
    inError.stack,
    inError.lineNumber,
    inError.fileName,
    inError.columnNumber,
    inError.name
  );
}
