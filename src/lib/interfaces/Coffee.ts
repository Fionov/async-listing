import {AbstractModel} from "src/lib/interfaces/AbstractModel";

export interface Coffee extends AbstractModel
{
    id: number,
    uid: string,
    blend_name: string,
    origin: string,
    variety: string,
    notes: string,
    intensifier: string,
}