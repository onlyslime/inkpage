/** 与 TextEscapeBlock / FleeingPhoto 共用：指针在这些元素上时不驱动灵动效果 */
export function isLivelyExcludedTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest("[data-lively-exclude]") !== null
  );
}
