import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { useState, useEffect, useContext, useCallback, useRef } from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

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

import { IUser } from "../features/UserSlice";
import { DELETE_POST, IPostItem, UPDATE_POST } from "../features/PostSlice";
import { ADD_COMMENT, IComment } from "../features/CommentSlice";

import { useAppDispatch, useAppSelector } from "../app/hook";

import moment from "moment";

import { SocketContext } from "../context/socket";

import { Instagram } from "react-content-loader/native";
import { ADD_NOTIFICATION } from "../features/NotificationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DBContext } from "../context/db";
import useSWR from "swr";

import * as FileSystem from "expo-file-system";
import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

type Props = IPostItem & { setSelectedProfile?: (value: string) => void };

const Post = (props: Props) => {
  const dispatch = useAppDispatch();

  const db = useContext(DBContext);

  const socket = useContext(SocketContext);

  const navigation = useNavigation();

  const fetcher = (url: string) => fetch(url).then((res) => res.blob());

  const cache = new Map();

  const state = useAppSelector<RootState>((state) => state);
  const USER = useAppSelector<IUser>((state) => state.user);
  const comment = useAppSelector<IComment>((state) => state.comment);
  const isLoading = useAppSelector<boolean>((state) => state.common.loading);

  const [sound, setSound] = useState<any>(null);
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | null>(
    null
  );
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [avatar, setAvatar] = useState<any>(null);

  const [audioStatus, setAudioStatus] = useState<boolean>(false);

  const [durationMillis, setDurationMillis] = useState<number | undefined>(0);
  const [positionMillis, setPositionMillis] = useState<number | undefined>(0);

  const [toggleMenuOptions, setToggleMenuOptions] = useState<boolean>(false);
  const [toggleDeletePostConfirm, setToggleDeletePostConfirm] =
    useState<boolean>(false);

  const [sliderWidth, setSliderWidth] = useState<number>(0);

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
    const sound = new Audio.Sound();
    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    await sound.loadAsync({
      uri: props.sound.uri,
    });

    setSound(sound);
  };

  // const loadSound = useCallback(
  //   async (postId: string) => {
  //     try {
  //       const sound = new Audio.Sound();
  //       sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

  //       const URL = `https://api-nhom16.herokuapp.com/v1/posts/sound/${postId}`;

  //       if (props.sound) {
  //         await sound.loadAsync({
  //           uri: props.sound.uri,
  //         });

  //         setSound(sound);

  //         return;
  //       }

  //       const res = await fetch(URL);

  //       const soundBlob = await res.blob();

  //       const reader = new FileReader();
  //       reader.readAsDataURL(soundBlob);
  //       reader.onload = async () => {
  //         const base64data = reader.result;

  //         await sound.loadAsync({
  //           uri: base64data.toString(),
  //         });

  //         dispatch(
  //           UPDATE_POST({
  //             postId: props.id,
  //             dataToUpdate: {
  //               sound: base64data.toString(),
  //             },
  //           })
  //         );
  //       };

  //       setSound(sound);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   },
  //   [props.id]
  // );

  // const loadThumbnail = useCallback(
  //   async (postId: string) => {
  //     try {
  //       const URL = `https://api-nhom16.herokuapp.com/v1/posts/thumbnail/${postId}`;

  //       if (props.thumbnail) {
  //         if (mounted) {
  //           setThumbnail(props.thumbnail);
  //         }
  //         return;
  //       }

  //       const res = await fetch(URL);

  //       const thumbnailBlob = await res.blob();
  //       const reader = new FileReader();
  //       reader.readAsDataURL(thumbnailBlob);
  //       reader.onloadend = () => {
  //         const base64data = reader.result;
  //         dispatch(
  //           UPDATE_POST({
  //             postId: props.id,
  //             dataToUpdate: {
  //               thumbnail: base64data,
  //             },
  //           })
  //         );
  //         if (mounted) {
  //           setThumbnail(base64data);
  //         }
  //       };
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   },
  //   [props.id]
  // );

  // const loadAvatar = useCallback(
  //   async (userId: string) => {
  //     try {
  //       const URL = `https://api-nhom16.herokuapp.com/v1/users/avatar/${userId}`;

  //       if (props.posting_user.avatar) {
  //         if (mounted) {
  //           setAvatar(props.posting_user.avatar);
  //         }
  //         return;
  //       }
  //       const res = await fetch(URL);

  //       const avatarBlob = await res.blob();
  //       const reader = new FileReader();
  //       reader.readAsDataURL(avatarBlob);
  //       reader.onloadend = () => {
  //         const base64data = reader.result;
  //         dispatch(
  //           UPDATE_POST({
  //             postId: props.id,
  //             dataToUpdate: {
  //               posting_user: {
  //                 ...props.posting_user,
  //                 avatar: base64data,
  //               },
  //             },
  //           })
  //         );
  //         if (mounted) {
  //           setAvatar(base64data);
  //         }
  //       };
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   },
  //   [props.posting_user.id]
  // );

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

  const handleLikePost = () => {
    const dataToSend = {
      postId: props.id,
      userId: USER.loggedInUser.id,
    };
    dispatch(
      UPDATE_POST({
        postId: props.id,
        dataToUpdate: {
          is_like_from_me: !props.is_like_from_me,
        },
      })
    );
    socket.emit("post:like", dataToSend);
  };

  const handleListenSound = () => {
    const dataToSend = {
      postId: props.id,
      userId: USER.loggedInUser.id,
    };
    socket.emit("post:listen", dataToSend);
  };

  const handleBookmarkPost = () => {
    const dataToSend = {
      postId: props.id,
      userId: USER.loggedInUser.id,
    };
    dispatch(
      UPDATE_POST({
        postId: props.id,
        dataToUpdate: {
          is_bookmarked_from_me: !props.is_bookmarked_from_me,
        },
      })
    );
    socket.emit("user:add_bookmarked_post", dataToSend);
  };

  const handleSelectProfile = () => {
    if (props.posting_user.id === USER.loggedInUser.id) return;
    if (props.setSelectedProfile) {
      props.setSelectedProfile(props.posting_user.id);
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

  const countComment = createDraftSafeSelector(
    (state: RootState) => state.comment,
    (comment) => comment.list.filter((o) => o.post_id === props.id).length
  );

  useEffect(() => {
    loadSound();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (audioStatus) {
        playSound();
        handleListenSound();
      } else {
        pauseSound();
      }
    }, [audioStatus])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSelectProfile}>
          <View style={styles.header__left}>
            <View
              style={{
                marginRight: 8,
              }}
            >
              {props.posting_user.avatar.uri ? (
                <Avatar.Image
                  size={32}
                  source={{ uri: props.posting_user.avatar.uri }}
                />
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
                {props.posting_user.username}
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
          {USER.loggedInUser.id !== props.posting_user.id && (
            <Menu.Item onPress={() => {}} title="Hủy theo dõi" />
          )}
          {USER.loggedInUser.id === props.posting_user.id && (
            <Menu.Item onPress={() => {}} title="Chỉnh sửa" />
          )}
          {USER.loggedInUser.id === props.posting_user.id && (
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
          borderBottomWidth: 1,
          borderBottomColor: "#e5e5e5",
          padding: 8,
          paddingTop: 2,
        }}
      >
        <View style={styles.body}>
          {props.thumbnail.uri ? (
            <Image
              style={{
                width: "50%",
                height: "100%",
                borderRadius: 16,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                marginHorizontal: "auto",
              }}
              source={{
                uri: props.thumbnail.uri,
              }}
              resizeMode="cover"
            />
          ) : (
            <ActivityIndicator
              color="#00adb5"
              style={{
                width: "45%",
                marginHorizontal: "auto",
              }}
            />
          )}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "50%",

              borderWidth: 1,
              borderColor: "#e5e5e5",
              borderRadius: 16,
              borderLeftWidth: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,

              padding: 4,
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

              {sound ? (
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
              ) : (
                <ActivityIndicator
                  color="#00adb5"
                  style={{ paddingHorizontal: 16 }}
                />
              )}

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
              <View style={{ marginBottom: 2, width: "100%", flex: 1 }}>
                <Slider
                  style={{ flex: 1 }}
                  value={
                    playbackStatus?.isLoaded ? playbackStatus.positionMillis : 0
                  }
                  minimumValue={0}
                  maximumValue={
                    playbackStatus?.isLoaded ? playbackStatus.durationMillis : 0
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
                    playbackStatus?.isLoaded ? playbackStatus.positionMillis : 0
                  )}
                </Text>
                <Text style={{ fontSize: 12 }}>
                  {millisToMinutesAndSeconds(
                    playbackStatus?.isLoaded ? playbackStatus.durationMillis : 0
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
              <TouchableOpacity onPress={handleLikePost}>
                {props.is_like_from_me ? (
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
              <Text style={{ fontWeight: "bold" }}>{countComment(state)}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 8,
              }}
            >
              {props.is_hear_from_me ? (
                <Icon
                  name="ear-sharp"
                  size={24}
                  color="#F9D923"
                  style={{ marginRight: 2 }}
                />
              ) : (
                <Icon name="ear-outline" size={24} style={{ marginRight: 2 }} />
              )}
              <Text style={{ fontWeight: "bold" }}>
                {props.users_listening.length}
              </Text>
            </View>

            {USER.loggedInUser.id !== props.posting_user.id && (
              <TouchableOpacity onPress={handleBookmarkPost}>
                {props.is_bookmarked_from_me ? (
                  <Icon name="bookmark-sharp" size={24} />
                ) : (
                  <Icon name="bookmark-outline" size={24} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

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
