import { useEffect } from "react";
import { StatusBar } from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { store } from "./app/store";
import { Provider } from "react-redux";

import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import Icon from "./components/Icon";

import { SocketContext, socket } from "./context/socket";

import { UPDATE_POST } from "./features/PostSlice";

import { useAppDispatch } from "./app/hook";

import _omit from "lodash/omit";

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {}

    interface Theme {}
  }
}

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  const getNumLike = (data: any) => {
    const dataToSend = {
      postId: data.postId,
      dataToUpdate: _omit(data, ["postId"]),
    };
    dispatch(UPDATE_POST({ des: "newsfeed", ...dataToSend }));
  };

  const getNumListening = (data: any) => {
    const dataToSend = {
      postId: data.postId,
      dataToUpdate: _omit(data, ["postId"]),
    };
    dispatch(UPDATE_POST({ des: "newsfeed", ...dataToSend }));
  };

  useEffect(() => {
    socket.on("post:num_like", getNumLike);
    socket.on("post:num_listening", getNumListening);
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return <Navigation colorScheme={colorScheme} />;
  }
}

export default function AppWrapper() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#00ADB5",
      accent: "#B50800",
      backgroud: "#fff",
      surface: "#fff",
    },
  };
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PaperProvider
          theme={theme}
          settings={{ icon: (props) => <Icon {...props} /> }}
        >
          <SocketContext.Provider value={socket}>
            <App />
          </SocketContext.Provider>
        </PaperProvider>
      </Provider>

      <StatusBar
        animated={true}
        backgroundColor="#00adb5"
        barStyle="light-content"
        showHideTransition="slide"
      />
    </SafeAreaProvider>
  );
}
