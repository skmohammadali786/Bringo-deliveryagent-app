import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDown, fadeInDownDelay } from "@/constants/animations";

export default function BankScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [accountNumber, setAccountNumber] = useState("••••••••1234");
  const [confirmAccount, setConfirmAccount] = useState("");
  const [ifsc, setIfsc] = useState("HDFC0001234");
  const [bankName, setBankName] = useState("HDFC Bank");
  const [accountHolder, setAccountHolder] = useState("Rahul Sharma");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(true);
  const [successModal, setSuccessModal] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccessModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ConfirmModal
        visible={successModal}
        onClose={() => setSuccessModal(false)}
        title="Bank Account Updated"
        body="Your bank details have been saved. Payouts will be processed within 2 business days."
        confirmText="OK"
        onConfirm={() => router.back()}
        variant="success"
        icon="check-circle"
      />
      <ScreenHeader title="Bank Account" showBack />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 16 : 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Account */}
        <Animated.View entering={fadeInDown(0)}>
          <Card style={[styles.currentCard, { backgroundColor: colors.successLight, borderColor: colors.success + "30" }]}>
            <View style={styles.currentLeft}>
              <View style={[styles.bankIcon, { backgroundColor: colors.success + "18" }]}>
                <Feather name="credit-card" size={22} color={colors.success} />
              </View>
              <View>
                <Text style={[styles.currentLabel, { color: colors.mutedForeground }]}>Current Payout Account</Text>
                <Text style={[styles.currentBank, { color: colors.foreground }]}>{bankName}</Text>
                <Text style={[styles.currentAc, { color: colors.mutedForeground }]}>••••••••1234</Text>
              </View>
            </View>
            {verified && (
              <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                <Feather name="check" size={12} color="#FFF" />
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Form */}
        <Animated.View entering={fadeInDownDelay(60)}>
          <Card style={styles.formCard}>
            <Text style={[styles.formTitle, { color: colors.foreground }]}>Update Bank Details</Text>
            <Input
              label="Account Holder Name"
              value={accountHolder}
              onChangeText={setAccountHolder}
              placeholder="As per bank records"
              icon={<Feather name="user" size={18} color={colors.mutedForeground} />}
            />
            <Input
              label="Bank Name"
              value={bankName}
              onChangeText={setBankName}
              placeholder="e.g. HDFC Bank"
              icon={<Feather name="home" size={18} color={colors.mutedForeground} />}
            />
            <Input
              label="Account Number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Enter account number"
              keyboardType="number-pad"
              secureTextEntry
              icon={<Feather name="credit-card" size={18} color={colors.mutedForeground} />}
            />
            <Input
              label="IFSC Code"
              value={ifsc}
              onChangeText={setIfsc}
              placeholder="e.g. HDFC0001234"
              autoCapitalize="characters"
              icon={<Feather name="hash" size={18} color={colors.mutedForeground} />}
            />
          </Card>
        </Animated.View>

        {/* Notice */}
        <Animated.View entering={fadeInDownDelay(120)}>
          <Card style={[styles.noticeCard, { backgroundColor: colors.warningLight, borderColor: colors.warning + "30" }]}>
            <Feather name="alert-triangle" size={18} color={colors.warning} />
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[styles.noticeTitle, { color: colors.foreground }]}>Important</Text>
              <Text style={[styles.noticeText, { color: colors.mutedForeground }]}>
                Ensure your bank account details are correct. Incorrect details may cause payout failures.
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Payout Info */}
        <Animated.View entering={fadeInDownDelay(160)}>
          <Card style={styles.payoutCard}>
            <Text style={[styles.payoutTitle, { color: colors.foreground }]}>Payout Schedule</Text>
            {[
              { icon: "clock", label: "Daily payouts", sub: "Available by 12 AM next day" },
              { icon: "trending-up", label: "Minimum payout", sub: "₹100 minimum balance required" },
              { icon: "shield", label: "Secure transfers", sub: "NEFT/IMPS bank transfer" },
            ].map((item) => (
              <View key={item.label} style={styles.payoutRow}>
                <View style={[styles.payoutIcon, { backgroundColor: colors.primaryLight }]}>
                  <Feather name={item.icon as any} size={14} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.payoutLabel, { color: colors.foreground }]}>{item.label}</Text>
                  <Text style={[styles.payoutSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
                </View>
              </View>
            ))}
          </Card>
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button title="Save Bank Details" onPress={handleSave} loading={loading} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  currentCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1 },
  currentLeft: { flexDirection: "row", gap: 14, alignItems: "center" },
  bankIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  currentLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  currentBank: { fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 2 },
  currentAc: { fontSize: 13, fontFamily: "Inter_400Regular" },
  verifiedBadge: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  formCard: { gap: 16 },
  formTitle: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  noticeCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderWidth: 1 },
  noticeTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  noticeText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  payoutCard: { gap: 14 },
  payoutTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  payoutRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  payoutIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  payoutLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  payoutSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});
