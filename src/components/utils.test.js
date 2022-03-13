import { getPattern } from './utils'

describe('getting patterns', () => {
    const input = {
        pattern: 'none',
        cellSize: 10,
        canvasWidth: 200,
        canvasHeight: 200
    }

    test('will get the blinker pattern', () => {
        const updatedInput = { ...input, pattern: 'blinker' };
        expect(getPattern(updatedInput)).toEqual({ cells: [210, 209, 211] })
    })

    test('will get the glider pattern', () => {
        const updatedInput = { ...input, pattern: 'glider' };
        expect(getPattern(updatedInput)).toEqual({ cells: [210, 209, 211, 191, 170] })
    })

    test('will get the toad pattern', () => {
        const updatedInput = { ...input, pattern: 'toad' };
        expect(getPattern(updatedInput)).toEqual({ cells: [210, 209, 211, 190, 191, 192] })
    })

    test('will get the beacon pattern', () => {
        const updatedInput = { ...input, pattern: 'beacon' };
        expect(getPattern(updatedInput)).toEqual({
            cells: [
                210,
                209,
                189,
                190,
                231,
                232,
                251,
                252,
            ]
        })
    })

    test('will get the pulsar pattern', () => {
        const updatedInput = { ...input, pattern: 'pulsar' };
        expect(getPattern(updatedInput)).toEqual({
            cells: [
                '90-120', '80-120',
                '100-120', '90-110',
                '90-60', '80-60',
                '100-60', '90-50'
            ]
        })
    })

    test('will get the pentaDecathlon pattern', () => {
        const updatedInput = { ...input, pattern: 'pentaDecathlon' };
        expect(getPattern(updatedInput)).toEqual({
            cells: [
                '90-120', '80-120',
                '100-120', '90-130',
                '90-70', '80-70',
                '100-70', '90-60'
            ]
        })
    })

    test('will get the spaceShip pattern', () => {
        const updatedInput = { ...input, pattern: 'spaceShip' };
        expect(getPattern(updatedInput)).toEqual({
            cells: [
                '90-100', '100-100',
                '110-100', '80-100',
                '80-90', '80-80',
                '90-70', '120-70',
                '120-90'
            ]
        })
    })

    test('will get an empty pattern', () => {
        const updatedInput = { ...input, pattern: 'none' };
        expect(getPattern(updatedInput)).toEqual({
            cells: []
        })
    })
})