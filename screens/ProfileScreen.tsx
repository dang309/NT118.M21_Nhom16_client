import { StatusBar, StyleSheet, View } from "react-native";
import { useState } from "react";

import { NavigationProfileProps } from "../types";

import {
  Avatar,
  Headline,
  IconButton,
  Subheading,
  Text,
  Portal,
  Dialog,
  Paragraph,
  Button,
  Menu,
  Divider,
  List,
} from "react-native-paper";

import PROFILE_CONSTANT from "./../constants/Profile";
import { REQUEST } from "../utils";
import { useAppDispatch, useAppSelector } from "./../app/hook";
import { SET_USER } from "../features/UserSlice";

import { User } from "../types";
import { IUser } from "./../features/UserSlice";

const renderStat = (header: string, quantity: number, styles: object) => {
  return (
    <View style={{ ...styles }}>
      <Text style={{ fontWeight: "bold", fontSize: 20 }}>{quantity}</Text>
      <Text style={{ fontSize: 16 }}>{header}</Text>
    </View>
  );
};

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const cUser = useAppSelector<IUser>((state) => state.user);

  const [showDialogOptions, setShowDialogOptions] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingTop: 8,
            marginBottom: 16,
          }}
        >
          <Avatar.Image
            size={128}
            source={{
              uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
            }}
          />

          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              {renderStat(PROFILE_CONSTANT.SOUNDS, 20, {
                alignItems: "center",
              })}
              {renderStat(PROFILE_CONSTANT.FOLLOWERS, 20, {
                alignItems: "center",
              })}

              {renderStat(PROFILE_CONSTANT.FOLLOWING, 20, {
                alignItems: "center",
              })}
            </View>
            <Text style={{ fontSize: 14 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor
              justo ac nibh diam amet, tincidunt in.
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Button
              mode="outlined"
              uppercase
              style={{ borderWidth: 1, borderColor: "#00ADB5", width: "100%" }}
            >
              Follow
            </Button>
          </View>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Button
              mode="outlined"
              uppercase
              style={{ borderWidth: 1, borderColor: "#00ADB5", width: "100%" }}
            >
              Nhắn tin
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
