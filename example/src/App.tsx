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
