export * as RadixTooltip from "@radix-ui/react-tooltip"
import * as RadixTooltip from "@radix-ui/react-tooltip"
import clsx from "classnames"

type Props = React.PropsWithChildren<{
  content?: string
  classNames?: {
    // trigger?: string
    content?: string
    arrow?: string
  }
}>

export function Tooltip({ content, classNames = {}, children }: Props) {
  return (
    <RadixTooltip.Provider delayDuration={200}>
      <RadixTooltip.Root>
        <RadixTooltip.TooltipTrigger asChild>{children}</RadixTooltip.TooltipTrigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className={clsx("max-w-sm bg-info text-info-content py-4 px-6", classNames.content)}
          >
            {content}
            <RadixTooltip.Arrow
              width={14}
              height={6}
              className={clsx("fill-info", classNames.arrow)}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
