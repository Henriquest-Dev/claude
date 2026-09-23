/**
 * Tiny spring solver with the same model Framer uses for its "Spring" transition
 * (stiffness / damping / mass). Every key animates independently towards its target.
 */
export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

/** The preset used by the Framer scroll variants in the reference. */
export const FRAMER_SPRING: SpringConfig = { stiffness: 180, damping: 19, mass: 1 };

export class Springs<K extends string> {
  private value: Record<K, number>;
  private velocity: Record<K, number>;
  private target: Record<K, number>;
  private readonly keys: K[];

  constructor(
    init: Record<K, number>,
    public config: SpringConfig = FRAMER_SPRING,
    public instant = false,
  ) {
    this.keys = Object.keys(init) as K[];
    this.value = { ...init };
    this.target = { ...init };
    this.velocity = {} as Record<K, number>;
    for (const k of this.keys) this.velocity[k] = 0;
  }

  get(k: K): number {
    return this.value[k];
  }

  set(target: Partial<Record<K, number>>): void {
    Object.assign(this.target, target);
  }

  /** Jump without animating (e.g. to start an intro from 0). */
  jump(values: Partial<Record<K, number>>): void {
    for (const k of Object.keys(values) as K[]) {
      this.value[k] = values[k]!;
      this.velocity[k] = 0;
    }
  }

  /** Advances the simulation. Returns true while anything is still moving. */
  step(dt: number): boolean {
    const { stiffness, damping, mass } = this.config;
    let moving = false;
    const steps = 4;
    const h = Math.min(dt, 1 / 30) / steps;

    for (const k of this.keys) {
      let v = this.value[k];
      let vel = this.velocity[k];
      const t = this.target[k];

      if (this.instant) {
        if (v !== t) moving = true;
        this.value[k] = t;
        this.velocity[k] = 0;
        continue;
      }

      for (let i = 0; i < steps; i++) {
        const force = -stiffness * (v - t) - damping * vel;
        vel += (force / mass) * h;
        v += vel * h;
      }

      const scale = Math.max(1, Math.abs(t));
      if (Math.abs(v - t) < 0.0005 * scale && Math.abs(vel) < 0.005 * scale) {
        v = t;
        vel = 0;
      } else {
        moving = true;
      }
      this.value[k] = v;
      this.velocity[k] = vel;
    }
    return moving;
  }
}
