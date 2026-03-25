# React Native Bridge: Old vs New Architecture

A comprehensive comparison of Legacy Bridge and New Architecture (TurboModules) implementations.

## 📚 Table of Contents

1. [Overview](#overview)
2. [Architecture Differences](#architecture-differences)
3. [Android Implementation](#android-implementation)
4. [iOS Implementation](#ios-implementation)
5. [JavaScript Usage](#javascript-usage)
6. [Key Differences](#key-differences)

---

## Overview

### Old Architecture (Legacy Bridge)
- **JSON-based communication** between JavaScript and Native
- **Asynchronous by default** - all calls go through the bridge
- **Module loading** - All native modules loaded at startup
- **Manual type checking** - No compile-time type safety

### New Architecture (TurboModules with JSI)
- **Direct C++ JSI bridge** - No JSON serialization
- **Synchronous capable** - Direct method calls possible
- **Lazy loading** - Modules loaded only when needed
- **Type-safe** - CodeGen generates type-safe interfaces

---

## Architecture Differences

```
OLD ARCHITECTURE (Legacy Bridge)
┌──────────────┐
│  JavaScript  │
└──────┬───────┘
       │ JSON serialization
       ▼
┌──────────────┐
│ Bridge Queue │ (Async, batched)
└──────┬───────┘
       │ Deserialize
       ▼
┌──────────────┐
│    Native    │
└──────────────┘

- Slower (JSON overhead)
- Always async
- All modules loaded at startup
```

```
NEW ARCHITECTURE (JSI/TurboModules)
┌──────────────┐
│  JavaScript  │
└──────┬───────┘
       │ Direct C++ call
       ▼
┌──────────────┐
│  JSI Layer   │ (Direct, type-safe)
└──────┬───────┘
       │ No serialization
       ▼
┌──────────────┐
│    Native    │
└──────────────┘

- Faster (no JSON)
- Can be sync or async
- Lazy loading
- Type-safe with CodeGen
```

---

## Android Implementation

### 1. Legacy Bridge (Old Architecture)

**CalendarModule.kt**
```kotlin
package com.mynewproject

import com.facebook.react.bridge.*

class CalendarModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "CalendarModule"

    // Promise-based method
    @ReactMethod
    fun createEvent(name: String, location: String, promise: Promise) {
        try {
            val eventId = createCalendarEvent(name, location)
            promise.resolve(eventId)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message, e)
        }
    }

    // Callback-based method
    @ReactMethod
    fun getEvent(eventId: Int, callback: Callback) {
        val event = mapOf(
            "id" to eventId,
            "name" to "Sample Event",
            "location" to "Sample Location"
        )
        callback.invoke(null, Arguments.makeNativeMap(event))
    }

    private fun createCalendarEvent(name: String, location: String): Int {
        // Implementation
        return 123
    }
}
```

**CalendarPackage.kt**
```kotlin
package com.mynewproject

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class CalendarPackage : ReactPackage {
    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): List<NativeModule> {
        return listOf(CalendarModule(reactContext))
    }

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): List<ViewManager<*, *>> {
        return emptyList()
    }
}
```

**Register in MainApplication.kt:**
```kotlin
override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
        context = applicationContext,
        packageList = PackageList(this).packages.apply {
            add(CalendarPackage())
        },
    )
}
```

---

### 2. New Architecture (TurboModule)

**Step 1: TypeScript Spec (src/specs/NativeCalendarModule.ts)**
```typescript
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    createEvent(name: string, location: string): Promise<number>;
    getEvent(eventId: number): Promise<Object>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('CalendarModule');
```

**Step 2: CalendarTurboModule.kt**
```kotlin
package com.mynewproject

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.mynewproject.turbomodule.NativeCalendarModuleSpec

@ReactModule(name = CalendarTurboModule.NAME)
class CalendarTurboModule(reactContext: ReactApplicationContext) :
    NativeCalendarModuleSpec(reactContext) {

    companion object {
        const val NAME = "CalendarModule"
    }

    override fun getName() = NAME

    // Type-safe implementation from generated spec
    override fun createEvent(name: String, location: String, promise: Promise) {
        try {
            val eventId = createCalendarEvent(name, location)
            promise.resolve(eventId.toDouble())
        } catch (e: Exception) {
            promise.reject("ERROR", e.message, e)
        }
    }

    override fun getEvent(eventId: Double, promise: Promise) {
        val event = Arguments.createMap().apply {
            putInt("id", eventId.toInt())
            putString("name", "Sample Event")
            putString("location", "Sample Location")
        }
        promise.resolve(event)
    }

    private fun createCalendarEvent(name: String, location: String): Int {
        return 123
    }
}
```

**Step 3: CalendarTurboPackage.kt**
```kotlin
package com.mynewproject

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class CalendarTurboPackage : TurboReactPackage() {
    
    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext
    ): NativeModule? {
        return when (name) {
            CalendarTurboModule.NAME -> CalendarTurboModule(reactContext)
            else -> null
        }
    }

    override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
        mapOf(
            CalendarTurboModule.NAME to ReactModuleInfo(
                CalendarTurboModule.NAME,
                CalendarTurboModule.NAME,
                false, // canOverrideExistingModule
                false, // needsEagerInit
                false, // hasConstants
                false, // isCxxModule
                true   // isTurboModule
            )
        )
    }
}
```

**Step 4: Add to package.json**
```json
{
  "codegenConfig": {
    "name": "MyNewProjectSpec",
    "type": "modules",
    "jsSrcsDir": "src/specs",
    "android": {
      "javaPackageName": "com.mynewproject.turbomodule"
    }
  }
}
```

---

## iOS Implementation

### 1. Legacy Bridge (Old Architecture)

**CalendarModule.swift**
```swift
import Foundation
import React

@objc(CalendarModule)
class CalendarModule: NSObject {
  
  // Promise-based method
  @objc
  func createEvent(_ name: String,
                   location: String,
                   resolver: @escaping RCTPromiseResolveBlock,
                   rejecter: @escaping RCTPromiseRejectBlock) {
    do {
      let eventId = try createCalendarEvent(name: name, location: location)
      resolver(eventId)
    } catch {
      rejecter("ERROR", error.localizedDescription, error)
    }
  }
  
  // Callback-based method
  @objc
  func getEvent(_ eventId: NSNumber,
                callback: @escaping RCTResponseSenderBlock) {
    let event: [String: Any] = [
      "id": eventId,
      "name": "Sample Event",
      "location": "Sample Location"
    ]
    callback([NSNull(), event])
  }
  
  private func createCalendarEvent(name: String, location: String) throws -> Int {
    return 123
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
```

**CalendarModule.m (Objective-C Bridge)**
```objc
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalendarModule, NSObject)

RCT_EXTERN_METHOD(createEvent:(NSString *)name
                  location:(NSString *)location
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getEvent:(nonnull NSNumber *)eventId
                  callback:(RCTResponseSenderBlock)callback)

@end
```

---

### 2. New Architecture (TurboModule)

**CalendarTurboModule.swift**
```swift
import Foundation
import React

@objc(CalendarModule)
class CalendarTurboModule: NSObject {
  
  // Type-safe implementation matching spec
  @objc
  func createEvent(_ name: String,
                   location: String,
                   resolver: @escaping RCTPromiseResolveBlock,
                   rejecter: @escaping RCTPromiseRejectBlock) {
    do {
      let eventId = try createCalendarEvent(name: name, location: location)
      resolver(NSNumber(value: eventId))
    } catch {
      rejecter("ERROR", error.localizedDescription, error)
    }
  }
  
  @objc
  func getEvent(_ eventId: NSNumber,
                resolver: @escaping RCTPromiseResolveBlock,
                rejecter: @escaping RCTPromiseRejectBlock) {
    let event: [String: Any] = [
      "id": eventId,
      "name": "Sample Event",
      "location": "Sample Location"
    ]
    resolver(event)
  }
  
  private func createCalendarEvent(name: String, location: String) throws -> Int {
    return 123
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
```

**CalendarTurboModule.m**
```objc
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalendarModule, NSObject)

RCT_EXTERN_METHOD(createEvent:(NSString *)name
                  location:(NSString *)location
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getEvent:(nonnull NSNumber *)eventId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
```

---

## JavaScript Usage

### Legacy Bridge

```typescript
import { NativeModules } from 'react-native';

const { CalendarModule } = NativeModules;

// Promise-based
const eventId = await CalendarModule.createEvent('Party', 'My House');

// Callback-based
CalendarModule.getEvent(123, (error, event) => {
  if (error) {
    console.error(error);
  } else {
    console.log(event);
  }
});
```

### New Architecture (TurboModule)

```typescript
import NativeCalendarModule from './src/specs/NativeCalendarModule';

// Type-safe with auto-completion
const eventId: number = await NativeCalendarModule.createEvent('Party', 'My House');

const event: Object = await NativeCalendarModule.getEvent(123);
```

---

## Key Differences

| Feature | Legacy Bridge | TurboModules |
|---------|--------------|--------------|
| **Communication** | JSON serialization | Direct JSI (C++) |
| **Speed** | Slower | Faster |
| **Loading** | All modules at startup | Lazy loading |
| **Type Safety** | Runtime only | Compile-time |
| **Synchronous** | Not possible | Possible |
| **Code Generation** | Manual | CodeGen from TypeScript |
| **Base Class** | ReactContextBaseJavaModule | TurboModule Spec |
| **Package Type** | ReactPackage | TurboReactPackage |
| **Auto-completion** | Limited | Full IDE support |

---

## Performance Comparison

```
Operation: Call native method 1000 times

Legacy Bridge:
- JSON serialization: ~50ms
- Bridge queue: ~30ms
- Total: ~80ms per 1000 calls

TurboModule (JSI):
- Direct call: ~5ms
- No serialization overhead
- Total: ~5ms per 1000 calls

Result: TurboModules are ~16x faster
```

---

## Migration Path

### From Legacy to TurboModule:

1. **Create TypeScript Spec**
   ```typescript
   // src/specs/NativeMyModule.ts
   export interface Spec extends TurboModule {
     myMethod(param: string): Promise<string>;
   }
   ```

2. **Add codegenConfig to package.json**
   ```json
   {
     "codegenConfig": {
       "name": "MyAppSpec",
       "type": "modules",
       "jsSrcsDir": "src/specs"
     }
   }
   ```

3. **Update Native Implementation**
   - Android: Extend generated `Spec` class
   - iOS: Match TypeScript interface

4. **Build** - CodeGen runs automatically

---

## Best Practices

### Legacy Bridge
✅ Use for backward compatibility  
✅ Simple, well-understood pattern  
❌ Performance bottleneck for intensive operations

### TurboModules
✅ Use for new projects  
✅ Better performance  
✅ Type-safe development  
❌ Requires New Architecture enabled  
❌ Learning curve

---

## Summary

**Choose Legacy Bridge when:**
- Supporting older React Native versions (<0.68)
- Simple, infrequent native calls
- No performance concerns

**Choose TurboModules when:**
- Building new apps (RN 0.68+)
- Performance is critical
- Want type safety and better DX
- Ready to adopt New Architecture

---

## Resources

- [React Native Docs](https://reactnative.dev/)
- [New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [TurboModules](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)
- [CodeGen](https://reactnative.dev/docs/the-new-architecture/pillars-codegen)
