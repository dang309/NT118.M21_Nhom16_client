import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";

import * as SCREENS from "../screens";

const MyComponent = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "newsfeed", title: "Bảng tin", icon: "home-sharp" },
    { key: "ranking", title: "Xếp hạng", icon: "medal-sharp" },
    { key: "add-post", title: "Thêm", icon: "add-circle-sharp" },
    { key: "chat", title: "Trò chuyện", icon: "chatbubble-sharp" },
    { key: "profile", title: "Hồ sơ cá nhân", icon: "person-sharp" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    newsfeed: SCREENS.NewsFeedScreen,
    ranking: SCREENS.RankingScreen,
    "add-post": SCREENS.AddPostScreen,
    chat: SCREENS.ChatContactScreen,
    profile: SCREENS.ProfileScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default MyComponent;
