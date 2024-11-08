import Char "mo:base/Char";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";

import Float "mo:base/Float";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

actor {
    // Constants
    let k : Float = 8.99e9; // Coulomb's constant
    let gridSize : Nat = 5; // Number of points in each dimension
    let spacing : Float = 1.0; // Spacing between grid points

    // Type definitions
    public type Position = {
        x: Float;
        y: Float;
        z: Float;
    };

    public type Charge = {
        strength: Float;
        position: Position;
    };

    public type Vector = {
        x: Float;
        y: Float;
        z: Float;
    };

    public type FieldVector = {
        position: Position;
        field: Vector;
    };

    // Calculate electric field at a point due to a single charge
    private func calculateFieldFromCharge(point: Position, charge: Charge) : Vector {
        let dx = point.x - charge.position.x;
        let dy = point.y - charge.position.y;
        let dz = point.z - charge.position.z;
        
        let r = Float.sqrt(dx * dx + dy * dy + dz * dz);
        let r3 = r * r * r;
        
        if (r < 0.1) {
            return { x = 0.0; y = 0.0; z = 0.0 };
        };

        let factor = k * charge.strength / r3;
        
        return {
            x = factor * dx;
            y = factor * dy;
            z = factor * dz;
        };
    };

    // Add two vectors
    private func addVectors(v1: Vector, v2: Vector) : Vector {
        return {
            x = v1.x + v2.x;
            y = v1.y + v2.y;
            z = v1.z + v2.z;
        };
    };

    // Public function to calculate the electric field
    public func calculateField(charge1: Charge, charge2: Charge) : async [FieldVector] {
        var fieldVectors : [var FieldVector] = Array.init<FieldVector>(
            gridSize * gridSize * gridSize,
            {
                position = { x = 0.0; y = 0.0; z = 0.0 };
                field = { x = 0.0; y = 0.0; z = 0.0 };
            }
        );
        
        var index = 0;
        for (i in Iter.range(0, gridSize - 1)) {
            for (j in Iter.range(0, gridSize - 1)) {
                for (k in Iter.range(0, gridSize - 1)) {
                    let x = Float.fromInt(i) * spacing - (Float.fromInt(gridSize - 1) * spacing / 2.0);
                    let y = Float.fromInt(j) * spacing - (Float.fromInt(gridSize - 1) * spacing / 2.0);
                    let z = Float.fromInt(k) * spacing - (Float.fromInt(gridSize - 1) * spacing / 2.0);
                    
                    let point = { x = x; y = y; z = z };
                    
                    // Calculate field from both charges
                    let field1 = calculateFieldFromCharge(point, charge1);
                    let field2 = calculateFieldFromCharge(point, charge2);
                    let totalField = addVectors(field1, field2);
                    
                    fieldVectors[index] := {
                        position = point;
                        field = totalField;
                    };
                    
                    index += 1;
                };
            };
        };
        
        return Array.freeze(fieldVectors);
    };
}
