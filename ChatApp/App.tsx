import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Authentication from './Components/Authentication';
import Tab from './Tabs/Tab';
import ChatScreen from './Components/ChatScreen';
import { Provider as PaperProvider } from 'react-native-paper';
function App() {
  const Stack = createNativeStackNavigator();
  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false}}>
        <Stack.Screen name='ChatScreen' component={ChatScreen} />
        <Stack.Screen name='Tab' component={Tab} />
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
