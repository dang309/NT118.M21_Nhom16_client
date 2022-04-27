import { View, Text } from "react-native";
import React, { useState } from "react";

import Icon from "./Icon";

import { Title, Subheading, Button, Portal, Dialog } from "react-native-paper";
import * as ADDPOST_CONSTANT from "../constants/AddPost";

type Props = {
  sound: any;
  handlePickSound: () => void;
  // handleRecording: () => void;
  // handleStopRecording: () => void;
};

const SoundPicker = ({ sound, handlePickSound }: Props) => {
  const [toggleRecordingDialog, setToggleRecordingDialog] =
    useState<boolean>(false);
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
        {/* <Button
          mode="outlined"
          style={{ borderWidth: 1, borderColor: "#00adb5", marginBottom: 8 }}
          icon="musical-notes-outline"
          onPress={() => {
            setToggleRecordingDialog(true);
            // handleRecording();
          }}
        >
          {ADDPOST_CONSTANT.RECORDING}
        </Button> */}
        <Button
          mode="outlined"
          style={{ borderWidth: 1, borderColor: "#00adb5" }}
          icon="musical-note-outline"
          onPress={handlePickSound}
        >
          {ADDPOST_CONSTANT.UPLOAD}
        </Button>
      </View>

      {/* <Portal>
        <Dialog
          visible={toggleRecordingDialog}
          onDismiss={() => setToggleRecordingDialog(false)}
        >
          <Dialog.Content>
            <Title>Đang ghi âm</Title>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              onPress={() => {
                setToggleRecordingDialog(false);
                // handleStopRecording();
              }}
            >
              Dừng lại
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal> */}
    </View>
  );
};

export default SoundPicker;
