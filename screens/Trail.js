import React, {useState, useReducer, useContext} from 'react';
import {View, StyleSheet, TouchableOpacity, Vibration, Platform} from 'react-native';
import {Snackbar} from 'react-native-paper';
import MapView, {Marker} from 'react-native-maps';
import {getDistance, isPointInPolygon} from 'geolib';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {AppContext} from '../hooks/AppContext';

const distanceThreshold = 10;

function MatchLoot(trailList, trailID, pos) {
  const trail = trailList.trailFromID(trailID);
  const trailMarkers = trail.markers;
  let retVal = -1;

  if (!trailList.trailVisited(trail.id)) {
    let r = [
        { latitude: trail.coordinate.latitude + trail.height / 2, longitude: trail.coordinate.longitude + trail.width / 2 },
        { latitude: trail.coordinate.latitude - trail.height / 2, longitude: trail.coordinate.longitude + trail.width / 2 },
        { latitude: trail.coordinate.latitude - trail.height / 2, longitude: trail.coordinate.longitude - trail.width / 2 },
        { latitude: trail.coordinate.latitude + trail.height / 2, longitude: trail.coordinate.longitude - trail.width / 2 },
    ];

    if (isPointInPolygon(pos, r)) {
        trailList.setVisited(trail.id);
        retVal = 1;
    }
  }

  for (let i = 0; i < trailMarkers.length; i++) {
    if (!trailList.markerVisited(trail.id, trailMarkers[i].id)) {
      const distance = getDistance(pos, trailMarkers[i].coordinate);
      if (distance <= distanceThreshold) {
        trailList.setVisited(trail.id, trailMarkers[i].id);
        retVal = 0;
        break;
      }
    }
  }
  return retVal;
}

export default function Trail({route}) {
  const { appState, appStateDispatch } = useContext(AppContext);
  const { mapType, trailList, currentPosition } = appState;
  const [ snackbarVisible, setSnackBarVisible ] = useState(false);
  const [ tracksViewChanges, setTracksViewChanges ] = useState(false);

  let mapRef = null;
  const trail = trailList.trailFromID(route.params.trailID);
  const trailMarkers = trail.markers;

  let trailMatch = 0;
  if (currentPosition) {
    trailMatch = MatchLoot(trailList, trail.id, currentPosition);
    if (trailMatch !== -1) {
        Vibration.vibrate();
        setTracksViewChanges(true);
        setSnackBarVisible(true);
    }
  }

  function onDismissSnackBar() {
    setTracksViewChanges(false);
    setSnackBarVisible(false);
    appStateDispatch(['updateTrailList']);
  }

  function MarkerTextColor(trailID, markerID) {
    return trailList.markerVisited(trailID, markerID) ? 'white' : 'white';
  }

  function MarkerBackgroundColor(trailID, markerID) {
    return trailList.markerVisited(trailID, markerID) ? 'green' : '#007AFF';
  }

  return (
    <View style={styles.container}>
      <MapView
        mapType={mapType}
        moveOnMarkerPress={true}
        ref={ref => {
          mapRef = ref;
        }}
        onMapReady={() =>
          mapRef.fitToCoordinates(trailMarkers.map(m => m.coordinate), {
            edgePadding: {top: 100, right: 10, bottom: 50, left: 10},
            animated: false,
          })
        }
        style={styles.map}
        initialRegion={{
          latitude: trail.coordinate.latitude,
          longitude: trail.coordinate.longitude,
          latitudeDelta: 0.1000,
          longitudeDelta: 0.300,
        }}>
        {trailMarkers.map(marker => (
          <Marker
            key={marker.id}
            tracksViewChanges={tracksViewChanges} // dramatically improves perf when false, so only set to true when a marker update will happen
            identifier={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={'blue'}
            onDragEnd={e => {
              marker.coordinate = e.nativeEvent.coordinate;
            }}>
            <View style={[styles.circle, {backgroundColor: MarkerBackgroundColor(trail.id, marker.id)}]}>
              <Icon name={marker.icon} size={20} color={MarkerTextColor(trail.id, marker.id)} />
            </View>
          </Marker>
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
      <Snackbar visible={snackbarVisible} onDismiss={onDismissSnackBar} style={styles.SnackBar}>
       { trailMatch ? "Trail acquired!" : "Feature acquired!"}
      </Snackbar>
    </View>
  );
}

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

  SnackBar: {
    backgroundColor: 'green',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    paddingLeft: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
