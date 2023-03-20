export const isMAc = window.navigator.userAgent.includes("Mac")

export const isExtension = process.env.NEXT_PUBLIC_EXTENSION === "chrome"
export const isExtensionPopup = process.env.NEXT_PUBLIC_EXTENSION_TYPE === "popup"
