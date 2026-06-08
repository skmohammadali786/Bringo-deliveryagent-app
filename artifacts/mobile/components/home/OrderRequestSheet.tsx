import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useColors } from "@/hooks/useColors";
import { Order } from "@/store/orderStore";

const COUNTDOWN = 30;
const RING_SIZE = 80;
const STROKE_WIDTH = 6;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DECLINE_REASONS = [
  "Too far away",
  "Order too large",
  "Shop closed",
  "Personal break",
  "Other",
];

interface Props {
  visible: boolean;
  order: Order | null;
  onAccept: () => void;
  onDecline: (reason?: string) => void;
}

export function OrderRequestSheet({ visible, order, onAccept, onDecline }: Props) {
  const colors = useColors();
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN);
  const [showReasons, setShowReasons] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Arrival haptic – fires when the sheet opens ── */
  useEffect(() => {
    if (visible && order && Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 120);
    }
  }, [visible, order?.id]);

  /* ── Countdown + urgency haptics ── */
  useEffect(() => {
    if (visible && order) {
      setTimeLeft(COUNTDOWN);
      setShowReasons(false);
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          const next = t - 1;
          if (next <= 0) {
            clearInterval(intervalRef.current!);
            onDecline("Timed out");
            return 0;
          }
          /* Haptic tick in last 10 s */
          if (next <= 10 && Platform.OS !== "web") {
            Haptics.impactAsync(
              next <= 5
                ? Haptics.ImpactFeedbackStyle.Medium
                : Haptics.ImpactFeedbackStyle.Light
            );
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, order?.id]);

  const handleAccept = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onAccept();
  }, [onAccept]);

  const handleDeclinePress = useCallback(async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowReasons(true);
  }, []);

  const handleDeclineReason = useCallback(async (reason: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    onDecline(reason);
  }, [onDecline]);

  if (!visible || !order) return null;

  const progress = timeLeft / COUNTDOWN;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const urgentColor = timeLeft <= 10 ? colors.destructive : colors.success;

  return (
    <Modal transparent animationType="none" visible={visible} statusBarTranslucent>
      <Animated.View
        entering={FadeIn.duration(220)}
        exiting={FadeOut.duration(220)}
        style={[styles.backdrop, { backgroundColor: colors.overlay }]}
      />

      {/* Sheet — snappy spring, minimal bounce */}
      <Animated.View
        entering={SlideInDown.springify().damping(30).stiffness(300).mass(0.85)}
        exiting={SlideOutDown.duration(240)}
        style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        {/* Header row: badge + countdown */}
        <View style={styles.sheetHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.pill, { backgroundColor: colors.primary }]}>
              <Feather name="bell" size={12} color="#FFF" />
              <Text style={styles.pillText}>New Order Request</Text>
            </View>
            <Text style={[styles.orderNum, { color: colors.mutedForeground }]}>
              {order.orderNumber}
            </Text>
          </View>

          <View style={styles.countdownWrap}>
            <Svg width={RING_SIZE} height={RING_SIZE}>
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke={colors.muted}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke={urgentColor}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${RING_SIZE / 2},${RING_SIZE / 2}`}
              />
            </Svg>
            <View style={styles.countdownCenter}>
              <Text style={[styles.countdownNum, { color: urgentColor }]}>{timeLeft}</Text>
              <Text style={[styles.countdownSec, { color: colors.mutedForeground }]}>sec</Text>
            </View>
          </View>
        </View>

        {/* Route card */}
        <Animated.View
          entering={FadeInDown.delay(60).duration(280)}
          style={[styles.routeCard, { backgroundColor: colors.background, borderColor: colors.border }]}
        >
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, { backgroundColor: colors.primary }]} />
            <View style={styles.routeInfo}>
              <Text style={[styles.routeLabel, { color: colors.mutedForeground }]}>PICKUP FROM</Text>
              <Text style={[styles.routeName, { color: colors.foreground }]} numberOfLines={1}>
                {order.shop.name}
              </Text>
              <Text style={[styles.routeSub, { color: colors.mutedForeground }]} numberOfLines={1}>
                {order.shop.address}
              </Text>
            </View>
          </View>

          <View style={[styles.routeConnector, { backgroundColor: colors.border }]} />

          <View style={styles.routeRow}>
            <View style={[styles.routeDot, { backgroundColor: colors.success }]} />
            <View style={styles.routeInfo}>
              <Text style={[styles.routeLabel, { color: colors.mutedForeground }]}>DELIVER TO</Text>
              <Text style={[styles.routeName, { color: colors.foreground }]} numberOfLines={1}>
                {order.customer.name}
              </Text>
              <Text style={[styles.routeSub, { color: colors.mutedForeground }]} numberOfLines={1}>
                {order.customer.address}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(120).duration(280)} style={styles.statsRow}>
          {[
            { icon: "navigation" as const, label: "Distance", value: order.distance },
            { icon: "clock" as const, label: "Est. Time", value: order.estimatedTime },
            { icon: "package" as const, label: "Items", value: `${order.items.length}` },
          ].map((s) => (
            <View key={s.label} style={[styles.statBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Feather name={s.icon} size={15} color={colors.primary} />
              <Text style={[styles.statVal, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Earnings */}
        <Animated.View
          entering={FadeInDown.delay(180).duration(280)}
          style={[styles.earningsRow, { backgroundColor: colors.successLight, borderRadius: colors.radiusSm }]}
        >
          <View style={styles.earningsLeft}>
            <Text style={[styles.earningsLabel, { color: colors.mutedForeground }]}>Your Earnings</Text>
            <Text style={[styles.earningsVal, { color: colors.success }]}>₹{order.deliveryFee}</Text>
          </View>
          <View style={styles.earningsBadges}>
            {order.paymentMode === "cod" && (
              <View style={[styles.badge, { backgroundColor: colors.warningLight }]}>
                <Text style={[styles.badgeText, { color: colors.warning }]}>
                  COD ₹{order.codAmount ?? order.totalAmount}
                </Text>
              </View>
            )}
            {order.priority === "express" && (
              <View style={[styles.badge, { backgroundColor: "#FF4D4F18" }]}>
                <Feather name="zap" size={11} color="#FF4D4F" />
                <Text style={[styles.badgeText, { color: "#FF4D4F" }]}>Express</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Decline reasons */}
        {showReasons && (
          <Animated.View
            entering={FadeIn.duration(150)}
            style={[styles.reasonsCard, { backgroundColor: colors.background, borderColor: colors.border }]}
          >
            <Text style={[styles.reasonsTitle, { color: colors.foreground }]}>
              Reason for declining?
            </Text>
            {DECLINE_REASONS.map((reason, i) => (
              <Pressable
                key={reason}
                onPress={() => handleDeclineReason(reason)}
                style={({ pressed }) => [
                  styles.reasonRow,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: i < DECLINE_REASONS.length - 1 ? 1 : 0,
                    backgroundColor: pressed ? colors.muted : "transparent",
                  },
                ]}
              >
                <Text style={[styles.reasonText, { color: colors.foreground }]}>{reason}</Text>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </Pressable>
            ))}
          </Animated.View>
        )}

        {/* Action buttons */}
        {!showReasons && (
          <Animated.View entering={FadeInDown.delay(240).duration(280)} style={styles.buttons}>
            <Pressable
              onPress={handleDeclinePress}
              style={({ pressed }) => [
                styles.declineBtn,
                { borderColor: colors.destructive, opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <Feather name="x" size={20} color={colors.destructive} />
              <Text style={[styles.declineBtnText, { color: colors.destructive }]}>Decline</Text>
            </Pressable>

            <Pressable
              onPress={handleAccept}
              style={({ pressed }) => [
                styles.acceptBtn,
                { backgroundColor: colors.success, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Feather name="check" size={20} color="#FFF" />
              <Text style={styles.acceptBtnText}>Accept Order</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Back option when showing reasons */}
        {showReasons && (
          <Pressable onPress={() => setShowReasons(false)} style={styles.backBtn}>
            <Feather name="arrow-left" size={14} color={colors.mutedForeground} />
            <Text style={[styles.backBtnText, { color: colors.mutedForeground }]}>Back</Text>
          </Pressable>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    padding: 20,
    paddingBottom: 40,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { gap: 6 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  pillText: { color: "#FFF", fontSize: 13, fontFamily: "Inter_700Bold" },
  orderNum: { fontSize: 12, fontFamily: "Inter_400Regular" },
  countdownWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  countdownCenter: {
    position: "absolute",
    alignItems: "center",
  },
  countdownNum: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  countdownSec: { fontSize: 9, fontFamily: "Inter_500Medium", marginTop: -2 },
  routeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 2,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 16,
    flexShrink: 0,
  },
  routeInfo: { flex: 1, gap: 2, paddingVertical: 4 },
  routeLabel: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 0.6 },
  routeName: { fontSize: 15, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  routeSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  routeConnector: { width: 1.5, height: 14, marginLeft: 5, marginVertical: 2 },
  statsRow: { flexDirection: "row", gap: 10 },
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: 5,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  statVal: { fontSize: 14, fontFamily: "Inter_700Bold", textAlign: "center" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  earningsRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 10,
  },
  earningsLeft: { flex: 1, gap: 2 },
  earningsLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  earningsVal: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  earningsBadges: { flexDirection: "row", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },
  badgeText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },
  declineBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  declineBtnText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  acceptBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  acceptBtnText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#FFF" },
  reasonsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  reasonsTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    padding: 14,
    paddingBottom: 10,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  reasonText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  backBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
});
