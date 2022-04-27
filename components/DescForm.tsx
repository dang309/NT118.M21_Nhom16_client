import { View, Text } from "react-native";
import React, { useState } from "react";

import {
  Title,
  Subheading,
  Button,
  Chip,
  TextInput,
  Portal,
  Dialog,
} from "react-native-paper";
import * as ADDPOST_CONSTANT from "../constants/AddPost";
import { REQUEST } from "../utils";

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
  const [customGenre, setCustomGenre] = useState<string>("");
  const [toggleCustomGenreForm, setToggleCustomGenreForm] =
    useState<boolean>(false);

  const handleAddGenre = async () => {
    try {
      const dataToSend = {
        name: customGenre,
      };
      const res = await REQUEST({
        method: "POST",
        url: "/genres",
        data: dataToSend,
      });

      if (res && res.data.result) {
        setToggleCustomGenreForm(false);
        setCustomGenre("");
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <View>
      {/* Tiêu đề */}
      <View>
        <Title>Tiêu đề</Title>
        <TextInput
          mode="outlined"
          autoComplete="off"
          value={desc?.title}
          onChangeText={(v) => setDesc((prev: any) => ({ ...prev, title: v }))}
          style={{
            backgroundColor: "#fff",
          }}
        />
      </View>
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
                  mode="outlined"
                  onPress={() =>
                    setDesc((prev: any) => ({ ...prev, genre: item.id }))
                  }
                  style={{
                    marginHorizontal: 2,

                    borderColor: "#00adb5",

                    backgroundColor:
                      item.id === desc?.genre ? "#00adb5" : "#fff",
                  }}
                  selected={item.id === desc?.genre}
                  selectedColor="#fff"
                  ellipsizeMode="clip"
                  textStyle={{
                    fontSize: 16,
                    color: item.id === desc?.genre ? "#fff" : "#000",
                  }}
                >
                  {item.name}
                </Chip>
              </View>
            );
          })}
        </View>
        <Button
          mode="contained"
          icon="add-outline"
          style={{ marginLeft: 8 }}
          onPress={() => setToggleCustomGenreForm(true)}
        >
          Thêm
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={toggleCustomGenreForm}
          onDismiss={() => setToggleCustomGenreForm(false)}
        >
          <Dialog.Content>
            <TextInput
              mode="outlined"
              autoComplete="off"
              placeholder="Thêm thể loại..."
              value={customGenre}
              onChangeText={setCustomGenre}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              style={{ marginRight: 8 }}
              onPress={handleAddGenre}
            >
              Thêm
            </Button>
            <Button
              mode="outlined"
              style={{ borderWidth: 1, borderColor: "#00adb5" }}
              onPress={() => setToggleCustomGenreForm(false)}
            >
              Hủy
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default DescForm;
