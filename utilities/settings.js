import AsyncStorage from '@react-native-community/async-storage';

function Settings() {

    this.userName = "";
    this.landingPageShown = false;

    this.load = async (callback) => {
        try {
          const value = await AsyncStorage.getItem('settings');
          if (value !== null) {
            try {
              obj = JSON.parse(value);
              this.userName = obj.userName;
              this.landingPageShown = obj.landingPageShown;
              callback();
            } catch (e) {
              // parse error
              callback();
            }
          } else {
            callback();
          }
        } catch (e) {
          // read error
          callback();
        }
    };

    this.save = async () => {
        try {
          const value = JSON.stringify({ landingPageShown: this.landingPageShown, userName: this.userName });
          await AsyncStorage.setItem('settings', value);
        } catch (e) {
          // write error
        }
    };
}

export default Settings;