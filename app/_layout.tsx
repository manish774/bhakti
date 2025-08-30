import { AuthProvider, useAuth } from "@/context/UserContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import Home from "./Home/Home";

function MainStack() {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Home />;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      {/* Add other screens here */}
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
