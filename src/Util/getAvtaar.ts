import { identicon } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

export const generateAvatar = (seed: string):string=>{
    const avtar = createAvatar(identicon,{
        seed,
    });

    return avtar.toDataUriSync();
}