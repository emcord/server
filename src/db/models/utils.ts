export function required<C extends StringConstructor | NumberConstructor>(type: C) {
  return {
    type,
    required: true,
  } as const
}
