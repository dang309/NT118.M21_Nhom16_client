import { ScrollView, StatusBar, StyleSheet, View, Text } from "react-native";
import { useState, useEffect, useContext } from "react";

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
import { CLEAR_USER, SET_USER, UPDATE_USER } from "../features/UserSlice";
import { IPost, IPostItem, SET_POST } from "../features/PostSlice";

import { User } from "../types";
import { IUser } from "./../features/UserSlice";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Header, Post } from "../components";

import { SocketContext } from "../context/socket";

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

  const socket = useContext(SocketContext);

  const [posts, setPosts] = useState<IPostItem[] | null>(null);
  const [showDialogOptions, setShowDialogOptions] = useState<boolean>(false);
  const [btnIndex, setBtnIndex] = useState<string>("posts");
  const [user, setUser] = useState<any>(null);
  const [toggleFollow, setToggleFollow] = useState<boolean>(false);
  const [toggleUnfollowDialog, setToggleUnfollowDialog] =
    useState<boolean>(false);

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
    setShowDialogOptions(false);
  };

  const loadThumbnail = async (userId: string, avatar: any) => {
    if (!avatar?.key.length || !avatar?.bucket.length) return;
    const response = await fetch(
      `https://api-nhom16.herokuapp.com/v1/users/avatar/${userId}`,
      {
        method: "GET",
      }
    );
    let result;
    const imageBlob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = () => {
      const base64data = reader.result;
      result = base64data;
    };
    return result;
  };

  const loadPosts = async () => {
    try {
      let filters = [];
      filters.push({
        key: "user_id",
        operator: "=",
        value: route.params?.userId,
      });
      const params = {
        filters: JSON.stringify(filters),
      };
      const res = await REQUEST({
        method: "GET",
        url: "/posts",
        params,
      });

      if (res && res.data.result) {
        setPosts(res.data.data.results);
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
      const { id, avatar } = res.data.data;
      let temp = res.data.data;
      const _avatar = await loadThumbnail(id, avatar);
      temp = Object.assign(temp, {
        avatar: _avatar || "",
      });
      if (temp.followers.some((o) => o === cUser.currentUserInfo.user.id)) {
        setToggleFollow(true);
      }
      setUser(temp);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFollow = async () => {
    try {
      const dataToSend = {
        userIdSource: cUser.currentUserInfo.user.id,
        userIdDestination: route.params?.userId,
      };
      socket.emit("user:toggle_follow", dataToSend);
    } catch (err) {
      console.error(err);
    }
  };

  const getNumFollowing = (data: any) => {
    const { num_following } = data;
    dispatch(UPDATE_USER({ following: num_following }));
  };

  const getNumFollowers = (data: any) => {
    const { num_followers } = data;
    setUser((prev: any) => ({ ...prev, followers: num_followers }));
  };

  const initConversation = async () => {
    try {
      const dataToSend = {
        firstUserId: cUser.currentUserInfo.user.id,
        secondUserId: route.params?.userId,
      };
      socket.emit("messenger:create_room", dataToSend);
    } catch (err) {
      console.error(err);
    }
  };

  const goToChatConversation = (payload: any) => {
    const { conversationId } = payload;

    navigation.navigate("ChatConversation", {
      conversationId,
      userId: route.params?.userId,
    });
  };

  useEffect(() => {
    loadPosts();
    getUserById();
  }, []);

  useEffect(() => {
    socket.on("user:num_following", getNumFollowing);
    socket.on("user:num_followers", getNumFollowers);
    socket.on("messenger:room_id", goToChatConversation);
  }, []);

  return (
    <View style={styles.container}>
      <Header showLeftIcon showRightIcon={false} title="Hồ sơ cá nhân" />
      {user && (
        <View>
          <ScrollView>
            <View style={{ marginBottom: 8 }}>
              <View
                style={{
                  paddingTop: 8,
                  marginBottom: 16,
                }}
              >
                <View
                  style={{ alignItems: "center", marginBottom: 8, padding: 8 }}
                >
                  {user.avatar?.length === 0 ? (
                    <Avatar.Icon size={64} icon="person-outline" />
                  ) : (
                    <Avatar.Image
                      size={64}
                      source={{
                        uri: user.avatar,
                      }}
                    />
                  )}

                  <Title>{user.username}</Title>
                  {user.bio.length > 0 && (
                    <Text style={{ fontSize: 14 }}>{user.bio}</Text>
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
                    {renderStat(PROFILE_CONSTANT.SOUNDS, 0, {
                      alignItems: "center",
                    })}
                    {renderStat(
                      PROFILE_CONSTANT.FOLLOWERS,
                      user.followers.length,
                      {
                        alignItems: "center",
                      }
                    )}

                    {renderStat(
                      PROFILE_CONSTANT.FOLLOWING,
                      user.following.length,
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
                  {toggleFollow ? (
                    <Button
                      mode="contained"
                      uppercase
                      onPress={() => {
                        setToggleUnfollowDialog(true);
                      }}
                      icon="caret-down"
                      style={{
                        borderWidth: 1,
                        borderColor: "#00ADB5",
                        width: "100%",
                      }}
                    >
                      Đang theo dõi
                    </Button>
                  ) : (
                    <Button
                      mode="contained"
                      uppercase
                      onPress={() => {
                        setToggleFollow(true);
                        handleFollow();
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: "#00ADB5",
                        width: "100%",
                      }}
                    >
                      Theo dõi
                    </Button>
                  )}
                </View>
                <View style={{ flex: 1, marginHorizontal: 8 }}>
                  <Button
                    mode="outlined"
                    uppercase
                    icon="chatbubble-outline"
                    onPress={initConversation}
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

            <View>
              {posts &&
                posts.length > 0 &&
                posts.map((item) => {
                  return <Post key={item.id} {...item} />;
                })}
              {(!posts || (posts && posts.length === 0)) && (
                <View style={{ alignItems: "center" }}>
                  <Title style={{ color: "#999" }}>
                    Không có bài viết nào.
                  </Title>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}

      <Portal>
        <Dialog
          visible={toggleUnfollowDialog}
          onDismiss={() => setToggleUnfollowDialog(false)}
        >
          <Dialog.Content>
            <Button
              mode="contained"
              onPress={() => {
                setToggleUnfollowDialog(false);
                setToggleFollow(false);
                handleFollow();
              }}
              style={{ marginBottom: 8 }}
            >
              Hủy theo dõi
            </Button>
            <Button
              mode="outlined"
              onPress={() => setToggleUnfollowDialog(false)}
              style={{ borderColor: "#00adb5", borderWidth: 1 }}
            >
              Hủy
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
