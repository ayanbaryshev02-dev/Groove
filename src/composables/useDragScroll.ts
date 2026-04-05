import { ref } from 'vue'

export function useDragScroll(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const isDragging = ref(false)
  let startX = 0
  let hasSwiped = false

  function onPointerDown(e: PointerEvent) {
    isDragging.value = true
    startX = e.clientX
    hasSwiped = false
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging.value) return
    const diff = e.clientX - startX
    if (Math.abs(diff) > 60 && !hasSwiped) {
      hasSwiped = true
      if (diff > 0) {
        onSwipeRight()
      } else {
        onSwipeLeft()
      }
    }
  }

  function onPointerUp() {
    isDragging.value = false
  }

  return {
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp
  }
}