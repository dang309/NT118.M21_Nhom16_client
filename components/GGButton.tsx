import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";

import { GGIcon } from "./Icons";

const GGButton = () => {
  return (
    <Pressable onPress={() => console.log("abc")}>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: "#fff",
            elevation: 4,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
            width: "auto",
          }}
        >
          <View style={{ marginRight: 8 }}>
            <GGIcon width={32} height={32} />
          </View>
          <Text style={{ fontSize: 16 }}>Đăng nhập bằng Google</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default GGButton;
