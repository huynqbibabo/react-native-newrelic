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
See [new relic IOS sdk doc](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-ios/ios-sdk-api) or [android sdk](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/android-sdk-api) for more detail
### nrInit()
> Call this to initialize the NRNewRelic module. capture all unhandle js exception

### crashNow(message?: string): void;
> Test with a native exception

### startInteraction(interactionName: string): Promise<InteractionId>;
> Track a method as an interaction
- `InteractionId` is string

### setInteractionName(interactionName: string): void;
> Name or rename interaction

### endInteraction(id: InteractionId): void;
> End an interaction
> Required. The string ID for the interaction you want to end.
> This string is returned when you use startInteraction().

### nrRecordMetric(name: string, category: MetricCategory | string, args?: MetricAttributes): void;
> Create custom metrics
```ts
  enum Category {
    NONE = 'None',
    VIEW_LOADING = 'View Loading',
    VIEW_LAYOUT = 'Layout',
    DATABASE = 'Database',
    IMAGE = 'Images',
    JSON = 'JSON',
    NETWORK = 'Network',
  }

  type MetricAttributes = {
    count: number;
  } | {
    totalValue: number;
  } | {
    count: number;
    totalValue: number;
    exclusiveValue: number;
  } | {
    count: number;
    totalValue: number;
    exclusiveValue: number;
    countUnit: MetricUnit;
    valueUnit: MetricUnit;
  };
```

### reportJSExceptionHandler(e?: any, isFatal?: boolean): void;
> Call this to record js handled exception.
- `e` is js exception

#### setAttribute(name: string, value: boolean | number | string): void;
> Create or update an attribute

### removeAttribute(name: string): void;
> This method removes the attribute specified by the name string

### setUserId(userId: string): void;
> Set custom user ID for associating sessions with events and attributes

### recordBreadcrumb(name: string, attributes?: {[key: string]: boolean | number | string}): void;
> Track app activity/screen that may be helpful for troubleshooting crashes

### recordCustomEvent(eventType: string, eventName?: string, attributes?: {[key: string]: boolean | number | string}): void;
> Creates and records a custom event, for use in New Relic Insights
```angular2html
* IMPORTANT considerations and best practices include:
*
* - You should limit the total number of event types to approximately five.
* eventType is meant to be used for high-level categories.
* For example, you might create an event type Gestures.
*
* - Do not use eventType to name your custom events.
* Create an attribute to name an event or use the optional name parameter.
* You can create many custom events; it is only event types that you should limit.
*
* - Using the optional name parameter has the same effect as adding a name key in the attributes dictionary.
* name is a keyword used for displaying your events in the New Relic UI.
* To create a useful name, you might combine several attributes.
```
### noticeNetworkRequest(url: string, options: RequestOptions): void;
> Record HTTP transactions at varying levels of detail

### noticeNetworkRequest(url: string, options: RequestOptions): void;
> Record HTTP error transactions at varying levels of detail
```ts
interface RequestOptions {
  httpMethod: 'GET' | 'POST' | 'PUT' | 'HEAD' | 'DELETE' | 'PATCH' | 'OPTIONS';
  statusCode: number;
  startTime?: number;
  endTime?: number;
  bytesSent?: number;
  bytesReceived?: number;
  responseHeader?: any;
  responseBody?: string;
  params?: {
    [key: string]: any;
  };
}
```
## Example
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
  crashNow,
  endInteraction,
  // noticeNetworkFailure,
  noticeNetworkRequest,
  nrInit,
  // nrRecordMetric,
  recordBreadcrumb,
  // recordCustomEvent,
  // removeAttribute,
  setAttribute,
  // setInteractionName,
  setUserId,
  startInteraction,
} from 'react-native-newrelic';

export default function App() {
  const [dataSource, setResult] = React.useState<any>([]);
  const [isLoading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    nrInit();
    recordBreadcrumb('User open first screen', { stack: 'feed-stack' });
    setUserId('test-id');
  }, []);
  //
  React.useEffect(() => {
    const url = 'https://reactnative.dev/movies.json';
    const startTime = new Date().getTime();
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        const endTime = new Date().getTime();
        noticeNetworkRequest(url, {
          httpMethod: 'GET',
          startTime,
          endTime,
          responseBody: JSON.stringify(response),
          statusCode: 200,
          responseHeader: response.headers,
        });
        console.log(response);
        setLoading(false);
        setResult(response.movies);
      })
      .catch((error) => {
        // logging function can be added here as well
        console.error(error);
      });
  }, []);
  //
  React.useEffect(() => {
    // Create Custom event tables in New Relic Insights
    setAttribute('name', 'User name');
    setAttribute('isActive', true);
    setAttribute('age', 23);
  }, []);
  //
  const badApiLoad = async () => {
    setLoading(true);
    const interactionId = await startInteraction('StartLoadBadApiCall');
    const url = 'https://facebook.github.io/react-native/moviessssssssss.json';
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setLoading(false);
        endInteraction(interactionId);
        setResult(responseJson.movies);
      })
      .catch((error) => {
        // noticeNetworkFailure(url, { httpMethod: 'GET', statusCode: 0 });
        setLoading(false);
        endInteraction(interactionId);
        console.error(error);
      });
  };

  const testNativeCrash = () => {
    crashNow('Test crash message');
  };

  const jsErrorHandle = () => {
    throw new Error('test js error handle');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title={'Bad API'} onPress={badApiLoad} color={'#3365f3'} />
      <Button
        title={'Test JS error handle'}
        onPress={jsErrorHandle}
        color={'#3365f3'}
      />
      <Button
        title={'Test native crash'}
        onPress={testNativeCrash}
        color={'#3365f3'}
      />
      <FlatList
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
