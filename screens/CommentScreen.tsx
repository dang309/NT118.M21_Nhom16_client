import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

import { TextInput, Title } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "../app/hook";
import {
  IComment,
  SET_COMMENT,
  ADD_COMMENT,
  CLEAR_COMENT,
} from "../features/CommentSlice";

import { REQUEST } from "../utils";
import { CommentItem } from "../components";
import { IUser } from "../features/UserSlice";

// components
import { Header } from "../components";
import { RouteProp, useRoute } from "@react-navigation/native";
import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

const CommentScreen = () => {
  const dispatch = useAppDispatch();

  const route: RouteProp<{ params: { postId: string } }, "params"> = useRoute();

  const state = useAppSelector<RootState>((state) => state);
  const comment = useAppSelector<IComment>((state) => state.comment);
  const USER = useAppSelector<IUser>((state) => state.user);

  const [content, setContent] = useState<string>("");

  const handleAddComment = async () => {
    try {
      const dataToSend = {
        post_id: route.params?.postId,
        content,
        user_comment_id: USER.loggedInUser.id,
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

  const getComments = createDraftSafeSelector(
    (state: RootState) => state.comment,
    (comment) => comment.list.filter((o) => o.post_id === route.params.postId)
  );

  return (
    <View style={styles.container}>
      <View>
        <Header
          showLeftIcon
          showRightIcon={false}
          title="Bình luận"
          handleUpdateProfile={() => console.log("")}
        />
        <View style={{ margin: 8 }}>
          {getComments(state).length > 0 && (
            <ScrollView>
              <View>
                {getComments(state).map((item) => {
                  return <CommentItem key={item.id} {...item} />;
                })}
              </View>
            </ScrollView>
          )}

          {getComments(state).length === 0 && (
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
