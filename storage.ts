import AsyncStorage from "@react-native-async-storage/async-storage";

class ASYNC_STORAGE {
  static async STORE(key: string, value: object) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  }

  static async GET(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export default ASYNC_STORAGE;
