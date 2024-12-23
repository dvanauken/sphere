import { describe, it, expect } from 'vitest'
import { GreatCircle } from '../src/models/GreatCircle.js'
import { Coordinate } from '../src/models/Coordinate.js'
import { Distance } from '../src/models/Distance.js'

describe('GreatCircle Calculations', () => {
  const london = new Coordinate(51.5074, -0.1278)
  const nyc = new Coordinate(40.7128, -74.0060)

  it('should calculate distances using default Earth radius', () => {
    const distance = new GreatCircle(london, nyc).distance()
    
    // Second parameter specifies decimal points to check
    expect(distance.inKilometers()).toBeCloseTo(5570, 0)
    expect(distance.inMiles()).toBeCloseTo(3461, 0)
  })

  it('should handle zero distance', () => {
    const distance = new GreatCircle(london, london)
      .withSphere(Distance.fromKilometers(6371))
      .distance()
      
    expect(distance.inKilometers()).toBeCloseTo(0, 2)
  })
})