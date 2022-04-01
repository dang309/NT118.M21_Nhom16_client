import { useEffect } from "react";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { store } from "./app/store";
import { Provider } from "react-redux";

import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import Icon from "./components/Icon";

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {}

    interface Theme {}
  }
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

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

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <PaperProvider
            theme={theme}
            settings={{ icon: (props) => <Icon {...props} /> }}
          >
            <Navigation colorScheme={colorScheme} />
          </PaperProvider>
        </Provider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
