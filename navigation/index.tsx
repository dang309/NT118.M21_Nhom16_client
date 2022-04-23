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
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import {
  ColorSchemeName,
  Pressable,
  TouchableOpacity,
  View,
  Text,
  Button,
} from "react-native";

import { IconButton, Menu, Divider } from "react-native-paper";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

import PROFILE_CONSTANT from "./../constants/Profile";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { CLEAR_USER, SET_USER } from "../features/UserSlice";

import { REQUEST } from "../utils";

// Screens
import * as SCREENS from "../screens";

// Components
import { Icon } from "../components";

// Types
import { RootStackParamList } from "../types";

import * as ADDPOST_CONSTANT from "../constants/AddPost";

import { useAppDispatch, useAppSelector } from "./../app/hook";
import { TOGGLE_PROFILE_ACTIONS_DIALOG } from "../features/UserSlice";
import { IUser } from "./../features/UserSlice";
import { IPost } from "./../features/PostSlice";
import { useNavigation } from "@react-navigation/native";
import AddPostScreen from "../screens/AddPostScreen";

import BottomNavigation from "./BottomNavigation";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
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
        name="BottomNavigation"
        component={BottomNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={SCREENS.ChatContactScreen}
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

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

// function BottomTabNavigator() {
//   const colorScheme = useColorScheme();
//   const dispatch = useAppDispatch();
//   const cUser = useAppSelector<IUser>((state) => state.user);
//   const post = useAppSelector<IPost>((state) => state.post);
//   const navigation = useNavigation();

//   const handleToggleProfileActionsDialog = () => {
//     dispatch(TOGGLE_PROFILE_ACTIONS_DIALOG());
//   };

//   const handleLogout = async () => {
//     try {
//       const tokens = await AsyncStorage.getItem("@tokens");

//       await REQUEST({
//         method: "POST",
//         url: "/auth/logout",
//         data: {
//           refreshToken: tokens?.length ? JSON.parse(tokens).refresh.token : "",
//         },
//       });
//       await AsyncStorage.removeItem("@tokens");
//       dispatch(CLEAR_USER());
//       navigation.navigate("Login");
//       handleToggleProfileActionsDialog();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const getTitleByStepIndicator = (stepIndicator: number): string => {
//     let result = "";
//     switch (stepIndicator) {
//       case 0:
//         result = ADDPOST_CONSTANT.PICK_SOUND;
//         break;
//       case 1:
//         result = ADDPOST_CONSTANT.PICK_THUMBNAIL;
//         break;
//       case 2:
//         result = ADDPOST_CONSTANT.DESC;
//         break;
//     }
//     return result;
//   };

//   return (
//     <BottomTab.Navigator
//       initialRouteName="NewsFeed"
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme].tint,
//         headerShown: false,
//       }}
//       tabBar={(props) => <MyTabBar {...props} />}
//     >
//       <BottomTab.Screen name="NewsFeed" component={SCREENS.NewsFeedScreen} />

//       <BottomTab.Screen name="Ranking" component={SCREENS.RankingScreen} />

//       <BottomTab.Screen
//         name="AddPost"
//         component={SCREENS.AddPostScreen}
//         options={{
//           headerShown: true,
//           title: getTitleByStepIndicator(post.actions.stepIndicatorAddPost),
//           headerLeft: () => (
//             <IconButton
//               icon="arrow-back"
//               size={24}
//               onPress={() => navigation.goBack()}
//             />
//           ),
//         }}
//       />

//       <BottomTab.Screen
//         name="CryptoMarket"
//         component={SCREENS.NewsFeedScreen}
//       />

//       <BottomTab.Screen
//         name="Profile"
//         component={SCREENS.ProfileScreen}
//         options={{
//           headerShown: true,
//           headerLeft: () => (
//             <IconButton
//               icon="arrow-back"
//               size={24}
//               onPress={() => navigation.goBack()}
//             />
//           ),
//           title: cUser.currentUserInfo.user.username || "Profile",
//           headerRight: () => (
//             <>
//               <Menu
//                 visible={
//                   !!cUser?.currentUserInfo?.actions?.showProfileActionsDialog
//                 }
//                 onDismiss={handleToggleProfileActionsDialog}
//                 anchor={
//                   <IconButton
//                     icon="ellipsis-vertical"
//                     size={24}
//                     onPress={handleToggleProfileActionsDialog}
//                   />
//                 }
//               >
//                 <Menu.Item
//                   onPress={() => {}}
//                   title={PROFILE_CONSTANT.EDIT_PROFILE}
//                   icon="pencil"
//                 />
//                 <Menu.Item
//                   onPress={() => {}}
//                   title={PROFILE_CONSTANT.BOOKMARK}
//                   icon="bookmark"
//                 />
//                 <Divider style={{ height: 1 }} />
//                 <Menu.Item
//                   onPress={handleLogout}
//                   title={PROFILE_CONSTANT.SIGN_OUT}
//                   icon="log-out-outline"
//                 />
//               </Menu>
//             </>
//           ),
//         }}
//       />
//     </BottomTab.Navigator>
//   );
// }
