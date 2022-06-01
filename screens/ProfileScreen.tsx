import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  FlatList,
} from "react-native";
import { useState, useEffect, useCallback, useContext, useRef } from "react";

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
  Caption,
} from "react-native-paper";

import PROFILE_CONSTANT from "./../constants/Profile";
import { REQUEST } from "../utils";
import { useAppDispatch, useAppSelector } from "./../app/hook";
import { SET_USER } from "../features/UserSlice";
import { getPosts, IPost, SET_POST } from "../features/PostSlice";

import { User } from "../types";
import { IUser } from "./../features/UserSlice";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Icon, Post } from "../components";
import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { DBContext } from "../context/db";
import moment from "moment";
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

export default function ProfileScreen() {
  const dispatch = useAppDispatch();

  const socket = useContext(SocketContext);

  const flatListRef = useRef<any>(null);

  const state = useAppSelector<RootState>((state) => state);
  const USER = useAppSelector<IUser>((state) => state.user);
  const post = useAppSelector<IPost>((state) => state.post);

  const navigation = useNavigation();
  const route: RouteProp<{ params: { postId: string } }, "params"> = useRoute();

  const [btnIndex, setBtnIndex] = useState<string>("posts");

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
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
      await AsyncStorage.clear();

      socket.disconnect();

      navigation.navigate("Login");
    } catch (err) {
      console.log(err);
    }
  };

  const getPersonalPost = createDraftSafeSelector(
    (state: RootState) => state,
    (state) => {
      return state.post.list.filter(
        (o) => o.posting_user.id === USER.loggedInUser.id
      );
    }
  );

  const countPersonalPost = createDraftSafeSelector(
    (state: RootState) => state,
    (state) => {
      return state.post.list.filter(
        (o) => o.posting_user.id === USER.loggedInUser.id
      ).length;
    }
  );

  const getBookmarkedPosts = createDraftSafeSelector(
    (state: RootState) => state.post,
    (post) => {
      return post.list
        .map((item) => {
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
        .filter((o) => o.is_bookmarked_from_me);
    }
  );

  useEffect(() => {
    if (!route.params?.postId.length) return;
    if (flatListRef.current) {
      let itemToScroll = getPersonalPost(state).findIndex(
        (o) => o.id === route.params?.postId
      );
      if (itemToScroll < 0) return;
      flatListRef.current.scrollToIndex({
        animated: true,
        index: itemToScroll,
      });
    }
  }, [route.params?.postId]);

  return (
    <View style={styles.container}>
      <View>
        {btnIndex === "posts" && (
          <View>
            <FlatList
              ref={flatListRef}
              data={getPersonalPost(state)}
              renderItem={({ item }) => <Post key={item.id} {...item} />}
              keyExtractor={(item) => {
                return item.id;
              }}
              getItemLayout={(data, index) => ({
                length: data?.length || 0,
                offset: (data?.length || 0) * index,
                index,
              })}
              onScrollToIndexFailed={(info) => {
                const wait = new Promise((resolve) => setTimeout(resolve, 500));
                wait.then(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                  });
                });
              }}
              ListHeaderComponent={
                <>
                  <View style={{ marginBottom: 8, flex: 1 }}>
                    <View
                      style={{
                        paddingTop: 8,
                        marginBottom: 16,
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          marginBottom: 8,
                          padding: 8,
                        }}
                      >
                        {!USER.loggedInUser?.avatar?.uri?.length ? (
                          <Avatar.Icon size={64} icon="person-outline" />
                        ) : (
                          <Avatar.Image
                            size={64}
                            source={{
                              uri: USER.loggedInUser.avatar.uri,
                            }}
                          />
                        )}

                        <Title>{USER.loggedInUser.username}</Title>
                        {USER.loggedInUser.bio.length > 0 && (
                          <Text style={{ fontSize: 14, marginVertical: 4 }}>
                            {USER.loggedInUser.bio}
                          </Text>
                        )}

                        <View
                          style={{
                            alignItems: "center",
                            flex: 1,
                            width: "100%",
                          }}
                        >
                          {USER.loggedInUser.phone_number.length > 0 && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Icon
                                name="phone-portrait-outline"
                                size={20}
                                style={{ marginRight: 8 }}
                              />
                              <Caption>
                                {USER.loggedInUser.phone_number}
                              </Caption>
                            </View>
                          )}

                          {USER.loggedInUser.address.length > 0 && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Icon
                                name="home-outline"
                                size={20}
                                style={{ marginRight: 8 }}
                              />
                              <Caption>{USER.loggedInUser.address}</Caption>
                            </View>
                          )}

                          {USER.loggedInUser.birthday.length > 0 && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Icon
                                name="calendar-outline"
                                size={20}
                                style={{ marginRight: 8 }}
                              />
                              <Caption>
                                {moment(USER.loggedInUser.birthday).format(
                                  "MM/DD/YYYY"
                                )}
                              </Caption>
                            </View>
                          )}
                        </View>
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
                            countPersonalPost(state),
                            {
                              alignItems: "center",
                            }
                          )}
                          {renderStat(
                            PROFILE_CONSTANT.FOLLOWERS,
                            USER.loggedInUser.followers.length,
                            {
                              alignItems: "center",
                            }
                          )}

                          {renderStat(
                            PROFILE_CONSTANT.FOLLOWING,
                            USER.loggedInUser.following.length,
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
                        <IconButton
                          onPress={handleLogout}
                          icon="log-out-outline"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <ToggleButton.Row
                      onValueChange={setBtnIndex}
                      value={btnIndex}
                    >
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
                </>
              }
            />
          </View>
        )}

        {btnIndex === "bookmarks" && (
          <View>
            <FlatList
              // ref={flatListRef}
              data={getBookmarkedPosts(state)}
              renderItem={({ item }) => <Post key={item.id} {...item} />}
              keyExtractor={(item) => {
                return item.id;
              }}
              getItemLayout={(data, index) => ({
                length: data?.length || 0,
                offset: (data?.length || 0) * index,
                index,
              })}
              onScrollToIndexFailed={(info) => {
                const wait = new Promise((resolve) => setTimeout(resolve, 500));
                wait.then(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                  });
                });
              }}
              ListHeaderComponent={
                <>
                  <View style={{ marginBottom: 8, flex: 1 }}>
                    <View
                      style={{
                        paddingTop: 8,
                        marginBottom: 16,
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          marginBottom: 8,
                          padding: 8,
                        }}
                      >
                        {!USER.loggedInUser?.avatar?.uri?.length ? (
                          <Avatar.Icon size={64} icon="person-outline" />
                        ) : (
                          <Avatar.Image
                            size={64}
                            source={{
                              uri: USER.loggedInUser.avatar.uri,
                            }}
                          />
                        )}

                        <Title>{USER.loggedInUser.username}</Title>
                        {USER.loggedInUser.bio.length > 0 && (
                          <Text style={{ fontSize: 14, marginVertical: 4 }}>
                            {USER.loggedInUser.bio}
                          </Text>
                        )}

                        <View
                          style={{
                            alignItems: "center",
                            flex: 1,
                            width: "100%",
                          }}
                        >
                          {USER.loggedInUser.phone_number.length > 0 && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Icon
                                name="phone-portrait-outline"
                                size={20}
                                style={{ marginRight: 8 }}
                              />
                              <Caption>
                                {USER.loggedInUser.phone_number}
                              </Caption>
                            </View>
                          )}

                          {USER.loggedInUser.address.length > 0 && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Icon
                                name="home-outline"
                                size={20}
                                style={{ marginRight: 8 }}
                              />
                              <Caption>{USER.loggedInUser.address}</Caption>
                            </View>
                          )}

                          {USER.loggedInUser.birthday.length > 0 && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Icon
                                name="calendar-outline"
                                size={20}
                                style={{ marginRight: 8 }}
                              />
                              <Caption>
                                {moment(USER.loggedInUser.birthday).format(
                                  "MM/DD/YYYY"
                                )}
                              </Caption>
                            </View>
                          )}
                        </View>
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
                            countPersonalPost(state),
                            {
                              alignItems: "center",
                            }
                          )}
                          {renderStat(
                            PROFILE_CONSTANT.FOLLOWERS,
                            USER.loggedInUser.followers.length,
                            {
                              alignItems: "center",
                            }
                          )}

                          {renderStat(
                            PROFILE_CONSTANT.FOLLOWING,
                            USER.loggedInUser.following.length,
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
                        <IconButton
                          onPress={handleLogout}
                          icon="log-out-outline"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <ToggleButton.Row
                      onValueChange={setBtnIndex}
                      value={btnIndex}
                    >
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
                </>
              }
            />
          </View>
        )}
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
