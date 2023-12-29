export interface PokeServiceRes {
    id:                                 number;
    pokedexId:                          number;
    name:                               string;
    image:                              string;
    sprite:                             string;
    slug:                               string;
    stats:                              Stats;
    apiTypes:                           APIType[];
    apiGeneration:                      number;
    apiResistances:                     APIResistance[];
    resistanceModifyingAbilitiesForApi: any[];
    apiEvolutions:                      APIEvolution[];
    apiPreEvolution:                    string;
    apiResistancesWithAbilities:        any[];
}

export interface APIEvolution {
    name:      string;
    pokedexId: number;
}

export interface APIResistance {
    name:              string;
    damage_multiplier: number;
    damage_relation:   DamageRelation;
}

export enum DamageRelation {
    Neutral = "neutral",
    Resistant = "resistant",
    TwiceResistant = "twice_resistant",
    Vulnerable = "vulnerable",
}

export interface APIType {
    name:  string;
    image: string;
}

export interface Stats {
    HP:              number;
    attack:          number;
    defense:         number;
    special_attack:  number;
    special_defense: number;
    speed:           number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toPokeServiceRes(json: string): PokeServiceRes {
        return cast(JSON.parse(json), r("PokeServiceRes"));
    }

    public static pokeServiceResToJson(value: PokeServiceRes): string {
        return JSON.stringify(uncast(value, r("PokeServiceRes")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "PokeServiceRes": o([
        { json: "id", js: "id", typ: 0 },
        { json: "pokedexId", js: "pokedexId", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "image", js: "image", typ: "" },
        { json: "sprite", js: "sprite", typ: "" },
        { json: "slug", js: "slug", typ: "" },
        { json: "stats", js: "stats", typ: r("Stats") },
        { json: "apiTypes", js: "apiTypes", typ: a(r("APIType")) },
        { json: "apiGeneration", js: "apiGeneration", typ: 0 },
        { json: "apiResistances", js: "apiResistances", typ: a(r("APIResistance")) },
        { json: "resistanceModifyingAbilitiesForApi", js: "resistanceModifyingAbilitiesForApi", typ: a("any") },
        { json: "apiEvolutions", js: "apiEvolutions", typ: a(r("APIEvolution")) },
        { json: "apiPreEvolution", js: "apiPreEvolution", typ: "" },
        { json: "apiResistancesWithAbilities", js: "apiResistancesWithAbilities", typ: a("any") },
    ], false),
    "APIEvolution": o([
        { json: "name", js: "name", typ: "" },
        { json: "pokedexId", js: "pokedexId", typ: 0 },
    ], false),
    "APIResistance": o([
        { json: "name", js: "name", typ: "" },
        { json: "damage_multiplier", js: "damage_multiplier", typ: 3.14 },
        { json: "damage_relation", js: "damage_relation", typ: r("DamageRelation") },
    ], false),
    "APIType": o([
        { json: "name", js: "name", typ: "" },
        { json: "image", js: "image", typ: "" },
    ], false),
    "Stats": o([
        { json: "HP", js: "HP", typ: 0 },
        { json: "attack", js: "attack", typ: 0 },
        { json: "defense", js: "defense", typ: 0 },
        { json: "special_attack", js: "special_attack", typ: 0 },
        { json: "special_defense", js: "special_defense", typ: 0 },
        { json: "speed", js: "speed", typ: 0 },
    ], false),
    "DamageRelation": [
        "neutral",
        "resistant",
        "twice_resistant",
        "vulnerable",
    ],
};

export class Pokemon {
    constructor(public id:number, public pokedexId:number, public name:string, public image:string, public sprite:string, 
        public slug:string, public stats:Stats, public apiTypes:APIType[], public apiGeneration: number, public apiResistances:APIResistance[],
        public resistanceModifyingAbilitiesForApi: any[], public apiEvolutions:APIEvolution[], public apiPreEvolution: string, public apiResistancesWithAbilities:any[]){}
}
