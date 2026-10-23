import {
  BookOpen,
  Search,
  Menu,
  X,
  Gavel,
  Snowflake,
  Brain,
  Eye,
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
  | 'hint-snow';

const ICON_MAP: Record<IconName, LucideIcon> = {
  notebook: BookOpen,
  accuse: Gavel,
  menu: Menu,
  close: X,
  detective: Search,
  'hint-grey': Brain,
  'hint-memory': Eye,
  'hint-snow': Snowflake,
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
