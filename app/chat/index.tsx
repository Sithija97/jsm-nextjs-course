import { chatWithAiModel } from "@/services/ai-chat.service";
import { uploadToCloudinary } from "@/services/image.upload.service";
import { useClerk } from "@clerk/clerk-expo";
import Feather from "@expo/vector-icons/Feather";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

type IMessage = { role: string; content: string };

export default function Index() {
  const router = useRouter();
  const { signOut } = useClerk();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  const { agentName, initialText, agentPrompt, agentId } =
    useLocalSearchParams();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<string | null>(null);
  const isAndroid = Platform.OS === "android";
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: agentName,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            console.log("Plus icon pressed");
          }}
          style={{ marginRight: 15 }}
        >
          <Feather name="plus" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, agentName]);

  useEffect(() => {
    setInput(initialText.toString());
    if (agentPrompt) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: agentPrompt.toString() },
      ]);
    }
  }, [agentPrompt]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(public)");
  };

  const onSendMessage = async () => {
    if (!input?.trim()) return;
    let imageUrl = null;
    if (file) {
      try {
        // Show loading state (optional)
        setIsUploading(true);

        // Upload to Cloudinary
        imageUrl = await uploadToCloudinary(file, "image");
        console.log("Uploaded to Cloudinary:", imageUrl);
      } catch (error) {
        console.error("Failed to upload image:", error);
        // Show error to user
        Alert.alert(
          "Upload Failed",
          "Failed to upload image. Please try again."
        );
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const loadingMessage = { role: "assistant", content: "loading" };
    setMessages((prev) => [...prev, loadingMessage]);

    const result = await chatWithAiModel([...messages, newMessage]);
    // @ts-ignore
    const responseMessage = { role: "assistant", content: result.aiResponse };
    // setMessages((prev) => [...prev, responseMessage]);
    setMessages((prev) => {
      const updatedMessageList = [...prev];
      updatedMessageList[updatedMessageList.length - 1] = responseMessage;
      return updatedMessageList;
    });
  };

  const copyToClipboard = async (content: string) => {
    await Clipboard.setStringAsync(content);
    isAndroid
      ? ToastAndroid.show("Copied to clipboard", ToastAndroid.TOP)
      : Alert.alert("Copied to clipboard");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFile(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={headerHeight - 100}
      >
        <View style={styles.messagesContainer}>
          <FlatList
            data={messages}
            keyboardShouldPersistTaps="handled"
            // @ts-ignore
            renderItem={({ item, index }) =>
              item.role !== "system" && (
                <View
                  key={index}
                  style={[
                    styles.messageContainer,
                    item.role === "user"
                      ? styles.userMessage
                      : styles.assistantMessage,
                  ]}
                >
                  {item.content == "loading" ? (
                    <ActivityIndicator size={"small"} color={"black"} />
                  ) : (
                    <View style={styles.messageContent}>
                      <Text
                        style={[
                          styles.messageText,
                          item.role === "user"
                            ? styles.userMessageText
                            : styles.assistantMessageText,
                        ]}
                      >
                        {item.content}
                      </Text>
                      {item.role == "assistant" && (
                        <Pressable
                          style={styles.copyButton}
                          onPress={() => copyToClipboard(item.content)}
                        >
                          <Feather name="copy" size={20} color={"gray"} />
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              )
            }
            showsVerticalScrollIndicator={false}
          />
          <Button title="Sign out" onPress={handleSignOut} />
        </View>

        <View>
          {file && (
            <View
              style={{ marginBottom: 5, display: "flex", flexDirection: "row" }}
            >
              <Image
                source={{ uri: file }}
                style={{ width: 50, height: 50, borderRadius: 6 }}
              />
              <TouchableOpacity onPress={() => setFile(null)}>
                <Feather name="x" size={20} color={"black"} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Feather name="camera" size={26} color={"gray"} />
            </TouchableOpacity>
            <TextInput
              placeholder="Type a message..."
              style={styles.input}
              value={input}
              onChangeText={(value) => setInput(value)}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity style={styles.sendButton} onPress={onSendMessage}>
              <Feather name="send" size={20} color={"white"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: "75%",
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: "#4285F4",
    alignSelf: "flex-end",
    borderBottomRightRadius: 2,
  },
  assistantMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // elevation: 2,
  },
  messageContent: {
    position: "relative",
  },
  messageText: {
    fontSize: 16,
    paddingRight: 30, // Add padding to prevent text from overlapping with copy button
  },
  userMessageText: {
    color: "white",
  },
  assistantMessageText: {
    color: "black",
  },
  copyButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginBottom: 24,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    marginHorizontal: 8,
    paddingHorizontal: 16,
    textAlignVertical: "center",
  },
  sendButton: {
    backgroundColor: "#4285F4",
    padding: 8,
    borderRadius: 99,
    marginBottom: 2,
  },
});
