import { StyleSheet, StatusBar, Image } from "react-native";
import { useState, useEffect } from "react";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import * as ADDPOST_CONSTANT from "../constants/AddPost";

import * as DocumentPicker from "expo-document-picker";

import FormData from "form-data";

import StepIndicator from "react-native-step-indicator";
import {
  Button,
  Title,
  Subheading,
  TextInput,
  Chip,
  Headline,
} from "react-native-paper";
import { Icon } from "../components";
import { REQUEST } from "../utils";

import { useAppDispatch, useAppSelector } from "./../app/hook";
import { IUser } from "./../features/UserSlice";

const labels = [
  ADDPOST_CONSTANT.PICK_SOUND,
  ADDPOST_CONSTANT.PICK_THUMBNAIL,
  ADDPOST_CONSTANT.DESC,
];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#00adb5",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#00adb5",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#00adb5",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#00adb5",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#00adb5",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#00adb5",
};

interface IGenre {
  id: string;
  name: string;
}

export default function AddPostScreen({
  navigation,
}: RootTabScreenProps<"AddPost">) {
  const cUser = useAppSelector<IUser>((state) => state.user);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [sound, setSound] = useState<any>(null);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [desc, setDesc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadGenres = async () => {
    try {
      const res = await REQUEST({
        method: "GET",
        url: "/genres",
      });
      if (res && res.data.result) {
        setGenres(res.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePickSound = async () => {
    try {
      const sound = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
      });

      if (sound.type !== "cancel") {
        setSound(sound);
        setCurrentStep((prev) => prev + 1);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePickThumbnail = async () => {
    try {
      const thumbnail = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });

      if (thumbnail.type !== "cancel") {
        setThumbnail(thumbnail);
        setCurrentStep((prev) => prev + 1);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // const extractHashtag = () => {
  //   const regex = /([#][a-zA-Z0-9]+)/gi;
  //   const caption = desc?.caption;

  //   const matches = caption.match(regex);

  //   let temp = Object.assign(postInfo, {
  //     desc: {
  //       ...desc,
  //       hashtag: matches,
  //     },
  //   });

  //   setPostInfo(temp);
  // };

  const handleFinishAddingPost = async () => {
    try {
      const dataToSend = new FormData();
      dataToSend.append("user_id", cUser.currentUserInfo.user.id);
      dataToSend.append("caption", desc?.caption);
      dataToSend.append("sound", {
        uri: sound?.uri,
        name: sound?.name,
        type: "audio/" + sound?.name.split(".")[1],
      });
      dataToSend.append("thumbnail", {
        uri: thumbnail?.uri,
        name: thumbnail?.name,
        type: "image/" + thumbnail?.name.split(".")[1],
      });
      dataToSend.append("genre_id", desc?.genre);
      // dataToSend.append("hashtag_id", desc.hashtag);

      // const res = await fetch("https://api-nhom16.herokuapp.com/v1/posts", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      //   body: dataToSend,
      // });

      // console.log(res.json());

      setIsLoading(true);

      const res = await REQUEST({
        method: "POST",
        url: "/posts",
        data: dataToSend,
        responseType: "json",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data, headers) => {
          // !!! override data to return formData
          // since axios converts that to string
          return dataToSend;
        },
      });

      if (res && res.data.result) {
        console.log(res.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // extractHashtag();
      handleFinishAddingPost();
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentStep}
          labels={labels}
          stepCount={3}
        />
      </View>

      {currentStep === 0 && (
        <View style={{ alignItems: "center" }}>
          {sound && (
            <View
              style={{
                borderWidth: 1,
                borderColor: "#e5e5e5",
                padding: 8,
                borderRadius: 16,
                marginBottom: 8,

                alignItems: "center",
              }}
            >
              <Icon
                name="musical-notes-outline"
                size={32}
                style={{ marginBottom: 8 }}
              />
              <View style={{ alignItems: "center" }}>
                <Title>{sound?.name}</Title>
                <Subheading>
                  {(sound.size / 1024 ** 2).toFixed(1)} MB
                </Subheading>
              </View>
            </View>
          )}

          <View style={{ alignItems: "center" }}>
            <Button
              mode="outlined"
              style={{ borderWidth: 1, borderColor: "#00adb5" }}
              icon="musical-note-outline"
              onPress={handlePickSound}
            >
              {ADDPOST_CONSTANT.UPLOAD}
            </Button>
          </View>
        </View>
      )}

      {currentStep === 1 && (
        <View>
          <View>
            {thumbnail && (
              <Image
                source={{ uri: thumbnail?.uri }}
                style={{
                  width: "100%",
                  height: 324,
                  borderRadius: 16,
                }}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={{ alignItems: "center" }}>
            <Button
              mode="outlined"
              icon="image-outline"
              style={{ borderWidth: 1, borderColor: "#00adb5" }}
              onPress={handlePickThumbnail}
            >
              {ADDPOST_CONSTANT.UPLOAD}
            </Button>
          </View>
        </View>
      )}

      {currentStep === 2 && (
        <View>
          {/* Chu thich */}
          <View>
            <Title>Chú thích</Title>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={5}
              autoComplete="off"
              value={desc?.caption}
              onChangeText={(v) =>
                setDesc((prev: any) => ({ ...prev, caption: v }))
              }
              style={{
                backgroundColor: "#fff",
              }}
            />
          </View>
          {/* The loai */}
          <View
            style={{
              marginVertical: 16,
            }}
          >
            <Title>Thể loại</Title>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {genres.map((item, index) => {
                return (
                  <View
                    key={item.id}
                    style={{
                      justifyContent: "center",
                      height: 56,
                    }}
                  >
                    <Chip
                      mode={index !== genres.length - 1 ? "outlined" : "flat"}
                      onPress={() =>
                        setDesc((prev: any) => ({ ...prev, genre: item.id }))
                      }
                      style={{
                        marginHorizontal: 2,
                      }}
                      selected={item.id === desc?.genre}
                      selectedColor="#00adb5"
                      ellipsizeMode="clip"
                      textStyle={{
                        fontSize: 16,
                        color: "black",
                      }}
                      icon={index === genres.length - 1 ? "add" : ""}
                    >
                      {item.name}
                    </Chip>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          mode="contained"
          style={{ flex: 1, marginHorizontal: 8 }}
          disabled={currentStep === 0}
          onPress={() => setCurrentStep((prev) => prev - 1)}
        >
          Quay lại
        </Button>
        <Button
          mode="contained"
          style={{ flex: 1, marginHorizontal: 8 }}
          disabled={
            (currentStep === 0 && sound?.name.length === 0) ||
            (currentStep === 1 && thumbnail?.uri.length === 0) ||
            (currentStep === 2 && desc?.genre?.length === 0)
          }
          onPress={handleNextStep}
          loading={isLoading}
        >
          {currentStep !== 2 ? "Tiếp theo" : "Xong"}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "space-between",

    padding: StatusBar.currentHeight,
  },
});
