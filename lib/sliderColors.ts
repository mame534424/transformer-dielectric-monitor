import type { PredictRequest } from '@/types';

export function getSliderAccent(key: keyof PredictRequest, value: number): string {
  switch (key) {
    case 'BDV': {
      const t = value / 100;
      return lerpColor('#ff4444', '#00ff88', t);
    }
    case 'Tan_Delta':
    case 'DDF': {
      const t = 1 - value;
      return lerpColor('#ff4444', '#00ff88', t);
    }
    case 'Insulation_Resistance': {
      const t = value / 1000;
      return lerpColor('#ff4444', '#00ff88', t);
    }
    case 'Capacitance_Variation': {
      const t = 1 - Math.min(1, Math.abs(value) / 10);
      return lerpColor('#ff4444', '#00ff88', t);
    }
    case 'Polarization_Index': {
      const t = value / 10;
      return lerpColor('#ff4444', '#00ff88', t);
    }
    default:
      return '#00d4ff';
  }
}

function lerpColor(a: string, b: string, t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const parse = (hex: string) => {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * clamped);
  const g = Math.round(g1 + (g2 - g1) * clamped);
  const bl = Math.round(b1 + (b2 - b1) * clamped);
  return `rgb(${r}, ${g}, ${bl})`;
}
