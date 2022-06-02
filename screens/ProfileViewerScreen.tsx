import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  FlatList,
} from "react-native";
import { useState, useEffect, useContext } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

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
  ActivityIndicator,
} from "react-native-paper";

import PROFILE_CONSTANT from "./../constants/Profile";
import { REQUEST } from "../utils";
import { useAppDispatch, useAppSelector } from "./../app/hook";
import { ISingleUser, SET_USER, UPDATE_USER } from "../features/UserSlice";
import { IPost, IPostItem, SET_POST } from "../features/PostSlice";

import { User } from "../types";
import { IUser } from "./../features/UserSlice";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Header, Post } from "../components";

import { SocketContext } from "../context/socket";
import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import UserServices from "../services/UserServices";
import { READ_MESSAGES } from "../features/MessengerSlice";

import { SingletonEventBus } from "../utils/event-bus";

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
  const USER = useAppSelector<IUser>((state) => state.user);

  const state = useAppSelector<RootState>((state) => state);

  const navigation = useNavigation();
  const route: RouteProp<{ params: { userId: string } }, "params"> = useRoute();

  const socket = useContext(SocketContext);

  const [posts, setPosts] = useState<IPostItem[] | null>(null);
  const [user, setUser] = useState<ISingleUser | null>(null);
  const [avatar, setAvatar] = useState<any>(null);
  const [toggleFollow, setToggleFollow] = useState<boolean>(false);
  const [toggleUnfollowDialog, setToggleUnfollowDialog] =
    useState<boolean>(false);

  const loadUserById = async () => {
    try {
      const _user = await UserServices.getUserById(route.params.userId);
      const _avatar = await UserServices.loadAvatar(_user);
      if (_user?.followers.some((o: string) => o === USER.loggedInUser.id)) {
        setToggleFollow(true);
      }
      setUser(_user);
      setAvatar(_avatar);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFollow = async () => {
    try {
      const dataToSend = {
        userIdSource: USER.loggedInUser.id,
        userIdDestination: route.params?.userId,
      };
      socket.emit("user:toggle_follow", dataToSend);
    } catch (err) {
      console.error(err);
    }
  };

  const initConversation = () => {
    let _contactIds = [];
    _contactIds.push(USER.loggedInUser.id);
    _contactIds.push(route.params.userId);
    socket.emit("messenger:read_message", {
      contactId: _contactIds.sort().join("_"),
    });
    dispatch(
      READ_MESSAGES({
        contactId: _contactIds.sort().join("_"),
      })
    );
    navigation.navigate("ChatConversation", {
      partnerId: route.params.userId,
      contactId: _contactIds.sort().join("_"),
    });
  };

  const getPosts = createDraftSafeSelector(
    (state: RootState) => state.post,
    (post) => {
      return post.list
        .map((item: IPostItem) => {
          let temp = { ...item };
          if (item.users_like.some((o) => o === USER.loggedInUser.id)) {
            Object.assign(temp, { is_like_from_me: true });
          }
          if (item.users_listening.some((o) => o === USER.loggedInUser.id)) {
            Object.assign(temp, { is_hear_from_me: true });
          }
          if (USER.loggedInUser.bookmarked_posts.some((o) => o === item.id)) {
            Object.assign(temp, { is_bookmarked_from_me: true });
          }
          return { ...temp };
        })
        .filter((o: IPostItem) => o.posting_user.id === route.params?.userId);
    }
  );

  useEffect(() => {
    loadUserById();
  }, []);

  useEffect(() => {
    const registry = SingletonEventBus.getInstance().register(
      "followers",
      (num_followers: number) => {
        setUser((prev: any) => ({ ...prev, followers: num_followers }));
      }
    );

    return () => {
      registry.unregister();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Header
        showLeftIcon
        showRightIcon={false}
        title="Hồ sơ cá nhân"
        handleUpdateProfile={() => console.log("")}
      />
      {user ? (
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
                  {avatar ? (
                    <Avatar.Image source={{ uri: avatar }} size={64} />
                  ) : (
                    <Avatar.Icon icon="person-outline" size={64} />
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
              {getPosts(state).map((post: IPostItem) => {
                return <Post key={post.id} {...post} />;
              })}
              {getPosts(state).length === 0 && (
                <View style={{ alignItems: "center" }}>
                  <Title style={{ color: "#999" }}>
                    Không có bài viết nào.
                  </Title>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color="#00adb5" />
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
