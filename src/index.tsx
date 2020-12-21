import { NativeModules } from 'react-native';

type NewrelicType = {
  multiply(a: number, b: number): Promise<number>;
};

const { Newrelic } = NativeModules;

export default Newrelic as NewrelicType;
