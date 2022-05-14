import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState, useEffect, useCallback } from "react";

import { Icon, Post } from "../components";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAppSelector } from "../app/hook";

import { useNavigation, useIsFocused } from "@react-navigation/core";
import {
  ActivityIndicator,
  Badge,
  FAB,
  IconButton,
  Title,
} from "react-native-paper";

import { CryptoTransfer, NotificationsDialog } from "../components";
import { useFocusEffect } from "@react-navigation/native";
import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { IUser } from "../features/UserSlice";

export default function NewsFeedScreen() {
  const navigation = useNavigation();

  const state = useAppSelector<RootState>((state) => state);
  const USER = useAppSelector<IUser>((state) => state.user);
  const isLoading = useAppSelector<boolean>((state) => state.common.loading);

  const [toggleCryptoDialog, setToggleCryptoDialog] = useState<boolean>(false);
  const [toggleNotiDialog, setToggleNotiDialog] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<string>("");

  const handleGotoProfile = () => {
    if (selectedProfile.length === 0) return;
    navigation.navigate("ProfileViewer", { userId: selectedProfile });
  };

  const getNewsfeedPosts = createDraftSafeSelector(
    (state: RootState) => state.post,
    (post) => {
      let temp = {};
      return post.list.map((item) => {
        temp = { ...item };
        if (item.users_like.some((o) => o === USER.loggedInUser.id)) {
          Object.assign(temp, { is_like_from_me: true });
        }
        if (item.users_listening.some((o) => o === USER.loggedInUser.id)) {
          Object.assign(temp, { is_hear_from_me: true });
        }
        if (USER.loggedInUser.bookmarked_posts.some((o) => o === item.id)) {
          Object.assign(temp, { is_bookmarked_from_me: true });
        }
        return temp;
      });
    }
  );

  const countNewsfeedPosts = createDraftSafeSelector(
    (state: RootState) => state.post,
    (post) => {
      return post.list.length;
    }
  );

  const countUnreadNotis = createDraftSafeSelector(
    (state: RootState) => state.notification,
    (noti) => {
      return noti.list.filter((o) => o.isUnread).length;
    }
  );

  useFocusEffect(
    useCallback(() => {
      handleGotoProfile();
    }, [selectedProfile])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <View style={styles.header}>
            <View>
              <Image
                source={require("../assets/images/logo.png")}
                style={{ width: 64 }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderColor: "#e5e5e5",
                borderWidth: 1,
                borderRadius: 24,
                padding: 8,
                paddingHorizontal: 16,
                height: 48,

                flex: 1,

                marginHorizontal: 8,
              }}
            >
              <TextInput
                placeholder="Tìm kiếm..."
                onPressIn={() => navigation.navigate("Search")}
              />
              <Icon name="search" size={16} color="#c4c4c4" />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => setToggleNotiDialog(true)}>
                <View>
                  <IconButton icon="notifications" size={24} color="#000" />
                  {countUnreadNotis(state) > 0 && (
                    <Badge
                      size={20}
                      style={{ position: "absolute", top: "10%", right: "15%" }}
                    >
                      {countUnreadNotis(state)}
                    </Badge>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <CryptoTransfer
              toggleCryptoDialog={toggleCryptoDialog}
              setToggleCryptoDialog={setToggleCryptoDialog}
            />

            <NotificationsDialog
              toggleNotiDialog={toggleNotiDialog}
              setToggleNotiDialog={setToggleNotiDialog}
              navigation={navigation}
            />
          </View>

          {countNewsfeedPosts(state) > 0 &&
            !isLoading &&
            getNewsfeedPosts(state).map((post) => {
              return (
                <Post
                  key={post.id}
                  {...post}
                  setSelectedProfile={setSelectedProfile}
                />
              );
            })}

          {isLoading && (
            <View style={{ margin: 8 }}>
              <ActivityIndicator color="#00adb5" size={32} />
            </View>
          )}

          {/* {getNewsfeedPosts(state) && countNewsfeedPosts(state) === 0 && (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Title style={{ color: "#999" }}>Chưa có bài viết nào.</Title>
            </View>
          )} */}
        </View>
      </ScrollView>
      <FAB
        icon="add"
        style={{
          backgroundColor: "#00adb5",
          position: "absolute",
          bottom: "4%",
          right: "4%",
        }}
        onPress={() => navigation.navigate("AddPost")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 64,
    borderBottomColor: "#e5e5e5",
    borderBottomWidth: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    width: "80%",
  },
});
