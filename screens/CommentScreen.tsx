import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  TextInput,
  Avatar,
  Caption,
  IconButton,
  Title,
} from "react-native-paper";

import { useAppDispatch, useAppSelector } from "../app/hook";
import { IComment, SET_COMMENT, ADD_COMMENT } from "../features/CommentSlice";

import { REQUEST } from "../utils";
import { CommentItem } from "../components";
import { IUser } from "../features/UserSlice";

// components
import { Header } from "../components";
import { useRoute } from "@react-navigation/native";

const CommentScreen = () => {
  const dispatch = useAppDispatch();

  const route = useRoute();

  const comment = useAppSelector<IComment>((state) => state.comment);
  const cUser = useAppSelector<IUser>((state) => state.user);

  const [content, setContent] = useState<string>("");

  const loadComment = async () => {
    try {
      let filters = [];
      filters.push({
        key: "post_id",
        operator: "=",
        value: route.params?.postId,
      });
      const params = {
        filters: JSON.stringify(filters),
      };
      const res = await REQUEST({
        method: "GET",
        url: "/comments",
        params,
      });

      if (res && res.data.result) {
        console.log(res.data);
        dispatch(SET_COMMENT(res.data.data.results));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async () => {
    try {
      const dataToSend = {
        post_id: route.params?.postId,
        content,
        user_comment_id: cUser.currentUserInfo.user.id,
      };
      const res = await REQUEST({
        method: "POST",
        url: "/comments",
        data: dataToSend,
      });

      if (res && res.data.result) {
        dispatch(ADD_COMMENT(res.data.data));
        setContent("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadComment();
  }, []);
  return (
    <View style={styles.container}>
      <View>
        <Header showLeftIcon showRightIcon={false} title="Bình luận" />
        <View style={{ margin: 8 }}>
          {comment.list.length > 0 && (
            <ScrollView>
              <View>
                {comment.list.map((item) => {
                  return <CommentItem key={item.id} {...item} />;
                })}
              </View>
            </ScrollView>
          )}

          {comment.list.length === 0 && (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Title>Chưa có bình luận nào.</Title>
            </View>
          )}
        </View>
      </View>

      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <TextInput
          mode="outlined"
          autoComplete="off"
          value={content}
          onChangeText={setContent}
          placeholder="Viết bình luận..."
          style={{
            backgroundColor: "#fff",
          }}
          left={
            <TextInput.Icon name="happy-outline" color="#ffd233" size={24} />
          }
          right={
            <TextInput.Icon
              name="send-sharp"
              size={24}
              color="#00adb5"
              onPress={handleAddComment}
              disabled={content.length === 0}
            />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",

    backgroundColor: "#fff",
  },
});

export default CommentScreen;
