import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState, useEffect } from "react";

import { Header, Icon } from "../components/";

import {
  Avatar,
  Button,
  Dialog,
  HelperText,
  IconButton,
  Portal,
  RadioButton,
  TextInput,
  Title,
} from "react-native-paper";

import * as DocumentPicker from "expo-document-picker";

import FormData from "form-data";
import { REQUEST } from "../utils";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { IUser, SET_USER, UPDATE_USER } from "../features/UserSlice";
import { setIn, useFormik, useFormikContext } from "formik";
import * as Yup from "yup";
import * as AUTH_CONSTANT from "../constants/Auth";
import { USER_SERVICES } from "../services";

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

export default function EditProfileScreen() {
  const dispatch = useAppDispatch();

  const USER = useAppSelector<IUser>((state) => state.user);

  const navigation = useNavigation();

  const [initAvatar, setInitAvatar] = useState<string>("");
  const [avatar, setAvatar] = useState<any>(null);
  const [toggleDialog, setToggleDialog] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const EditProfileSchema = Yup.object().shape({
    email: Yup.string()
      .email(AUTH_CONSTANT.INVALID_EMAIL)
      .required(AUTH_CONSTANT.REQUIRED_EMAIL),
    bio: Yup.string(),
    phoneNumber: Yup.string(),
    address: Yup.string(),
    birthday: Yup.date(),
    sex: Yup.string(),
  });

  const ChangePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(8, AUTH_CONSTANT.MIN_LENGTH_PASSWORD)
      .matches(
        /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
        AUTH_CONSTANT.ALPHANUMERIC_PASSWORD
      ),
    password: Yup.string()
      .min(8, AUTH_CONSTANT.MIN_LENGTH_PASSWORD)
      .matches(
        /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
        AUTH_CONSTANT.ALPHANUMERIC_PASSWORD
      ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      AUTH_CONSTANT.MUST_MATCHED_CONFIRM_PASSWORD
    ),
  });

  const formik = useFormik({
    initialValues: {
      email: USER.loggedInUser.email,
      bio: USER.loggedInUser.bio,
      phoneNumber: USER.loggedInUser.phone_number,
      address: USER.loggedInUser.address,
      birthday: USER.loggedInUser.birthday,
      sex: USER.loggedInUser.sex ? "Male" : "Female",
    },
    validationSchema: EditProfileSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        setError("");

        if (values.email.trim().length === 0) return;

        const dataToSend = new FormData();

        if (avatar) {
          dataToSend.append("avatar", {
            uri: avatar?.uri,
            name: avatar?.name,
            type: "image/" + avatar?.name.split(".")[1],
          });
        }
        dataToSend.append("email", values.email.trim());
        dataToSend.append("phone_number", values.phoneNumber.trim());
        dataToSend.append("address", values.address.trim());
        dataToSend.append("sex", values.sex.trim() === "Male");
        dataToSend.append(
          "birthday",
          new Date(values.birthday).toLocaleDateString()
        );
        dataToSend.append("bio", values.bio.trim());

        const res = await REQUEST({
          method: "PUT",
          url: `/users/${USER.loggedInUser.id}`,
          data: dataToSend,
          responseType: "json",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data, headers) => {
            return dataToSend;
          },
        });

        if (res && res.data.result) {
          let temp = res.data.data;
          const _avatar = await USER_SERVICES.loadAvatar(temp);
          Object.assign(temp, {
            avatar: {
              ...temp.avatar,
              uri: _avatar,
            },
          });
          console.log(temp);
          dispatch(UPDATE_USER(temp));
          setToggleDialog(true);
        }
      } catch (err) {
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
    setFieldValue,
  } = formik;

  const getAvatar = async () => {
    const _avatar = await USER_SERVICES.loadAvatar(USER.loggedInUser);
    if (!_avatar) return;
    setInitAvatar(_avatar);
  };

  const handleChangeAvatar = async () => {
    try {
      const avatar = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });

      if (avatar.type !== "cancel") {
        console.log(avatar);
        setAvatar(avatar);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeBirthday = () => {
    DateTimePickerAndroid.open({
      value: new Date(values.birthday),
      onChange: (e, selectedDate) => setFieldValue("birthday", selectedDate),
      mode: "date",
    });
  };

  useEffect(() => {
    getAvatar();
  }, []);

  const showAvatar = Boolean(avatar || initAvatar);

  return (
    <View style={styles.container}>
      <Header
        showLeftIcon
        showRightIcon
        title="Chỉnh sửa thông tin"
        handleUpdateProfile={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <ScrollView>
        <View style={{ padding: 16, backgroundColor: "#fff" }}>
          <View style={{ alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {showAvatar ? (
                avatar ? (
                  <Avatar.Image source={{ uri: avatar.uri }} size={64} />
                ) : initAvatar ? (
                  <Avatar.Image source={{ uri: initAvatar }} size={64} />
                ) : (
                  <Avatar.Icon icon="person-outline" size={64} />
                )
              ) : (
                <Avatar.Icon icon="person-outline" size={64} />
              )}
              <IconButton icon="camera-outline" onPress={handleChangeAvatar} />
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              marginVertical: 8,
            }}
          >
            <RadioButton.Group
              onValueChange={handleChange("sex")}
              value={values.sex}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>Nam</Text>
                  <RadioButton value="Male" />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>Nữ</Text>
                  <RadioButton value="Female" />
                </View>
              </View>
            </RadioButton.Group>
          </View>

          <View style={{ marginVertical: 8 }}>
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
                left={<TextInput.Icon name="at" color="#999" />}
                error={Boolean(touched.email && errors.email)}
                style={{ width: "100%", backgroundColor: "#fff" }}
              />
              {errors.email?.length && (
                <HelperText type="error" visible={!!errors.email?.length}>
                  {errors.email}
                </HelperText>
              )}
            </View>

            <View style={{ marginBottom: 8 }}>
              <TextInput
                value={values.phoneNumber}
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                placeholder="Số điện thoại"
                label="Số điện thoại"
                mode="outlined"
                autoComplete="off"
                outlineColor="#e5e5e5"
                keyboardType="numeric"
                left={
                  <TextInput.Icon name="phone-portrait-outline" color="#999" />
                }
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                style={{ width: "100%", backgroundColor: "#fff" }}
              />
            </View>

            <View style={{ marginBottom: 8 }}>
              <TextInput
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                placeholder="Địa chỉ"
                label="Địa chỉ"
                mode="outlined"
                autoComplete="off"
                outlineColor="#e5e5e5"
                left={<TextInput.Icon name="home-outline" color="#999" />}
                error={Boolean(touched.address && errors.address)}
                style={{ width: "100%", backgroundColor: "#fff" }}
              />
            </View>

            <View style={{ marginBottom: 8 }}>
              <TouchableOpacity onPress={handleChangeBirthday}>
                <TextInput
                  value={moment(values.birthday).format("MM/DD/YYYY")}
                  placeholder="Ngày sinh (MM/DD/YYYY)"
                  label="Ngày sinh (MM/DD/YYYY)"
                  mode="outlined"
                  editable={false}
                  autoComplete="off"
                  outlineColor="#e5e5e5"
                  left={<TextInput.Icon name="calendar-outline" color="#999" />}
                  error={Boolean(touched.birthday && errors.birthday)}
                  style={{ width: "100%", backgroundColor: "#fff" }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 8 }}>
              <TextInput
                value={values.bio}
                onChangeText={handleChange("bio")}
                onBlur={handleBlur("bio")}
                placeholder="Mô tả bản thân"
                label="Mô tả bản thân"
                mode="outlined"
                autoComplete="off"
                multiline
                numberOfLines={7}
                left={<TextInput.Icon name="newspaper-outline" color="#999" />}
                outlineColor="#e5e5e5"
                error={Boolean(touched.bio && errors.bio)}
                style={{ width: "100%", backgroundColor: "#fff" }}
              />
            </View>
          </View>

          <View>
            <Button mode="contained">Đổi mật khẩu</Button>
          </View>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={toggleDialog} onDismiss={() => setToggleDialog(false)}>
          <Dialog.Content>
            <View style={{ alignItems: "center" }}>
              <Icon name="checkmark-circle" size={64} color="green" />
              <Title style={{ marginVertical: 8 }}>Cập nhật thành công!</Title>
              <Button
                icon="arrow-back"
                mode="contained"
                onPress={() => {
                  navigation.goBack();
                  setToggleDialog(false);
                }}
              >
                Quay lại
              </Button>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
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
