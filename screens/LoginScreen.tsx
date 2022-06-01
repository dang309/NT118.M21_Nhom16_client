import { useState, useEffect, useCallback, useContext } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  View,
  useColorScheme,
  ScrollView,
} from "react-native";

import { TextInput, Button, HelperText, Snackbar } from "react-native-paper";

import { Icon } from "../components";

import { NavigationLoginProps } from "../types";

import { useFormik, Form, FormikProvider } from "formik";

import { useAppDispatch } from "../app/hook";
import {
  ISingleUser,
  IUser,
  SET_USER,
  UPDATE_USER,
} from "../features/UserSlice";

import * as Yup from "yup";
import { REQUEST } from "../utils";

import * as AUTH_CONSTANT from "../constants/Auth";

import * as FileSystem from "expo-file-system";

import AsyncStorage from "@react-native-async-storage/async-storage";

import jwt_decode from "jwt-decode";
import { useFocusEffect } from "@react-navigation/native";
import { FOLDERS } from "../context/files";
import { IToken, SET_TOKEN } from "../features/TokenSlice";

const BORDER_RADIUS = 8;
const BORDER_COLOR = "#e5e5e5";
const PRIMARY_COLOR = "#00ADB5";

export default function LoginScreen({ navigation }: NavigationLoginProps) {
  const dispatch = useAppDispatch();
  const theme = useColorScheme();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState("");

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(AUTH_CONSTANT.INVALID_EMAIL)
      .required(AUTH_CONSTANT.REQUIRED_EMAIL),
    password: Yup.string().required(AUTH_CONSTANT.REQUIRED_PASSWORD),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        setError("");
        const dataToSend = {
          email: values.email.trim(),
          password: values.password.trim(),
        };
        const res = await REQUEST({
          method: "POST",
          url: "/auth/login",
          data: dataToSend,
        });

        if (res && res.data.result) {
          await AsyncStorage.setItem(
            "@tokens",
            JSON.stringify(res.data.data.tokens)
          );
          const { user, tokens } = res.data.data;
          let temp: ISingleUser & IToken = user;
          const _avatar = await loadAvatar(temp);
          Object.assign(temp, {
            avatar: {
              ...temp.avatar,
              uri: _avatar,
            },
          });
          console.log(temp);
          dispatch(SET_USER(temp));
          dispatch(SET_TOKEN(tokens));
          navigation.navigate("Root");
        }
      } catch (err) {
        console.log(err);
        if (err.response) {
          setError(err?.response?.data?.message);
        }
      }
    },
  });

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    handleBlur,
    handleChange,
    getFieldProps,
  } = formik;

  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const loadAvatar = async (user: ISingleUser) => {
    try {
      if (!user?.avatar?.key.length) return;
      const URL = `https://api-nhom16.herokuapp.com/v1/users/avatar/${user.id}`;
      const fileToSave =
        FOLDERS.USER.AVATARS +
        user?.avatar?.key.split("/")[1].replace(/[(\s+)-]/gi, "_");
      const fileInfo = await FileSystem.getInfoAsync(fileToSave);
      if (fileInfo.exists) {
        return fileToSave;
      }
      const { uri } = await FileSystem.downloadAsync(URL, fileToSave);
      return uri;
    } catch (err) {
      console.error(err);
    }
  };

  const getUserById = async (userId: string) => {
    try {
      const res = await REQUEST({
        method: "GET",
        url: `/users/${userId}`,
      });

      if (res && res.data.result) {
        let temp: ISingleUser = res.data.data;
        const _avatar = await loadAvatar(temp);
        temp = Object.assign(temp, {
          avatar: {
            ...temp.avatar,
            uri: _avatar,
          },
        });
        dispatch(UPDATE_USER(temp));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const checkAuth = async () => {
    let tokens = await AsyncStorage.getItem("@tokens");
    if (tokens?.length) {
      const _tokens = JSON.parse(tokens);
      if (new Date().valueOf() < new Date(_tokens.access.expires).valueOf()) {
        const decodedJwt: any = jwt_decode(_tokens.access.token);
        getUserById(decodedJwt.sub);
        navigation.navigate("Root");
        return;
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          borderStartColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <ScrollView>
          <View style={styles.container}>
            <View style={{ justifyContent: "center", marginBottom: 16 }}>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../assets/images/login.png")}
                  resizeMode="cover"
                />
              </View>
              <View style={{ marginBottom: 8 }}>
                <TextInput
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  placeholder="Email"
                  label="Email"
                  mode="outlined"
                  autoComplete="off"
                  outlineColor="#e5e5e5"
                  right={<TextInput.Icon name="at" color="#999" />}
                  error={Boolean(touched.email && errors.email)}
                  style={{ ...styles.input }}
                />
                {errors.email?.length && (
                  <HelperText type="error" visible={!!errors.email?.length}>
                    {errors.email}
                  </HelperText>
                )}
              </View>
              <View style={{ marginBottom: 8 }}>
                <TextInput
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  placeholder="Mật khẩu"
                  label="Mật khẩu"
                  mode="outlined"
                  autoComplete="off"
                  outlineColor="#e5e5e5"
                  right={
                    showPassword ? (
                      <TextInput.Icon
                        name="eye-off"
                        color="#999"
                        onPress={handleToggleShowPassword}
                      />
                    ) : (
                      <TextInput.Icon
                        name="eye"
                        color="#999"
                        onPress={handleToggleShowPassword}
                      />
                    )
                  }
                  error={Boolean(touched.password && errors.password)}
                  style={{ ...styles.input }}
                  secureTextEntry={!showPassword}
                />
                {errors.password?.length && (
                  <HelperText type="error" visible={!!errors.password}>
                    {errors.password}
                  </HelperText>
                )}
              </View>
              <Text
                style={{
                  color: PRIMARY_COLOR,
                  textAlign: "right",
                  fontWeight: "bold",
                }}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                {AUTH_CONSTANT.FORGOT_PASSWORD}
              </Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Button
                mode="contained"
                disabled={!values.email.length || !values.password.length}
                loading={isSubmitting}
                onPress={handleSubmit}
                style={{ marginBottom: 8 }}
              >
                {AUTH_CONSTANT.SIGN_IN}
              </Button>

              <Text style={{ textAlign: "center" }}>
                Chưa có tài khoản?{" "}
                <Text
                  style={{ fontWeight: "bold", color: PRIMARY_COLOR }}
                  onPress={() => navigation.navigate("Register")}
                >
                  Đăng ký
                </Text>
              </Text>
            </View>

            {/* <View>
              <GGButton handleSignInWithGG={handleSignInWithGG} />
            </View> */}
          </View>

          <Snackbar
            visible={!!error?.length}
            duration={5000}
            onDismiss={() => setError("")}
            style={{
              backgroundColor: "#ff0033",
            }}
          >
            {error}
          </Snackbar>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#fff",
  },
  logo: {
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
  },
  signInBtn: {
    backgroundColor: PRIMARY_COLOR,
    padding: 8,
    borderRadius: BORDER_RADIUS,
    color: "#ffffff",
    marginBottom: 8,
  },
});
