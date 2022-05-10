import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";

import { Avatar, Caption, IconButton } from "react-native-paper";

import { REQUEST } from "../utils";

import moment from "moment";
import { USER_SERVICES } from "../services";
import { ISingleUser } from "../features/UserSlice";

const CommentItem = (props: any) => {
  const [userComment, setUserComment] = useState<ISingleUser | null>(null);
  const [avatar, setAvatar] = useState<any>(null);

  const loadUserComment = async () => {
    const _user = await USER_SERVICES.getUserById(props.user_comment_id);
    const _avatar = await USER_SERVICES.loadAvatar(_user);

    setUserComment(_user);
    setAvatar(_avatar);
  };

  useEffect(() => {
    loadUserComment();
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
        {avatar ? (
          <Avatar.Image source={{ uri: avatar }} size={48} />
        ) : (
          <Avatar.Icon icon="person" size={48} />
        )}
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
