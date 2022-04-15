import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";

import { Avatar, Caption, IconButton } from "react-native-paper";

import { REQUEST } from "../utils";

import moment from "moment";

const CommentItem = (props: any) => {
  const [userComment, setUserComment] = useState<any | null>(null);

  const getUserById = async () => {
    try {
      const res = await REQUEST({
        method: "GET",
        url: `/users/${props.user_comment_id}`,
      });

      if (res && !res.data.result) return;

      console.log(res.data.data);

      setUserComment(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getUserById();
  }, []);

  return (
    <View
      key={props.id}
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 8,
      }}
    >
      <View style={{ marginRight: 8 }}>
        <Avatar.Icon icon="person" size={48} />
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexWrap: "wrap",
          }}
        >
          <Text style={{ marginRight: 8, fontWeight: "bold" }}>
            {userComment?.username}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginVertical: -2,
          }}
        >
          <Caption style={{ marginRight: 16 }}>
            {moment(props.created_at).format("MMM DD, HH:mm")}
          </Caption>
          <Caption>{props.users_like.length} thích</Caption>
        </View>

        <View>
          <Text style={{ lineHeight: 18 }}>{props.content}</Text>
        </View>
      </View>
      <View>
        <IconButton icon="heart-outline" />
      </View>
    </View>
  );
};

export default CommentItem;
