import { describe, expect, test } from '@jest/globals';

import {
  COLUMN_X,
  STAGE_COUNT,
  TRACK,
  TRACK_LENGTH,
  activeStageAt,
  pointAtProgress,
} from '@/salmon/track';

describe('salmon track', () => {
  test('top row stages sit on the top edge, pointing up', () => {
    [0, 1, 2].forEach((stage) => {
      const point = pointAtProgress(stage);
      expect(point.x).toBeCloseTo(COLUMN_X[stage]);
      expect(point.y).toBeCloseTo(TRACK.top);
      expect(point.angle).toBe(-90);
    });
  });

  test('bottom row stages run right to left, pointing down', () => {
    [3, 4, 5].forEach((stage) => {
      const point = pointAtProgress(stage);
      expect(point.x).toBeCloseTo(COLUMN_X[5 - stage]);
      expect(point.y).toBeCloseTo(TRACK.bottom);
      expect(point.angle).toBe(90);
    });
  });

  test('progress wraps around after a full loop', () => {
    expect(pointAtProgress(STAGE_COUNT)).toEqual(pointAtProgress(0));
    expect(pointAtProgress(-1).x).toBeCloseTo(pointAtProgress(5).x);
  });

  test('halfway between the last and first stage is the left end of the track', () => {
    const point = pointAtProgress(5.5);
    expect(point.x).toBeLessThan(TRACK.left);
    expect(point.y).toBeCloseTo((TRACK.top + TRACK.bottom) / 2);
    expect(TRACK_LENGTH).toBeGreaterThan(0);
  });

  test('active stage is the most recently reached one', () => {
    expect(activeStageAt(0)).toBe(0);
    expect(activeStageAt(0.5)).toBe(0);
    expect(activeStageAt(0.95)).toBe(1);
    expect(activeStageAt(5.5)).toBe(5);
    expect(activeStageAt(5.95)).toBe(0);
    expect(activeStageAt(-0.5)).toBe(5);
  });
});
