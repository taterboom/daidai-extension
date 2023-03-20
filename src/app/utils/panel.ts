export type PanelConfig = [string, boolean] // [name, supportAnonymous]

export const PANEL_CREATOR: PanelConfig = ["creator", false]
export const PANEL_EDITOR: PanelConfig = ["editor", false]
export const PANEL_DELETER: PanelConfig = ["deleter", false]
export const PANEL_IMPORTER: PanelConfig = ["importer", false]
export const PANEL_PROFILE: PanelConfig = ["profile", false]
export const PANEL_SHORTCUTS: PanelConfig = ["shortcuts", true]

export const PANELS = [
  PANEL_CREATOR,
  PANEL_EDITOR,
  PANEL_DELETER,
  PANEL_IMPORTER,
  PANEL_PROFILE,
  PANEL_SHORTCUTS
]
