import { NavigationContainer } from '@react-navigation/native';
import { MainStackNavigator } from './presentation/navigator/MainStackNavigatior';

export default function App() {
  return (
    <NavigationContainer>
      <MainStackNavigator/>
    </NavigationContainer>
  )
}


