import clsx from "classnames"
import React, { forwardRef } from "react"
import { Link, LinkProps } from "react-router-dom"

export type ButtonProps = {
  disableDefaultStyle?: boolean
  rounded?: boolean
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

const Button = forwardRef(
  (
    {
      rounded = false,
      className = "",
      disableDefaultStyle = false,
      ...props
    }: ButtonProps,
    ref: any
  ) => {
    const btnClassName = clsx(
      `btn`,
      !disableDefaultStyle && `btn-ghost btn-sm`,
      rounded && "btn-circle",
      className
    )
    return <button {...props} className={btnClassName} ref={ref}></button>
  }
)

export type LinkButtonProps = React.PropsWithChildren<
  {
    rounded?: boolean
    className?: string
    disableDefaultStyle?: boolean
    title?: string
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
  } & LinkProps
>

export const LinkButton = ({
  rounded = false,
  className = "",
  children,
  disableDefaultStyle = false,
  title,
  onClick,
  ...linkProps
}: LinkButtonProps) => {
  const btnClassName = clsx(
    `btn`,
    !disableDefaultStyle && `btn-ghost btn-sm`,
    rounded && "btn-circle",
    className
  )
  return (
    <Link
      {...linkProps}
      className={btnClassName}
      title={title}
      onClick={onClick}>
      {children}
    </Link>
  )
}

export default Button
