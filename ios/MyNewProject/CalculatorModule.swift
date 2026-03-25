/**
 * LEGACY BRIDGE (Old Architecture) - iOS
 *
 * This module demonstrates the traditional way of creating native modules
 * using RCTBridgeModule protocol.
 *
 * Characteristics:
 * - Uses JSON serialization for data transfer
 * - All methods are asynchronous
 * - No compile-time type safety
 * - Module loaded at app startup
 */

import Foundation
import React

@objc(CalculatorModule)
class CalculatorModule: NSObject {
  
  /**
   * Promise-based addition
   * Standard async pattern in Legacy Bridge
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
   * Callback-based multiplication
   * Old-school error-first callback pattern
   */
  @objc
  func multiply(_ a: NSNumber,
                b: NSNumber,
                callback: @escaping RCTResponseSenderBlock) {
    let result = a.doubleValue * b.doubleValue
    // Callback format: [error, result]
    callback([NSNull(), NSNumber(value: result)])
  }
  
  /**
   * Calculate percentage
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
