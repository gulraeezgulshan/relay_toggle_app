import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";

export default function App() {
	return (
		<View className="flex-1 items-center justify-center bg-gray-900 p-6">
			<Image
				source={require("../assets/images/background_1.png")}
				className="w-72 h-72 mb-4"
			/>
			<Text className="text-3xl font-bold mb-4 text-kingfisher-100">
				Welcome to the IoT App
			</Text>

			<Pressable
				className="bg-kingfisher-600 px-6 py-3 rounded-lg active:bg-kingfisher-700"
				onPress={() => router.push("/(tabs)/home")}
			>
				<Text className="text-white font-semibold text-lg">
					Get Started
				</Text>
			</Pressable>
		</View>
	);
}
