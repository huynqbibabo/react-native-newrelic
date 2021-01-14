#import "RNNewRelicModule.h"

@implementation RNNewRelic

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(crashNow:(NSString *)message){
    [NewRelic crashNow:message];
}

/**
 * Track a method as an interaction
 */
RCT_EXPORT_METHOD(startInteraction:(NSString *)interactionName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSString* interactionId = [NewRelic startInteractionWithName:(NSString * _Null_unspecified)interactionName];
        resolve((NSString *)interactionId);
    } @catch (NSException *exception) {
        [NewRelic recordHandledException:exception];
        reject(@"interactionId", @"Start interaction false!", nil);
    }
}

RCT_EXPORT_METHOD(setInteractionName:(NSString *)interactionName) {
    [NewRelic startInteractionWithName:(NSString * _Null_unspecified)interactionName];
}

/**
 * End an interaction
 * Required. The string ID for the interaction you want to end.
 * This string is returned when you use startInteraction().
 */
RCT_EXPORT_METHOD(endInteraction:(NSString *)interactionId) {
    [NewRelic stopCurrentInteraction:(NSString * _Null_unspecified)interactionId];
}

RCT_EXPORT_METHOD(addUserId:(NSString *)userId){
  [NewRelic setUserId:(NSString * _Null_unspecified)userId];
}

RCT_EXPORT_METHOD(recordMetric:(NSString *)name category:(NSString *)category attrs:(NSDictionary *)attrs)
{
//    NSNumber *value = [NSNumber ];
//
//    [NewRelic recordMetricWithName:(NSString * _Nonnull)name category:(NSString * _Nonnull)category value:(NSNumber * _Nonnull)value valueUnits:(NRMetricUnit * _Nullable) countUnits:(NRMetricUnit * _Nullable)];
}

RCT_EXPORT_METHOD(interaction:(NSString *)screen){
  [NewRelic recordCustomEvent:@"RNInteraction" attributes:@{@"Screen":screen}];
}

RCT_EXPORT_METHOD(logSend:(NSString *)loglevel message:(NSString *)message stack:(NSString *)stack lineNumber:(NSString *)lineNumber fileName:(NSString *)fileName columnNumber:(NSString *)columnNumber name:(NSString *)name)
{
  if (loglevel == nil) {
    loglevel = @"missing";
  }

  if (message == nil) {
    message = @"missing";
  }

  if (stack == nil) {
    stack = @"missing";
  }

  if (lineNumber == nil) {
    lineNumber = @"missing";
  }

  if (fileName == nil) {
    fileName = @"missing";
  }

  if (columnNumber == nil) {
    columnNumber = @"missing";
  }

  if (loglevel == nil) {
    name = @"missing";
  }

  id objects[] = {loglevel, message, stack, lineNumber,fileName, columnNumber, name, @"ios"};
  id keys[] = {@"logLevel", @"message", @"stack", @"lineNumber", @"fileName", @"columnNumber", @"name", @"platform"};
  NSUInteger count = sizeof(objects) / sizeof(id);
  NSDictionary *nrdictionary = [NSDictionary dictionaryWithObjects:objects
                                                         forKeys:keys
                                                           count:count];

   [NewRelic recordCustomEvent:@"RNError" attributes:nrdictionary];
}

@end
