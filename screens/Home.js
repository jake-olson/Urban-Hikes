// screens/Home.js

import React, {useState, useReducer, useRef, useContext} from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity, Platform} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getDistance, getPreciseDistance} from 'geolib';

import {AppContext} from '../hooks/AppContext';

import Trail from '../screens/Trail';

function ExploreMap({navigation}) {
  const { appState, appStateDispatch } = useContext(AppContext);
  const { mapType, trailList, currentPosition } = appState;
  const { markerList } = trailList;
  const [, setState] = useState(); // force update
  const posDelta = 0.01;

  let mapRef = null;

  const milli = new Date().getMilliseconds();

  return (
    <View style={styles.container}>
      <MapView
        mapType={mapType}
        moveOnMarkerPress={false}
        ref={ref => {
          mapRef = ref;
        }}
        onMapReady={() =>
          mapRef.fitToCoordinates(markerList.map(m => m.coordinate), {
            edgePadding: {top: 50, right: 10, bottom: 50, left: 10},
            animated: false,
          })
        }
        onCalloutPress={e => {
          const trail = trailList.trailFromCoordinate(e.nativeEvent.coordinate);

         if (trail) {
          navigation.navigate('Trail', {
            trailID: trail.id,
            trailTitle: trail.title
          });
         }
        }}
        style={styles.map}
        initialRegion={{
          latitude: 47.60357,
          longitude: -122.32945,
          latitudeDelta: 0.9000,
          longitudeDelta: 0.3300,
        }}>
        {markerList.map(marker => (
          <Marker
            key={marker.id + milli.toString()} // make sure key is different every refresh so that pin color will update properly
            identifier={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={(trailList.trailVisited(marker.id)) ? 'green' : 'tan'}
            onDragEnd={e => {
              marker.coordinate = e.nativeEvent.coordinate;
            }}
          />
        ))}
        {currentPosition ? (
          <Marker.Animated
            ref={marker => {
              //state.markerRef = marker;
            }}
            pinColor={'blue'}
            coordinate={currentPosition}
            title={'You are here'}
          />
        ) : (
          <></>
        )}
      </MapView>

      <TouchableOpacity
        onPress={() => {
            appStateDispatch(['toggleMapType']);
        }}
        style={styles.TouchableOpacityStyle}>
        <Icon name="layers" size={36} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

function ExploreList({navigation}) {
  const { appState, appStateDispatch } = useContext(AppContext);
  const { trailList, currentPosition } = appState;
  const { markerList } = trailList;

  let trailItems = [];
  for (let i = 0; i < markerList.length; i++) {
    let distance = '';
    if (currentPosition) {
      distance = getDistance(currentPosition, markerList[i].coordinate);
      distance = (distance * 3.2808399) / 5280.0;
      distance = distance.toFixed(1);
    }

    trailItems.push({
      id: markerList[i].id,
      distance: distance,
      title: markerList[i].title,
      description: markerList[i].description,
      markers: markerList[i].markers,
    });
  }

  trailItems.sort(function(left, right) {
    return left.distance - right.distance;
  });

  function Separator() {
    return <View style={styles.listItemSeparator} />;
  }

  return (
    <View>
      <FlatList
        data={trailItems}
        ItemSeparatorComponent={Separator}
        renderItem={({item}) => (
          <TouchableOpacity style={trailList.trailVisited(item.id) ? styles.greenStyle : styles.redStyle}
            onPress={() => {
              navigation.navigate('Trail', {
                trailID: item.id,
                trailTitle: item.title
              });
            }}>
            <View style={styles.listItemView}>
              <View style={styles.listItemDistance}>
                {currentPosition ? (
                  <>
                    <Text style={styles.listItemDistanceText}>{item.distance}</Text>
                    <Text style={styles.listItemDistanceMiles}>miles</Text>
                  </>
                ) : (
                  <></>
                )}
              </View>
              <View style={styles.listItemInfo}>
                <Text style={styles.listItemTitle}>{item.title}</Text>
                <Text style={styles.listItemDescription}>{item.description}</Text>
              </View>
              <View style={styles.listItemLootView}>
                <View style={styles.listItemLoot}>
                    {item.markers.map(subItem => (
                      <Icon
                        key={subItem.id}
                        name={subItem.icon}
                        size={20}
                        color={trailList.markerVisited(item.id, subItem.id) ? 'green' : 'black'}
                      />
                    ))}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
const ExploreTab = createMaterialTopTabNavigator();

function ExploreTabScreen() {
  return (
    <ExploreTab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}>
      <ExploreTab.Screen
        name="Map"
        component={ExploreMap}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: 'map-outline',
        }}
      />
      <ExploreTab.Screen
        name="List"
        component={ExploreList}
        options={{
          tabBarLabel: 'List',
          tabBarIcon: 'map-outline',
        }}
      />
    </ExploreTab.Navigator>
  );
}

const HomeStack = createStackNavigator();

function HomeStackScreen(mapRef) {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}>
      <HomeStack.Screen
        name="Explore"
        component={ExploreTabScreen}
        options={{
          title: 'Explore Trails',
        }}
      />
      <HomeStack.Screen
        name="Trail"
        component={Trail}
        options={({route}) => ({title: route.params.trailTitle})}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 20,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    top: 10,
  },

  redStyle: {
  },

  greenStyle: {
    backgroundColor: '#cffbcf'
    //backgroundColor: 'palegreen',
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },

  listItemView: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },

  listItemDistance: {
    width: '15%',
    alignItems: 'center',
  },

  listItemDistanceText: {
    fontSize: 18,
  },

  listItemDistanceMiles: {
    fontSize: 12,
  },

  listItemInfo: {
    paddingLeft: 10,
    paddingRight: 10,
    width: '65%',
  },

  listItemLootView: {
    width: '20%',
  },

  listItemLoot: {
    flexDirection: 'row',
    flexWrap: "wrap",
    alignItems: 'flex-end',
  },

  listItemSeparator: {
    borderWidth: 0.75,
    borderColor: 'lightgray',
  },

  listItemTitle: {
    fontSize: 18,
  },

  listItemDescription: {
    fontSize: 12,
  },

  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
