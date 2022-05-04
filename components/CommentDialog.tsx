import { View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";

import { Dialog, Portal, TextInput } from "react-native-paper";

import { useAppDispatch, useAppSelector } from "../app/hook";
import { IComment, SET_COMMENT, ADD_COMMENT } from "../features/CommentSlice";

import { REQUEST } from "../utils";
import CommentItem from "./CommentItem";
import { IUser } from "../features/UserSlice";

type Props = {
  postId: string;
  showCmt: boolean;
  setShowCmt: (value: boolean) => void;
};

const CommentDialog = ({ postId, showCmt, setShowCmt }: Props) => {
  const dispatch = useAppDispatch();

  const comment = useAppSelector<IComment>((state) => state.comment);
  const USER = useAppSelector<IUser>((state) => state.user);

  const [content, setContent] = useState<string>("");

  const loadComment = async () => {
    try {
      const params = {
        post_id: postId,
        sort: "created_at:desc",
      };
      const res = await REQUEST({
        method: "GET",
        url: "/comments",
        params,
      });

      if (res && res.data.result) {
        dispatch(SET_COMMENT(res.data.data.results));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async () => {
    try {
      const dataToSend = {
        post_id: postId,
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

  useEffect(() => {
    loadComment();
  }, []);
  return (
    <View>
      <Portal>
        <Dialog visible={showCmt} onDismiss={() => setShowCmt(false)}>
          <Dialog.Title>Bình luận</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              <View>
                {comment.list.length > 0 &&
                  comment.list.map((item) => {
                    return <CommentItem key={item.id} {...item} />;
                  })}
              </View>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <TextInput
              mode="outlined"
              autoComplete="off"
              value={content}
              onChangeText={setContent}
              placeholder="Viết bình luận..."
              style={{
                flex: 1,
                backgroundColor: "#fff",
              }}
              left={
                <TextInput.Icon name="happy-outline" size={24} color="#999" />
              }
              right={
                content.length === 0 ? (
                  <TextInput.Icon name="send-outline" size={24} color="#999" />
                ) : (
                  <TextInput.Icon
                    name="send-sharp"
                    size={24}
                    color="#00adb5"
                    onPress={handleAddComment}
                  />
                )
              }
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default CommentDialog;
