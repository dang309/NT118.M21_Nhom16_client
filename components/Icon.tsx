import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IconProps = {
  size?: number;
  color?: string;
  name: string;
  style?: object;
};

export default function Icon(props: IconProps) {
  return (
    <View style={{ ...props.style }}>
      <Ionicons
        size={props.size || 24}
        name={props.name}
        color={props.color || "#000"}
      />
    </View>
  );
}
