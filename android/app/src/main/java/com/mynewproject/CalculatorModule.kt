package com.mynewproject

import com.facebook.react.bridge.*

/**
 * LEGACY BRIDGE (Old Architecture)
 * 
 * This module demonstrates the traditional way of creating native modules
 * using ReactContextBaseJavaModule.
 * 
 * Characteristics:
 * - Uses JSON serialization for data transfer
 * - All methods are asynchronous
 * - No compile-time type safety
 * - Module loaded at app startup
 */
class CalculatorModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "CalculatorModule"

    /**
     * Promise-based addition
     * Standard async pattern in Legacy Bridge
     */
    @ReactMethod
    fun add(a: Double, b: Double, promise: Promise) {
        try {
            val result = a + b
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("CALCULATION_ERROR", e.message, e)
        }
    }

    /**
     * Callback-based multiplication
     * Old-school error-first callback pattern
     */
    @ReactMethod
    fun multiply(a: Double, b: Double, callback: Callback) {
        try {
            val result = a * b
            // Callback format: (error, result)
            callback.invoke(null, result)
        } catch (e: Exception) {
            callback.invoke(e.message, null)
        }
    }

    /**
     * Calculate percentage
     */
    @ReactMethod
    fun calculatePercentage(value: Double, percentage: Double, promise: Promise) {
        try {
            val result = (value * percentage) / 100
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("PERCENTAGE_ERROR", e.message, e)
        }
    }
}
