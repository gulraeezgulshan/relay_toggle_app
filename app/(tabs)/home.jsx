import {
	View,
	Text,
	FlatList,
	Pressable,
	Modal,
	TextInput,
	Alert,
	ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axiosClient from "../../lib/axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import { debounce } from "lodash";
import { AntDesign } from "@expo/vector-icons";

const HomeTab = () => {
	const [devices, setDevices] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [newDevice, setNewDevice] = useState({
		name: "",
		type: "",
		relay_port: "",
	});
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState(null);
	const [loadingDevices, setLoadingDevices] = useState({});

	const availablePorts = [1, 2, 3, 4, 5, 6];
	const deviceTypes = ["Light", "Fan", "AC", "Door Lock", "TV", "Speaker"];

	const getAllDevices = async () => {
		try {
			const response = await axiosClient.get("devices");
			console.log("Device data:", JSON.stringify(response.data, null, 2));
			setDevices(response.data);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	const handleDevicePress = (device) => {
		setLoadingDevices((prev) => ({ ...prev, [device.id]: true }));
		debouncedToggle(device);
	};

	const debouncedToggle = debounce(async (device) => {
		try {
			const response = await axiosClient.post(
				`devices/${device.id}/toggle`
			);
			await getAllDevices();
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingDevices((prev) => ({ ...prev, [device.id]: false }));
		}
	}, 1000);

	const handleCreateDevice = async () => {
		try {
			if (!newDevice.name || !newDevice.type || !newDevice.relay_port) {
				console.log("All fields are required");
				return;
			}

			const portNum = parseInt(newDevice.relay_port);
			if (isNaN(portNum) || portNum < 1 || portNum > 6) {
				console.log("Relay port must be a number between 1 and 6");
				return;
			}

			const deviceData = {
				name: newDevice.name,
				type: newDevice.type,
				relay_port: portNum,
			};

			const response = await axiosClient.post("devices", deviceData);
			setModalVisible(false);
			setNewDevice({ name: "", type: "", relay_port: "" });
			getAllDevices();
		} catch (error) {
			console.log(
				"Error creating device:",
				error.response?.data || error.message
			);
		}
	};

	const handleDeleteDevice = async () => {
		try {
			await axiosClient.delete(`devices/${selectedDevice.id.toString()}`);
			setDeleteModalVisible(false);
			setSelectedDevice(null);
			getAllDevices();
		} catch (error) {
			console.log(error);
		}
	};

	const getUsedPorts = () => {
		return devices.map((device) => device.relay_port);
	};

	const areAllPortsUsed = () => {
		const usedPorts = getUsedPorts();
		return usedPorts.length >= availablePorts.length;
	};

	useEffect(() => {
		getAllDevices();
	}, []);

	return (
		<SafeAreaView className="flex-1 items-center justify-center p-4 bg-gray-900">
			<FlatList
				data={devices}
				ListEmptyComponent={() => (
					<View className="bg-gray-800 p-6 rounded-xl w-full shadow-lg border border-gray-700">
						<Text className="text-white text-lg font-semibold text-center mb-2">
							No Devices Found
						</Text>
						<Text className="text-gray-400 text-sm text-center">
							Tap the + button below to add your first device
						</Text>
					</View>
				)}
				ItemSeparatorComponent={() => <View className="h-3" />}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => handleDevicePress(item)}
						onLongPress={() => {
							setSelectedDevice(item);
							setDeleteModalVisible(true);
						}}
						className="bg-gray-800 p-5 w-full rounded-xl flex-row justify-between items-center shadow-lg border border-gray-700"
					>
						<View>
							<Text className="text-white text-lg font-semibold">
								{item.name}
							</Text>
							<Text className="text-gray-400 text-sm">
								{item.type} • Port {item.relay_port}
							</Text>
						</View>
						<View className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-700">
							{loadingDevices[item.id] ? (
								<ActivityIndicator color="#832afd" />
							) : (
								<Entypo
									name={
										item.status === "on" ||
										item.status === "open"
											? "light-up"
											: "light-down"
									}
									size={24}
									color={
										item.status === "on" ||
										item.status === "open"
											? "#832afd"
											: "#ef4444"
									}
								/>
							)}
						</View>
					</Pressable>
				)}
			/>

			<Pressable
				onPress={() => {
					if (areAllPortsUsed()) {
						Alert.alert(
							"No Ports Available",
							"All relay ports are currently in use. Please delete an existing device to add a new one.",
							[{ text: "OK", onPress: () => {} }]
						);
					} else {
						setModalVisible(true);
					}
				}}
				className="absolute bottom-6 right-6 w-14 h-14 bg-kingfisher-600 rounded-full items-center justify-center shadow-lg"
			>
				<AntDesign name="plus" size={24} color="white" />
			</Pressable>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View className="flex-1 justify-center items-center bg-black/70">
					<View className="bg-gray-800 p-6 rounded-xl w-[90%] shadow-xl border border-gray-700">
						{areAllPortsUsed() ? (
							<>
								<Text className="text-xl font-bold mb-4 text-white">
									No Available Ports
								</Text>
								<Text className="text-gray-300 mb-4">
									All relay ports are currently in use. Please
									delete an existing device to add a new one.
								</Text>
								<Pressable
									onPress={() => setModalVisible(false)}
									className="px-5 py-3 rounded-lg bg-gray-700 items-center"
								>
									<Text className="text-gray-300">Close</Text>
								</Pressable>
							</>
						) : (
							<>
								<Text className="text-xl font-bold mb-4 text-white">
									Add New Device
								</Text>

								<TextInput
									className="border border-gray-600 p-3 rounded-lg mb-4 min-h-12 bg-gray-700 text-white"
									placeholder="Device Name"
									placeholderTextColor="#9ca3af"
									value={newDevice.name}
									onChangeText={(text) =>
										setNewDevice((prev) => ({
											...prev,
											name: text,
										}))
									}
								/>

								<Text className="mb-2 text-gray-300">
									Select Device Type:
								</Text>
								<View className="flex-row flex-wrap gap-2 mb-4">
									{deviceTypes.map((type) => (
										<Pressable
											key={type}
											onPress={() =>
												setNewDevice((prev) => ({
													...prev,
													type: type,
												}))
											}
											className={`px-4 py-2 min-h-12 items-center justify-center rounded-lg ${
												newDevice.type === type
													? "bg-kingfisher-600"
													: "bg-gray-700"
											}`}
										>
											<Text
												className={
													newDevice.type === type
														? "text-white"
														: "text-gray-300"
												}
											>
												{type}
											</Text>
										</Pressable>
									))}
								</View>

								<Text className="mb-2 text-gray-300">
									Select Relay Port:
								</Text>
								<View className="flex-row flex-wrap gap-2 mb-4">
									{availablePorts.map((port) => {
										const isUsed =
											getUsedPorts().includes(port);
										return (
											<Pressable
												key={port}
												onPress={() => {
													if (!isUsed) {
														setNewDevice(
															(prev) => ({
																...prev,
																relay_port:
																	port.toString(),
															})
														);
													}
												}}
												className={`w-12 rounded-lg items-center min-h-12 justify-center ${
													newDevice.relay_port ===
													port.toString()
														? "bg-kingfisher-600"
														: isUsed
														? "bg-gray-600"
														: "bg-gray-700"
												}`}
											>
												<Text
													className={
														newDevice.relay_port ===
														port.toString()
															? "text-white"
															: isUsed
															? "text-gray-400"
															: "text-gray-300"
													}
												>
													{port}
												</Text>
											</Pressable>
										);
									})}
								</View>

								<View className="flex-row justify-end gap-3">
									<Pressable
										onPress={() => setModalVisible(false)}
										className="px-5 py-3 rounded-lg bg-gray-700 min-h-12 items-center justify-center"
									>
										<Text className="text-gray-300">
											Cancel
										</Text>
									</Pressable>

									<Pressable
										onPress={handleCreateDevice}
										className="px-5 py-3 min-h-12 items-center justify-center rounded-lg bg-kingfisher-600"
									>
										<Text className="text-white font-medium">
											Create
										</Text>
									</Pressable>
								</View>
							</>
						)}
					</View>
				</View>
			</Modal>

			<Modal
				animationType="fade"
				transparent={true}
				visible={deleteModalVisible}
				onRequestClose={() => {
					setDeleteModalVisible(false);
					setSelectedDevice(null);
				}}
			>
				<View className="flex-1 justify-center items-center bg-black/70">
					<View className="bg-gray-800 p-6 rounded-xl w-[90%] shadow-xl border border-gray-700">
						<Text className="text-xl font-bold mb-4 text-white">
							Delete Device
						</Text>
						<Text className="mb-4 text-gray-300">
							Are you sure you want to delete "
							{selectedDevice?.name}"?
						</Text>

						<View className="flex-row justify-end gap-3">
							<Pressable
								onPress={() => {
									setDeleteModalVisible(false);
									setSelectedDevice(null);
								}}
								className="px-5 py-3 rounded-lg bg-gray-700"
							>
								<Text className="text-gray-300">Cancel</Text>
							</Pressable>

							<Pressable
								onPress={handleDeleteDevice}
								className="px-5 py-3 rounded-lg bg-red-600"
							>
								<Text className="text-white font-medium">
									Delete
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

export default HomeTab;
