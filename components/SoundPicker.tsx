import { View, Text } from "react-native";
import React from "react";

import Icon from "./Icon";

import { Title, Subheading, Button } from "react-native-paper";
import * as ADDPOST_CONSTANT from "../constants/AddPost";

type Props = {
  sound: any;
  handlePickSound: () => void;
};

const SoundPicker = ({ sound, handlePickSound }: Props) => {
  return (
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
            <Subheading>{(sound.size / 1024 ** 2).toFixed(1)} MB</Subheading>
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
  );
};

export default SoundPicker;
