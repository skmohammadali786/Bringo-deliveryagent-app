import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

const QUICK_MSGS = [
  "I'm on my way",
  "Please come to the gate",
  "I've arrived at your location",
  "OTP please?",
];

export default function DeliveryChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { orders } = useOrderStore();
  const [messages, setMessages] = useState([
    { id: "1", role: "agent" as const, text: "Hello! I'm on my way with your order.", time: "Now" },
  ]);
  const [input, setInput] = useState("");

  const order = orders.find((o) => ["delivering", "picked_up"].includes(o.status));

  const sendMsg = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    setInput("");
    setMessages((p) => [...p, { id: Date.now().toString(), role: "agent", text: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenHeader
        title={order?.customer.name ?? "Customer"}
        showBack
        right={
          order ? (
            <Pressable
              onPress={() => Linking.openURL(`tel:${order.customer.phone}`)}
              style={[styles.callBtn, { backgroundColor: colors.successLight }]}
            >
              <Feather name="phone" size={16} color={colors.success} />
            </Pressable>
          ) : undefined
        }
      />

      <ScrollView
        contentContainerStyle={[styles.messages, { paddingBottom: 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer header */}
        {order && (
          <View style={[styles.customerBanner, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.avatarInitial, { color: colors.primary }]}>{order.customer.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.customerName, { color: colors.foreground }]}>{order.customer.name}</Text>
              <Text style={[styles.customerAddr, { color: colors.mutedForeground }]} numberOfLines={1}>
                {order.customer.address}
              </Text>
            </View>
          </View>
        )}

        {/* Quick replies */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRow} contentContainerStyle={styles.quickContent}>
          {QUICK_MSGS.map((m) => (
            <Pressable
              key={m}
              onPress={() => sendMsg(m)}
              style={[styles.quickChip, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.quickText, { color: colors.foreground }]}>{m}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {messages.map((msg) => (
          <View key={msg.id} style={[styles.msgRow, msg.role === "agent" && styles.msgRowRight]}>
            <View style={[styles.bubble, { backgroundColor: msg.role === "agent" ? colors.primary : colors.card }]}>
              <Text style={[styles.bubbleText, { color: msg.role === "agent" ? "#FFF" : colors.foreground }]}>
                {msg.text}
              </Text>
              <Text style={[styles.time, { color: msg.role === "agent" ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                {msg.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Message customer..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground }]}
          />
          <Pressable
            onPress={() => sendMsg()}
            style={[styles.sendBtn, { backgroundColor: input.trim() ? colors.primary : colors.muted }]}
          >
            <Feather name="send" size={16} color={input.trim() ? "#FFF" : colors.mutedForeground} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  messages: { paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  customerBanner: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 6 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  avatarInitial: { fontSize: 20, fontFamily: "Inter_700Bold" },
  customerName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  customerAddr: { fontSize: 12, fontFamily: "Inter_400Regular" },
  quickRow: { marginBottom: 4 },
  quickContent: { gap: 8 },
  quickChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  quickText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  msgRow: { maxWidth: "80%" },
  msgRowRight: { alignSelf: "flex-end" },
  bubble: { padding: 12, borderRadius: 18 },
  bubbleText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  time: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 4, textAlign: "right" },
  callBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  inputBar: { paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1 },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 8 },
  input: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
});
