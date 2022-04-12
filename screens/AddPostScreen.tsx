import { StyleSheet, StatusBar, Image } from "react-native";
import { useState, useEffect } from "react";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import * as ADDPOST_CONSTANT from "../constants/AddPost";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

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

const genres = [
  "Pop",
  "Rock",
  "Blues",
  "R&B",
  "Hip hop",
  "EDM",
  "Beat",
  "Rap",
  "LoFi",
  "Thêm",
];

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
  stepStrokeCurrentColor: "#fe7013",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#fe7013",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#fe7013",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#fe7013",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#fe7013",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#fe7013",
};

interface IPostInfoState {
  sound: {
    name: string;
    size: number;
    uri: string;
  };

  thumbnail: {
    width: number;
    height: number;
    uri: string;
  };

  desc: {
    caption: string;
    genre: string;
    hashtag: string[];
  };
}

export default function AddPostScreen({
  navigation,
}: RootTabScreenProps<"AddPost">) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [postInfo, setPostInfo] = useState<IPostInfoState>({
    sound: {
      name: "",
      size: 0,
      uri: "",
    },
    thumbnail: {
      width: 0,
      height: 0,
      uri: "",
    },
    desc: {
      caption: "",
      genre: "",
      hashtag: [],
    },
  });

  const handlePickSound = async () => {
    try {
      const sound = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
      });

      if (sound.type !== "cancel") {
        let temp = Object.assign(postInfo, {
          sound: {
            name: sound.name,
            size: sound.size,
            uri: sound.uri,
          },
        });
        setPostInfo(temp);
        setCurrentStep((prev) => prev + 1);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePickThumbnail = async () => {
    try {
      let thumbnail = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!thumbnail.cancelled) {
        let temp = Object.assign(postInfo, {
          thumbnail: {
            width: thumbnail.width,
            height: thumbnail.height,
            uri: thumbnail.uri,
          },
        });
        setPostInfo(temp);
        setCurrentStep((prev) => prev + 1);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const extractHashtag = () => {
    const regex = /([#][a-zA-Z0-9]+)/gi;
    const caption = postInfo.desc.caption;

    const matches = caption.match(regex);

    let temp = Object.assign(postInfo, {
      desc: {
        ...postInfo.desc,
        hashtag: matches,
      },
    });

    setPostInfo(temp);
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      extractHashtag();
      console.log(postInfo);
    }
  };

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
          {postInfo.sound.name.length > 0 && (
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
                <Title>{postInfo.sound.name}</Title>
                <Subheading>
                  {(postInfo.sound.size / 1024 ** 2).toFixed(1)} MB
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
            {postInfo.thumbnail.uri.length > 0 && (
              <Image
                source={{ uri: postInfo.thumbnail.uri }}
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
              value={postInfo.desc.caption}
              onChangeText={(v) =>
                setPostInfo((prev) => ({
                  ...prev,
                  desc: { ...postInfo.desc, caption: v },
                }))
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
                    key={index}
                    style={{
                      justifyContent: "center",
                      height: 56,
                    }}
                  >
                    <Chip
                      mode={index !== genres.length - 1 ? "outlined" : "flat"}
                      onPress={() =>
                        setPostInfo((prev) => ({
                          ...prev,
                          desc: { ...prev.desc, genre: item },
                        }))
                      }
                      style={{
                        marginHorizontal: 2,
                      }}
                      selected={item === postInfo.desc.genre}
                      selectedColor="#00adb5"
                      ellipsizeMode="clip"
                      textStyle={{
                        fontSize: 16,
                        color: "black",
                      }}
                      icon={index === genres.length - 1 ? "add" : ""}
                    >
                      {item}
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
            (currentStep === 0 && postInfo.sound.name.length === 0) ||
            (currentStep === 1 && postInfo.thumbnail.uri.length === 0)
          }
          onPress={handleNextStep}
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
