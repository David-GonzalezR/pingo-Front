import { NavigationContainer } from '@react-navigation/native';
import { MainStackNavigator } from './presentation/navigator/MainStackNavigatior';

export default function App() {
  if (typeof window !== 'undefined') {
    (window as any).crypto = {
        getRandomValues: (arr: Uint8Array) => {
            if (arr instanceof Uint8Array) {
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = Math.floor(Math.random() * 256);
                }
            }
            return arr;
        }
    };
}
  return (
    <NavigationContainer>
      <MainStackNavigator/>
    </NavigationContainer>
  )
}


