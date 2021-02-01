import type { LiteralUnion } from 'type-fest';

export interface StackFrame {
  file: string | null;
  methodName: LiteralUnion<'<unknown>', string>;
  arguments: string[];
  lineNumber: number | null;
  column: number | null;
}

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

enum NRAttributes {
  appId = 'appId',
  appName = 'appName',
  accountId = 'accountId',
  carrier = 'carrier',
  category = 'category',
  deviceManufacturer = 'deviceManufacturer',
  deviceModel = 'deviceModel',
  eventType = 'eventType',
  install = 'install',
  lastInteraction = 'lastInteraction',
  memUsageMb = 'memUsageMb',
  newRelicVersion = 'newRelicVersion',
  osMajorVersion = 'osMajorVersion',
  osName = 'osName',
  osVersion = 'osVersion',
  platform = 'platform',
  platformVersion = 'platformVersion',
  sessionDuration = 'sessionDuration',
  sessionId = 'sessionId',
  timestamp = 'timestamp',
  type = 'type',
  upgradeFrom = 'upgradeFrom',
  uuid = 'uuid',
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

export type MetricAttributes =
  | { count: number }
  | { totalValue: number }
  | { count: number; totalValue: number; exclusiveValue: number }
  | {
      count: number;
      totalValue: number;
      exclusiveValue: number;
      countUnit: MetricUnit;
      valueUnit: MetricUnit;
    };

export interface RequestOptions {
  httpMethod: 'GET' | 'POST' | 'PUT' | 'HEAD' | 'DELETE' | 'PATCH' | 'OPTIONS';
  statusCode: number;
  startTime?: number;
  endTime?: number;
  bytesSent?: number;
  bytesReceived?: number;
  responseHeader?: any;
  responseBody?: string;
  params?: {
    [key: string]: any;
  };
}

export type Attribute =
  | NRAttributes.appId
  | NRAttributes.appName
  | NRAttributes.accountId
  | NRAttributes.carrier
  | NRAttributes.category
  | NRAttributes.deviceManufacturer
  | NRAttributes.deviceModel
  | NRAttributes.eventType
  | NRAttributes.install
  | NRAttributes.lastInteraction
  | NRAttributes.memUsageMb
  | NRAttributes.newRelicVersion
  | NRAttributes.osMajorVersion
  | NRAttributes.osName
  | NRAttributes.osVersion
  | NRAttributes.platform
  | NRAttributes.platformVersion
  | NRAttributes.sessionDuration
  | NRAttributes.sessionId
  | NRAttributes.timestamp
  | NRAttributes.type
  | NRAttributes.upgradeFrom
  | NRAttributes.uuid;

export interface EventAttributes {
  [key: string]: boolean | number | string;
}
