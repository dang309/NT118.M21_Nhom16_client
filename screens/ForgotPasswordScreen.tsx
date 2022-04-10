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
  Title,
} from "react-native-paper";

import { Icon, GGButton } from "../components";

import { NavigationForgotPasswordProps } from "../types";

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

export default function ForgotPasswordScreen({
  navigation,
}: NavigationForgotPasswordProps) {
  const dispatch = useAppDispatch();
  const theme = useColorScheme();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState("");

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(AUTH_CONSTANT.INVALID_EMAIL)
      .required(AUTH_CONSTANT.REQUIRED_EMAIL),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPasswordSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        setError("");
        // const dataToSend = {
        //   email: values.email.trim(),
        // };
        // const res = await REQUEST({
        //   method: "POST",
        //   url: "/auth/forgot-password",
        //   data: dataToSend,
        // });

        // if (res && res.data.result) {
        //   dispatch(SET_USER(res.data.data));
        //   navigation.navigate("EmailVerification");
        // }
        navigation.navigate("EmailVerification");
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
          <Title>{AUTH_CONSTANT.RETRIEVE_PASSWORD}</Title>
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
        </View>

        <View style={{ marginBottom: 16 }}>
          <Button
            mode="contained"
            disabled={!values.email.length}
            loading={isSubmitting}
            onPress={handleSubmit}
            style={{ marginBottom: 8 }}
          >
            {AUTH_CONSTANT.NEXT}
          </Button>
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
