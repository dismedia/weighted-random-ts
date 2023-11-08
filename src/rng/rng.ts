import { Rng } from "../index";

export const mathRandomRng: () =>Rng = function* () {
    while(true){
        yield Math.random();

    }

}