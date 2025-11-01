# FFmpeg Kit 16KB Page Size Setup - Complete Reference Notes

## Problem Statement

React Native 0.76+ requires Android libraries to support 16KB page size (Android 15+), but the official `ffmpeg-kit-react-native` package:
- Is deprecated
- No Maven artifacts support 16KB page size
- Building an AAR module that depends on another local AAR causes Gradle error: "Direct local .aar file dependencies are not supported when building an AAR"

## Solution Overview

Build a custom 16KB-compatible FFmpeg Kit AAR from source and configure Gradle to properly handle local AAR dependencies in a React Native library module.

---

## Step 1: Build 16KB Compatible FFmpeg Kit AAR

### 1.1 Clone the Repository

```bash
git clone https://github.com/moizhassankh/ffmpeg-kit-android-16KB.git
cd ffmpeg-kit-android-16KB
```

### 1.2 Build the AAR

```bash
cd android
./gradlew :ffmpeg-kit-android-lib:assembleRelease
```

**Build Time:** 15-30 minutes (compiles FFmpeg from source)

**Output Location:** `android/ffmpeg-kit-android-lib/build/outputs/aar/ffmpegkit-release.aar`

**File Size:** ~35-40 MB

---

## Step 2: Set Up React Native Wrapper

### 2.1 Copy React Native Module

From the repository root:

```bash
cp -r react-native /path/to/your/project/ffmpeg-kit-react-native
```

### 2.2 Create libs Directory

```bash
mkdir -p /path/to/your/project/ffmpeg-kit-react-native/android/libs
```

### 2.3 Copy Built Files

Copy the AAR and required JAR dependencies:

```bash
# Copy AAR (rename to ffmpeg-kit-release.aar)
cp android/ffmpeg-kit-android-lib/build/outputs/aar/ffmpegkit-release.aar \
   /path/to/your/project/ffmpeg-kit-react-native/android/libs/ffmpeg-kit-release.aar

# Copy JAR dependencies (if they exist in the build)
# These are typically found in the AAR or need to be extracted
# smart-exception-common-0.2.0.jar
# smart-exception-java-0.2.0.jar
```

---

## Step 3: Configure Library Module Build Script

**File:** `ffmpeg-kit-react-native/android/build.gradle`

### Key Configuration

```gradle
repositories {
  mavenCentral()
  google()
  
  // Define flatDir for local AAR files
  flatDir {
    dirs 'libs'
  }
  
  // ... React Native repository configuration
}

dependencies {
  api 'com.facebook.react:react-native:+'
  
  // CRITICAL: Use compileOnly, not api or implementation
  // This allows compilation without packaging the AAR inside another AAR
  compileOnly fileTree(dir: 'libs', include: ['*.aar', '*.jar'])
}
```

### Why compileOnly?

- **The Problem:** Library modules (that produce AARs) cannot package other local AARs as dependencies
- **The Solution:** `compileOnly` tells Gradle: "I need these files to compile, but don't try to package them"
- **The Result:** The app module (final APK) is responsible for including the actual AAR at runtime

### What NOT to Use

❌ **Don't use these - they will fail:**

```gradle
// These cause "Direct local .aar dependencies not supported" error:
api files('libs/ffmpeg-kit-release.aar')
api(name: 'ffmpeg-kit-release', ext: 'aar')
implementation files('libs/ffmpeg-kit-release.aar')
implementation(name: 'ffmpeg-kit-release', ext: 'aar')

// This causes transitive dependency resolution errors:
api fileTree(dir: 'libs', include: ['*.jar'])
```

---

## Step 4: Configure App Module

### 4.1 Copy Files to App Module

```bash
mkdir -p android/app/libs

# Copy AAR
cp ffmpeg-kit-react-native/android/libs/ffmpeg-kit-release.aar android/app/libs/

# Copy JARs
cp ffmpeg-kit-react-native/android/libs/smart-exception-*.jar android/app/libs/
```

### 4.2 Update android/app/build.gradle

```gradle
android {
    // ... your existing android configuration
}

// Add repositories block to tell Gradle where to find local AARs
repositories {
    flatDir {
        dirs 'libs'
    }
}

dependencies {
    // The version of react-native is set by the React Native Gradle Plugin
    implementation("com.facebook.react:react-android")

    // Link the React Native wrapper module
    implementation project(':ffmpeg-kit-react-native')
    
    // Provide the actual AAR at runtime
    implementation(name: 'ffmpeg-kit-release', ext: 'aar')
    
    // Provide JAR dependencies
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    // Or explicitly:
    // implementation files('libs/smart-exception-common-0.2.0.jar')
    // implementation files('libs/smart-exception-java-0.2.0.jar')

    // ... rest of your dependencies
}
```

---

## Step 5: Install the Package

### Option A: Local Package

```bash
npm install ./ffmpeg-kit-react-native
# or
yarn add file:./ffmpeg-kit-react-native
```

### Option B: package.json

```json
{
  "dependencies": {
    "ffmpeg-kit-react-native": "file:./ffmpeg-kit-react-native"
  }
}
```

---

## Step 6: Persist Changes with patch-package

Since you're modifying files in `node_modules`:

### 6.1 Install patch-package

```bash
npm install patch-package --save-dev
```

### 6.2 Add postinstall Script

**In package.json:**

```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

### 6.3 Create Patch

```bash
npx patch-package ffmpeg-kit-react-native
```

This creates a `patches/` directory with your modifications that will be automatically applied after every `npm install`.

---

## Step 7: Build and Test

### Clean Build

```bash
cd android
./gradlew clean
./gradlew --stop
cd ..

# Remove build artifacts
rm -rf android/app/build
rm -rf android/build
rm -rf node_modules/ffmpeg-kit-react-native/android/build
```

### Build

```bash
npx react-native run-android
# or for Expo
npx expo run:android
```

---

## Final Project Structure

```
your-react-native-project/
├── android/
│   ├── app/
│   │   ├── build.gradle                 (modified: added flatDir + implementations)
│   │   └── libs/
│   │       ├── ffmpeg-kit-release.aar   (~35-40 MB)
│   │       ├── smart-exception-common-0.2.0.jar
│   │       └── smart-exception-java-0.2.0.jar
│   ├── build.gradle
│   └── settings.gradle
├── ffmpeg-kit-react-native/             (local package)
│   ├── android/
│   │   ├── build.gradle                 (modified: compileOnly dependencies)
│   │   ├── libs/
│   │   │   ├── ffmpeg-kit-release.aar
│   │   │   ├── smart-exception-common-0.2.0.jar
│   │   │   └── smart-exception-java-0.2.0.jar
│   │   └── src/
│   ├── ios/
│   ├── src/
│   └── package.json
├── node_modules/
│   └── ffmpeg-kit-react-native/         (symlink to local package)
├── patches/
│   └── ffmpeg-kit-react-native+6.0.2.patch
├── package.json
└── ...
```

---

## Key Concepts Explained

### Understanding AAR Packaging

**What is an AAR?**
- Android Archive format for Android libraries
- Contains: compiled code (classes.jar), resources, native libraries (.so), manifest

**The Limitation:**
- An AAR **cannot** package another AAR inside it
- This is by design in Android's build system
- Nested AARs would create broken libraries with missing classes and resources

### The Dependency Chain

```
Final APK (app module)
    ↓
ffmpeg-kit-react-native (library module - produces AAR)
    ↓
ffmpeg-kit-release.aar (cannot be packaged inside library AAR)
```

### Our Solution

```
Final APK (app module)
    ├─→ ffmpeg-kit-react-native (provides React Native bridge)
    └─→ ffmpeg-kit-release.aar (directly included in APK)
```

**How it works:**
1. Library module uses `compileOnly` - compiles against the AAR but doesn't package it
2. App module uses `implementation` - actually includes the AAR in the final APK
3. Both modules can compile successfully, and the APK contains everything needed

### compileOnly vs api vs implementation

| Scope | Compile Time | Package in AAR | Transitive | Use Case |
|-------|-------------|----------------|------------|----------|
| `compileOnly` | ✅ Yes | ❌ No | ❌ No | Library needs to compile but won't package dependency |
| `implementation` | ✅ Yes | ✅ Yes | ❌ No | Standard dependency for app modules |
| `api` | ✅ Yes | ✅ Yes | ✅ Yes | Exposes dependency to consumers |

**For our case:**
- **Library module:** `compileOnly` - compile against AAR, don't package it
- **App module:** `implementation` - include AAR in final APK

---

## Common Errors and Solutions

### Error 1: "Direct local .aar file dependencies are not supported"

**Cause:** Library module trying to package local AAR

**Solution:** Use `compileOnly` instead of `api` or `implementation` in library's build.gradle

```gradle
// ❌ Wrong
api files('libs/ffmpeg-kit-release.aar')

// ✅ Correct
compileOnly fileTree(dir: 'libs', include: ['*.aar'])
```

### Error 2: "Could not find :ffmpeg-kit-release:"

**Cause:** App module can't find the AAR file

**Solutions:**
1. Add `flatDir` repository to app's build.gradle
2. Verify AAR file exists in `android/app/libs/`
3. Check AAR filename matches (e.g., `ffmpeg-kit-release` not `ffmpeg-kit-full`)

```gradle
repositories {
    flatDir {
        dirs 'libs'
    }
}
```

### Error 3: "Could not find com.arthenica:smart-exception-java"

**Cause:** Gradle trying to resolve JAR as Maven dependency

**Solution:** Use local file references instead

```gradle
// ❌ Wrong (if no Maven artifact exists)
implementation 'com.arthenica:smart-exception-java:0.2.0'

// ✅ Correct
implementation files('libs/smart-exception-java-0.2.0.jar')
```

### Error 4: "Duplicate class" or "Multiple dex files"

**Cause:** AAR/JAR included in multiple places

**Solutions:**
1. Ensure files are only in `android/app/libs/`
2. Use `compileOnly` in library module
3. Use `implementation` only in app module

### Error 5: Native library crashes at runtime

**Cause:** .so files conflicts or missing

**Solution:** Add packaging options to app's build.gradle

```gradle
android {
    packagingOptions {
        pickFirst '**/*.so'
        pickFirst 'lib/*/libc++_shared.so'
    }
}
```

---

## Testing Your Implementation

### Basic Test Code

```javascript
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';

const testFFmpeg = async () => {
  try {
    const session = await FFmpegKit.execute('-version');
    const returnCode = await session.getReturnCode();
    
    if (ReturnCode.isSuccess(returnCode)) {
      console.log('✅ FFmpeg Kit is working!');
      const output = await session.getOutput();
      console.log('Version:', output);
    } else {
      console.log('❌ FFmpeg command failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testFFmpeg();
```

---

## Build Checklist

Before building:

- [ ] AAR file exists in `android/app/libs/` (~35-40 MB)
- [ ] JAR files exist in `android/app/libs/`
- [ ] Library module uses `compileOnly` for AAR and JARs
- [ ] App module has `flatDir` repository defined
- [ ] App module uses `implementation` for AAR and JARs
- [ ] AAR filename matches in implementation statement
- [ ] All previous builds cleaned (`./gradlew clean`)

---

## Performance Notes

### APK Size Impact
- FFmpeg Kit adds **~35-40 MB** to your APK
- Use Android App Bundle (AAB) for Play Store to reduce download size
- Consider building minimal FFmpeg with only needed codecs

### Runtime Performance
- 16KB page size version performs comparably or better on modern devices
- Best performance on devices with 6GB+ RAM
- Older devices with 2-4GB RAM may see slight improvements

---

## Maintenance

### When to Rebuild
- React Native major version updates
- Android NDK version changes
- New FFmpeg features needed
- Security updates

### Keeping Updated
- Check [moizhassankh/ffmpeg-kit-android-16KB](https://github.com/moizhassankh/ffmpeg-kit-android-16KB) for updates
- Test thoroughly after any React Native upgrade
- Monitor crash reports for native library issues

### Version Control
- ✅ Commit: `patches/` directory (patch-package changes)
- ✅ Commit: `ffmpeg-kit-react-native/` directory (local package)
- ❌ Don't commit: AAR/JAR files if > 100MB (use Git LFS or download script)
- ✅ Commit: Setup documentation and build notes

---

## Alternative Approaches (Why We Didn't Use Them)

### 1. Using Maven Dependencies
**Why not:** No official 16KB-compatible builds on Maven Central

### 2. Extracting AAR Contents Manually
**Why not:** Complex, error-prone, hard to maintain; requires manually extracting JARs, .so files, and resources

### 3. Downgrading Android Gradle Plugin
**Why not:** Loses compatibility with React Native 0.76+ and modern Android tooling; not a long-term solution

### 4. Making Library an Application Module
**Why not:** Hacky workaround; breaks the library paradigm; causes issues with module dependencies

---

## Resources

### Official Documentation
- [Android 16KB Page Size](https://developer.android.com/guide/practices/page-sizes)
- [React Native 0.76+ Requirements](https://reactnative.dev/blog)
- [Gradle Declaring Repositories](https://docs.gradle.org/current/userguide/declaring_repositories.html)

### Community Resources
- [16KB Compatible Fork](https://github.com/moizhassankh/ffmpeg-kit-android-16KB)
- [Original FFmpeg Kit](https://github.com/arthenica/ffmpeg-kit)
- [patch-package Documentation](https://github.com/ds300/patch-package)

---

## Troubleshooting Commands

```bash
# Check AAR file exists and size
ls -lh android/app/libs/ffmpeg-kit-release.aar

# Find all build.gradle files
find android -name "build.gradle" -type f

# Check dependencies tree
cd android && ./gradlew app:dependencies --configuration debugRuntimeClasspath

# Clean everything
rm -rf android/app/build android/build node_modules/*/android/build

# Rebuild with detailed logs
cd android && ./gradlew assembleDebug --info --stacktrace

# Check for duplicate files
cd android && ./gradlew app:assembleDebug --warning-mode all
```

---

## Summary

### What We Did
1. Built a 16KB-compatible FFmpeg AAR from source
2. Configured library module to use `compileOnly` for local AAR/JARs
3. Configured app module to `implementation` the actual AAR/JARs
4. Used `flatDir` repository for local AAR resolution
5. Applied patch-package for persistent changes

### Why It Works
- Separates compilation needs (library) from packaging needs (app)
- Avoids Gradle's "no nested AARs" limitation
- Provides proper dependency resolution at both build stages
- Maintains compatibility with React Native 0.76+ and 16KB page size

### Key Takeaway
**When a library module needs to depend on a local AAR:**
- Library uses `compileOnly` (compile but don't package)
- App uses `implementation` (include in final APK)
- Both use `flatDir` to locate the AAR file

---

**Last Updated:** November 2024  
**React Native Version:** 0.76+  
**Android Gradle Plugin:** 8.1.0+  
**Minimum Android SDK:** 24 (Android 7.0)  
**Target Android SDK:** 35 (Android 15)