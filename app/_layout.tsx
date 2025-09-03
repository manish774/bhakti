import { BhaktiColors } from "@/constants/Colors";
import { AuthProvider } from "@/context/UserContext";
import { Stack, useRouter } from "expo-router";
import { Image, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
// Note: Home is imported in the index route; keep layout minimal.
function MainStack() {
  function Gear() {
    const router = useRouter();
    return (
      <TouchableOpacity onPress={() => router.push("/settings/settings")}>
        <Image
          source={require("@/assets/images/settings.png")}
          style={{ width: 30, height: 30, marginLeft: 8 }}
        />
      </TouchableOpacity>
    );
  }
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerStyle: { backgroundColor: BhaktiColors.background },
          headerTitleStyle: { color: BhaktiColors.error, fontWeight: "bold" },
          headerRight: () => {
            return <Gear />;
          },
          headerLeft: () => (
            <Image
              source={require("@/assets/gods/Hanuman.png")}
              style={{ width: 30, height: 30, marginLeft: 8 }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Description"
        options={{
          title: "Description",
          headerStyle: { backgroundColor: BhaktiColors.background },
          headerTitleStyle: { color: BhaktiColors.error, fontWeight: "bold" },
          headerRight: () => {
            return (
              <>
                <Image
                  source={require("@/assets/gods/Hanuman.png")}
                  style={{ width: 30, height: 30, marginLeft: 8 }}
                />
              </>
            );
          },
        }}
      />
    </Stack>
  );
}
export default function RootLayout() {
  const theme = {
    ...DefaultTheme,
    // Specify custom property
    myOwnProperty: true,
    // Specify custom property in nested object
    colors: {
      ...DefaultTheme.colors,
      myOwnColor: "#BADA55",
    },
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <MainStack />
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
