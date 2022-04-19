import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

export default function NewsFeedScreen() {
  const dispatch = useAppDispatch();
  const post = useAppSelector<IPost>((state) => state.post);

  const loadPosts = async () => {
    try {
      const res = await REQUEST({
        method: "GET",
        url: "/posts",
      });

      if (res && res.data.result) {
        dispatch(SET_POST(res.data.data));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <View style={styles.header}>
            <Text>Logo</Text>
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
                width: "60%",
              }}
            >
              <TextInput placeholder="Tìm kiếm..." />
              <Icon name="search" size={16} color="#c4c4c4" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                name="logo-bitcoin"
                size={24}
                color="#FFA800"
                style={{ paddingRight: 16 }}
              />
              <Icon name="notifications" size={24} color="#000" />
            </View>
          </View>

          {post.list.length > 0 &&
            post.list.map((post) => {
              return <Post key={post.id} {...post} />;
            })}
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
