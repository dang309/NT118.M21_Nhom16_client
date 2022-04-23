import { View, Text } from "react-native";
import React from "react";

import { IconButton, Title } from "react-native-paper";

import { useNavigation } from "@react-navigation/core";

type Props = {
  showLeftIcon: boolean;
  showRightIcon: boolean;
  title: string;
};

const Header = ({ showLeftIcon, showRightIcon, title }: Props) => {
  const navigation = useNavigation();
  return (
    <View style={{ backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",

          borderBottomWidth: 1,
          borderBottomColor: "#e5e5e5",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showLeftIcon && (
            <IconButton
              icon="arrow-back"
              size={24}
              onPress={() => navigation.goBack()}
            />
          )}
          <Title style={{ margin: 16 }}>{title}</Title>
        </View>

        {showRightIcon && (
          <IconButton
            icon="checkmark"
            color="green"
            size={24}
            onPress={() => navigation.goBack()}
          />
        )}
      </View>
    </View>
  );
};

export default Header;
