import {
  Activity, AlertCircle, AlertTriangle, AppWindow, Archive, ArrowLeft, ArrowRight,
  ArrowUpDown, ArrowUpRight, Atom, BadgeCheck, BarChart3, Bell, BrainCircuit,
  Building, Building2, Calendar, CalendarCheck, CalendarRange, Camera, Check,
  CheckCircle2, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ClipboardCheck,
  Clock, Cloud, Code2, Compass, Download, ExternalLink, Eye, FileCode, FileSignature,
  FileText, Filter, Gauge, Globe, GraduationCap, HeartHandshake, HelpCircle, Inbox,
  Info, Instagram, Layers, LayoutDashboard, LayoutTemplate, Lightbulb, LifeBuoy,
  Linkedin, LineChart, ListChecks, Loader2, Lock, LogOut, Mail, MapPin, Megaphone,
  Menu, MessageSquare, Minus, Monitor, MoreHorizontal, Paperclip, PenSquare, Phone,
  PieChart, Play, Plus, Puzzle, Receipt, RefreshCw, Rocket, ScanEye, Scale, Search,
  SearchCheck, Send, Settings, Share2, ShieldCheck, ShoppingCart, Smartphone,
  Sparkles, Star, Store, Tag, Target, TrendingDown, TrendingUp, Triangle, Trash2,
  Twitter, Upload, UserPlus, UserRound, UserSquare, Users, Video,
  Wallet, Workflow, X, Youtube, Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Data files reference icons by name. Keeping an explicit map (rather than a
 * dynamic `lucide-react/*` import) means the bundler can still tree-shake, and
 * a typo surfaces as a visible fallback rather than a crash.
 */
const iconMap = {
  Activity, AlertCircle, AlertTriangle, AppWindow, Archive, ArrowLeft, ArrowRight,
  ArrowUpDown, ArrowUpRight, Atom, BadgeCheck, BarChart3, Bell, BrainCircuit,
  Building, Building2, Calendar, CalendarCheck, CalendarRange, Camera, Check,
  CheckCircle2, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ClipboardCheck,
  Clock, Cloud, Code2, Compass, Download, ExternalLink, Eye, FileCode, FileSignature,
  FileText, Filter, Gauge, Globe, GraduationCap, HeartHandshake, HelpCircle, Inbox,
  Info, Instagram, Layers, LayoutDashboard, LayoutTemplate, Lightbulb, LifeBuoy,
  Linkedin, LineChart, ListChecks, Loader2, Lock, LogOut, Mail, MapPin, Megaphone,
  Menu, MessageSquare, Minus, Monitor, MoreHorizontal, Paperclip, PenSquare, Phone,
  PieChart, Play, Plus, Puzzle, Receipt, RefreshCw, Rocket, ScanEye, Scale, Search,
  SearchCheck, Send, Settings, Share2, ShieldCheck, ShoppingCart, Smartphone,
  Sparkles, Star, Store, Tag, Target, TrendingDown, TrendingUp, Triangle, Trash2,
  Twitter, Upload, UserPlus, UserRound, UserSquare, Users, Video,
  Wallet, Workflow, X, Youtube, Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
  /**
   * Icons are decorative by default (the adjacent text carries the meaning).
   * Pass a label when an icon is the only content of a control.
   */
  label?: string;
}

export function Icon({ name, className = "h-5 w-5", strokeWidth = 1.75, label }: IconProps) {
  const Component = iconMap[name as IconName] ?? HelpCircle;
  return (
    <Component
      className={className}
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
