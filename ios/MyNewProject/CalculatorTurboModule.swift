/**
 * NEW ARCHITECTURE (TurboModule) - iOS
 *
 * This module demonstrates the modern way of creating native modules
 * using TurboModule with CodeGen.
 *
 * Characteristics:
 * - Direct JSI (C++) calls - no JSON serialization
 * - Type-safe interface generated from TypeScript spec
 * - Lazy loading - module loaded only when first used
 * - Better performance
 * - Compile-time validation
 *
 * CodeGen automatically generates protocol definitions
 * from src/specs/NativeCalculatorTurboModule.ts
 */

import Foundation
import React

@objc(CalculatorTurboModule)
class CalculatorTurboModule: NSObject {
  
  /**
   * Add two numbers
   * Implementation of method defined in TypeScript spec
   *
   * Note: The signature must match the spec exactly
   * CodeGen ensures compile-time validation
   */
  @objc
  func add(_ a: NSNumber,
           b: NSNumber,
           resolver: @escaping RCTPromiseResolveBlock,
           rejecter: @escaping RCTPromiseRejectBlock) {
    let result = a.doubleValue + b.doubleValue
    resolver(NSNumber(value: result))
  }
  
  /**
   * Multiply two numbers
   * Type-safe implementation matching TypeScript spec
   */
  @objc
  func multiply(_ a: NSNumber,
                b: NSNumber,
                resolver: @escaping RCTPromiseResolveBlock,
                rejecter: @escaping RCTPromiseRejectBlock) {
    let result = a.doubleValue * b.doubleValue
    resolver(NSNumber(value: result))
  }
  
  /**
   * Calculate percentage
   * Direct JSI call - faster than Legacy Bridge
   */
  @objc
  func calculatePercentage(_ value: NSNumber,
                           percentage: NSNumber,
                           resolver: @escaping RCTPromiseResolveBlock,
                           rejecter: @escaping RCTPromiseRejectBlock) {
    let result = (value.doubleValue * percentage.doubleValue) / 100.0
    resolver(NSNumber(value: result))
  }
  
  /**
   * Required for module setup
   * Return false to run on background thread
   */
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
