import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/UserContext";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack, useRouter } from "expo-router";
import { Image, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
// Note: Home is imported in the index route; keep layout minimal.
function MainStack() {
  const { theme } = useTheme();
  const { clerkLoaded, isSignedIn, corePujaType } = useAuth();

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

  function SelectPujaType() {
    const router = useRouter();
    return (
      isSignedIn && (
        <TouchableOpacity
          onPress={() => router.push("/Home/SelectCorePujaType")}
        >
          <Image
            source={require("@/assets/images/settings.png")}
            style={{ width: 30, height: 30, marginLeft: 8 }}
          />
        </TouchableOpacity>
      )
    );
  }
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerStyle: { backgroundColor: theme.background },
          headerTitleStyle: {
            color: theme.accent,
            fontWeight: "bold",
          },
          headerRight: () => {
            return isSignedIn ? <Gear /> : undefined;
          },
          headerLeft: () => (isSignedIn ? <SelectPujaType /> : undefined),
        }}
      />
      <Stack.Screen
        name="Description"
        options={{
          title: "Description",
          headerStyle: { backgroundColor: theme.background },
          headerTitleStyle: { color: theme.error, fontWeight: "bold" },
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
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <PaperProvider theme={theme}>
          <ThemeProvider>
            <AuthProvider>
              <MainStack />
            </AuthProvider>
          </ThemeProvider>
        </PaperProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
