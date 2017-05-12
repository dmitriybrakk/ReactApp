# SYMPTOMA App based on react-native

## iOS

Run `react-native run-ios` (only works on OSX).

## Android

Documentation: [Android Setup](https://facebook.github.io/react-native/releases/0.23/docs/android-setup.html)

Before testing on android create local.properties files in `android` folder and add the following line 
    `sdk.dir=path_to_your_sdk/Android/sdk`
    
Run `react-native run-android`.
    
### Faster Builds ###
    
To make builds faster, start the gradle daemon (normally by running `gradle`).
    
### Troubleshooting ###
    
If you use Genymotion as Android Emulator, make sure to [set the Android SDK location correctly](http://stackoverflow.com/questions/35959350/react-native-android-genymotion-adb-server-didnt-ack).

Do not use Homebrew `android-platform-tools`, if you install the SDK via Android Studio or you get this error [ADB server version (36) doesn't match this client (39)](http://stackoverflow.com/questions/43050370/adb-server-version-36-doesnt-match-this-client-39).


    
