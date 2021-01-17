#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

#import <NewRelic/NewRelic.h>

@interface RNNewRelic : NSObject <RCTBridgeModule>

- (void)reportJSException:(NSError *)error;
@end
