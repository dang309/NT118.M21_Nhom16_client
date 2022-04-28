import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Headline,
  Searchbar,
  Title,
  Caption,
} from "react-native-paper";

import { useNavigation } from "@react-navigation/core";
import { REQUEST } from "../utils";

import { useAppSelector } from "../app/hook";

import { IUser } from "../features/UserSlice";
import { SocketContext } from "../context/socket";

const ChatContactScreen = () => {
  const navigation = useNavigation();

  const socket = useContext(SocketContext);

  const cUser = useAppSelector<IUser>((state) => state.user);

  const [searchValue, setSearchValue] = useState<string>("");
  const [partners, setPartners] = useState<any>(null);

  const loadConversation = async () => {
    let filters = [];
    filters.push({
      key: ["first_user_id", "second_user_id"],
      operator: "or",
      value: cUser.currentUserInfo.user.id,
    });
    const params = {
      filters: JSON.stringify(filters),
    };
    try {
      const res = await REQUEST({
        method: "GET",
        url: "/conversations",
        params,
      });

      if (res && res.data.result) {
        const conversations = res.data.data.results;
        let temp: string[] = [];
        conversations.forEach((conversation: any) => {
          if (conversation.first_user_id === cUser.currentUserInfo.user.id) {
            temp.push(conversation.second_user_id);
          }
          if (conversation.second_user_id === cUser.currentUserInfo.user.id) {
            temp.push(conversation.first_user_id);
          }
        });

        let filters = [];

        filters.push({
          key: "_id",
          operator: "in",
          value: temp,
        });

        const params = {
          filters: JSON.stringify(filters),
        };

        const resMessage = await REQUEST({
          method: "GET",
          url: "/users",
          params,
        });

        if (resMessage && resMessage.data.result) {
          setPartners(resMessage.data.data.results);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const initConversation = async (userId: string) => {
    try {
      const dataToSend = {
        firstUserId: cUser.currentUserInfo.user.id,
        secondUserId: userId,
      };
      socket.emit("messenger:create_room", dataToSend);
    } catch (err) {
      console.error(err);
    }
  };

  const goToChatConversation = (payload: any) => {
    const { conversationId, secondUserId } = payload;

    navigation.navigate("ChatConversation", {
      conversationId,
      userId: secondUserId,
    });
  };

  useEffect(() => {
    loadConversation();
  }, []);

  useEffect(() => {
    socket.on("messenger:room_id", goToChatConversation);
  }, []);

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
        {partners ? (
          <FlatList
            data={partners}
            renderItem={({ item }) => {
              return (
                <View key={item.id}>
                  <TouchableOpacity onPress={() => initConversation(item.id)}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Avatar.Icon
                        icon="person-outline"
                        size={48}
                        style={{ marginRight: 8 }}
                      />

                      <View>
                        <Text style={{ fontWeight: "bold", marginBottom: -4 }}>
                          {item.username}
                        </Text>
                        {/* <Caption>Đang hoạt động</Caption> */}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        ) : (
          <ActivityIndicator color="#00adb5" />
        )}
      </View>
    </View>
  );
};

export default ChatContactScreen;
