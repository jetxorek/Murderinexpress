import {
  BookOpen,
  Search,
  Menu,
  X,
  Gavel,
  Snowflake,
  Brain,
  Eye,
  Award,
  Diamond,
  Crown,
  Key,
  FileText,
  Sparkles,
  BookMarked,
  Skull,
  AlertTriangle,
  Volume2,
  VolumeX,
  type LucideIcon,
} from 'lucide-react';

export type IconName =
  | 'notebook'
  | 'accuse'
  | 'menu'
  | 'close'
  | 'detective'
  | 'hint-grey'
  | 'hint-memory'
  | 'hint-snow'
  | 'char_01'
  | 'char_02'
  | 'char_03'
  | 'char_04'
  | 'char_05'
  | 'char_06'
  | 'char_07'
  | 'victim'
  | 'warning'
  | 'volume-2'
  | 'volume-x';

const ICON_MAP: Record<IconName, LucideIcon> = {
  notebook: BookOpen,
  accuse: Gavel,
  menu: Menu,
  close: X,
  detective: Search,
  'hint-grey': Brain,
  'hint-memory': Eye,
  'hint-snow': Snowflake,
  char_01: Award,
  char_02: Diamond,
  char_03: Crown,
  char_04: Key,
  char_05: FileText,
  char_06: Sparkles,
  char_07: BookMarked,
  victim: Skull,
  warning: AlertTriangle,
  'volume-2': Volume2,
  'volume-x': VolumeX,
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className }: IconProps) {
  const LucideIcon = ICON_MAP[name];
  return <LucideIcon size={size} className={className} />;
}
