import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { fadeInDown } from "@/constants/animations";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const INITIAL_MSGS = [
  { id: "1", role: "agent" as const, text: "Hi! I'm your Bringo Support Agent. How can I help you today?", time: "10:00 AM" },
  { id: "2", role: "agent" as const, text: "I can help with orders, payments, account issues, and more.", time: "10:00 AM" },
];

const QUICK_REPLIES = [
  "My order is delayed",
  "Payment issue",
  "App not working",
  "Report an incident",
];

const CANNED_RESPONSES: { keywords: string[]; text: string }[] = [
  {
    keywords: ["delay", "late", "slow", "waiting", "not arrived"],
    text: "I understand your concern about the delay. I've checked the current traffic and order status. Your delivery agent is on the way — estimated arrival is within 10 minutes. Can you share your order number for a more precise update?",
  },
  {
    keywords: ["payment", "money", "upi", "paid", "charge", "refund", "wallet"],
    text: "I'll help resolve this payment issue right away. Please share your UPI transaction ID and the order number so I can initiate an investigation. Refunds are processed within 3–5 business days.",
  },
  {
    keywords: ["app", "working", "crash", "bug", "error", "freeze", "slow"],
    text: "Sorry to hear the app is acting up! Please try: (1) Force-close and reopen the app, (2) Check your internet connection, (3) Update to the latest version. If it persists, share your device model and app version and I'll escalate this.",
  },
  {
    keywords: ["incident", "accident", "unsafe", "threat", "emergency", "sos"],
    text: "🚨 Your safety is our top priority! I'm flagging this as URGENT and connecting you to our safety team right now. Please stay in a safe location. Share your current location and what happened — our team will respond within 2 minutes.",
  },
  {
    keywords: ["wrong", "missing", "item", "order", "dispute"],
    text: "I'm sorry about the order issue. I've raised a dispute ticket on your behalf. Please provide the order ID and describe the issue (wrong item / missing item / damaged). We'll review and resolve within 24 hours.",
  },
  {
    keywords: ["kyc", "document", "verify", "aadhar", "license", "id"],
    text: "For KYC verification, you'll need: Aadhaar card, driving licence, and a clear profile photo. Go to Profile → Documents to upload them. Verification usually completes within 2 working days.",
  },
  {
    keywords: ["earn", "income", "bonus", "incentive", "salary", "money"],
    text: "To maximise your earnings: (1) Work during peak hours (7–9 AM, 12–2 PM, 6–9 PM), (2) Accept surge-zone orders, (3) Maintain a 4.8+ rating for priority assignments, (4) Complete daily incentive milestones shown in your Earnings tab.",
  },
  {
    keywords: ["payout", "withdraw", "bank", "transfer"],
    text: "Payouts are processed every Monday. For early withdrawal, go to Earnings → Withdraw — instant transfers are available with a small convenience fee. Make sure your bank account/UPI is verified in your profile.",
  },
];

function getCannedResponse(text: string): string {
  const lower = text.toLowerCase();
  for (const entry of CANNED_RESPONSES) {
    if (entry.keywords.some((k) => lower.includes(k))) return entry.text;
  }
  return "Thank you for reaching out! I'm looking into this for you. Could you share your order number so I can assist you better? I'm here to help and will respond shortly.";
}

export default function SupportChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(INITIAL_MSGS);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    setInput("");
    const userMsg = { id: Date.now().toString(), role: "user" as const, text: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 1400 + Math.random() * 600));
    setTyping(false);
    const agentMsg = {
      id: (Date.now() + 1).toString(),
      role: "agent" as const,
      text: getCannedResponse(msg),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, agentMsg]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScreenHeader
        title="Support Chat"
        showBack
        right={
          <View style={[styles.agentStatus, { backgroundColor: colors.successLight }]}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.statusText, { color: colors.success }]}>Online</Text>
          </View>
        }
      />

      {/* Messages */}
      <ScrollView
        contentContainerStyle={[styles.messages, { paddingBottom: 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Replies */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRow} contentContainerStyle={styles.quickContent}>
          {QUICK_REPLIES.map((r) => (
            <Pressable
              key={r}
              onPress={() => sendMessage(r)}
              style={[styles.quickChip, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.quickText, { color: colors.foreground }]}>{r}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {messages.map((msg, i) => (
          <Animated.View
            key={msg.id}
            entering={fadeInDown(i < 2 ? i : 0)}
            style={[styles.msgRow, msg.role === "user" && styles.msgRowUser]}
          >
            {msg.role === "agent" && (
              <View style={[styles.agentAvatar, { backgroundColor: colors.primary }]}>
                <Feather name="headphones" size={14} color="#FFF" />
              </View>
            )}
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: msg.role === "user" ? colors.primary : colors.card,
                  borderRadius: msg.role === "user" ? 20 : 20,
                },
              ]}
            >
              <Text style={[styles.bubbleText, { color: msg.role === "user" ? "#FFF" : colors.foreground }]}>
                {msg.text}
              </Text>
              <Text style={[styles.bubbleTime, { color: msg.role === "user" ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                {msg.time}
              </Text>
            </View>
          </Animated.View>
        ))}

        {typing && (
          <View style={styles.msgRow}>
            <View style={[styles.agentAvatar, { backgroundColor: colors.primary }]}>
              <Feather name="headphones" size={14} color="#FFF" />
            </View>
            <View style={[styles.bubble, { backgroundColor: colors.card }]}>
              <Text style={[styles.typingText, { color: colors.mutedForeground }]}>typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground }]}
            multiline
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
          />
          <Pressable
            onPress={() => sendMessage()}
            disabled={!input.trim()}
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
  messages: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  quickRow: { marginBottom: 8 },
  quickContent: { gap: 8, paddingHorizontal: 4 },
  quickChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  msgRow: { flexDirection: "row", gap: 10, maxWidth: "85%" },
  msgRowUser: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  agentAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", marginTop: 4 },
  bubble: { padding: 12, maxWidth: "100%", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  bubbleText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  bubbleTime: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 4, textAlign: "right" },
  typingText: { fontSize: 13, fontFamily: "Inter_400Regular", fontStyle: "italic" },
  agentStatus: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5 },
  statusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  inputBar: { paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1 },
  inputWrap: { flexDirection: "row", alignItems: "flex-end", gap: 10, borderWidth: 1, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 8 },
  input: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", maxHeight: 100 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
});
