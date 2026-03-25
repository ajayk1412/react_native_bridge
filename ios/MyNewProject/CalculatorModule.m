/**
 * LEGACY BRIDGE - Objective-C Bridge File
 * 
 * This file exports Swift methods to React Native's bridge.
 * Required for Legacy Bridge to work with Swift.
 */

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalculatorModule, NSObject)

/**
 * Export add method with Promise
 */
RCT_EXTERN_METHOD(add:(nonnull NSNumber *)a
                  b:(nonnull NSNumber *)b
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

/**
 * Export multiply method with Callback
 */
RCT_EXTERN_METHOD(multiply:(nonnull NSNumber *)a
                  b:(nonnull NSNumber *)b
                  callback:(RCTResponseSenderBlock)callback)

/**
 * Export calculatePercentage method
 */
RCT_EXTERN_METHOD(calculatePercentage:(nonnull NSNumber *)value
                  percentage:(nonnull NSNumber *)percentage
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
