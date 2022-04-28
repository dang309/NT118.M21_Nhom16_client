import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState, useEffect } from "react";

import EditScreenInfo from "../components/EditScreenInfo";
import { NavigationNewsFeedProps } from "../types";

import { Icon, Post } from "../components";

import { SafeAreaView } from "react-native-safe-area-context";

import { IPostItem, IPost, SET_POST } from "../features/PostSlice";

import REQUEST from "../utils/request";
import { useAppDispatch, useAppSelector } from "../app/hook";

import { useNavigation } from "@react-navigation/core";
import { IconButton, Title } from "react-native-paper";

import { CryptoTransfer } from "../components";

export default function NewsFeedScreen() {
  const dispatch = useAppDispatch();
  const post = useAppSelector<IPost>((state) => state.post);

  const navigation = useNavigation();

  const [toggleCryptoDialog, setToggleCryptoDialog] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<string>("");

  const loadPosts = async () => {
    try {
      const params = {
        sort: "created_at:desc",
      };
      const res = await REQUEST({
        method: "GET",
        url: "/posts",
        params,
      });

      if (res && res.data.result) {
        dispatch(SET_POST({ des: "newsfeed", data: res.data.data.results }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleGotoProfile = () => {
    if (selectedProfile.length === 0) return;
    navigation.navigate("ProfileViewer", { userId: selectedProfile });
  };

  useEffect(() => {
    handleGotoProfile();
  }, [selectedProfile]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <View style={styles.header}>
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

                marginRight: 8,
              }}
            >
              <TextInput
                placeholder="Tìm kiếm..."
                onPressIn={() => navigation.navigate("Search")}
              />
              <Icon name="search" size={16} color="#c4c4c4" />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconButton
                icon="logo-bitcoin"
                size={24}
                color="#FFA800"
                onPress={() => setToggleCryptoDialog(true)}
                style={{ paddingRight: 16 }}
              />
              <Icon name="notifications" size={24} color="#000" />
            </View>

            <CryptoTransfer
              toggleCryptoDialog={toggleCryptoDialog}
              setToggleCryptoDialog={setToggleCryptoDialog}
            />
          </View>

          {post.list.newsfeed.length > 0 ? (
            post.list.newsfeed.map((post) => {
              return (
                <Post
                  key={post.id}
                  {...post}
                  setSelectedProfile={setSelectedProfile}
                />
              );
            })
          ) : (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Title style={{ color: "#999" }}>Chưa có bài viết nào.</Title>
            </View>
          )}
        </View>
      </ScrollView>
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
