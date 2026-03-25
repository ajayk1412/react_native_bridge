# Troubleshooting Guide

Common issues and solutions for React Native Bridge implementations.

## ✅ Fixed: TurboModule Build Error

### Problem
After integrating TurboModule, Android build fails with:
```
UnsupportedModulePropertyParserError: TypeScript interfaces extending TurboModule 
must only contain 'FunctionTypeAnnotation's. Property 'PI' refers to a 'TSNumberKeyword'.
```

### Cause
CodeGen doesn't support `readonly` properties (constants) in TurboModule TypeScript specs.

### Solution
**DON'T** declare constants in the TypeScript spec:
```typescript
// ❌ WRONG - This causes build error
export interface Spec extends TurboModule {
  readonly PI: number;  // CodeGen doesn't support this!
  add(a: number, b: number): Promise<number>;
}
```

**DO** only include methods in the spec, and handle constants in native code:
```typescript
// ✅ CORRECT - Only methods in the spec
export interface Spec extends TurboModule {
  add(a: number, b: number): Promise<number>;
  // Constants are handled natively, not in the spec
}
```

**Native Implementation (Android):**
```kotlin
override fun getConstants(): MutableMap<String, Any> {
    return hashMapOf(
        "PI" to 3.14159,
        "E" to 2.71828
    )
}
```

**Native Implementation (iOS):**
```swift
@objc
func constantsToExport() -> [AnyHashable : Any]! {
    return [
      "PI": 3.14159,
      "E": 2.71828
    ]
}
```

**JavaScript Usage:**
```typescript
import { NativeModules } from 'react-native';
const { CalculatorTurboModule } = NativeModules;

// Access constants
const constants = CalculatorTurboModule.getConstants();
console.log(constants.PI);  // 3.14159
```

---

## 🔧 Other Common Issues

### 1. Module Not Found Error

**Error:**
```
Cannot read property 'CalculatorModule' of undefined
```

**Solution:**
```bash
# Android
cd android && ./gradlew clean
npm run android

# iOS  
cd ios && rm -rf build
npm run ios
```

### 2. CodeGen Not Running

**Error:**
```
Cannot find module 'NativeCalculatorTurboModuleSpec'
```

**Checklist:**
1. ✅ Verify `codegenConfig` in `package.json`:
   ```json
   {
     "codegenConfig": {
       "name": "MyNewProjectSpec",
       "type": "modules",
       "jsSrcsDir": "src/specs"
     }
   }
   ```

2. ✅ Check TypeScript spec file exists:
   ```
   src/specs/NativeCalculatorTurboModule.ts
   ```

3. ✅ Clean and rebuild:
   ```bash
   cd android && ./gradlew clean
   npm run android
   ```

### 3. Type Mismatch Errors

**Error:**
```
'add' overrides nothing
```

**Cause:** Native implementation doesn't match TypeScript spec.

**Solution:** Ensure exact match:

**TypeScript Spec:**
```typescript
add(a: number, b: number): Promise<number>;
```

**Android (must match!):**
```kotlin
override fun add(a: Double, b: Double, promise: Promise) {
    promise.resolve(a + b)
}
```

**iOS (must match!):**
```swift
@objc
func add(_ a: NSNumber, b: NSNumber,
         resolver: @escaping RCTPromiseResolveBlock,
         rejecter: @escaping RCTPromiseRejectBlock) {
    resolver(NSNumber(value: a.doubleValue + b.doubleValue))
}
```

### 4. Legacy Bridge Deprecation Warnings

**Warning:**
```
'createNativeModules' overrides deprecated member
```

**Solution:** These are warnings, not errors. Your code will still work. To fix:

```kotlin
@Suppress("DEPRECATION")
override fun createNativeModules(
    reactContext: ReactApplicationContext
): List<NativeModule> {
    return listOf(CalculatorModule(reactContext))
}
```

### 5. TurboReactPackage Deprecation

**Warning:**
```
'class TurboReactPackage' is deprecated. Use BaseReactPackage instead.
```

**Current (works but deprecated):**
```kotlin
class CalculatorTurboPackage : TurboReactPackage() {
    // ...
}
```

**Updated (recommended):**
```kotlin
class CalculatorTurboPackage : BaseReactPackage() {
    // Implementation remains the same
}
```

---

## 📝 TurboModule Spec Guidelines

### ✅ What CodeGen Supports

1. **Methods with Promises:**
   ```typescript
   myMethod(param: string): Promise<string>;
   ```

2. **Methods with Callbacks:**
   ```typescript
   myMethod(param: string, callback: (error: string | null, result: string | null) => void): void;
   ```

3. **Void Methods:**
   ```typescript
   logMessage(message: string): void;
   ```

4. **Event Emitters:**
   ```typescript
   // Must be non-nullable
   myEventEmitter: EventEmitter<{ onEvent: () => void }>;
   ```

### ❌ What CodeGen Doesn't Support

1. **Readonly Properties (Constants):**
   ```typescript
   // ❌ Don't do this
   readonly PI: number;
   ```

2. **Synchronous Return Values:**
   ```typescript
   // ❌ Don't do this (except in native code)
   getValueSync(): string;
   ```

3. **Optional Parameters:**
   ```typescript
   // ❌ Don't do this
   myMethod(required: string, optional?: string): Promise<void>;
   ```

4. **Union Types:**
   ```typescript
   // ❌ Don't do this
   myMethod(param: string | number): Promise<void>;
   ```

---

## 🐛 Debugging Tips

### 1. Check Generated Files

**Android:**
```bash
find android/app/build/generated -name "*YourModule*"
```

**Generated file location:**
```
android/app/build/generated/source/codegen/java/com/yourapp/turbomodule/
```

### 2. Verify Package Registration

**Android (MainApplication.kt):**
```kotlin
PackageList(this).packages.apply {
    add(CalculatorPackage())         // Legacy
    add(CalculatorTurboPackage())    // TurboModule
}
```

### 3. Check Module Name Consistency

All these must match exactly:
- TypeScript: `TurboModuleRegistry.getEnforcing<Spec>('CalculatorTurboModule')`
- Android: `const val NAME = "CalculatorTurboModule"`
- iOS: `@objc(CalculatorTurboModule)`

### 4. View Full Build Output

```bash
cd android
./gradlew :app:assembleDebug --stacktrace --info
```

---

## 📚 Resources

- [React Native CodeGen](https://reactnative.dev/docs/the-new-architecture/pillars-codegen)
- [TurboModules Guide](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)
- [Migration Guide](https://reactnative.dev/docs/new-architecture-intro)

---

## 💡 Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Constants in spec | Remove from spec, add to `getConstants()` |
| Module not found | Clean build (`gradlew clean`) |
| Type mismatch | Match spec exactly in native code |
| CodeGen not running | Check `codegenConfig` in `package.json` |
| Deprecation warnings | Add `@Suppress` or update to new API |

---

**Remember:** TurboModule specs should only contain method signatures. Constants, properties, and advanced types are handled in native code!
