// App.js

import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';

import HomeStackScreen from './screens/Home';
import Loot from './screens/Loot';
import AccountStackScreen from './screens/Account';
import LandingScreen from './screens/Landing';

import TrailList from './trails/TrailList';
import Settings from './utilities/settings';

import {useCurrentPosition} from './hooks/UseCurrentPosition';
import {AppContext} from './hooks/AppContext';

const Tab = createMaterialBottomTabNavigator();

let gTrailList = new TrailList();
let gSettings = new Settings();

function NavStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Trails',
          tabBarIcon: 'map-outline',
        }}
      />
      <Tab.Screen
        name="Loot"
        component={Loot}
        options={{
          tabBarLabel: 'Loot',
          tabBarIcon: 'treasure-chest',
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStackScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: 'account-outline',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {

 const [appState, appStateDispatch] = React.useReducer(
    (prevState, [type, position]) => {
      switch (type) {
        case 'toggleMapType':
          return {
            ...prevState,
            mapType: (prevState.mapType === 'standard') ? 'hybrid' : 'standard',
          };
        case 'updateTrailList':
            return {...prevState, trailList: gTrailList };
        case 'dismissLandingPage':
            return {...prevState, showLandingPage: false };
        case 'initialPosition':
        case 'updatePosition':
            return {...prevState, currentPosition: position };
      }
    },
    {
      mapType: "standard",
      trailList: gTrailList,
      settings: gSettings,
      showLandingPage: true,
      currentPosition: null,
    },
  );

 const appStateContextValue = React.useMemo(() => {
    return { appState, appStateDispatch };
 },
    [appState, appStateDispatch]
 );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
        gTrailList.loadVisitedList(function () {
            appStateDispatch(['updateTrailList']);
        });
    };

    bootstrapAsync();
  }, []);

  useCurrentPosition(appStateDispatch);

  return (
    <PaperProvider>
        <AppContext.Provider value={appStateContextValue}>
            <NavigationContainer>
              {appState.showLandingPage ? <LandingScreen /> : <NavStack />}
            </NavigationContainer>
        </AppContext.Provider>
    </PaperProvider>
  );
}

console.disableYellowBox = true;
