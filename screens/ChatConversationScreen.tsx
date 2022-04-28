import { View, Text, StyleSheet, FlatList, TextInput } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Avatar, IconButton, Title } from "react-native-paper";

import EmojiPicker from "rn-emoji-keyboard";
import { useNavigation, useRoute } from "@react-navigation/native";
import { REQUEST } from "../utils";
import { SocketContext } from "../context/socket";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { IUser } from "../features/UserSlice";
import {
  ADD_MESSAGE,
  IMessage,
  IMessenger,
  SET_MESSAGES,
} from "../features/MessengerSlice";

const ChatConversation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const socket = useContext(SocketContext);

  const dispatch = useAppDispatch();

  const cUser = useAppSelector<IUser>((state) => state.user);
  const messenger = useAppSelector<IMessenger>((state) => state.messenger);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [content, setContent] = useState<string>("");
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState<boolean>(false);

  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<any>(null);

  const getUserById = async () => {
    try {
      const res = await REQUEST({
        method: "GET",
        url: `/users/${route.params?.userId}`,
      });

      if (res && !res.data.result) return;

      setUser(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadAvatar = async () => {
    const response = await fetch(
      `https://api-nhom16.herokuapp.com/v1/users/avatar/${route.params?.userId}`,
      {
        method: "GET",
      }
    );
    const imageBlob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setAvatar(base64data);
    };
  };

  const loadMessages = async () => {
    try {
      let filters = [];
      filters.push({
        key: "conversation_id",
        operator: "=",
        value: route.params?.conversationId,
      });
      const params = {
        filters: JSON.stringify(filters),
      };
      const res = await REQUEST({
        method: "GET",
        url: "/messages",
        params,
      });

      if (res && res.data.result) {
        dispatch(SET_MESSAGES(res.data.data.results));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendPrivateMessage = () => {
    const dataToSend = {
      conversation_id: route.params?.conversationId,
      content,
      from: cUser.currentUserInfo.user.id,
      to: route.params?.userId,
    };
    socket.emit("messenger:send_private_message", dataToSend);
    setContent("");
  };

  const handleReceivePrivateMessage = (payload: any) => {
    const { _id, conversationId, content, from, to } = payload;

    console.log(payload);

    const data = {
      id: _id,
      content,
      conversation_id: conversationId,
      from,
      to,
    };

    dispatch(ADD_MESSAGE(data));
  };

  useEffect(() => {
    getUserById();
    loadAvatar();
    loadMessages();
  }, []);

  useEffect(() => {
    socket.on("messenger:send_private_message", handleReceivePrivateMessage);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#e5e5e5",

          padding: 8,
        }}
      >
        <IconButton
          icon="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />
        {user && (
          <>
            {avatar ? (
              <Avatar.Image
                source={{ uri: avatar }}
                size={48}
                style={{ marginRight: 8 }}
              />
            ) : (
              <Avatar.Icon
                icon="person-outline"
                size={48}
                style={{ marginRight: 8 }}
              />
            )}
            <Title>{user.username}</Title>
          </>
        )}
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-end",
          marginHorizontal: 16,
        }}
      >
        <FlatList
          data={messenger.messages.filter(
            (o) => o.conversation_id === route.params?.conversationId
          )}
          renderItem={({ item }) => {
            const isFromMe = Boolean(
              item.from === cUser.currentUserInfo.user.id
            );
            return (
              <View
                key={item.id}
                style={{
                  alignItems: isFromMe ? "flex-end" : "flex-start",
                }}
              >
                {isFromMe ? (
                  <Text
                    style={{
                      backgroundColor: isFromMe ? "#00adb5" : "#000",
                      color: isFromMe ? "#fff" : "#000",

                      padding: 8,
                      marginBottom: 4,

                      borderRadius: 16,

                      maxWidth: "60%",
                    }}
                  >
                    {item.content}
                  </Text>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <Avatar.Icon
                      icon="person-outline"
                      size={32}
                      style={{ marginRight: 4 }}
                    />

                    <Text
                      style={{
                        backgroundColor: "#fff",
                        color: "#000",

                        padding: 8,

                        borderWidth: 1,
                        borderColor: "#e5e5e5",
                        borderRadius: 16,

                        maxWidth: "60%",
                      }}
                    >
                      {item.content}
                    </Text>
                  </View>
                )}
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View
        style={{
          margin: 16,
          borderWidth: 1,
          borderColor: "#e5e5e5",
          borderRadius: 32,

          padding: 8,

          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          icon="happy-outline"
          size={24}
          color="#ffd233"
          onPress={() => setToggleEmojiPicker(true)}
        />
        <TextInput
          placeholder="Viết tin nhắn..."
          value={content}
          onChangeText={setContent}
          style={{
            flex: 1,

            backgroundColor: "#fff",
          }}
        />
        <IconButton
          icon="send-sharp"
          size={24}
          onPress={handleSendPrivateMessage}
          disabled={content.length === 0}
          color="#00adb5"
        />
        <EmojiPicker
          enableRecentlyUsed
          onEmojiSelected={(emoji) => setContent((prev) => prev + emoji.emoji)}
          open={toggleEmojiPicker}
          onClose={() => setToggleEmojiPicker(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",

    justifyContent: "space-between",
  },
});

export default ChatConversation;
