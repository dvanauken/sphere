import { describe, it, expect } from 'vitest'
import { Arc } from '../src/models/Arc.js'
import { Coordinate } from '../src/models/Coordinate.js'
import { assertDistanceNearlyEqual } from './helpers/assertions'

describe('Arc Calculations', () => {
  it('should create simple arc with default radius', () => {
    const arc = Arc.onSphere()
    const circumference = arc.length()
    const expectedCircumference = 2 * Math.PI * 6371

    assertDistanceNearlyEqual(
      circumference.inKilometers(),
      expectedCircumference,
      1,
      'Default arc should have Earth\'s circumference'
    )
  })

  it('should calculate great circle arc between two points', () => {
    const london = new Coordinate(51.5074, -0.1278)
    const paris = new Coordinate(48.8566, 2.3522)
    const arc = Arc.fromPoints(london, paris)
    const length = arc.length()

    assertDistanceNearlyEqual(
      length.inKilometers(),
      344,
      1,
      'London-Paris arc length should be about 344 km'
    )
  })
})