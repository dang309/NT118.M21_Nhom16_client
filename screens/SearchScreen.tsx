import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SectionList,
} from "react-native";
import { useState, useRef, useEffect, useCallback } from "react";

import { Icon } from "../components";
import { Avatar, Caption, IconButton } from "react-native-paper";

import { useNavigation } from "@react-navigation/core";
import { REQUEST } from "../utils";

import _debounce from "lodash/debounce";
import { USER_SERVICES } from "../services";
import { useAppSelector } from "../app/hook";
import { ISingleUser, IUser } from "../features/UserSlice";

type TPropsSingleUser = ISingleUser & { navigation: any };

const SingleUser = (props: TPropsSingleUser) => {
  const USER = useAppSelector<IUser>((state) => state.user);

  const [avatar, setAvatar] = useState<any>(null);

  const getAvatar = async () => {
    const _avatar = await USER_SERVICES.loadAvatar(props);
    setAvatar(_avatar);
  };

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
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("ProfileViewer", { userId: props.id })
        }
      >
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
              <Caption style={{ marginRight: 16 }}>{props.email}</Caption>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const SearchScreen = () => {
  const navigation = useNavigation();

  const USER = useAppSelector<IUser>((state) => state.user);

  const inputRef = useRef<TextInput | null>(null);

  const [searchValue, setSearchValue] = useState<string>("");
  const [recommendedUser, setRecommendedUser] = useState<ISingleUser[] | null>(
    null
  );
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadRecommendedUser = async () => {
    let filters = [];
    filters.push({
      key: ["_id"],
      operator: "in",
      value: USER.loggedInUser.following,
    });
    const params = {
      limit: 5,
      filters: JSON.stringify(filters),
    };
    try {
      const res = await REQUEST({
        method: "GET",
        url: "/users",
        params,
      });

      if (res && res.data.result) {
        let temp: ISingleUser[] = res.data.data.results;
        let _avatar;

        let result: ISingleUser[] = [];
        for (let i = 0; i < temp.length; i++) {
          _avatar = await USER_SERVICES.loadAvatar(temp[i]);
          if (!_avatar) continue;
          result.push({
            ...temp[i],
            avatar: { ...temp[i].avatar, uri: _avatar },
          });
        }
        setRecommendedUser(result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getUsers = async (v: string) => {
    try {
      if (!v.length) {
        setResult(null);
        return;
      }
      let filters = [];
      filters.push({
        key: "username",
        operator: "regex",
        value: v,
      });
      const params = {
        filters: JSON.stringify(filters),
      };
      const res = await REQUEST({
        method: "GET",
        url: "/users",
        params,
      });

      if (res && res.data.result) {
        let temp: ISingleUser[] = res.data.data.results;
        let _avatar;

        let result: ISingleUser[] = [];
        for (let i = 0; i < temp.length; i++) {
          _avatar = await USER_SERVICES.loadAvatar(temp[i]);
          if (!_avatar) continue;
          result.push({
            ...temp[i],
            avatar: { ...temp[i].avatar, uri: _avatar },
          });
        }
        setResult(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebounce = useCallback(
    _debounce((v: string) => getUsers(v), 2000),
    []
  );

  const handleChangeSearchValue = (v: string) => {
    setSearchValue(v);

    setIsLoading(true);

    handleDebounce(v);
  };

  useEffect(() => {
    if (!searchValue.length) {
      loadRecommendedUser();
    } else {
      setRecommendedUser(null);
    }
  }, [searchValue]);

  useEffect(() => {
    if (inputRef.current) {
      const unsubscribe = navigation.addListener("focus", () => {
        inputRef.current?.focus();
      });
      return unsubscribe;
    }
  }, [navigation, inputRef.current]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconButton
          icon="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderColor: "#e5e5e5",
            borderWidth: 1,
            borderRadius: 24,
            padding: 8,
            paddingHorizontal: 16,
            height: 48,

            margin: 8,
            marginLeft: 0,
          }}
        >
          <TextInput
            value={searchValue}
            onChangeText={handleChangeSearchValue}
            placeholder="Tìm kiếm..."
            ref={inputRef}
          />
          <Icon name="search" size={16} color="#c4c4c4" />
        </View>
      </View>

      {result && result.length > 0 && (
        <View style={{ padding: 8 }}>
          {
            <FlatList
              data={result}
              keyExtractor={(item, index) => {
                return item.id;
              }}
              renderItem={({ item }) => {
                return (
                  <SingleUser key={item.id} {...item} navigation={navigation} />
                );
              }}
            />
          }
        </View>
      )}

      {recommendedUser && !result && (
        <View style={{ padding: 8 }}>
          {
            <SectionList
              sections={[{ title: "Gợi ý", data: recommendedUser }]}
              keyExtractor={(item, index) => item.id}
              renderSectionHeader={({ section: { title } }) => (
                <View style={{ marginBottom: 8 }}>
                  <Caption>{title}</Caption>
                </View>
              )}
              renderItem={({ item }) => {
                return (
                  <SingleUser key={item.id} {...item} navigation={navigation} />
                );
              }}
            />
          }
        </View>
      )}

      {!recommendedUser && !result && (
        <View style={{ marginVertical: 8 }}>
          <ActivityIndicator color="#00adb5" size={32} animating={true} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },
});

export default SearchScreen;
