import { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";

export const ANIM_DURATION = 350;
export const ANIM_STAGGER = 60;

export const fadeInDown = (index: number = 0) =>
  FadeInDown.delay(index * ANIM_STAGGER).duration(ANIM_DURATION);

export const fadeInDownDelay = (delayMs: number) =>
  FadeInDown.delay(delayMs).duration(ANIM_DURATION);

export const fadeInDownIndexed = (baseMs: number, index: number) =>
  FadeInDown.delay(baseMs + index * ANIM_STAGGER).duration(ANIM_DURATION);

export const fadeInUp = (index: number = 0) =>
  FadeInUp.delay(index * ANIM_STAGGER).duration(ANIM_DURATION);

export const fadeInUpDelay = (delayMs: number) =>
  FadeInUp.delay(delayMs).duration(ANIM_DURATION);

export const fadeInUpIndexed = (baseMs: number, index: number) =>
  FadeInUp.delay(baseMs + index * ANIM_STAGGER).duration(ANIM_DURATION);

export const zoomInDelay = (delayMs: number = 0) =>
  ZoomIn.delay(delayMs).duration(ANIM_DURATION);
