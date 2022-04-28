import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useRef, useEffect, useCallback } from "react";

import { Icon } from "../components";
import { Avatar, IconButton } from "react-native-paper";

import { useNavigation } from "@react-navigation/core";
import { REQUEST } from "../utils";

import _debounce from "lodash/debounce";

const SearchScreen = () => {
  const navigation = useNavigation();

  const inputRef = useRef<TextInput | null>(null);

  const [searchValue, setSearchValue] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadThumbnail = async (userId: string, avatar: any) => {
    if (!avatar?.key.length || !avatar?.bucket.length) return;
    const response = await fetch(
      `https://api-nhom16.herokuapp.com/v1/users/avatar/${userId}`,
      {
        method: "GET",
      }
    );
    let result;
    const imageBlob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = () => {
      const base64data = reader.result;
      result = base64data;
    };
    return result;
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
        let temp = res.data.data.results;
        temp.map((item: any) => {
          return { ...item, avatar: loadThumbnail(item.id, item.avatar) };
        });
        setResult(temp);
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

      <View style={{ padding: 8, alignItems: "center" }}>
        {result && result.length > 0 ? (
          <FlatList
            data={result}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    navigation.navigate("ProfileViewer", { userId: item.id })
                  }
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {item.avatar.length > 0 ? (
                      <Avatar.Image source={{ uri: item.avatar }} size={64} />
                    ) : (
                      <Avatar.Icon icon="person-outline" size={64} />
                    )}
                    <Text style={{ marginLeft: 8, fontWeight: "bold" }}>
                      {item.username}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <ActivityIndicator color="#00adb5" animating={isLoading} />
        )}
      </View>
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
