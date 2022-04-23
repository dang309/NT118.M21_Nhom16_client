import { View, Text, StyleSheet, FlatList, TextInput } from "react-native";
import React, { useState } from "react";
import { Avatar, IconButton, Title } from "react-native-paper";

import { useNavigation } from "@react-navigation/core";

import EmojiPicker from "rn-emoji-keyboard";

type MessageType = {
  id: string;
  content: string;
  isFromMe: boolean;
};

const ChatConversation = () => {
  const navigation = useNavigation();

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [content, setContent] = useState<string>("");
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState<boolean>(false);

  const handleSendMessage = () => {
    if (!content.length) return;

    setMessages((prev) => [
      ...prev,
      { id: new Date().valueOf().toString(), content, isFromMe: true },
    ]);

    setContent("");
  };

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
        <Avatar.Icon
          icon="person-outline"
          size={48}
          style={{ marginRight: 8 }}
        />
        <Title>haidang__309</Title>
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
          data={messages}
          renderItem={({ item }) => {
            return (
              <View
                key={item.id}
                style={{
                  alignItems: item.isFromMe ? "flex-end" : "flex-start",
                }}
              >
                {item.isFromMe ? (
                  <Text
                    style={{
                      backgroundColor: item.isFromMe ? "#00adb5" : "#000",
                      color: item.isFromMe ? "#fff" : "#000",

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
          onPress={handleSendMessage}
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
