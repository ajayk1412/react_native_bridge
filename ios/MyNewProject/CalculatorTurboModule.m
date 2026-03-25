/**
 * NEW ARCHITECTURE - Objective-C Bridge File
 *
 * This file exports Swift methods to React Native's TurboModule system.
 * Works with CodeGen-generated protocols.
 */

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalculatorTurboModule, NSObject)

/**
 * Export add method
 * Must match TypeScript spec signature
 */
RCT_EXTERN_METHOD(add:(nonnull NSNumber *)a
                  b:(nonnull NSNumber *)b
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

/**
 * Export multiply method
 * Must match TypeScript spec signature
 */
RCT_EXTERN_METHOD(multiply:(nonnull NSNumber *)a
                  b:(nonnull NSNumber *)b
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

/**
 * Export calculatePercentage method
 * Must match TypeScript spec signature
 */
RCT_EXTERN_METHOD(calculatePercentage:(nonnull NSNumber *)value
                  percentage:(nonnull NSNumber *)percentage
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
