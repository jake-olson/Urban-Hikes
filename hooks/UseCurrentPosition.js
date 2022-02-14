import React, {useEffect, useRef} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export function useCurrentPosition(dispatch) {
  const watchID = useRef(null);

  useEffect(() => {
    function setupLocation() {
      Geolocation.getCurrentPosition(
        position => {
          console.log('Initial location: ' + JSON.stringify(position.coords));
          const newCoordinate = {latitude: position.coords.latitude, longitude: position.coords.longitude};
          dispatch(['initialPosition', newCoordinate]);
        },
        error => console.warn(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
      watchID.current = Geolocation.watchPosition(
        position => {
          console.log('Updated location: ' + JSON.stringify(position.coords));
          const newCoordinate = {latitude: position.coords.latitude, longitude: position.coords.longitude};
          dispatch(['updatePosition', newCoordinate]);
        },
        error => console.warn(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 5},
      );
    }

    if (Platform.OS === 'ios') {
      setupLocation();
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setupLocation();
          } else {
            console.warn('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
      requestLocationPermission();
    }

    // Specify how to clean up after this effect:
    return function cleanup() {
      Geolocation.clearWatch(watchID.current);
    };
  }, [dispatch]);
}

export function UpdateCurrentPositionReducer(state, [type, position]) {
  switch (type) {

    // create the current position marker
    case 'initial':
      return {...state, currentPosition: position};

    // update the current position marker
    case 'update':
      if (Platform.OS === 'android') {
        if (state.markerRef) {
          state.markerRef.animateMarkerToCoordinate(position, 500);
          if (state.updateCallback) {
            state.updateCallback(position);
          }
        }
      } else {
        //coordinate.timing(newCoordinate).start();
      }
      break;
  }
  return state;
}
