declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    onpan?: (event: CustomEvent<{ x: number; y: number; target: EventTarget & T }>) => void;
    onpanup?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onpandown?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onpanmove?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onpinch?: (event: CustomEvent<{ scale: number; center: { x: number; y: number } }>) => void;
    onpinchup?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onpinchdown?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onpinchmove?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onrotate?: (event: CustomEvent<{ rotation: number; center: { x: number; y: number } }>) => void;
    onrotateup?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onrotatedown?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onrotatemove?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onswipe?: (
      event: CustomEvent<{
        direction: "top" | "right" | "bottom" | "left";
        target: EventTarget;
      }>
    ) => void;
    onswipeup?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onswipedown?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onswipemove?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    ontap?: (event: CustomEvent<{ x: number; y: number; target: EventTarget }>) => void;
    ontapup?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    ontapdown?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    ontapmove?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onpress?: (event: CustomEvent<{ x: number; y: number; target: EventTarget }>) => void;
    onpressup?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onpressdown?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
    onpressmove?: (event: CustomEvent<{ event: PointerEvent; pointersCount: number }>) => void;
  }
}
