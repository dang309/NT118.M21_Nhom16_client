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
import { IPost, SET_POST } from "../features/PostSlice";

import { User } from "../types";
import { IUser } from "./../features/UserSlice";

import { useNavigation } from "@react-navigation/native";
import { Post } from "../components";

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

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const cUser = useAppSelector<IUser>((state) => state.user);
  const post = useAppSelector<IPost>((state) => state.post);

  const navigation = useNavigation();

  const [showDialogOptions, setShowDialogOptions] = useState<boolean>(false);
  const [btnIndex, setBtnIndex] = useState<string>("posts");
  const [thumbnail, setThumbnail] = useState<any>(null);

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
    setShowDialogOptions(false);
  };

  const loadThumbnail = async () => {
    const response = await fetch(
      `https://api-nhom16.herokuapp.com/v1/posts/thumbnail/${cUser.currentUserInfo.user.id}`,
      {
        method: "GET",
      }
    );
    const imageBlob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setThumbnail(base64data);
    };
  };

  const loadPosts = async () => {
    try {
      const res = await REQUEST({
        method: "GET",
        url: "/posts",
      });

      if (res && res.data.result) {
        dispatch(SET_POST({ des: "personal", data: res.data.data.results }));
      }
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

  useEffect(() => {
    loadPosts();
    loadThumbnail();
  }, []);

  return (
    <View style={styles.container}>
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
                {!thumbnail ? (
                  <Avatar.Icon size={64} icon="person-outline" />
                ) : (
                  <Avatar.Image
                    size={64}
                    source={{
                      uri: thumbnail,
                    }}
                  />
                )}

                <Title>{cUser.currentUserInfo.user.username}</Title>
                {cUser.currentUserInfo.user.bio.length > 0 && (
                  <Text style={{ fontSize: 14 }}>
                    {cUser.currentUserInfo.user.bio}
                  </Text>
                )}
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
                  {renderStat(
                    PROFILE_CONSTANT.SOUNDS,
                    post.list.personal.length,
                    {
                      alignItems: "center",
                    }
                  )}
                  {renderStat(
                    PROFILE_CONSTANT.FOLLOWERS,
                    cUser.currentUserInfo.user.followers.length,
                    {
                      alignItems: "center",
                    }
                  )}

                  {renderStat(
                    PROFILE_CONSTANT.FOLLOWING,
                    cUser.currentUserInfo.user.following.length,
                    {
                      alignItems: "center",
                    }
                  )}
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
                  mode="outlined"
                  uppercase
                  icon="pencil-outline"
                  onPress={handleEditProfile}
                  style={{
                    borderWidth: 1,
                    borderColor: "#00ADB5",
                    width: "100%",
                  }}
                >
                  Chỉnh sửa thông tin
                </Button>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <IconButton onPress={handleLogout} icon="log-out-outline" />
              </View>
            </View>
          </View>

          <View style={{ alignItems: "center" }}>
            <ToggleButton.Row onValueChange={setBtnIndex} value={btnIndex}>
              <ToggleButton
                icon="grid-outline"
                value="posts"
                style={{ borderBottomWidth: 0, width: "50%" }}
              />
              <ToggleButton
                icon="bookmark"
                value="bookmarks"
                style={{ borderBottomWidth: 0, width: "50%" }}
              />
            </ToggleButton.Row>
          </View>

          <Divider style={{ height: 1 }} />

          {btnIndex === "posts" && (
            <View>
              {post.list.personal.length > 0 &&
                post.list.personal.map((item) => {
                  return <Post key={item.id} {...item} />;
                })}
            </View>
          )}

          {btnIndex === "bookmarks" && (
            <View>
              {post.list.bookmark.length > 0 &&
                post.list.bookmark.map((item) => {
                  return <Post key={item.id} {...item} />;
                })}
            </View>
          )}
        </ScrollView>
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
