# Wood Empire Lagos Parametric Pricing Matrix & BOM Logic

## Pricing Matrix

### Project Typologies & Base Pricing (NGN ₦)
| Typology | Base Unit | Base Rate (₦) | Additional Toggles (₦) | Board Yield (Base Boards/Unit) |
| :--- | :--- | :--- | :--- | :--- |
| Bespoke Culinary & Kitchen Joinery | Linear Meter | 480,000 | +220,000/lm for Quartz/Sintered Stone Countertop (Excl. from Timber Multiplier) | 3.2 boards/lm (+4.5 boards if Island) |
| Luxury Walk-In Wardrobe & Millwork | Linear Meter | 390,000 | - | 2.8 boards/lm |
| Executive Office & Corporate Boardroom | Module | 550,000 | - | 4.5 boards/module |
| Signature Architectural Loose Pieces | Signature Set | 1,250,000 | - | 6.0 boards/set |

### Substrate & Timber Multipliers
*Note: Multiplied directly against the Base Typology Rate.*
| Tier | Description | Multiplier |
| :--- | :--- | :--- |
| Tier 1 (Contemporary Essential) | 18mm Imported Egger MFC / High-Density Melamine with 2mm ABS laser edge-banding | 1.0x |
| Tier 2 (Coastal Humidity Shield) | 18mm HMR Green-Core MDF or Treated Marine Plywood with natural wood veneer & 2K Matte PU lacquer | 1.45x |
| Tier 3 (Architectural Heirloom Timber) | Kiln-Dried Solid Nigerian Teak / Iroko / Imported American White Oak with Rubio Monocoat oil / satin varnish | 2.25x |

### Ironmongery & Lighting Tiers
*Note: Surcharge applied to Base Fabrication Cost (Base Rate × Dimension/Units), NOT timber-multiplied total.*
| Tier | Description | Surcharge |
| :--- | :--- | :--- |
| Tier A (Precision Standard) | DTC Heavy-Duty Soft-Close hinges & undermount runners | +₦0 |
| Tier B (Austrian Luxury Spec) | Blum Blumotion hinges, Legrabox drawers, Aventos lifts, 3000K recessed LED sensor profiles | +32% of Base Fabrication Cost |

### Logistics, Haulage & Site Installation Factor
| Zone | Flat Haulage (₦) | Installation Fee (% of fabrication subtotal) |
| :--- | :--- | :--- |
| Mainland Zone | 120,000 | 8% |
| Island Zone 1 (VI, Ikoyi, Lekki Phase 1) | 180,000 | 8% |
| Island Zone 2 (Chevron, Ikate, VGC, Ajah) | 240,000 | 8% |

**Elevated Apartment Surcharge:**
For 2nd–10th+ Floor without service elevator: Add `+₦85,000` flat manual hoisting labor fee + `+4%` onto the installation fee.

### Board Yield & Wastage Formula
15% wastage applied to all board yields.
`Total Boards = Math.ceil((Units × Base Boards Per Unit) × 1.15)`

## JSON Schema (BOM Logic)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Wood Empire Lagos Estimator Model",
  "type": "object",
  "properties": {
    "typology": {
      "type": "string",
      "enum": ["kitchen", "wardrobe", "office", "signature"]
    },
    "dimension_units": {
      "type": "number",
      "description": "Linear meters, modules, or sets"
    },
    "kitchen_options": {
      "type": "object",
      "properties": {
        "countertop": { "type": "boolean" },
        "island": { "type": "boolean" }
      }
    },
    "substrate_tier": {
      "type": "number",
      "enum": [1, 2, 3]
    },
    "hardware_tier": {
      "type": "string",
      "enum": ["A", "B"]
    },
    "logistics": {
      "type": "object",
      "properties": {
        "zone": {
          "type": "string",
          "enum": ["mainland", "island_1", "island_2"]
        },
        "elevated_surcharge": {
          "type": "boolean"
        }
      }
    },
    "budget_capacity": {
      "type": "number"
    }
  },
  "required": ["typology", "dimension_units", "substrate_tier", "hardware_tier", "logistics"]
}
```
