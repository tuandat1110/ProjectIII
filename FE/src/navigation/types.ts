// import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Room } from "../types/room";

export type RootStackParamList = {
    Main: undefined;
    Login: undefined;
    Signup: undefined;
    MainTab: undefined;
    Room: Room;
    ProfileDetail: undefined;
    Dashboard: undefined;
}

/** Tab params (nếu dùng tab) */
export type MainTabParamList = {
  Home: undefined;
  Device: undefined;
  Personal: undefined;
  Notification: undefined;
};

/** Convenience props for stack screens */
export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

/** Dùng cho các màn hình trong Tab nhưng vẫn muốn gọi navigation của RootStack */
export type MainTabScreenProps<Screen extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;