// TODO: this should all probably be in umbreld

export const DEFAULT_REFRESH_MS = 1000 * 60 * 5

type BaseWidget = {
	type: WidgetType
	refresh?: number
}

export const widgetTypes = [
	'text-with-buttons',
	'text-with-progress',
	'two-stats-with-guage',
	'three-stats',
	'four-stats',
	'list-emoji',
	'list',
] as const

export type WidgetType = (typeof widgetTypes)[number]

// ------------------------------

/**
 * This link is relative to `RegistryApp['path']`
 * NOTE: type is created for this comment to appear in VSCode
 */
type Link = string

type FourUpItem = BaseWidget & {
	title: string
	icon: string
	value: string
	valueSub: string
}
export type FourUpWidget = BaseWidget & {
	type: 'four-stats'
	link?: Link
	items: [FourUpItem, FourUpItem, FourUpItem, FourUpItem]
}

type ThreeUpItem = {
	icon: string
	title: string
	value: string
}
export type ThreeUpWidget = BaseWidget & {
	type: 'three-stats'
	link?: Link
	items: [ThreeUpItem, ThreeUpItem, ThreeUpItem]
}

// The long name feels like it could be just be two-stats, but if we ever add one without a progress, what would we call it?
type TwoStatsWithProgressItem = {
	title: string
	value: string
	valueSub: string
	/** Number from 0 to 1 */
	progress: number
}
export type TwoStatsWithProgressWidget = BaseWidget & {
	type: 'two-stats-with-guage'
	link?: Link
	items: [TwoStatsWithProgressItem, TwoStatsWithProgressItem]
}

export type StatWithProgressWidget = BaseWidget & {
	type: 'text-with-progress'
	link?: Link
	title: string
	value: string
	valueSub?: string
	progressLabel: string
	/** Number from 0 to 1 */
	progress: number
}

export type StatWithButtonsWidget = BaseWidget & {
	type: 'text-with-buttons'
	icon: string
	title: string
	value: string
	valueSub: string
	buttons: {
		text: string
		icon: string
		link: Link
	}[]
}

export type ListWidget = BaseWidget & {
	type: 'list'
	link?: Link
	items: {
		text: string
		textSub: string
	}[]
	noItemsText?: string
}

export type ListEmojiWidget = BaseWidget & {
	type: 'list-emoji'
	link?: Link
	count: number
	items: {
		emoji: string
		text: string
	}[]
}

type AnyWidgetConfig =
	| FourUpWidget
	| ThreeUpWidget
	| TwoStatsWithProgressWidget
	| StatWithProgressWidget
	| StatWithButtonsWidget
	| ListWidget
	| ListEmojiWidget

// Choose the widget AnyWidgetConfig based on the type `T` passed in, othwerwise `never`
export type WidgetConfig<T extends WidgetType = WidgetType> = Extract<AnyWidgetConfig, {type: T}>

// ------------------------------

export type ExampleWidgetConfig<T extends WidgetType = WidgetType> = T extends 'text-with-buttons'
	? // Omit the `type` (and `link` from buttons) by omitting `buttons` and then adding it without the `link`
	  Omit<StatWithButtonsWidget, 'type' | 'buttons'> & {buttons: Omit<StatWithButtonsWidget['buttons'], 'link'>}
	: // Otherwise, just omit the `type`
	  Omit<WidgetConfig<T>, 'type'>

// Adding `= WidgetType` to `T` makes it so that if `T` is not provided, it defaults to `WidgetType`. Prevents us from always having to write `RegistryWidget<WidgetType>` when referring to the type.
export type RegistryWidget<T extends WidgetType = WidgetType> = {
	id: string
	type: T
	refresh?: number
	// Examples aren't interactive so no need to include `link` in example
	example?: ExampleWidgetConfig<T>
}

// ------------------------------

export const MAX_WIDGETS = 3

export const liveUsageWidgets: [
	RegistryWidget<'text-with-progress'>,
	RegistryWidget<'text-with-progress'>,
	RegistryWidget<'three-stats'>,
] = [
	{
		id: 'umbrel:storage',
		type: 'text-with-progress',
		example: {
			title: 'Storage',
			value: '256 GB',
			progressLabel: '1.75 TB left',
			progress: 0.25,
		},
	},
	{
		id: 'umbrel:memory',
		type: 'text-with-progress',
		example: {
			title: 'Memory',
			value: '5.8 GB',
			valueSub: '/16GB',
			progressLabel: '11.4 GB left',
			progress: 0.36,
		},
	},
	{
		id: 'umbrel:system-stats',
		type: 'three-stats',
		example: {
			items: [
				{
					icon: 'system-widget-storage',
					title: 'Storage',
					value: '1.75 TB',
				},
				{
					icon: 'system-widget-memory',
					title: 'Memory',
					value: '5.8 GB',
				},
				{
					icon: 'system-widget-cpu',
					title: 'CPU',
					value: '24%',
				},
			],
		},
	},
]
