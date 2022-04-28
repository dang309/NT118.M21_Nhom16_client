import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { useState, useEffect, useContext } from "react";

import { useNavigation } from "@react-navigation/native";

import Icon from "./Icon";

import {
  Avatar,
  Button,
  Caption,
  Dialog,
  Divider,
  IconButton,
  Menu,
  Portal,
} from "react-native-paper";

import Slider from "@react-native-community/slider";

import { Audio, AVPlaybackStatus } from "expo-av";

import { REQUEST } from "../utils";

import { IUser as IUserSlice } from "../features/UserSlice";
import { DELETE_POST, IPostItem } from "../features/PostSlice";
import { IComment } from "../features/CommentSlice";

import { useAppDispatch, useAppSelector } from "../app/hook";

import moment from "moment";

import { SocketContext } from "../context/socket";

import { Instagram } from "react-content-loader/native";

interface IUser {
  avatar: {
    bucket: string;
    key: string;
  };
  balance_dcoin: number;
  bio: string;
  created_at: string;
  email: string;
  followers: string[];
  following: string[];
  hobbies: string[];
  id: string;
  is_email_verified: false;
  updated_at: string;
  username: string;
}

type Props = IPostItem & { setSelectedProfile?: (value: string) => void };

const Post = (props: Props) => {
  const dispatch = useAppDispatch();

  const socket = useContext(SocketContext);

  const navigation = useNavigation();

  const cUser = useAppSelector<IUserSlice>((state) => state.user);
  const comment = useAppSelector<IComment>((state) => state.comment);

  const [audioStatus, setAudioStatus] = useState<boolean>(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [avatar, setAvatar] = useState<any>(null);
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | null>(
    null
  );
  const [durationMillis, setDurationMillis] = useState<number | undefined>(0);
  const [positionMillis, setPositionMillis] = useState<number | undefined>(0);
  const [user, setUser] = useState<IUser | null>(null);

  const [numLike, setNumLike] = useState<number>(0);

  const [isLiked, setIsLiked] = useState<boolean>(false);

  const [toggleMenuOptions, setToggleMenuOptions] = useState<boolean>(false);
  const [toggleDeletePostConfirm, setToggleDeletePostConfirm] =
    useState<boolean>(false);

  const [sliderWidth, setSliderWidth] = useState<number>(0);

  const getUserById = async () => {
    try {
      const res = await REQUEST({
        method: "GET",
        url: `/users/${props.user_id}`,
      });

      if (res && res.data.result) {
        setUser(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadAvatar = async () => {
    const response = await fetch(
      `https://api-nhom16.herokuapp.com/v1/users/avatar/${props.user_id}`,
      {
        method: "GET",
      }
    );
    const imageBlob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setAvatar(base64data);
    };
  };

  const loadThumbnail = async () => {
    const response = await fetch(
      `https://api-nhom16.herokuapp.com/v1/posts/thumbnail/${props.id}`,
      {
        method: "GET",
      }
    );
    const imageBlob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setThumbnail(base64data);
    };
  };

  const onLayout = (event: any) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    console.log("haidang", x, y, height, width);
  };

  const handleChangeAudioStatus = () => {
    setAudioStatus((prev) => !prev);
  };

  const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    if (playbackStatus.isLoaded) {
      setPlaybackStatus(playbackStatus);
    } else {
      setPlaybackStatus(null);
    }
  };

  const loadSound = async () => {
    try {
      const sound = new Audio.Sound();
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

      const res = await fetch(
        `https://api-nhom16.herokuapp.com/v1/posts/sound/${props.id}`,
        {
          method: "GET",
        }
      );

      const soundBlob = await res.blob();
      const reader = new FileReader();
      reader.readAsDataURL(soundBlob);
      reader.onload = async () => {
        const base64data = reader.result;

        await sound.loadAsync({
          uri: base64data.toString(),
        });
      };

      setSound(sound);
    } catch (e) {
      console.error(e);
    }
  };

  const playSound = async () => {
    await sound?.playAsync();
  };

  const pauseSound = async () => {
    await sound?.pauseAsync();
  };

  const handleIncrease10Seconds = () => {
    if (playbackStatus?.isLoaded) {
      sound?.setPositionAsync(playbackStatus.positionMillis + 10 * 1000);
    }
  };

  const handleDecrease10Seconds = () => {
    if (playbackStatus?.isLoaded) {
      sound?.setPositionAsync(playbackStatus.positionMillis - 10 * 1000);
    }
  };

  const millisToMinutesAndSeconds = (millis: number = 0) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = parseInt(((millis % 60000) / 1000).toFixed(0));
    if (seconds >= 60) {
      minutes += 1;
      seconds = 0;
    }
    return (
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (seconds < 10 ? "0" : "") +
      seconds
    );
  };

  const initLike = () => {
    if (props.users_like.some((o) => o === cUser.currentUserInfo.user.id)) {
      setIsLiked(true);
    }
  };

  const handleLikePost = () => {
    const dataToSend = {
      postId: props.id,
      userId: cUser.currentUserInfo.user.id,
    };
    socket.emit("post:like", dataToSend);
  };

  const handleListenSound = () => {
    const dataToSend = {
      postId: props.id,
      userId: cUser.currentUserInfo.user.id,
    };
    socket.emit("post:listen", dataToSend);
  };

  useEffect(() => {
    getUserById();
    loadSound();
    loadThumbnail();
    initLike();
  }, []);

  useEffect(() => {
    if (audioStatus) {
      playSound();
      handleListenSound();
    } else {
      pauseSound();
    }
  }, [audioStatus]);

  const handleSelectProfile = () => {
    if (props.user_id === cUser.currentUserInfo.user.id) return;
    if (props.setSelectedProfile) {
      props.setSelectedProfile(props.user_id);
    }
  };

  const handleDeletePost = async () => {
    try {
      const postId = props.id;
      const res = await REQUEST({
        method: "DELETE",
        url: `/posts/${props.id}`,
      });

      if (res && res.data.result) {
        dispatch(DELETE_POST({ postId }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isLoading = Boolean(!user?.username || !thumbnail || !sound);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Instagram />
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleSelectProfile}>
              <View style={styles.header__left}>
                <View
                  style={{
                    marginRight: 8,
                  }}
                >
                  {avatar ? (
                    <Avatar.Image size={32} source={{ uri: avatar }} />
                  ) : (
                    <Avatar.Icon size={32} icon="person" />
                  )}
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginBottom: -4,
                    }}
                  >
                    {user?.username}
                  </Text>

                  <Caption>
                    {moment(props.created_at).format("MMM DD, YYYY HH:mm")}
                  </Caption>
                </View>
              </View>
            </TouchableOpacity>

            <Menu
              visible={toggleMenuOptions}
              onDismiss={() => setToggleMenuOptions(false)}
              anchor={
                <TouchableOpacity onPress={() => setToggleMenuOptions(true)}>
                  <Icon name="ellipsis-horizontal" size={24} />
                </TouchableOpacity>
              }
            >
              {cUser.currentUserInfo.user.id !== props.user_id && (
                <Menu.Item onPress={() => {}} title="Hủy theo dõi" />
              )}
              {cUser.currentUserInfo.user.id === props.user_id && (
                <Menu.Item onPress={() => {}} title="Chỉnh sửa" />
              )}
              {cUser.currentUserInfo.user.id === props.user_id && (
                <>
                  <Divider style={{ height: 1 }} />
                  <Menu.Item
                    onPress={() => {
                      setToggleDeletePostConfirm(true);
                      setToggleMenuOptions(false);
                    }}
                    title="Xóa"
                    icon="trash-outline"
                  />
                </>
              )}
            </Menu>
          </View>

          <View style={styles.caption}>
            <Text>{props.caption}</Text>
          </View>

          <View
            style={{
              borderTopColor: "#e5e5e5",
              borderBottomColor: "#e5e5e5",
              borderTopWidth: 1,
              borderBottomWidth: 1,

              padding: 8,
            }}
          >
            <View style={styles.body}>
              <Image
                style={{
                  width: "45%",
                  height: "95%",
                  borderRadius: 16,
                  marginHorizontal: "auto",
                }}
                source={{
                  uri: thumbnail,
                }}
                resizeMode="cover"
              />
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50%",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {props.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  <TouchableOpacity onPress={handleDecrease10Seconds}>
                    <Icon name="play-back" size={24} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleChangeAudioStatus}>
                    {!audioStatus ? (
                      <Icon
                        name="play-circle"
                        style={{ paddingHorizontal: 16 }}
                        size={48}
                      />
                    ) : (
                      <Icon
                        name="pause-circle"
                        style={{ paddingHorizontal: 16 }}
                        size={48}
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleIncrease10Seconds}>
                    <Icon name="play-forward" size={24} />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: "80%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{ marginBottom: 2, width: "100%", flex: 1 }}
                    onLayout={onLayout}
                  >
                    <Slider
                      style={{ flex: 1 }}
                      value={
                        playbackStatus?.isLoaded
                          ? playbackStatus.positionMillis
                          : 0
                      }
                      minimumValue={0}
                      maximumValue={
                        playbackStatus?.isLoaded
                          ? playbackStatus.durationMillis
                          : 0
                      }
                      minimumTrackTintColor="#00ADB5"
                      maximumTrackTintColor="#000"
                      onSlidingComplete={async (value) => {
                        sound?.setPositionAsync(value);
                        await sound?.playAsync();
                        handleChangeAudioStatus();
                      }}
                      onSlidingStart={async () => {
                        await sound?.pauseAsync();
                        handleChangeAudioStatus();
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>
                      {millisToMinutesAndSeconds(
                        playbackStatus?.isLoaded
                          ? playbackStatus.positionMillis
                          : 0
                      )}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      {millisToMinutesAndSeconds(
                        playbackStatus?.isLoaded
                          ? playbackStatus.durationMillis
                          : 0
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setIsLiked((prev) => !prev);
                      handleLikePost();
                    }}
                  >
                    {isLiked ? (
                      <Icon
                        name="heart-sharp"
                        size={24}
                        color="#f44336"
                        style={{ marginRight: 2 }}
                      />
                    ) : (
                      <Icon
                        name="heart-outline"
                        size={24}
                        style={{ marginRight: 2 }}
                      />
                    )}
                  </TouchableOpacity>
                  <Text style={{ fontWeight: "bold" }}>
                    {props.users_like.length}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Comment", { postId: props.id })
                    }
                  >
                    <Icon
                      name="chatbubble-ellipses-outline"
                      size={24}
                      style={{ marginRight: 2 }}
                    />
                  </TouchableOpacity>
                  <Text style={{ fontWeight: "bold" }}>
                    {comment.list.length}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <Icon
                    name="ear-outline"
                    size={24}
                    style={{ marginRight: 2 }}
                  />
                  <Text style={{ fontWeight: "bold" }}>
                    {props.users_listening.length}
                  </Text>
                </View>

                {cUser.currentUserInfo.user.id !== props.user_id && (
                  <TouchableOpacity>
                    <Icon
                      name="download-outline"
                      size={24}
                      style={{ marginRight: 8 }}
                    />
                  </TouchableOpacity>
                )}
                {cUser.currentUserInfo.user.id !== props.user_id && (
                  <TouchableOpacity>
                    <Icon name="bookmark-outline" size={24} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </>
      )}

      <Portal>
        <Dialog
          visible={toggleDeletePostConfirm}
          onDismiss={() => setToggleDeletePostConfirm(false)}
        >
          <Dialog.Title>Bạn muốn xóa bài viết này?</Dialog.Title>
          <Dialog.Content>
            <Button
              mode="contained"
              style={{ marginBottom: 8 }}
              onPress={() => {
                handleDeletePost();
                setToggleDeletePostConfirm(false);
                setToggleMenuOptions(false);
              }}
            >
              Xóa
            </Button>
            <Button
              mode="outlined"
              onPress={() => setToggleDeletePostConfirm(false)}
              style={{ borderWidth: 1, borderColor: "#00adb5" }}
            >
              Hủy
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 4,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  header__left: {
    flexDirection: "row",
    alignItems: "center",
  },
  header__right: {},
  caption: {
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    marginTop: 8,
  },
});

export default Post;
