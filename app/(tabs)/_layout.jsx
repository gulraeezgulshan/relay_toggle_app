import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const TabsLayout = () => {
	return (
		<Tabs
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarStyle: {
					backgroundColor: "#1A1A1A",
					borderTopColor: "#2A2A2A",
					paddingBottom: 5,
					paddingTop: 5,
					height: 60,
				},
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "home") {
						iconName = focused ? "home" : "home-outline";
					} else if (route.name === "settings") {
						iconName = focused ? "settings" : "settings-outline";
					}

					return (
						<Ionicons name={iconName} size={size} color={color} />
					);
				},
				tabBarActiveTintColor: "#832afd",
				tabBarInactiveTintColor: "#9ca3af",
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "500",
				},
			})}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
				}}
			/>
		</Tabs>
	);
};

export default TabsLayout;
