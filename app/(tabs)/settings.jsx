import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

const SettingsTab = () => {
	return (
		<SafeAreaView className="flex-1 items-center justify-center p-4 bg-gray-900">
			<View className="bg-gray-800 p-6 rounded-xl w-full shadow-lg border border-gray-700">
				<Text className="text-white text-xl font-bold text-center mb-2">
					Coming Soon!
				</Text>
				<Text className="text-gray-400 text-sm text-center">
					Settings features are under development
				</Text>
			</View>
		</SafeAreaView>
	);
};

export default SettingsTab;
