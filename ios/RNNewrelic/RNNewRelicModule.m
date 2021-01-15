#import "RNNewRelicModule.h"

@implementation RNNewRelic

RCT_EXPORT_MODULE();



/**
 * Test a native crash
 */
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

/**
 * End an interaction
 * Required. The string ID for the interaction you want to end.
 * This string is returned when you use startInteraction().
 */
RCT_EXPORT_METHOD(endInteraction:(NSString *)interactionId) {
    [NewRelic stopCurrentInteraction:(NSString * _Null_unspecified)interactionId];
}

/**
 * VIEW_LOADING    Creating sub views, controls, and other related tasks
 * VIEW_LAYOUT    Inflation of layouts, resolving components
 * DATABASE    SQLite and other file I/O
 * IMAGE    Image loading and processing
 * JSON    JSON parsing or creation
 * NETWORK    Web service integration methods, remote resource loading
 * Create custom metrics
 */
RCT_EXPORT_METHOD(recordMetric:(NSString *)name category:(NSString *)category attrs:(NSDictionary *)attrs)
{
    NSNumber *value = attrs[@"totalValue"];
    NRMetricUnit *valueUnits = attrs[@"valueUnit"];
    NRMetricUnit *countUnits = attrs[@"countUnit"];

    [NewRelic recordMetricWithName:(NSString * _Nonnull)name category:(NSString * _Nonnull)category value:(NSNumber * _Nonnull)value valueUnits:(NRMetricUnit * _Nullable)valueUnits countUnits:(NRMetricUnit * _Nullable)countUnits];
}

/**
 * Create or update an attribute
 */
RCT_EXPORT_METHOD(setAttribute:(NSString *)name data:(NSDictionary *)data)
{
    id value = data[@"value"];
    [NewRelic setAttribute:(NSString * _Nonnull)name value:(id _Nonnull)value];
}

/**
 * This method removes the attribute specified by the name string
 */
RCT_EXPORT_METHOD(removeAttribute:(NSString *)name) {
    [NewRelic removeAttribute:(NSString * _Nonnull)name];
}

/**
 * Set custom user ID for associating sessions with events and attributes
 */
RCT_EXPORT_METHOD(addUserId:(NSString *)userId){
  [NewRelic setUserId:(NSString * _Null_unspecified)userId];
}

/**
 * Creates and records a custom event, for use in New Relic Insights
 *
 * IMPORTANT! considerations and best practices include:
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
RCT_EXPORT_METHOD(methodrecordCustomEvent:(NSString *)eventType eventName:()eventName attrs:(NSDictionary *)attrs) {
    [NewRelic recordCustomEvent:(NSString * _Nonnull)eventType name:(NSString * _Nullable)eventName attributes:(NSDictionary * _Nullable)attrs];
}

RCT_EXPORT_METHOD(noticeHttpTransaction:(NSString *)url attrs:(NSDictionary *)attrs) {
    NSString *method = attrs[@"httpMethod"];
    NSNumber *startTime = attrs[@"startTime"];
    NSNumber *endTime = attrs[@"startTime"];
    
    NRTimer *timer = [timer startTimeMillis:(double)startTime];
    
    [NewRelic noticeNetworkRequestForURL:(NSURL * _Null_unspecified)url httpMethod:(NSString * _Null_unspecified)method withTimer:(NRTimer * _Null_unspecified)timer responseHeaders:<#(NSDictionary * _Null_unspecified)#> statusCode:<#(NSInteger)#> bytesSent:<#(NSUInteger)#> bytesReceived:<#(NSUInteger)#> responseData:<#(NSData * _Null_unspecified)#> andParams:<#(NSDictionary * _Nullable)#>];
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
