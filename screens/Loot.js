import React, {useState, useReducer, useContext} from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {DataTable} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {AppContext} from '../hooks/AppContext';

export default function Loot({navigation}) {
  const { appState, appStateDispatch } = useContext(AppContext);
  const { trailList } = appState;
  const displayList = trailList.visitedDisplayList();

  function FormatDate(str) {
    let ms = Date.parse(str);
    let d = new Date();
    d.setTime(ms);
    return d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
  }

  function Separator() {
    return <View style={styles.listItemSeparator} />;
  }

  return (
    <View style={styles.container}>
        <Text style={styles.topRow}>Trails and Loot Acquired</Text>
        { (displayList.length === 0) ? (
            <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                <Icon name="bell-alert" size={48} color="#000000" />
                <Text style={styles.noLootInfo}>No trails or loot acquired yet.</Text>
                <Text style={styles.noLootInfo}>Use the Trails tab to find trails in your area to explore.</Text>
            </View>
        ) : (
          <FlatList
            data={displayList}
            ItemSeparatorComponent={Separator}
            renderItem={({item}) => (
              <TouchableOpacity
                style={item.icon ? styles.lootStyle : styles.trailStyle}
                onPress={() => {
                  navigation.navigate('Trail', {
                    trailID: item.trailID,
                    trailTitle: item.trailTitle
                  });
                }}>
                <View style={styles.listItemView}>
                  { item.icon ? (
                     <View style={styles.listItemInfoIcon}>
                      <Icon name={item.icon} size={20} style={styles.listItemIcon} />
                      <Text style={styles.listItemTitleIcon}>{item.title}</Text>
                     </View>
                  ) : (
                     <View style={styles.listItemInfo}>
                      <Text style={styles.listItemTitle}>{item.title}</Text>
                     </View>
                  )}
                  <View style={styles.listItemDateView}>
                    <Text style={styles.listItemDate}>{FormatDate(item.date)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    backgroundColor: "#007AFF",
    textAlignVertical: "bottom",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 20
  },
  noLootInfo: {
      fontSize: 20,
      marginTop: 20,
      marginLeft: 40,
      marginRight: 40,
      textAlign: 'center',
  },
    listItemView: {
      marginTop: 10,
      marginBottom: 10,
      flexDirection: 'row',
    },

    listItemViewIcon: {
      marginTop: 10,
      marginBottom: 10,
      flexDirection: 'row',
    },

    listItemInfo: {
      paddingLeft: 10,
      paddingRight: 10,
      width: '75%',
    },

    listItemInfoIcon: {
      flexDirection: 'row',
      paddingLeft: 30,
      paddingRight: 10,
      width: '75%',
      alignItems: 'center'
    },

    listItemIcon: {
        paddingRight: 5
    },

    listItemDateView: {
      width: '25%',
      justifyContent: 'center',
    },

    listItemSeparator: {
      borderWidth: 0.75,
      borderColor: 'lightgray',
    },

    listItemTitle: {
      fontSize: 22,
    },
    listItemTitleIcon: {
      fontSize: 16,
    },
    listItemDescription: {
      fontSize: 12,
    },

    listItemDate: {
      fontSize: 14,
    },

    lootStyle: {
        //backgroundColor: '#e6fde6'
    },

    trailStyle: {
        //backgroundColor: '#cffbcf'
    }
  });
