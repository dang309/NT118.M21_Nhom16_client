import { View, Text } from "react-native";
import React from "react";

import { Title, Subheading, Button, Chip, TextInput } from "react-native-paper";
import * as ADDPOST_CONSTANT from "../constants/AddPost";

interface IGenre {
  id: string;
  name: string;
}

type Props = {
  genres: IGenre[];
  desc: any;
  setDesc: (prev: any) => void;
};

const DescForm = ({ genres, desc, setDesc }: Props) => {
  return (
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
  );
};

export default DescForm;
