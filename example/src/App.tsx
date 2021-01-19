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
  setAttributes,
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
    setAttributes({ isActive: true, age: 21, role: 'admin' });
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
