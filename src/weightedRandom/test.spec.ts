import { distributionFactory, normalizeAndAccumulate } from "./weightedRandomDistribution";

test('should distribute according to weight', () => {

    const input = Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

    const wr = distributionFactory()

    const distribution = wr(input, v => v == 4 ? 0 : v)

    const result = new Map<number, number>(input.map(v => [v, 0]))

    // console.log(distribution.next())

    for (let i = 0; i < 1500; i++) {
        const val = distribution.next()
        result.set(val, result.get(val) + 1);
    }

    console.log(result);

    expect(result.get(0)).toEqual(0)
    expect(result.get(4)).toEqual(0)

})

test("normalize and accumulate", () => {

    const input = [1, 3, 4]
    const extract1 = (v => v)

    const naa1 = normalizeAndAccumulate(input, extract1)

    expect(naa1).toEqual([
            {pc: 0.125, element: 1},
            {pc: 0.5, element: 3},
            {pc: 1, element: 4}
        ]
    )

    const extract2 = (v => 3*v)

    const naa2 = normalizeAndAccumulate(input, extract2)

    expect(naa2).toEqual([
            {pc: 0.125, element: 1},
            {pc: 0.5, element: 3},
            {pc: 1, element: 4}
        ]
    )
})

test("should respect cumulated threshold", () => {

    const input = [1, 3, 4]
    const extract = (v => v)

    const wr = distributionFactory()
    const distribution = wr(input, extract)


    const results=[

        distribution.next(0),
        distribution.next(0.1249),
        distribution.next(0.1251),
        distribution.next(0.51),
        distribution.next(0.9999)

    ]

     expect(results).toEqual([1,1,3,4,4])
})