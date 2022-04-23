import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { Header } from "../components/";

import { Avatar, Button, TextInput } from "react-native-paper";

export default function EditProfileScreen() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  return (
    <View style={styles.container}>
      <Header showLeftIcon showRightIcon title="Chỉnh sửa thông tin" />

      <View style={{ padding: 16, backgroundColor: "#fff" }}>
        <View style={{ alignItems: "center" }}>
          <Avatar.Icon icon="person-outline" size={64} />
        </View>

        <View style={{ marginVertical: 16 }}>
          <TextInput
            mode="outlined"
            label="Tên đăng nhập"
            autoComplete="off"
            value={username}
            onChangeText={setUsername}
            style={{ backgroundColor: "#fff" }}
          />
          <TextInput
            mode="outlined"
            label="Email"
            autoComplete="off"
            value={email}
            onChangeText={setEmail}
            style={{ marginVertical: 16, backgroundColor: "#fff" }}
          />
          <TextInput
            mode="outlined"
            label="Mô tả bản thân"
            autoComplete="off"
            multiline
            numberOfLines={5}
            value={bio}
            onChangeText={setBio}
            style={{ backgroundColor: "#fff" }}
          />
        </View>

        <View>
          <Button mode="contained">Đổi mật khẩu</Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
