import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SectionList,
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Avatar,
  Headline,
  Searchbar,
  Title,
  Caption,
  Badge,
} from "react-native-paper";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { REQUEST } from "../utils";

import { useAppDispatch, useAppSelector } from "../app/hook";

import { ISingleUser, IUser } from "../features/UserSlice";
import { SocketContext } from "../context/socket";
import {
  ADD_MESSAGE,
  IMessenger,
  READ_MESSAGES,
  SET_MESSAGES,
  SET_UNREAD_MESSAGES,
} from "../features/MessengerSlice";
import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { USER_SERVICES } from "../services";

type TPropsChatContactItem = ISingleUser & { navigation: any };

const ChatContactItem = (props: TPropsChatContactItem) => {
  const dispatch = useAppDispatch();

  const socket = useContext(SocketContext);

  const USER = useAppSelector<IUser>((state) => state.user);
  const state = useAppSelector<RootState>((state) => state);
  const messenger = useAppSelector<IMessenger>((state) => state.messenger);

  const [avatar, setAvatar] = useState<any>(null);

  const handleGoToChatConversation = async () => {
    let _contactIds = [];
    _contactIds.push(USER.loggedInUser.id);
    _contactIds.push(props.id);
    socket.emit("messenger:read_message", {
      contactId: _contactIds.sort().join("_"),
    });
    dispatch(
      READ_MESSAGES({
        contactId: _contactIds.sort().join("_"),
      })
    );
    props.navigation.navigate("ChatConversation", {
      partnerId: props.id,
      contactId: _contactIds.sort().join("_"),
    });
  };

  const getAvatar = async () => {
    const _avatar = await USER_SERVICES.loadAvatar(props);
    setAvatar(_avatar);
  };

  const getUnreadMessages = createDraftSafeSelector(
    (state: RootState) => state.messenger,
    (messenger) => {
      let _contactIds: string[] = [];
      _contactIds.push(USER.loggedInUser.id);
      _contactIds.push(props.id);
      return messenger.messages.filter(
        (o) =>
          o.contactId === _contactIds.sort().join("_") &&
          o.isUnreadAtTo &&
          o.to === USER.loggedInUser.id
      ).length;
    }
  );

  useEffect(() => {
    getAvatar();
  }, []);

  return (
    <View
      key={props.id}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: "#e5e5e5",

        paddingBottom: 8,
        marginBottom: 8,
      }}
    >
      <TouchableOpacity onPress={handleGoToChatConversation}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ fontWeight: "bold", marginRight: 16 }}>
                {props.username}
              </Text>

              <Caption>{socket.connected ? "online" : "offline"}</Caption>
            </View>

            {getUnreadMessages(state) > 0 && (
              <View>
                <Badge size={24} style={{ paddingHorizontal: 4 }}>
                  {getUnreadMessages(state) + " tin nhắn chưa đọc"}
                </Badge>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ChatContactScreen = () => {
  const navigation = useNavigation();

  const socket = useContext(SocketContext);

  const dispatch = useAppDispatch();

  const USER = useAppSelector<IUser>((state) => state.user);

  const [searchValue, setSearchValue] = useState<string>("");
  const [chatContacts, setChatContacts] = useState<ISingleUser[] | null>(null);

  const loadChatContact = async () => {
    let filters = [];
    filters.push({
      key: "_id",
      operator: "not",
      value: USER.loggedInUser.id,
    });
    const params = {
      filters: JSON.stringify(filters),
    };
    try {
      const res = await REQUEST({
        method: "GET",
        url: "/users",
        params,
      });

      if (res && res.data.result) {
        setChatContacts(res.data.data.results);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadChatContact();
    }, [])
  );

  return (
    <View style={{ padding: 16, backgroundColor: "#fff", flex: 1 }}>
      <Title style={{ marginBottom: 8 }}>Trò chuyện</Title>

      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Tin nhắn</Text>

      <View>
        {chatContacts ? (
          <SectionList
            sections={[{ title: "Gợi ý", data: chatContacts }]}
            keyExtractor={(item, index) => item.id}
            renderSectionHeader={({ section: { title } }) => (
              <View>
                <Caption>{title}</Caption>
              </View>
            )}
            renderItem={({ item }) => {
              return (
                <ChatContactItem
                  key={item.id}
                  {...item}
                  navigation={navigation}
                />
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
