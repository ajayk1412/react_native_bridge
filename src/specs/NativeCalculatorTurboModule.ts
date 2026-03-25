/**
 * NEW ARCHITECTURE (TurboModule)
 * TypeScript Specification
 * 
 * This spec file is used by CodeGen to automatically generate:
 * - Android: NativeCalculatorTurboModuleSpec.java (abstract base class)
 * - iOS: Protocol definitions and C++ JSI bindings
 * 
 * Benefits:
 * - Compile-time type safety
 * - Auto-generated native interfaces
 * - IDE auto-completion
 * - Catches type mismatches before runtime
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Add two numbers
   * @param a First number
   * @param b Second number
   * @returns Promise with sum
   */
  add(a: number, b: number): Promise<number>;

  /**
   * Multiply two numbers
   * @param a First number
   * @param b Second number
   * @returns Promise with product
   */
  multiply(a: number, b: number): Promise<number>;

  /**
   * Calculate percentage of a value
   * @param value Base value
   * @param percentage Percentage to calculate
   * @returns Promise with calculated percentage
   */
  calculatePercentage(value: number, percentage: number): Promise<number>;
}

/**
 * Register and export the TurboModule
 * getEnforcing throws if module is not found (type-safe)
 */
export default TurboModuleRegistry.getEnforcing<Spec>(
  'CalculatorTurboModule'
);
