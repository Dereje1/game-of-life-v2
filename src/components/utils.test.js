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
                150,
                149,
                151,
                170,
                270,
                269,
                271,
                250,
            ]
        })
    })

    test('will get the pentaDecathlon pattern', () => {
        const updatedInput = { ...input, pattern: 'pentaDecathlon' };
        expect(getPattern(updatedInput)).toEqual({
            cells: [
                170,
                169,
                171,
                150,
                270,
                269,
                271,
                290,
            ]
        })
    })

    test('will get the spaceShip pattern', () => {
        const updatedInput = { ...input, pattern: 'spaceShip' };
        expect(getPattern(updatedInput)).toEqual({
            cells: [
                     210,
                     211,
                     212,
                     213,
                     194,
                     190,
                     170,
                     151,
                     154,
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