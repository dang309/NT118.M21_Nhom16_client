import { FOLDERS } from "../context/files";
import { ISingleUser } from "../features/UserSlice";
import * as FileSystem from "expo-file-system";
import { REQUEST } from "../utils";

class UserServices {
  getUserById = async (userId: string): Promise<ISingleUser | null> => {
    try {
      const res = await REQUEST({
        method: "GET",
        url: `/users/${userId}`,
      });

      if (res && !res.data.result) return null;

      return res.data.data;
    } catch (e) {
      throw e;
    }
  };

  loadAvatar = async (user: ISingleUser | null) => {
    try {
      if (!user?.avatar.key.length) return;
      const URL = `https://api-nhom16.herokuapp.com/v1/users/avatar/${user.id}`;
      const fileToSave =
        FOLDERS.POST.AVATARS +
        user.avatar.key.split("/")[1].replace(/[(\s+)-]/gi, "_");
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
}

export default new UserServices();
