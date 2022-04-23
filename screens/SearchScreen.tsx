import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";

import { Icon } from "../components";
import { IconButton } from "react-native-paper";

import { useNavigation } from "@react-navigation/core";

const SearchScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconButton
          icon="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderColor: "#e5e5e5",
            borderWidth: 1,
            borderRadius: 24,
            padding: 8,
            paddingHorizontal: 16,
            height: 48,

            margin: 8,
            marginLeft: 0,
          }}
        >
          <TextInput placeholder="Tìm kiếm..." autoFocus />
          <Icon name="search" size={16} color="#c4c4c4" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },
});

export default SearchScreen;
