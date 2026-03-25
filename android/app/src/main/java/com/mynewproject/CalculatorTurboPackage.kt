package com.mynewproject

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

/**
 * NEW ARCHITECTURE PACKAGE (TurboReactPackage)
 * 
 * Key differences from ReactPackage:
 * - Supports lazy loading (modules loaded on-demand)
 * - Provides module metadata for React Native
 * - isTurboModule flag enables JSI bridge
 */
class CalculatorTurboPackage : TurboReactPackage() {
    
    /**
     * Get module by name (lazy loading)
     * Only called when JavaScript first accesses the module
     */
    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext
    ): NativeModule? {
        return when (name) {
            CalculatorTurboModule.NAME -> CalculatorTurboModule(reactContext)
            else -> null
        }
    }

    /**
     * Provide module metadata
     * This information is used by React Native's module system
     */
    override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
        mapOf(
            CalculatorTurboModule.NAME to ReactModuleInfo(
                /* name= */ CalculatorTurboModule.NAME,
                /* className= */ CalculatorTurboModule.NAME,
                /* canOverrideExistingModule= */ false,
                /* needsEagerInit= */ false,
                /* hasConstants= */ true,
                /* isCxxModule= */ false,
                /* isTurboModule= */ true  // 🔥 This enables JSI/TurboModule!
            )
        )
    }
}
