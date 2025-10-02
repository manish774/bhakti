import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Image, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import BookPuja from "./Description/BookPuja";
import { Description } from "./Description/Description";
import ForgotPasswordScreen from "./ForgotPassword";
import Home from "./Home/Home";
import SelectCorePujaType from "./Home/SelectCorePujaType";
import AuthScreen from "./auth/login";
import SettingsScreen from "./settings/settings";
import { RootStackParamList } from "./utils/utils";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Create a separate component for the Navigator to access auth state
function AppNavigator() {
  const { theme } = useTheme();
  const { isSignedIn } = useAuth();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerRight: () => (
            <Pressable
              onPress={() => {
                if (isSignedIn) {
                  navigation.navigate("Settings");
                } else {
                  navigation.navigate("login");
                }
              }}
            >
              <Image
                source={require("@/assets/images/settings.png")}
                style={{ width: 30, height: 30, marginLeft: 8 }}
              />
            </Pressable>
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => {
                if (isSignedIn) {
                  navigation.navigate("PujaType");
                } else {
                  navigation.navigate("login");
                }
              }}
            >
              <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
            </Pressable>
          ),
        })}
      />

      <Stack.Screen name="Settings" component={SettingsScreen} options={{}} />

      <Stack.Screen name="Description" component={Description} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="login" component={AuthScreen} />
      <Stack.Screen name="PujaType" component={SelectCorePujaType} />
      <Stack.Screen name="bookingPage" component={BookPuja} />
    </Stack.Navigator>
  );
}

export default function Index() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <PaperProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </PaperProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
