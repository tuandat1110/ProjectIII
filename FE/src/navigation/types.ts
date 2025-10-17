import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Main: undefined;
    Login: undefined;
    Signup: undefined;
}

/** Tab params (nếu dùng tab) */
export type MainTabParamList = {
  Feed: undefined;
  Search: { q?: string } | undefined;
  Settings: undefined;
};

/** Convenience props for stack screens */
export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

/** Composite props example: a screen inside tab + stack */
// export type FeedScreenProps =
//   CompositeScreenProps<
//     BottomTabScreenProps<MainTabParamList, 'Feed'>,
//     NativeStackScreenProps<RootStackParamList>
//   >;