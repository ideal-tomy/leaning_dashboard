"use client";

import type { LucideIcon } from "lucide-react";
import {
  Building2,
  ClipboardList,
  Clock,
  FileText,
  GitBranch,
  Home,
  LayoutDashboard,
  MessageSquare,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import type { TemplateNavIconName } from "@/lib/app-template-config";

/** app-template-config の icon 名 → コンポーネント */
export const templateNavIcons: Record<TemplateNavIconName, LucideIcon> = {
  LayoutDashboard,
  Users,
  Building2,
  TrendingUp,
  Sparkles,
  Home,
  MoreHorizontal,
  ClipboardList,
  FileText,
  GitBranch,
  Clock,
  MessageSquare,
};
