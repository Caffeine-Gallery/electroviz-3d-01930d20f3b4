import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Charge { 'strength' : number, 'position' : Position }
export interface FieldVector { 'field' : Vector, 'position' : Position }
export interface Position { 'x' : number, 'y' : number, 'z' : number }
export interface Vector { 'x' : number, 'y' : number, 'z' : number }
export interface _SERVICE {
  'calculateField' : ActorMethod<[Charge, Charge], Array<FieldVector>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
