import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

interface Message { id: string; text: string; from: "agent" | "support"; time: string; }

const INITIAL: Message[] = [
  { id: "1", text: "Hi! Welcome to Bringo support. How can I help you today?", from: "support", time: "Now" },
];

export default function SupportChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const send = () => {
    if (!text.trim()) return;
    const msg: Message = { id: Date.now().toString(), text: text.trim(), from: "agent", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, msg]);
    setText("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: "Thank you for reaching out. Our agent will review your issue and respond shortly.", from: "support", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenHeader title="Support Chat" showBack subtitle="Typically replies in 2 minutes" />
      <ScrollView contentContainerStyle={[styles.messages, { paddingBottom: 20 }]} showsVerticalScrollIndicator={false}>
        {messages.map((m) => (
          <View key={m.id} style={[styles.bubble, m.from === "agent" ? styles.agentBubble : styles.supportBubble]}>
            <View style={[styles.bubbleContent, { backgroundColor: m.from === "agent" ? colors.primary : colors.card, borderColor: colors.border }]}>
              <Text style={[styles.bubbleText, { color: m.from === "agent" ? "#FFF" : colors.foreground }]}>{m.text}</Text>
            </View>
            <Text style={[styles.bubbleTime, { color: colors.mutedForeground }]}>{m.time}</Text>
          </View>
        ))}
        {isTyping && (
          <View style={styles.supportBubble}>
            <View style={[styles.typingBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.typingText, { color: colors.mutedForeground }]}>Support is typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>
      <View style={[styles.inputRow, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 8 }]}>
        <TextInput value={text} onChangeText={setText} placeholder="Type your message..." placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, backgroundColor: colors.background, borderColor: colors.border }]} multiline returnKeyType="send" />
        <Pressable onPress={send} style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.primary : colors.muted }]}>
          <Feather name="send" size={18} color={text.trim() ? "#FFF" : colors.mutedForeground} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  messages: { paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  bubble: { maxWidth: "80%" },
  agentBubble: { alignSelf: "flex-end", alignItems: "flex-end" },
  supportBubble: { alignSelf: "flex-start", alignItems: "flex-start" },
  bubbleContent: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1 },
  bubbleText: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 22 },
  bubbleTime: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 4, marginHorizontal: 4 },
  typingBubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1 },
  typingText: { fontSize: 13, fontFamily: "Inter_400Regular", fontStyle: "italic" },
  inputRow: { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 16, paddingTop: 10, gap: 10, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, fontFamily: "Inter_400Regular", borderWidth: 1, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
