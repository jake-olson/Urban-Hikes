import React, {useState} from 'react';
import {ScrollView, Text, StyleSheet} from 'react-native';
import {DataTable} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {rankList} from '../trails/Data.js';

export default function Ranks({route}) {

  let lootClaimed = route.params.lootClaimed;
  let trailsClaimed = route.params.trailsClaimed;
  let totalLoot = route.params.totalLoot;

  rankList[rankList.length -1].minPOI = totalLoot;

  // Temporary solution adjusting the flex of the columns. Need to wrap the description text.
  return (
    <ScrollView>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title><Text style={styles.Header}>Rank</Text></DataTable.Title>
            <DataTable.Title style={styles.Description}><Text style={styles.Header}>Description</Text></DataTable.Title>
          </DataTable.Header>
          {rankList.map(item => (
              <DataTable.Row style= {trailsClaimed >= item.minTrails && lootClaimed >= item.minPOI ? styles.greenRow : styles.regRow}>
              <DataTable.Cell>{item.rank}</DataTable.Cell>
              <DataTable.Cell style={styles.cellStyle}><Text style={styles.descriptionStyle}>{item.description}</Text></DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  Header: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  Description: {
    flex: 1.7,
  },
  greenRow: {
    justifyContent: 'flex-start',
    backgroundColor: 'palegreen',
  },
  regRow: {
    justifyContent: 'flex-start',
  },
  cellStyle: {
    //backgroundColor: 'blue',
    flex: 1.7,

  },
  descriptionStyle: {
    //backgroundColor: 'red',
  }
});
