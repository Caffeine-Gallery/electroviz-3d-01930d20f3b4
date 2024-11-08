export const idlFactory = ({ IDL }) => {
  const Position = IDL.Record({
    'x' : IDL.Float64,
    'y' : IDL.Float64,
    'z' : IDL.Float64,
  });
  const Charge = IDL.Record({
    'strength' : IDL.Float64,
    'position' : Position,
  });
  const Vector = IDL.Record({
    'x' : IDL.Float64,
    'y' : IDL.Float64,
    'z' : IDL.Float64,
  });
  const FieldVector = IDL.Record({ 'field' : Vector, 'position' : Position });
  return IDL.Service({
    'calculateField' : IDL.Func([Charge, Charge], [IDL.Vec(FieldVector)], []),
  });
};
export const init = ({ IDL }) => { return []; };
