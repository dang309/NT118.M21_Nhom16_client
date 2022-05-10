/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  StackRouter,
  useFocusEffect,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect, useCallback, useContext } from "react";
import { ColorSchemeName } from "react-native";

import { IconButton, Menu, Divider } from "react-native-paper";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

import PROFILE_CONSTANT from "./../constants/Profile";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ISingleUser, SET_USER } from "../features/UserSlice";

import { REQUEST } from "../utils";

// Screens
import * as SCREENS from "../screens";

// Components
import { Icon } from "../components";

// Types
import { RootStackParamList } from "../types";

import * as ADDPOST_CONSTANT from "../constants/AddPost";

import { useAppDispatch, useAppSelector } from "./../app/hook";
import { IUser } from "./../features/UserSlice";
import { ADD_POST, IPost, IPostItem, SET_POST } from "./../features/PostSlice";
import { useNavigation } from "@react-navigation/native";

import { COMMON } from "../utils";
import { START_LOADING, STOP_LOADING } from "../features/CommonSlice";
import { DBContext } from "../context/db";

import * as FileSystem from "expo-file-system";
import { FOLDERS } from "../context/files";
import { ADD_COMMENT } from "../features/CommentSlice";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const dispatch = useAppDispatch();

  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={SCREENS.LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={SCREENS.RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={SCREENS.ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailVerification"
        component={SCREENS.EmailVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={SCREENS.ResetPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ChatConversation"
        component={SCREENS.ChatConversationScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Comment"
        component={SCREENS.CommentScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EditProfile"
        component={SCREENS.EditProfileScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProfileViewer"
        component={SCREENS.ProfileViewerScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Search"
        component={SCREENS.SearchScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="NotFound"
        component={SCREENS.NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}

// function MyTabBar({ state, descriptors, navigation }) {
//   return (
//     <View style={{ flexDirection: "row" }}>
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key];
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//             ? options.title
//             : route.name;

//         const isFocused = state.index === index;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: "tabPress",
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             // The `merge: true` option makes sure that the params inside the tab screen are preserved
//             navigation.navigate({ name: route.name, merge: true });
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: "tabLongPress",
//             target: route.key,
//           });
//         };

//         return (
//           <TouchableOpacity
//             accessibilityRole="button"
//             accessibilityState={isFocused ? { selected: true } : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarTestID}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             style={{ flex: 1 }}
//           >
//             <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
//               {label}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

const BottomTab = createBottomTabNavigator();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  const dispatch = useAppDispatch();

  const USER = useAppSelector<IUser>((state) => state.user);
  const POST = useAppSelector<IPost>((state) => state.post);

  const loadSound = async (post: IPostItem) => {
    try {
      const URL = `https://api-nhom16.herokuapp.com/v1/posts/sound/${post.id}`;
      const fileToSave =
        FOLDERS.POST.SOUNDS +
        post.sound.key.split("/")[1].replace(/[(\s+)-]/gi, "_");
      const fileInfo = await FileSystem.getInfoAsync(fileToSave);
      if (fileInfo.exists) {
        return fileToSave;
      }
      const { uri } = await FileSystem.downloadAsync(URL, fileToSave);
      return uri;
    } catch (err) {
      console.error(err);
    }
  };

  const loadThumbnail = async (post: IPostItem) => {
    try {
      const URL = `https://api-nhom16.herokuapp.com/v1/posts/thumbnail/${post.id}`;
      const fileToSave =
        FOLDERS.POST.THUMBNAILS +
        post.thumbnail.key.split("/")[1].replace(/[(\s+)-]/gi, "_");
      const fileInfo = await FileSystem.getInfoAsync(fileToSave);
      if (fileInfo.exists) {
        return fileToSave;
      }
      const { uri } = await FileSystem.downloadAsync(URL, fileToSave);
      return uri;
    } catch (err) {
      console.error(err);
    }
  };

  const loadAvatar = async (user: ISingleUser) => {
    try {
      if (!user?.avatar?.key.length) return;
      const URL = `https://api-nhom16.herokuapp.com/v1/users/avatar/${user.id}`;
      const fileToSave =
        FOLDERS.POST.AVATARS +
        user?.avatar?.key.split("/")[1].replace(/[(\s+)-]/gi, "_");
      const fileInfo = await FileSystem.getInfoAsync(fileToSave);
      if (fileInfo.exists) {
        return fileToSave;
      }
      const { uri } = await FileSystem.downloadAsync(URL, fileToSave);
      return uri;
    } catch (err) {
      console.error(err);
    }
  };

  const loadComments = async (post: IPostItem) => {
    try {
      let filters = [];
      filters.push({
        key: "post_id",
        operator: "=",
        value: post.id,
      });
      const params = {
        filters: JSON.stringify(filters),
      };
      const res = await REQUEST({
        method: "GET",
        url: "/comments",
        params,
      });

      if (res && res.data.result) {
        dispatch(ADD_COMMENT(res.data.data.results));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadPosts = async () => {
    try {
      dispatch(START_LOADING());
      const params = {
        sortBy: "created_at:desc",
        limit: 5,
      };
      const res = await REQUEST({
        method: "GET",
        url: "/posts",
        params,
      });

      if (res && res.data.result) {
        let _sound;
        let _thumbnail;
        let _user;
        let _avatar;
        let result = [];
        let temp = res.data.data.results;
        for (let i = 0; i < temp.length; i++) {
          _sound = await loadSound(temp[i]);
          _thumbnail = await loadThumbnail(temp[i]);
          _user = await COMMON.getUserById(temp[i].user_id);
          _avatar = await loadAvatar(_user);
          await loadComments(temp[i]);
          if (
            temp[i].users_like.some((o: any) => o === USER.loggedInUser.id) &&
            temp[i].users_listening.some((o: any) => o === USER.loggedInUser.id)
          ) {
            result.push({
              ...temp[i],
              sound: {
                ...temp[i].sound,
                uri: _sound,
              },
              thumbnail: {
                ...temp[i].thumbnail,
                uri: _thumbnail,
              },
              posting_user: {
                ..._user,
                avatar: {
                  ..._user.avatar,
                  uri: _avatar,
                },
              },
              is_like_from_me: true,
              is_hear_from_me: true,
            });
          } else if (
            temp[i].users_like.some((o: any) => o === USER.loggedInUser.id)
          ) {
            result.push({
              ...temp[i],
              sound: {
                ...temp[i].sound,
                uri: _sound,
              },
              thumbnail: {
                ...temp[i].thumbnail,
                uri: _thumbnail,
              },
              posting_user: {
                ..._user,
                avatar: {
                  ..._user.avatar,
                  uri: _avatar,
                },
              },
              is_like_from_me: true,
            });
          } else if (
            temp[i].users_listening.some((o: any) => o === USER.loggedInUser.id)
          ) {
            result.push({
              ...temp[i],
              sound: {
                ...temp[i].sound,
                uri: _sound,
              },
              thumbnail: {
                ...temp[i].thumbnail,
                uri: _thumbnail,
              },
              posting_user: {
                ..._user,
                avatar: {
                  ..._user.avatar,
                  uri: _avatar,
                },
              },
              is_hear_from_me: true,
            });
          } else {
            result.push({
              ...temp[i],
              sound: {
                ...temp[i].sound,
                uri: _sound,
              },
              thumbnail: {
                ...temp[i].thumbnail,
                uri: _thumbnail,
              },
              posting_user: {
                ..._user,
                avatar: {
                  ..._user.avatar,
                  uri: _avatar,
                },
              },
            });
          }
        }
        dispatch(SET_POST(result));
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(STOP_LOADING());
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!USER.loggedInUser.id.length) return;
      if (POST.list.length > 0) return;
      loadPosts();

      return () => {
        console.log("unfocused");
      };
    }, [])
  );

  return (
    <BottomTab.Navigator
      initialRouteName="NewsFeed"
      screenOptions={{
        tabBarActiveTintColor: "#00adb5",
        tabBarShowLabel: false,
        headerShown: false,
        unmountOnBlur: false,

        tabBarStyle: {
          backgroundColor: "#fff",

          borderTopWidth: 1,
          borderTopColor: "#e5e5e5",
        },
      }}
    >
      <BottomTab.Screen
        name="NewsFeed"
        component={SCREENS.NewsFeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-sharp" color={color} size={size} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Ranking"
        component={SCREENS.RankingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="medal-sharp" color={color} size={size} />
          ),
        }}
      />

      <BottomTab.Screen
        name="AddPost"
        component={SCREENS.AddPostScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="add-circle-sharp" color={color} size={size} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Chat"
        component={SCREENS.ChatContactScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chatbubble-sharp" color={color} size={size} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Profile"
        component={SCREENS.ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-sharp" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
