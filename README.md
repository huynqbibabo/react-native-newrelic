# New Relic React Native Module
> This module utilizes native New Relic agents to expose the Javascript environment. The New Relic SDKs collect crashes, network traffic, and other information for hybrid apps using native components.

<p align="center">
  <a href="https://www.npmjs.org/package/react-native">
    <img src="https://badge.fury.io/js/react-native.svg" alt="React Native npm package version." />
  </a>
  <a href="https://github.com/newrelic/NewRelicReactNativeModule/#contributing">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
</p>

### Features
* Capture JavaScript errors
* Capture interactions and the sequence they were created
* Pass user information to New Relic to track user sessions

### Requirements
- React Native >= 0.60
- IOS native requirements https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-ios/get-started/new-relic-ios-compatibility-requirements
- Android native requirements https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/get-started/new-relic-android-compatibility-requirements

## Installation
- Yarn
```sh
yarn add @bibabovn/react-native-newrelic
```
- React native autolink package
- Don't forget to run:
```shell
  npx pod-install
```
### Android Setup
- Install the New Relic native Android agent ([instructions here](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/install-configure/install-android-apps-gradle-android-studio))
- Update build.gradle:
  ```java
    buildscript {
      ...
      repositories {
        ...
        mavenCentral()
      }
      dependencies {
        ...
        classpath "com.newrelic.agent.android:agent-gradle-plugin:5.+"
      }
    }
  ```

- Update app/build.gradle
  ```
    apply plugin: "com.android.application"
    apply plugin: 'newrelic' // <-- add this
    ...
    dependencies {
      ...
      implementation "com.newrelic.agent.android:android-agent:5.+"
    }
  ```
- Update the app's `MainApplication.java` file (./android/app/src/main/java/'{package}/MainApplication.java')
  - Add an imports for the module and the native agent at the top of the file:
     ```java
     import com.newrelic.agent.android.NewRelic;
    ```
  - Move the `NewRelic.start(Context)` call from the `default (Main) activity` (as detailed in step #5 of the [agent installation instructions](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/install-configure/install-android-apps-gradle-android-studio)) to the `MainApplication.onCreate()` method.
    - Change the `Context` parameter from `this.getApplication()` to `this`
    - Ensure`GENERATED_TOKEN` has been replaced with a valid New Relic application token
    ```java
    @Override
    public void onCreate() {
        super.onCreate();
        NewRelic.withApplicationToken("GENERATED_TOKEN").start(this);
        ...
    }
    ```

- Set app permissions
  - Ensure that your app requests INTERNET and ACCESS_NETWORK_STATE permissions by adding these lines to your AndroidManifest.xml.
  ```
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  ```
### iOS Setup
> NewRelic doesn't officially support React Native yet, so some RN features may not work well with NewRelic like Flipper on iOS. So if you want to use RNNewRelic for development you'll need to disable it

- Install the New Relic native IOS agent ([instructions here](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-ios/installation/cocoapods-installation) with [notes regarding agent v7.+](https://docs.newrelic.com/docs/release-notes/mobile-release-notes/xcframework-release-notes/xcframework-agent-700)):
  - Update your podspec
  ```pod
    // add this
    pod 'NewRelicAgent'
  ```
  - Update your project
    * Close your project in Xcode and update by running this command from the Terminal in your project directory.
  ```shell
    pod install
  ```
  - Integrate and start the agent
    - In your ``AppDelegate.m`` file
    ```
      #import <NewRelic/NewRelic.h>
    ```
    - add this call as the first line of ``application:didFinishLaunchingWithOptions``
    ```
      [NewRelic startWithApplicationToken:@"GENERATED_TOKEN"];
    ```
  - Automatically upload your dSYM
    - In XCode, select your project in the navigator, then click on the application target.
    - Select Build Phases, then add a New Run Script Build Phase
    - In the script text area (beneath the Shell line) enter this script:
    ```shell
      SCRIPT=`/usr/bin/find "${SRCROOT}" -name newrelic_postbuild.sh | head -n 1`
      /bin/sh "${SCRIPT}" "YOUR_GENERATED_TOKEN"
    ```
  - Add a prefix header to your iOS project
    - Add a ``PrefixHeader.pch`` file as explained [here](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-ios/configuration/adding-prefix-header-ios-project) Your file should look like this:
    ```
      #ifdef __OBJC__

      #import <NewRelic/NewRelic.h>

      #endif
    ```
## Usage

### nrInit(firstScreen)
> Call this to initialize the SDK. Pass a name of the app's landing screen as an argument.
- `firstScreen` is text

### nrLog(inError)
> Call this to record a custom error event.
- `inError` is JavaScript exception

### nrError(inError)
> Call this to record a custom error event at `error` level.
- `inError` is JavaScript exception

### nrWarning(inError)
> Call this to record a custom error event at `warning` level.
- `inError` is JavaScript exception

### nrCritical(inError)
> Call this to record a custom error event at `critical` level.
- `inError` is JavaScript exception

### nrAddUserId(userId)
> Call this to associate a user with custom events.
- `userId` is text

### nrInteraction(screen)
> Call this to record an interaction event.
- `screen` is text

#### nrRecordMetric('myCustomEventName', sampleData)
> Call this to record a custom metric.
- `sampledata` is JSON

```js
import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  SafeAreaView,
} from 'react-native';
import {
  nrInit,
  nrAddUserId,
  nrError,
  nrInteraction,
  nrCritical,
  nrRecordMetric,
} from 'react-native-newrelic';

export default function App() {
  const [dataSource, setResult] = React.useState<any>([]);
  const [isLoading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    nrInit('Test-Screen');
    nrAddUserId('TestUser');
    nrInteraction('TestScreen');
  }, []);

  React.useEffect(() => {
    fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setLoading(false);
        setResult(responseJson.movies);
      })
      .catch((error) => {
        // logging function can be added here as well
        console.error(error);
        nrError(error);
      });
  }, []);

  React.useEffect(() => {
    // Create Custom event tables in New Relic Insights
    const sampledata = {
      cityName: 'Philadelphia',
      zipCode: 19134,
      username: 'bob',
      alive: true,
    };
    nrRecordMetric('MyCustomMetric', sampledata);
  }, []);

  const badApiLoad = () => {
    setLoading(true);
    fetch('https://facebook.github.io/react-native/moviessssssssss.json')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setLoading(false);
        setResult(responseJson.movies);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        // logging function can be added here as well
        nrCritical(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title={'Bad API'} onPress={badApiLoad} color={'#3365f3'} />
      <FlatList
        style={{ flex: 1 }}
        data={dataSource}
        renderItem={({ item }) => (
          <Text>
            {item.title}, {item.releaseYear}
          </Text>
        )}
        keyExtractor={({ id }) => id}
        ListEmptyComponent={
          <View>{isLoading ? <Text>Loading...</Text> : null}</View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
```

## License

MIT
