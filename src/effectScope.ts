export let activeEffectScope;

class EffectScope {
  active = true;
  effects = []; // 收集内部的effect
  parent;
  scopes; // 收集作用域的
  constructor(detached = false) {
    if (!detached && activeEffectScope) {
      activeEffectScope.scopes || (activeEffectScope.scopes = []).push(this);
    }
  }
  run(fn) {
    if (this.active) {
      try {
        this.parent = activeEffectScope;
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = this.parent;
        this.parent = null;
      }
    }
  }
  stop() {
    if (this.active) {
      for (let i = 0; i < this.effects.length; i++) {
        this.effects[i].stop();
      }
      this.active = false;
    }
    if (this.scopes) {
      for (let i = 0; i < this.scopes.length; i++) {
        this.scopes[i].stop();
      }
    }
  }
}

export function recordEffectScope(effect) {
  if (activeEffectScope && activeEffectScope.active) {
    activeEffectScope.effects.push(effect);
  }
}

export function effectScope(detached) {
  return new EffectScope(detached);
}
