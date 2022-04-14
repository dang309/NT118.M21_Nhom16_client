import { View, Text, Image } from "react-native";
import React from "react";

import Icon from "./Icon";

import { Title, Subheading, Button } from "react-native-paper";
import * as ADDPOST_CONSTANT from "../constants/AddPost";

type Props = {
  thumbnail: any;
  handlePickThumbnail: () => void;
};

const ThumbnailPicker = ({ thumbnail, handlePickThumbnail }: Props) => {
  return (
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
  );
};

export default ThumbnailPicker;
