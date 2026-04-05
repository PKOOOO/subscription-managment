import { icons } from "@/constants/icons";
import "@/global.css";
import { useOAuth } from "@clerk/expo";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { styled } from "nativewind";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const [loading, setLoading] = useState<"google" | "apple" | null>(null);

  const googleOAuth = useOAuth({ strategy: "oauth_google" });
  const appleOAuth = useOAuth({ strategy: "oauth_apple" });

  const handleOAuth = useCallback(
    async (provider: "google" | "apple") => {
      try {
        setLoading(provider);

        const oAuth = provider === "google" ? googleOAuth : appleOAuth;
        const { createdSessionId, setActive } = await oAuth.startOAuthFlow({
          redirectUrl: Linking.createURL("/"),
        });

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
        }
      } catch (error: any) {
        if (error?.errors?.[0]?.code === "session_exists") return;

        console.error(`[auth] ${provider} OAuth error:`, error);
        Alert.alert(
          "Sign-in failed",
          "Something went wrong. Please try again.",
          [{ text: "OK" }]
        );
      } finally {
        setLoading(null);
      }
    },
    [googleOAuth, appleOAuth]
  );

  const isDisabled = loading !== null;

  return (
    <SafeAreaView className="auth-safe-area">
      <ScrollView
        className="auth-scroll"
        contentContainerClassName="grow"
        keyboardShouldPersistTaps="handled"
      >
        <View className="auth-content items-center justify-center">
          {/* ── Heading ── */}
          <View className="auth-brand-block">
            <Text className="auth-title">Welcome back</Text>
            <Text className="auth-subtitle">
              Sign in to manage your subscriptions and stay on top of your
              spending.
            </Text>
          </View>

          {/* ── OAuth Buttons ── */}
          <View className="auth-card w-full">
            <View className="auth-form">
              {/* Google */}
              <Pressable
                className={`auth-button flex-row items-center justify-center gap-3 ${isDisabled ? "auth-button-disabled" : ""
                  }`}
                onPress={() => handleOAuth("google")}
                disabled={isDisabled}
              >
                {loading === "google" ? (
                  <ActivityIndicator color="#081126" />
                ) : (
                  <>
                    <Image
                      source={icons.google}
                      className="size-7"
                      resizeMode="contain"
                    />
                    <Text className="auth-button-text">
                      Continue with Google
                    </Text>
                  </>
                )}
              </Pressable>

              {/* Divider */}
              <View className="auth-divider-row">
                <View className="auth-divider-line" />
                <Text className="auth-divider-text">or</Text>
                <View className="auth-divider-line" />
              </View>

              {/* Apple */}
              <Pressable
                className={`auth-button flex-row items-center justify-center gap-3 bg-primary ${isDisabled ? "auth-button-disabled bg-primary/45" : ""
                  }`}
                onPress={() => handleOAuth("apple")}
                disabled={isDisabled}
              >
                {loading === "apple" ? (
                  <ActivityIndicator color="#fff9e3" />
                ) : (
                  <>
                    <Image
                      source={icons.apple}
                      className="size-7"
                      resizeMode="contain"
                      tintColor="#fff9e3"
                    />
                    <Text className="auth-button-text text-background">
                      Continue with Apple
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>

          {/* ── Footer ── */}
          <View className="mt-8 px-4">
            <Text className="text-center text-xs font-sans-medium text-muted-foreground leading-5">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}