import type { KeyboardShortcut } from '@glow/design-system/types/keyboardshortcut';

export interface ActionDropdownItem {
	id: string;
	label: string;
	badge?: string;
	badgeProps?: Record<string, unknown>;
	icon?: string;
	divided?: boolean;
	disabled?: boolean;
	shortcut?: KeyboardShortcut;
	customClass?: string;
	checked?: boolean;
}
