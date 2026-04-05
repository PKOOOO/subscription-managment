import { useClerk } from "@clerk/expo";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Settings() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (e) {
      console.error("[auth] Sign out error:", e);
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5 pb-30">
      <Text className="text-2xl font-sans-bold text-primary mb-6">Settings</Text>

      <View className="mt-auto mb-10">
        <Pressable
          className={`sub-cancel ${signingOut ? "sub-cancel-disabled" : ""}`}
          onPress={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <ActivityIndicator color="#fff9e3" />
          ) : (
            <Text className="sub-cancel-text">Sign Out</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}