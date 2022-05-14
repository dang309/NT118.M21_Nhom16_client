import { View, Text } from "react-native";
import React from "react";

import { Button, IconButton, Title } from "react-native-paper";

import { useNavigation } from "@react-navigation/core";

type Props = {
  showLeftIcon: boolean;
  showRightIcon: boolean;
  title: string;
  handleUpdateProfile: () => void;
  isSubmitting?: boolean;
};

const Header = ({
  showLeftIcon,
  showRightIcon,
  title,
  handleUpdateProfile,
  isSubmitting,
}: Props) => {
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

          paddingHorizontal: 8,
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
          <Button
            mode="contained"
            icon="checkmark"
            color="green"
            style={{
              backgroundColor: "#00adb5",
              borderRadius: 16,
              elevation: 4,
            }}
            loading={!!isSubmitting}
            onPress={handleUpdateProfile}
          >
            Lưu
          </Button>
        )}
      </View>
    </View>
  );
};

export default Header;
