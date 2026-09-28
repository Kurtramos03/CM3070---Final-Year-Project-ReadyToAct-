import React, { useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "./components/BottomNav";
import AlertDashboardScreen from "./screens/AlertDashboardScreen";
import AlertDetailScreen from "./screens/AlertDetailScreen";
import CommunityReportScreen from "./screens/CommunityReportScreen";
import MapOverviewScreen from "./screens/MapOverviewScreen";
import PreparednessScreen from "./screens/PreparednessScreen";
import ProfileScreen from "./screens/ProfileScreen";
import QuizResultScreen from "./screens/QuizResultScreen";
import QuizScreen from "./screens/QuizScreen";
import ResourceDetailScreen from "./screens/ResourceDetailScreen";
import ResourceHubScreen from "./screens/ResourceHubScreen";
import { colors } from "./styles/globalStyles";

const Stack = createNativeStackNavigator();

const MainTabs = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("alerts");
  const [refreshKey, setRefreshKey] = useState(0);

  const changeTab = (tabKey) => {
    setActiveTab(tabKey);
    setRefreshKey((value) => value + 1);
  };

  const screenProps = {
    navigation,
    goToTab: changeTab,
    refreshKey
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "reports":
        return <CommunityReportScreen {...screenProps} />;
      case "preparedness":
        return <PreparednessScreen {...screenProps} />;
      case "map":
        return <MapOverviewScreen {...screenProps} />;
      case "resources":
        return <ResourceHubScreen {...screenProps} />;
      case "profile":
        return <ProfileScreen {...screenProps} />;
      default:
        return <AlertDashboardScreen {...screenProps} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1 }}>
        {renderScreen()}
        <BottomNav activeTab={activeTab} onChangeTab={changeTab} />
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: "800" },
            contentStyle: { backgroundColor: colors.background }
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="AlertDetail" component={AlertDetailScreen} options={{ title: "Alert Detail" }} />
          <Stack.Screen name="ResourceDetail" component={ResourceDetailScreen} options={{ title: "Resource" }} />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: "Readiness Quiz" }} />
          <Stack.Screen name="QuizResult" component={QuizResultScreen} options={{ title: "Quiz Result", headerBackVisible: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
