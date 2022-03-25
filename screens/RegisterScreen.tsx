import { useState } from "react";
import { StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

import { Icon } from "../components";

import { NavigationRegisterProps } from "../types";

const BORDER_RADIUS = 8;
const BORDER_COLOR = "#e5e5e5";
const PRIMARY_COLOR = "#00ADB5";

export default function RegisterScreen({
  navigation,
}: NavigationRegisterProps) {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleChangeUsername = (newText: string) => {
    setUsername(newText);
  };

  const handleChangeEmail = (newText: string) => {
    setEmail(newText);
  };

  const handleChangePassword = (newText: string) => {
    setPassword(newText);
  };

  const handleChangeConfirmPassword = (newText: string) => {
    setConfirmPassword(newText);
  };

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: "center" }}>
        <Text style={styles.logo}>N16 - Logo</Text>
      </View>
      <View style={{ justifyContent: "center", marginBottom: 16 }}>
        <TextInput
          value={username}
          onChangeText={handleChangeUsername}
          placeholder="Tên đăng nhập"
          style={{ ...styles.input, marginBottom: 8 }}
        />
        <TextInput
          value={email}
          onChangeText={handleChangeEmail}
          placeholder="Email"
          style={{ ...styles.input, marginBottom: 8 }}
        />

        <TextInput
          value={password}
          onChangeText={handleChangePassword}
          placeholder="Mật khẩu"
          style={{ ...styles.input, marginBottom: 8 }}
          secureTextEntry
        />
        <TextInput
          value={confirmPassword}
          onChangeText={handleChangeConfirmPassword}
          placeholder="Nhập lại mật khẩu"
          style={{ ...styles.input, marginBottom: 8 }}
          secureTextEntry
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => console.log("dasd")}
          disabled={
            !username ||
            !email.length ||
            !password.length ||
            !confirmPassword.length
          }
        >
          <View
            style={{
              ...styles.signInBtn,
              opacity:
                !username ||
                !email.length ||
                !password.length ||
                !confirmPassword.length
                  ? 0.36
                  : 1,
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Đăng ký
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={{ textAlign: "center" }}>
          Đã có tài khoản?{" "}
          <Text
            style={{ fontWeight: "bold", color: PRIMARY_COLOR }}
            onPress={() => navigation.navigate("Login")}
          >
            Đăng nhập
          </Text>
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View style={{ height: 1, backgroundColor: "#000" }}></View>
        <View>
          <Text style={{ color: "#999999" }}>Hoặc</Text>
        </View>
        <View style={{ height: 1, backgroundColor: BORDER_COLOR }}></View>
      </View>

      <View>
        <TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: BORDER_COLOR,
              padding: 8,
              borderRadius: BORDER_RADIUS,
            }}
          >
            <Text style={{ textAlign: "center", marginRight: 8 }}>
              Đăng nhập bằng
            </Text>
            <Icon name="logo-google" size={24} color="#EA4335" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
  },
  logo: {
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: BORDER_RADIUS,
    padding: 8,
    paddingLeft: 24,
    backgroundColor: "#f2f2f2",
  },
  signInBtn: {
    backgroundColor: PRIMARY_COLOR,
    padding: 8,
    borderRadius: BORDER_RADIUS,
    color: "#ffffff",
    marginBottom: 8,
  },
});
