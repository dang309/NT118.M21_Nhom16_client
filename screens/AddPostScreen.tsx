import { StyleSheet, StatusBar, Image } from "react-native";
import { useState, useEffect } from "react";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { NavigationAddPostProps } from "../types";

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
import { Icon, SoundPicker, ThumbnailPicker, DescForm } from "../components";
import { REQUEST } from "../utils";

import { useAppDispatch, useAppSelector } from "./../app/hook";
import { IUser } from "./../features/UserSlice";
import { ADD_POST } from "./../features/PostSlice";

interface IGenre {
  id: string;
  name: string;
}

export default function AddPostScreen() {
  const cUser = useAppSelector<IUser>((state) => state.user);
  const dispatch = useAppDispatch();

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
        dispatch(ADD_POST(res.data.data));
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
          customStyles={ADDPOST_CONSTANT.STEP_INDICATOR_CUSTOM_STYLES}
          currentPosition={currentStep}
          labels={ADDPOST_CONSTANT.STEP_INDICATOR_LABELS}
          stepCount={3}
        />
      </View>

      {currentStep === 0 && (
        <SoundPicker sound={sound} handlePickSound={handlePickSound} />
      )}

      {currentStep === 1 && (
        <ThumbnailPicker
          thumbnail={thumbnail}
          handlePickThumbnail={handlePickThumbnail}
        />
      )}

      {currentStep === 2 && (
        <DescForm genres={genres} desc={desc} setDesc={setDesc} />
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
          {ADDPOST_CONSTANT.BACK}
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
          {currentStep !== 2 ? ADDPOST_CONSTANT.NEXT : ADDPOST_CONSTANT.DONE}
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

    backgroundColor: "#fff",
  },
});
