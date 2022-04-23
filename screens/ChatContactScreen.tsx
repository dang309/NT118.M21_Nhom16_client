import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  Avatar,
  Headline,
  Searchbar,
  Title,
  Caption,
} from "react-native-paper";

import { useNavigation } from "@react-navigation/core";

const ChatContactScreen = () => {
  const navigation = useNavigation();

  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <View style={{ padding: 16, backgroundColor: "#fff", flex: 1 }}>
      <Title style={{ marginBottom: 8 }}>Trò chuyện</Title>

      <Searchbar
        value={searchValue}
        onChangeText={setSearchValue}
        placeholder="Tìm kiếm..."
        style={{ marginBottom: 8 }}
      />

      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Tin nhắn</Text>

      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChatConversation")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar.Icon
              icon="person-outline"
              size={48}
              style={{ marginRight: 8 }}
            />

            <View>
              <Text style={{ fontWeight: "bold", marginBottom: -4 }}>
                someone__123
              </Text>
              <Caption>Đang hoạt động</Caption>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatContactScreen;
