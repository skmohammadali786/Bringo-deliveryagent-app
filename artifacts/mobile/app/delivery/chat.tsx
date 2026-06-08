import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

const QUICK_MSGS = ["I'm on my way", "Almost there", "Can't find your location", "Please come to the gate"];

interface Message { id: string; text: string; from: "agent" | "customer"; time: string; }

const INITIAL: Message[] = [
  { id: "1", text: "Hi, I'm picking up your order from Green Mart", from: "agent", time: "2:15 PM" },
  { id: "2", text: "Great! I'll be home. Please ring the bell.", from: "customer", time: "2:16 PM" },
];

export default function DeliveryChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { orders, activeOrderId } = useOrderStore();
  const order = orders.find((o) => o.id === activeOrderId) ?? orders[1];
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [text, setText] = useState("");

  const send = (msg?: string) => {
    const content = msg ?? text.trim();
    if (!content) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: content, from: "agent", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setText("");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={90}>
      <ScreenHeader title={order?.customer.name ?? "Customer"} showBack subtitle="Delivery Chat" />
      <ScrollView contentContainerStyle={[styles.messages, { paddingBottom: 20 }]} showsVerticalScrollIndicator={false}>
        {messages.map((m) => (
          <View key={m.id} style={[styles.bubble, m.from === "agent" ? styles.agentBubble : styles.customerBubble]}>
            <View style={[styles.bubbleContent, { backgroundColor: m.from === "agent" ? colors.primary : colors.card, borderColor: colors.border }]}>
              <Text style={[styles.bubbleText, { color: m.from === "agent" ? "#FFF" : colors.foreground }]}>{m.text}</Text>
            </View>
            <Text style={[styles.bubbleTime, { color: colors.mutedForeground }]}>{m.time}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.quickMsgs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickMsgsRow}>
          {QUICK_MSGS.map((q) => (
            <Pressable key={q} onPress={() => send(q)} style={[styles.quickMsg, { backgroundColor: colors.muted, borderRadius: 16 }]}>
              <Text style={[styles.quickMsgText, { color: colors.foreground }]}>{q}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View style={[styles.inputRow, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 8 }]}>
        <TextInput value={text} onChangeText={setText} placeholder="Type a message..." placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, backgroundColor: colors.background, borderColor: colors.border }]} returnKeyType="send" onSubmitEditing={() => send()} />
        <Pressable onPress={() => send()} style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.primary : colors.muted }]}>
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
  customerBubble: { alignSelf: "flex-start", alignItems: "flex-start" },
  bubbleContent: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1 },
  bubbleText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  bubbleTime: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 4, marginHorizontal: 4 },
  quickMsgs: { paddingVertical: 10 },
  quickMsgsRow: { paddingHorizontal: 16, gap: 8 },
  quickMsg: { paddingHorizontal: 14, paddingVertical: 8 },
  quickMsgText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  inputRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 10, gap: 10, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, fontFamily: "Inter_400Regular", borderWidth: 1 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
