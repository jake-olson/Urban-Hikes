import React, {useState, useReducer, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, Button, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Swiper from 'react-native-swiper';

import {AppContext} from '../hooks/AppContext';

function LandingScreen() {
  const { appState, appStateDispatch } = useContext(AppContext);
  const { settings } = appState;
  const [ showTutorial, setShowTutorial ] = useState(false);

    React.useEffect(() => {
      const bootstrapAsync = async () => {

          settings.load(function () {
              if (settings.landingPageShown) {
                appStateDispatch(['dismissLandingPage']);
              } else {
                setShowTutorial(true);
              }
          });
      };

      bootstrapAsync();
    }, []);

   const DismissLandingPage = async () => {
        settings.landingPageShown = true;
        settings.save();
        appStateDispatch(['dismissLandingPage']);
    };

  return (
  <View style={styles.container}>
  { showTutorial ? (
        <Swiper style={styles.wrapper} showsButtons={true} index={0}
        buttonWrapperStyle={{backgroundColor: 'transparent', flexDirection: 'row', position: 'absolute', top: 0, left: 0, flex: 1, paddingHorizontal: 10, paddingVertical: 10, justifyContent: 'space-between', alignItems: 'flex-end'}}
        nextButton=<Text style={styles.buttonText}>Next</Text>
        prevButton=<Text style={styles.buttonText} onPress={() => { DismissLandingPage();}}>Skip</Text>
        >
            <View style={styles.slide}>
              <Image source={require('../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png')}/>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.titleText}>Urban Hikes</Text>
              <Text style={styles.descriptionText}>Urban Hikes can help you find cool trails near you. To learn how, swipe or tap on the Next button. </Text>
            </View>
            <View style={styles.slide}>
              <Image style={styles.exampleImage} source={require('../assets/tutorial_explore.png')}/>
              <Text style={styles.captionText}>Find a Trail</Text>
              <Text style={styles.descriptionText}>The Trails screen shows trails in your area. Tap one to explore it.</Text>
            </View>
            <View style={styles.slide}>
              <Image style={styles.exampleImage} source={require('../assets/tutorial_trail.png')}/>
              <Text style={styles.captionText}>Find the Loot!</Text>
              <Text style={styles.descriptionText}>Located on the trails are a set of loot points - visit them all to improve your rank!</Text>
            </View>
            <View style={styles.slide}>
              <Image style={styles.exampleImage} source={require('../assets/tutorial_account.png')}/>
              <Text style={styles.captionText}>Track your Progress</Text>
              <Text style={styles.descriptionText}>Try the Account screen to see the trails and loot you have acquired and the rating you have earned.</Text>
            </View>
            <View style={styles.slide}>
                <Image style={styles.actionImage} source={require('../assets/tutorial_adventure.png')}/>
                <Text style={[styles.captionText, {marginBottom: 50}]}>Now go hit the trails and earn some loot!</Text>
                <Button title="Start Exploring" onPress={() => { DismissLandingPage();}} />
            </View>
        </Swiper>
        ) : (
        <></>
        )}
  </View>
  );
}

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'  },

  welcomeText: {
    marginTop: 40,
    color: '#505050',
    fontSize: 20,
  },

  captionText: {
    marginTop: 20,
    marginLeft: 40,
    marginRight: 40,
    textAlign: 'center',
    color: '#505050',
    fontSize: 20,
    fontWeight: "bold"
  },

  descriptionText: {
    marginTop: 20,
    marginLeft: 40,
    marginRight: 40,
    color: '#505050',
    textAlign: 'center',
    fontSize: 20,
  },

  titleText: {
    color: '#505050',
    fontSize: 50,
  },

  exampleImage: {
    width: 540*0.42,
    height: 980*0.42,
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 10,
  },

  actionImage: {
    width: 800*0.42,
    height: 660*0.42,
  },

  buttonStyle: {
    marginTop: 30,
  },

  buttonText: {
    fontSize: 20,
    marginBottom: 10
  },
    wrapper: {},
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
    }
});