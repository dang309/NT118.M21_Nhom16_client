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
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  NewsFeed: undefined;
  Ranking: undefined;
  AddPost: undefined;
  CryptoMarket: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ResetPassword: undefined;
  EmailVerification: undefined;
  ForgotPassword: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type NavigationLoginProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

export type NavigationRegisterProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
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
