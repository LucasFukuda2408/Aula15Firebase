import { Stack } from "expo-router";
import { View } from "react-native";
import { I18nextProvider } from "react-i18next";
import i18n from "../services/i18n";

export default function Layout() {
  return (
    <I18nextProvider i18n={i18n}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </I18nextProvider>
  );
}
