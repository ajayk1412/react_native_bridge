package com.mynewproject

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.mynewproject.turbomodule.NativeCalculatorTurboModuleSpec

/**
 * NEW ARCHITECTURE (TurboModule)
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
 * CodeGen automatically generates NativeCalculatorTurboModuleSpec
 * from src/specs/NativeCalculatorTurboModule.ts
 */
@ReactModule(name = CalculatorTurboModule.NAME)
class CalculatorTurboModule(reactContext: ReactApplicationContext) :
    NativeCalculatorTurboModuleSpec(reactContext) {

    companion object {
        const val NAME = "CalculatorTurboModule"
    }

    override fun getName() = NAME

    /**
     * Add two numbers
     * Implementation of method defined in TypeScript spec
     * 
     * Note: The signature must match the spec exactly
     * CodeGen ensures compile-time validation
     */
    override fun add(a: Double, b: Double, promise: Promise) {
        try {
            val result = a + b
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("CALCULATION_ERROR", e.message, e)
        }
    }

    /**
     * Multiply two numbers
     * Type-safe implementation matching TypeScript spec
     */
    override fun multiply(a: Double, b: Double, promise: Promise) {
        try {
            val result = a * b
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("CALCULATION_ERROR", e.message, e)
        }
    }

    /**
     * Calculate percentage
     * Direct JSI call - faster than Legacy Bridge
     */
    override fun calculatePercentage(
        value: Double,
        percentage: Double,
        promise: Promise
    ) {
        try {
            val result = (value * percentage) / 100
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("PERCENTAGE_ERROR", e.message, e)
        }
    }
}
