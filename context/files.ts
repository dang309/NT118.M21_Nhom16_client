import { createContext } from "react";
import * as FileSystem from "expo-file-system";

const SOUNDS = FileSystem.documentDirectory + "post/sounds/";
const THUMBNAILS = FileSystem.documentDirectory + "post/thumbnails/";
const AVATARS = FileSystem.documentDirectory + "post/avatars/";

const USER_AVATARS = FileSystem.documentDirectory + "user/avatars/";

export const FOLDERS = {
  USER: {
    AVATARS: USER_AVATARS,
  },
  POST: {
    SOUNDS,
    THUMBNAILS,
    AVATARS,
  },
};
