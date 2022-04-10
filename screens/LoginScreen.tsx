import { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  View,
  useColorScheme,
} from "react-native";

import {
  TextInput,
  Button,
  Divider,
  HelperText,
  Snackbar,
} from "react-native-paper";

import { Icon, GGButton } from "../components";

import { NavigationLoginProps } from "../types";

import { useFormik, Form, FormikProvider } from "formik";

import { useAppDispatch } from "../app/hook";
import { SET_USER } from "../features/UserSlice";

import * as Yup from "yup";
import { REQUEST } from "../utils";

import * as AUTH_CONSTANT from "../constants/Auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

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
          dispatch(SET_USER(res.data.data));
          navigation.navigate("Root");
        }
      } catch (err) {
        setError(err.response.data.message);
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

  const handleSignInWithGG = async () => {
    console.log("logged in");
  };

  const checkAuth = async () => {
    let tokens = await AsyncStorage.getItem("@tokens");
    if (tokens?.length) {
      const _tokens = JSON.parse(tokens);
      if (new Date().valueOf() < new Date(_tokens.access.expires).valueOf()) {
        navigation.navigate("Root");
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.logo}>N16 - Logo</Text>
        </View>
        <View style={{ justifyContent: "center", marginBottom: 16 }}>
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
            Quên mật khẩu
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

        <View>
          <GGButton />
        </View>
      </View>

      <Snackbar
        visible={!!error.length}
        duration={5000}
        onDismiss={() => setError("")}
        style={{
          backgroundColor: "#ff0033",
        }}
      >
        {error}
      </Snackbar>
    </>
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
