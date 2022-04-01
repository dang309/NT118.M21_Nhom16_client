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
import {
  NewsFeedScreen,
  RankingScreen,
  ProfileScreen,
  NotFoundScreen,
  LoginScreen,
  RegisterScreen,
} from "../screens";

// Components
import { Icon } from "../components";

// Types
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";

import { useAppDispatch, useAppSelector } from "./../app/hook";
import { TOGGLE_PROFILE_ACTIONS_DIALOG } from "../features/UserSlice";
import { IUser } from "./../features/UserSlice";
import { useNavigation } from "@react-navigation/native";

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
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}

function MyTabBar({ state, descriptors, navigation }: any) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        height: 64,
        backgroundColor: "#fff",
        borderTopColor: "#e5e5e5",
        borderTopWidth: 1,
      }}
    >
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label = route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        let icon = "";

        switch (route.name) {
          case "NewsFeed":
            icon = "home";
            break;
          case "Ranking":
            icon = "medal";
            break;
          case "AddPost":
            icon = "add-circle-outline";
            break;
          case "CryptoMarket":
            icon = "bar-chart";
            break;
          case "Profile":
            icon = "person";
            break;
        }

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={route.key}
          >
            <View
              style={{
                paddingLeft: index % 2 !== 0 ? 48 : 0,
                paddingRight: index % 2 !== 0 ? 48 : 0,
              }}
            >
              <Icon
                name={icon}
                color={isFocused ? "#00ADB5" : "#000"}
                size={index === 2 ? 32 : 24}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const cUser = useAppSelector<IUser>((state) => state.user);
  const navigation = useNavigation();

  const handleToggleProfileActionsDialog = () => {
    dispatch(TOGGLE_PROFILE_ACTIONS_DIALOG());
  };

  const handleLogout = async () => {
    try {
      const tokens = await AsyncStorage.getItem("@tokens");

      await REQUEST({
        method: "POST",
        url: "/auth/logout",
        data: {
          refreshToken: tokens?.length ? JSON.parse(tokens).refresh.token : "",
        },
      });
      await AsyncStorage.removeItem("@tokens");
      dispatch(CLEAR_USER());
      navigation.navigate("Login");
      handleToggleProfileActionsDialog();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <BottomTab.Navigator
      initialRouteName="NewsFeed"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
      }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <BottomTab.Screen name="NewsFeed" component={NewsFeedScreen} />

      <BottomTab.Screen name="Ranking" component={RankingScreen} />

      <BottomTab.Screen name="AddPost" component={NewsFeedScreen} />

      <BottomTab.Screen name="CryptoMarket" component={NewsFeedScreen} />

      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerLeft: () => (
            <IconButton
              icon="arrow-back"
              size={24}
              onPress={() => navigation.goBack()}
            />
          ),
          title: cUser.currentUserInfo.user.username || "Profile",
          headerRight: () => (
            <>
              <Menu
                visible={
                  !!cUser?.currentUserInfo?.actions?.showProfileActionsDialog
                }
                onDismiss={handleToggleProfileActionsDialog}
                anchor={
                  <IconButton
                    icon="ellipsis-vertical"
                    size={24}
                    onPress={handleToggleProfileActionsDialog}
                  />
                }
              >
                <Menu.Item
                  onPress={() => {}}
                  title={PROFILE_CONSTANT.EDIT_PROFILE}
                  icon="pencil"
                />
                <Menu.Item
                  onPress={() => {}}
                  title={PROFILE_CONSTANT.BOOKMARK}
                  icon="bookmark"
                />
                <Divider style={{ height: 1 }} />
                <Menu.Item
                  onPress={handleLogout}
                  title={PROFILE_CONSTANT.SIGN_OUT}
                  icon="log-out-outline"
                />
              </Menu>
            </>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
