/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  EmailVerification: undefined;
  NewsFeed: undefined;
  Ranking: undefined;
  AddPost: undefined;
  Chat: undefined;
  Profile: undefined;
  Comment: undefined;
  BottomNavigation: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type NavigationLoginProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

export type NavigationRegisterProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;

export type NavigationForgotPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "ForgotPassword"
>;

export type NavigationEmailVerificationProps = NativeStackScreenProps<
  RootStackParamList,
  "EmailVerification"
>;

export type NavigationResetPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "ResetPassword"
>;

export type NavigationNewsFeedProps = NativeStackScreenProps<
  RootStackParamList,
  "NewsFeed"
>;

export type NavigationRankingProps = NativeStackScreenProps<
  RootStackParamList,
  "Ranking"
>;

export type NavigationAddPostProps = NativeStackScreenProps<
  RootStackParamList,
  "AddPost"
>;

export type NavigationChatProps = NativeStackScreenProps<
  RootStackParamList,
  "Chat"
>;

export type NavigationProfileProps = NativeStackScreenProps<
  RootStackParamList,
  "Profile"
>;

export type User = {
  user: {
    id: string;
    email: string;
    username: string;
    bio: string;
    avatar: string;
    following: string;
    followers: string;
    balance_dcoin: number;
    hobbies: string;
  };
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
};
