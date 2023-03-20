/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const VERTICAL_GAP = 10
const HORIZONTAL_OFFSET = 5

export function setFloatingElemPosition(
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  verticalGap: number = 10,
  horizontalOffset: number = 5
): void {
  const scrollerElem = anchorElem.parentElement
  console.log(targetRect, floatingElem)
  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = "0"
    floatingElem.style.top = "-10000px"
    floatingElem.style.left = "-10000px"

    return
  }

  const floatingElemRect = floatingElem.getBoundingClientRect()
  const anchorElementRect = anchorElem.getBoundingClientRect()
  const editorScrollerRect = scrollerElem.getBoundingClientRect()

  let top = targetRect.top - floatingElemRect.height - verticalGap
  let left = targetRect.left - horizontalOffset

  if (top < editorScrollerRect.top) {
    top += floatingElemRect.height + targetRect.height + verticalGap * 2
  }

  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset
  }

  top -= anchorElementRect.top
  left -= anchorElementRect.left

  floatingElem.style.opacity = "1"
  floatingElem.style.top = `${top}px`
  floatingElem.style.left = `${left}px`
}

export function setScroll(targetElem: HTMLElement, _scrollerElem?: HTMLElement, gap = 4): void {
  const scrollerElem = _scrollerElem || getScrollableParent(targetElem)

  if (!scrollerElem) return

  const targetElemRect = targetElem.getBoundingClientRect()
  const scrollerElemRect = scrollerElem.getBoundingClientRect()

  let deltaY = 0
  let deltaX = 0

  if (targetElemRect.top < scrollerElemRect.top) {
    deltaY = targetElemRect.top - scrollerElemRect.top - gap
  }
  if (targetElemRect.bottom > scrollerElemRect.bottom) {
    deltaY = targetElemRect.bottom - scrollerElemRect.bottom + gap
  }
  if (targetElemRect.left < scrollerElemRect.left) {
    deltaX = targetElemRect.left - scrollerElemRect.left
  }
  if (targetElemRect.right > scrollerElemRect.right) {
    deltaX = targetElemRect.right - scrollerElemRect.right
  }

  console.log(targetElem, scrollerElem, deltaX, deltaY)

  if (deltaX || deltaY) {
    scrollerElem.scrollBy({
      left: deltaX,
      top: deltaY,
      behavior: "smooth",
    })
  }
}

const isScrollable = (elem: HTMLElement) => {
  const hasScrollableContent = elem.scrollHeight > elem.clientHeight
  const overflowYStyle = window.getComputedStyle(elem).overflowY
  const isOverflowHidden = overflowYStyle.indexOf("hidden") !== -1
  return hasScrollableContent && !isOverflowHidden
}

const getScrollableParent = (elem: HTMLElement): HTMLElement | null => {
  return !elem || elem === document.body
    ? document.body
    : isScrollable(elem)
    ? elem
    : elem.parentElement
    ? getScrollableParent(elem.parentElement)
    : null
}
