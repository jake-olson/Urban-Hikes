import AsyncStorage from '@react-native-community/async-storage';

import {markerList} from '../trails/Data.js';

export default function TrailList() {
  this.visitedList = [];

  this.getTrailList = function() {
    return markerList;
  };

  this.markerList = markerList;

  this.indexFromCoordinate = function(list, coordinate) {
    for (let i = 0; i < list.length; i++) {
      if (
        list[i].coordinate.latitude === coordinate.latitude &&
        list[i].coordinate.longitude === coordinate.longitude
      ) {
        return i;
      }
    }
    return -1;
  };

  this.trailFromCoordinate = function(coordinate) {
    const index = this.indexFromCoordinate(markerList, coordinate);
    if (index === -1) {
      return null;
    } else {
      return markerList[index];
    }
  };

  this.markerFromTrailCoordinate = function(trail, coordinate) {
    const index = this.indexFromCoordinate(trail.markers, coordinate);
    if (index === -1) {
      return null;
    } else {
      return trail.markers[index];
    }
  };

  this.markerFromCoordinate = function(coordinate) {
    for (let i = 0; i < markerList.length; i++) {
      const trail = markerList[i];
      for (let j = 0; j < trail.markers.length; j++) {
        if (
          trail.markers[i].coordinate.latitude === coordinate.latitude &&
          trail.markers[i].coordinate.longitude === coordinate.longitude
        ) {
          return trail.markers[i];
        }
      }
    }
    return null;
  };

  this.indexFromID = function(list, id) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        return i;
      }
    }
    return -1;
  };

  this.trailFromID = function(id) {
    const index = this.indexFromID(markerList, id);
    if (index === -1) {
      return null;
    } else {
      return markerList[index];
    }
  };

  this.markerFromTrailID = function(trail, id) {
    const index = this.indexFromID(trail.markers, id);
    if (index === -1) {
      return null;
    } else {
      return trail.markers[index];
    }
  };

  this.getVisitedList = function() {
    return this.visitedList;
  };

  this.loadVisitedList = async (callback) => {
    try {
      const value = await AsyncStorage.getItem('visitedList');
      if (value !== null) {
        try {
          this.visitedList = JSON.parse(value);
          callback();
        } catch (e) {
          // parse error
        }
      }
    } catch (e) {
      // read error
    }
  };

  this.saveVisitedList = async () => {
    try {
      const value = JSON.stringify(this.visitedList);
      await AsyncStorage.setItem('visitedList', value);
    } catch (e) {
      // write error
    }
  };

  this.visitedListIndex = function(trailID, markerID) {
    for (let i = 0; i < this.visitedList.length; i++) {
      if ((this.visitedList[i].trailID === trailID) &&
          (this.visitedList[i].markerID === markerID)) {
        return i;
      }
    }
    return -1;
  };

  this.trailVisited = function(trailID) {
    return this.visitedListIndex(trailID) !== -1;
  };

  this.markerVisited = function(trailID, markerID) {
    return this.visitedListIndex(trailID, markerID) !== -1;
  };

  this.setVisited = function(trailID, markerID) {
    let d = new Date();

    let index = this.visitedListIndex(trailID, markerID);

    if (markerID) {
        if (index !== -1) {
            this.visitedList[index].dateUpdated = d.toISOString();
        } else {
            this.visitedList.push({ trailID: trailID, markerID: markerID, dateUpdated: d.toISOString() });
        }
    }

    index = this.visitedListIndex(trailID);
    if (index !== -1) {
        this.visitedList[index].dateUpdated = d.toISOString();
    } else {
        this.visitedList.push({ trailID: trailID, dateUpdated: d.toISOString() });
    }

    this.saveVisitedList();
  };

  this.clearVisited = function(trailID, markerID) {
    const index = this.visitedListIndex(trailID, markerID);
    if (index !== -1) {
      this.visitedList.splice(index, 1);
      this.saveVisitedList();
    }
  };

  this.visitedDisplayList = function() {
    let list = [];
    for (var i = 0; i < this.visitedList.length; i++) {
      const trail = this.trailFromID(this.visitedList[i].trailID);
      const marker = this.markerFromTrailID(trail, this.visitedList[i].markerID);
      const trailIndex = this.visitedListIndex(trail.id);
      if (marker) {
        list.push({ id: marker.id, icon: marker.icon, title: marker.title, description: marker.description, date: this.visitedList[i].dateUpdated,
                    trailID: trail.id, trailTitle: trail.title, trailDate: this.visitedList[trailIndex].dateUpdated });
      } else {
        list.push({ id: trail.id, title: trail.title, description: trail.description, date: this.visitedList[i].dateUpdated,
                    trailID: trail.id, trailTitle: trail.title, trailDate: this.visitedList[i].dateUpdated, });
      }
    }
    list.sort(function(left, right) {
      let lDate = Date.parse(left.trailDate);
      let rDate = Date.parse(right.trailDate);

      if (left.icon) {
         lDate--;
       }
       if (right.icon) {
         rDate--;
       }

      if (lDate === rDate) {
        lDate = Date.parse(left.date);
        rDate = Date.parse(right.date);
       }
      return rDate - lDate;
    });
    return list;
  };
}
