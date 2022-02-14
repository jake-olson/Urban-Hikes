import React, {useState, useReducer, useContext} from 'react';
import { Button, View, Text, StyleSheet, FlatList, Clipboard, ImageBackground, useWindowDimensions, TouchableOpacity  } from 'react-native';
import {TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {createStackNavigator} from '@react-navigation/stack';

import Ranks from '../screens/Ranks';
import {rankList} from '../trails/Data.js';

import {AppContext} from '../hooks/AppContext';


const AccountStack = createStackNavigator();



function AccountStackScreen() {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}>
      <AccountStack.Screen
        name="Account"
        component={Account}
        options={{
          title: 'Account',
        }}
      />
      <AccountStack.Screen
        name="Ranks"
        component={Ranks}
        options={{
            title: 'Trail Rank',
         }}
      />
    </AccountStack.Navigator>
  );
}

export default AccountStackScreen;


function Account({navigation}) {
  const { appState, appStateDispatch } = useContext(AppContext);
  const { trailList, settings } = appState;
  const { markerList } = trailList;

  const trailLength = markerList.length;

  const [ name, setName ] = React.useState(settings.userName);
  const [ editable, setEditable ] = React.useState(settings.userName === "");


  // Calculates the total number of loot
  let totalLoot = 0;
  for (let i = 0; i < trailLength; i ++) {
    for(let j = 0; j < markerList[i].markers.length; j ++) {
        totalLoot ++;
    }
  }
  const lootNum = totalLoot;

  // Calculates the loot claimed and trails logged
  let lootClaimed = 0;
  let trailsClaimed = 0;
  for(let j = 0; j < trailList.visitedList.length; j ++) {
     if (trailList.visitedList[j].markerID) {
       lootClaimed++;
     } else {
       trailsClaimed++;
     }
  }

  // Finds the current Rank
  let index = 0;
  for(let i = 1; i < rankList.length; i ++) {
     if (trailsClaimed >= rankList[i].minTrails && lootClaimed >= rankList[i].minPOI) {
         index = i;
     }
  }
  let rankName = rankList[index].rank;

  function Separator() {
      return <View style={styles.listItemSeparator} />;
  }

  return (
    <View style={styles.container}>
        <ImageBackground source={require('../assets/scenic-view.jpg')} style={styles.image}>
            <View style={styles.items}>
                <View>
                    { editable ? (
                        <View style={styles.header}>
                            <TextInput style={{ height: 70, width: 200, marginRight: 10 }}
                              label="Enter your name:"
                              selectTextOnFocus
                              value={name}
                              onChangeText={text => setName(text)}
                            />
                            <View>
                                <Button title="Save" onPress={() => {
                                    settings.userName = name;
                                    settings.save();
                                    setEditable(false);
                                    }}
                                />
                                <View style={{marginTop: 5}}>
                                    <Button title="Cancel" onPress={() => {
                                        setName(settings.userName);
                                        setEditable(false);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    ) : (
                         <View style={styles.header}>
                                <Text style={styles.boldText}>{name}</Text>
                                <Icon name="pencil" color={"#0F0F0F"} size={30} onPress={() => { setEditable(true); }}/>

                         </View>
                     )}

                    <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Ranks', {
                            lootClaimed: lootClaimed,
                            trailsClaimed: trailsClaimed,
                            totalLoot: totalLoot
                          });
                        }}
                       style={styles.title}>
                       <Text>{"Rank: " + rankName}</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={styles.progressText}>
                        <Button
                            onPress={() => {
                              navigation.navigate('List');
                            }}
                            title="Trails Logged: "
                            color="green"
                        />
                        <Text style={styles.stats}>{trailsClaimed}/{trailLength}</Text>
                    </View>
                    <View style={styles.progressText}>
                        <Button
                            onPress={() => {
                              navigation.navigate('Loot');
                            }}
                            title="Loot Claimed: "
                            color="green"
                        />
                        <Text style={styles.stats}>{lootClaimed}/{lootNum}</Text>
                    </View>
                </View>
            </View>
        </ImageBackground>
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  items: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  settings: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0,0.1)',
    borderRadius: 50,
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
    marginTop: 40,
    flexDirection: "row",
  },
  title: {
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor:'rgba(52, 52, 52,0.3)',
    padding: 10,
    marginBottom: 40,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 30,
    marginRight: 10,
  },
  progressText: {
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(20, 80, 0,0.70)',
    padding: 12,
    marginBottom: 10,
  },
  stats: {
    marginLeft: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'rgb(180,252,180)',
  },
  achievements: {
    borderRadius: 15,
    backgroundColor: 'rgba(200, 252, 0, 0.54)',
    alignItems: 'center',
    padding: 10,
  },
  achievementText: {
    //backgroundColor: 'rgba(200, 252, 0,0.4)',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  badges: {
    paddingVertical: 15,
    flexDirection: 'row',
    marginRight: 10,
  },
  badgeText: {
    marginHorizontal: 30,
  },
  name: {
    fontFamily: 'Verdana',
    fontSize: 18,
    textAlign: 'center',
  },
  email: {
    fontSize: 12,
  },
});
