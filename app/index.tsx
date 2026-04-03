import { Redirect } from "expo-router";

export default function Index() {
    // TODO: check auth state here and redirect accordingly:
    // - if logged in → redirect to "(tabs)"
    // - if not logged in → redirect to "(auth)/sign-in"
    return <Redirect href="/(tabs)" />;
}
