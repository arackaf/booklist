export type NavigationItem = {
  label: string;
  Icon: any;
  href: string;
  badge?: string | number | null;
  active?: boolean | null;
  hidden?: boolean;
  disabled?: boolean;
};
