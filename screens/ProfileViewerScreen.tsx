import { ScrollView, StatusBar, StyleSheet, View, Text } from "react-native";
import { useState, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationProfileProps } from "../types";

import {
  Avatar,
  Headline,
  IconButton,
  Subheading,
  Portal,
  Dialog,
  Paragraph,
  Button,
  Menu,
  Divider,
  List,
  Title,
  ToggleButton,
} from "react-native-paper";

import PROFILE_CONSTANT from "./../constants/Profile";
import { REQUEST } from "../utils";
import { useAppDispatch, useAppSelector } from "./../app/hook";
import { CLEAR_USER, SET_USER } from "../features/UserSlice";
import { IPost, IPostItem, SET_POST } from "../features/PostSlice";

import { User } from "../types";
import { IUser } from "./../features/UserSlice";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Header, Post } from "../components";

const renderStat = (header: string, quantity: number, styles: object) => {
  return (
    <View style={{ ...styles }}>
      <Text style={{ fontWeight: "bold", fontSize: 20 }} ellipsizeMode="tail">
        {quantity}
      </Text>
      <Text style={{ fontSize: 16 }}>{header}</Text>
    </View>
  );
};

export default function ProfileViewerScreen() {
  const dispatch = useAppDispatch();
  const cUser = useAppSelector<IUser>((state) => state.user);

  const navigation = useNavigation();
  const route = useRoute();

  const [posts, setPosts] = useState<IPostItem[] | null>(null);
  const [showDialogOptions, setShowDialogOptions] = useState<boolean>(false);
  const [btnIndex, setBtnIndex] = useState<string>("posts");
  const [user, setUser] = useState<any>(null);

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
    setShowDialogOptions(false);
  };

  const loadPosts = async () => {
    try {
      const res = await REQUEST({
        method: "GET",
        url: "/posts",
      });

      if (res && res.data.result) {
        dispatch(SET_POST({ des: "personal", data: res.data.data }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getUserById = async () => {
    try {
      const res = await REQUEST({
        method: "GET",
        url: `/users/${route.params?.userId}`,
      });

      if (res && !res.data.result) return;

      setUser(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      const tokens = await AsyncStorage.getItem("@tokens");

      await REQUEST({
        method: "POST",
        url: "/auth/logout",
        data: {
          refreshToken: tokens?.length ? JSON.parse(tokens).refresh.token : "",
        },
      });
      await AsyncStorage.removeItem("@tokens");
      dispatch(CLEAR_USER());
      navigation.navigate("Login");
    } catch (err) {
      console.log(err);
    }
  };

  console.log(route.params);

  useEffect(() => {
    // loadPosts();
    getUserById();
  }, []);

  return (
    <View style={styles.container}>
      <Header showLeftIcon showRightIcon={false} title="Hồ sơ cá nhân" />
      {user && (
        <View>
          <ScrollView>
            <View style={{ marginBottom: 8, flex: 1 }}>
              <View
                style={{
                  paddingTop: 8,
                  marginBottom: 16,
                }}
              >
                <View
                  style={{ alignItems: "center", marginBottom: 8, padding: 8 }}
                >
                  <Avatar.Image
                    size={64}
                    source={{
                      uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
                    }}
                  />

                  <Title>{user.username}</Title>
                  <Text style={{ fontSize: 14 }}>{user.bio}</Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderTopWidth: 1,
                    borderTopColor: "#e5e5e5",
                    borderBottomWidth: 1,
                    borderBottomColor: "#e5e5e5",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
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
                    mode="contained"
                    uppercase
                    style={{
                      borderWidth: 1,
                      borderColor: "#00ADB5",
                      width: "100%",
                    }}
                  >
                    Follow
                  </Button>
                </View>
                <View style={{ flex: 1, marginHorizontal: 8 }}>
                  <Button
                    mode="outlined"
                    uppercase
                    style={{
                      borderWidth: 1,
                      borderColor: "#00ADB5",
                      width: "100%",
                    }}
                  >
                    Nhắn tin
                  </Button>
                </View>
              </View>
            </View>

            {/* {posts.length > 0 &&
            posts.map((item) => {
              return <Post key={item.id} {...item} />;
            })} */}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
