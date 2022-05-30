#import "RNNewRelic.h"
#import <React/RCTConvert.h>
#import <React/RCTExceptionsManager.h>

@implementation RNNewRelic

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

/**
 * Test a native crash
 */
RCT_EXPORT_METHOD(crashNow:(NSString *)message resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [NewRelic crashNow:message];
    resolve(@true);
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
        reject([exception name], [exception reason], nil);
    }
}

/**
 * End an interaction
 * Required. The string ID for the interaction you want to end.
 * This string is returned when you use startInteraction().
 */
RCT_EXPORT_METHOD(endInteraction:(NSString *)interactionId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        [NewRelic stopCurrentInteraction:(NSString * _Null_unspecified)interactionId];
        resolve(@true);
    } @catch (NSException *exception) {
        [NewRelic recordHandledException:exception];
        reject([exception name], [exception reason], nil);
    }
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
RCT_EXPORT_METHOD(recordMetric:(NSString *)category name:(NSString *)name attrs:(NSDictionary *)attrs resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSNumber *value = attrs[@"totalValue"];
        NRMetricUnit *vUnits = attrs[@"valueUnit"];
        NRMetricUnit *cUnits = attrs[@"countUnit"];
        
        [NewRelic recordMetricWithName:(NSString * _Nonnull)name category:(NSString * _Nonnull)category value:(NSNumber * _Nonnull)value valueUnits:(NRMetricUnit * _Nullable)vUnits countUnits:(NRMetricUnit * _Nullable)cUnits];        resolve(@true);
    } @catch (NSException *exception) {
        [NewRelic recordHandledException:exception];
        reject([exception name], [exception reason], nil);
    }
}

/**
 * Create or update an attribute
 */
RCT_EXPORT_METHOD(setAttribute:(NSString *)name data:(NSDictionary *)data resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        id value = data[@"value"];
        [NewRelic setAttribute:(NSString * _Nonnull)name value:(id _Nonnull)value];
        resolve(@true);
    } @catch (NSException *exception) {
        [NewRelic recordHandledException:exception];
        reject([exception name], [exception reason], nil);
    }
}

/**
 * Create or update multiple attributes
 */
RCT_EXPORT_METHOD(setAttributes:(NSDictionary *)attributes resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    @try {
        for (NSString *key in attributes) {
            if ([[attributes valueForKey:key] isKindOfClass:[NSString class]] || [[attributes valueForKey:key] isKindOfClass:[NSNumber class]] || [[attributes valueForKey:key] isKindOfClass:[[NSNumber numberWithBool:YES] class]] || [[attributes valueForKey:key] isKindOfClass:[[NSNumber numberWithBool:YES] class]]) {
                [NewRelic setAttribute:(NSString * _Nonnull)key value:(id _Nonnull)[attributes valueForKey:key]];
            }
        }
        resolve(@true);
    } @catch (NSException *exception) {
        [NewRelic recordHandledException:exception];
        reject([exception name], [exception reason], nil);
    }
}

/**
 * This method removes the attribute specified by the name string
 */
RCT_EXPORT_METHOD(removeAttribute:(NSString *)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        [NewRelic removeAttribute:(NSString * _Nonnull)name];
        resolve(@true);
    } @catch (NSException *exception) {
        [NewRelic recordHandledException:exception];
        reject([exception name], [exception reason], nil);
    }
}

/**
 * Set custom user ID for associating sessions with events and attributes
 */
RCT_EXPORT_METHOD(setUserId:(NSString *)userId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        [NewRelic setUserId:(NSString * _Null_unspecified)userId];
        resolve(@true);
    } @catch (NSException *exception) {
        [NewRelic recordHandledException:exception];
        reject([exception name], [exception reason], nil);
    }
}

/**
 * Track app activity that may be helpful for troubleshooting crashes
 */
RCT_EXPORT_METHOD(recordBreadcrumb:(NSString *)name attributes:(NSDictionary *)attributes resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    @try {
        [NewRelic recordBreadcrumb:(NSString * _Nonnull)name attributes:(NSDictionary * _Nullable)attributes];
        resolve(@true);
    } @catch (NSException *exception) {
        [NewRelic recordHandledException:exception];
        reject([exception name], [exception reason], nil);
    }
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
RCT_EXPORT_METHOD(recordCustomEvent:(NSString *)eventType eventName:(NSString *)eventName attrs:(NSDictionary *)attrs resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        [NewRelic recordCustomEvent:(NSString * _Nonnull)eventType name:(NSString * _Nullable)eventName attributes:(NSDictionary * _Nullable)attrs];
        resolve(@true);
    } @catch (NSException *exception) {
        [NewRelic recordHandledException:exception];
        reject([exception name], [exception reason], nil);
    }
}

/**
 * Record HTTP transactions at varying levels of detail
 */
RCT_EXPORT_METHOD(noticeNetworkRequest:(NSString *)url dict:(NSDictionary *)dict resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSURL *requestUrl = [RCTConvert NSURL:url];
        NSString *method = [RCTConvert NSString:dict[@"httpMethod"]];
        NSDictionary *headers = [RCTConvert NSDictionary:dict[@"responseHeader"]];
        NSInteger statusCode = [RCTConvert NSInteger:dict[@"statusCode"]];
        NSUInteger bytesSent = [RCTConvert NSUInteger:dict[@"bytesSent"]];
        NSUInteger bytesReceived = [RCTConvert NSUInteger:dict[@"bytesReceived"]];
        NSDictionary *params = [RCTConvert NSDictionary:dict[@"params"]];
        
        NSData *jsonBody = [dict[@"responseBody"] dataUsingEncoding:NSUTF8StringEncoding];
        
        NRTimer *timer = [NRTimer new];
        
        [NewRelic noticeNetworkRequestForURL:(NSURL * _Null_unspecified)requestUrl httpMethod:(NSString * _Null_unspecified)method withTimer:(NRTimer * _Null_unspecified)timer responseHeaders:(NSDictionary * _Null_unspecified)headers statusCode:(NSInteger)statusCode bytesSent:(NSUInteger)bytesSent bytesReceived:(NSUInteger)bytesReceived responseData:(NSData * _Null_unspecified)jsonBody andParams:(NSDictionary * _Nullable)params];
        resolve(@true);
    } @catch (NSException *exception) {
        [NewRelic recordHandledException:exception];
        reject([exception name], [exception reason], nil);
    }
}

/*
 * Record network failures
 */
RCT_EXPORT_METHOD(noticeNetworkFailure:(NSString *)url dict:(NSDictionary *)dict resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        NSURL *requestUrl = [RCTConvert NSURL:url];
        NSString *method = [RCTConvert NSString:dict[@"httpMethod"]];
        NSInteger statusCode = [RCTConvert NSInteger:dict[@"statusCode"]];
        NRTimer *timer = [NRTimer new];
        [NewRelic noticeNetworkFailureForURL:(NSURL * _Null_unspecified)requestUrl httpMethod:(NSString * _Null_unspecified)method withTimer:(NRTimer * _Null_unspecified)timer andFailureCode:(NSInteger)statusCode];
        resolve(@true);
    } @catch (NSException *exception) {
        [NewRelic recordHandledException:exception];
        reject([exception name], [exception reason], nil);
    }
}

/**
 * Record handled JS exception
 */
RCT_EXPORT_METHOD(recordHandledException:(NSDictionary *)jsError attributes:(NSDictionary *)attributes resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSError* e = [self pareJSErrorToNSException:jsError];
        [NewRelic recordError:(NSError * _Nonnull)e attributes:(NSDictionary * _Nullable)attributes];
        resolve(@true);
    } @catch (NSException *exception) {
        [NewRelic recordHandledException:exception];
        reject([exception name], [exception reason], nil);
    }
}

-(NSError *) pareJSErrorToNSException:(NSDictionary *)jsError {
    NSString *message = [RCTConvert NSString:jsError[@"message"]];
    NSArray<NSDictionary *> *stack = [RCTConvert NSDictionaryArray:jsError[@"stack"]];
    NSString *description = [@"Uncaught JS Exception: " stringByAppendingString:message];
    NSDictionary *errorInfo = @{NSLocalizedDescriptionKey : description, RCTJSStackTraceKey : stack};
    NSError *error = [NSError errorWithDomain:RCTErrorDomain code:0 userInfo:errorInfo];
    
    return error;
}


@end
