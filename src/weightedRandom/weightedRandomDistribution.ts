import { mathRandomRng } from "../rng/rng";
import { Rng, WeightedRandomDistribution } from "../index";

export type Weight = number
export type PoolSize = number

export const distributionFactory = (rng: Rng = mathRandomRng()): WeightedRandomDistribution => {

    return (elements, probability) => {

        const state = {
            elements: elements,
            arr: normalizeAndAccumulate(elements, probability)
        }

        return {
            next: (random) => {
                const r = random === undefined ? rng.next().value : random

                return state.arr.find((entry) => entry.pc > r).element
            },
            add: (newElement) => {
                state.elements.push(...newElement)
                state.arr = normalizeAndAccumulate(state.elements, probability)
                return state.elements.length

            },
            remove: (remElements) => {
                state.elements.filter(e => remElements.indexOf(e) == 0)
                state.arr = normalizeAndAccumulate(state.elements, probability)
                return state.elements.length

            },
            reevaluate: () => {
                state.arr = normalizeAndAccumulate(state.elements, probability)
                return state.elements.length

            },
        }
    }
}

export const normalizeAndAccumulate = <K>(elements: K[], probability: (element: K) => Weight): { pc: Weight, element: K }[] => {
    const e = elements.map(element => ({p: probability(element), element}));
    const sum = e.reduce((acc, element) => acc + element.p, 0)
    return e.map(elementWithProb => ({p: elementWithProb.p / sum, element: elementWithProb.element}))
        .reduce((acc, elementWithProb) => {
                acc.cumulative += elementWithProb.p
                acc.arr.push({pc: acc.cumulative, element: elementWithProb.element})
                return acc
            }, {arr: [], cumulative: 0}
        ).arr

}