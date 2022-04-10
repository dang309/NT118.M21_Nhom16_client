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

import { NavigationEmailVerificationProps } from "../types";

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

export default function EmailVerificationScreen({
  navigation,
}: NavigationEmailVerificationProps) {
  const dispatch = useAppDispatch();
  const theme = useColorScheme();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState("");

  const EmailVerificationSchema = Yup.object().shape({
    otp: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: EmailVerificationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        setError("");
        const dataToSend = {
          otp: values.otp.toString().trim(),
        };
        const res = await REQUEST({
          method: "POST",
          url: "/auth/verify-email",
          data: dataToSend,
        });

        if (res && res.data.result) {
          navigation.navigate("ResetPassword");
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

  return (
    <>
      <View style={styles.container}>
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.logo}>N16 - Logo</Text>
        </View>
        <View style={{ justifyContent: "center", marginBottom: 16 }}>
          <Title>{AUTH_CONSTANT.EMAIL_VERIFICATION}</Title>
          <View style={{ marginBottom: 8 }}>
            <TextInput
              value={values.otp}
              onChangeText={handleChange("otp")}
              onBlur={handleBlur("otp")}
              placeholder="OTP"
              label="OTP"
              mode="outlined"
              autoComplete="off"
              outlineColor="#e5e5e5"
              right={<TextInput.Icon name="lock-closed-outline" color="#999" />}
              error={Boolean(touched.otp && errors.otp)}
              keyboardType="numeric"
              style={{ ...styles.input }}
            />
            {errors.otp?.length && (
              <HelperText type="error" visible={!!errors.otp?.length}>
                {errors.otp}
              </HelperText>
            )}
          </View>
        </View>

        <View style={{ marginBottom: 4 }}>
          <Button
            mode="contained"
            disabled={!values.otp.length}
            loading={isSubmitting}
            onPress={handleSubmit}
            style={{ marginBottom: 8 }}
          >
            {AUTH_CONSTANT.NEXT}
          </Button>
        </View>

        <Text
          style={{
            color: PRIMARY_COLOR,
            textAlign: "center",
            fontWeight: "bold",
          }}
          onPress={() => navigation.navigate("Login")}
        >
          {AUTH_CONSTANT.SIGN_IN}
        </Text>
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
