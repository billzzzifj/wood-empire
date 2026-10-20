import React, { useState, useMemo } from 'react';
import {
  Building,
  MapPin,
  Droplets,
  Lightbulb,
  Settings,
  CreditCard,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Package,
  Clock,
  MessageSquare,
  FileText
} from 'lucide-react';

// --- CONSTANTS & DATA MODELS ---
const TYPOLOGIES = [
  { id: 'kitchen', label: 'Bespoke Culinary & Kitchen Joinery', unit: 'Linear Meter', baseRate: 480000, baseBoards: 3.2, icon: Building },
  { id: 'wardrobe', label: 'Luxury Walk-In Wardrobe & Millwork', unit: 'Linear Meter', baseRate: 390000, baseBoards: 2.8, icon: Building },
  { id: 'office', label: 'Executive Office & Corporate Boardroom Fit-Out', unit: 'Module', baseRate: 550000, baseBoards: 4.5, icon: Building },
  { id: 'signature', label: 'Signature Architectural Loose Pieces', unit: 'Signature Set', baseRate: 1250000, baseBoards: 6.0, icon: Building },
];

const SUBSTRATES = [
  { id: 1, label: 'Tier 1 (Contemporary Essential)', desc: '18mm Imported Egger MFC with 2mm ABS edge-banding', multiplier: 1.0, rating: 'Standard' },
  { id: 2, label: 'Tier 2 (Coastal Humidity Shield)', desc: '18mm HMR Green-Core MDF / Marine Ply + 2K Matte PU', multiplier: 1.45, rating: 'High Moisture Resistance' },
  { id: 3, label: 'Tier 3 (Architectural Heirloom)', desc: 'Solid Nigerian Teak / White Oak + Rubio Monocoat', multiplier: 2.25, rating: 'Heirloom Lifetime' },
];

const HARDWARE = [
  { id: 'A', label: 'Tier A (Precision Standard)', desc: 'DTC Heavy-Duty Soft-Close hinges & runners', surcharge: 0 },
  { id: 'B', label: 'Tier B (Austrian Luxury Spec)', desc: 'Blum Blumotion, Legrabox, 3000K LED sensors', surcharge: 0.32 },
];

const ZONES = [
  { id: 'mainland', label: 'Mainland Zone', desc: 'Ikeja GRA, Maryland, Surulere, Yaba', haulage: 120000, installPct: 0.08 },
  { id: 'island_1', label: 'Island Zone 1', desc: 'Victoria Island, Ikoyi, Lekki Phase 1', haulage: 180000, installPct: 0.08 },
  { id: 'island_2', label: 'Island Zone 2', desc: 'Chevron, Ikate, VGC, Ajah', haulage: 240000, installPct: 0.08 },
];

const COUNTERTOP_RATE = 220000;
const ISLAND_BOARDS = 4.5;
const ELEVATED_FEE = 85000;
const ELEVATED_INSTALL_PCT = 0.04;

export default function WoodEmpireConfigurator() {
  const [step, setStep] = useState(1);

  // State Models
  const [typology, setTypology] = useState('kitchen');
  const [dimension, setDimension] = useState(3);
  const [kitchenOptions, setKitchenOptions] = useState({ countertop: false, island: false });
  const [zone, setZone] = useState('island_1');
  const [elevated, setElevated] = useState(false);
  const [substrate, setSubstrate] = useState(2);
  const [hardware, setHardware] = useState('B');
  const [budget, setBudget] = useState('');

  const [showSpecifier, setShowSpecifier] = useState(false);

  // Formatting utilities
  const formatNGN = (num) => `₦${num.toLocaleString('en-NG')}`;

  // Calculation Engine
  const estimate = useMemo(() => {
    const selectedTypology = TYPOLOGIES.find(t => t.id === typology);
    const selectedSubstrate = SUBSTRATES.find(s => s.id === substrate);
    const selectedHardware = HARDWARE.find(h => h.id === hardware);
    const selectedZone = ZONES.find(z => z.id === zone);

    // 1. Base Cost (Base Rate x Dimension)
    const baseCost = selectedTypology.baseRate * dimension;

    // 2. Timber Multiplier applied to Base Cost
    const fabricationCost = baseCost * selectedSubstrate.multiplier;

    // 3. Hardware Surcharge applied to Base Cost ONLY
    const hardwareCost = baseCost * selectedHardware.surcharge;

    // 4. Kitchen Additions (Outside Timber Multiplier)
    let countertopCost = 0;
    if (typology === 'kitchen' && kitchenOptions.countertop) {
      countertopCost = COUNTERTOP_RATE * dimension;
    }

    const fabricationSubtotal = fabricationCost + hardwareCost + countertopCost;

    // 5. Logistics & Installation
    let installPct = selectedZone.installPct;
    let installFee = fabricationSubtotal * installPct;
    let haulage = selectedZone.haulage;

    if (elevated) {
      installFee += (fabricationSubtotal * ELEVATED_INSTALL_PCT);
      haulage += ELEVATED_FEE;
    }

    const totalCost = fabricationSubtotal + installFee + haulage;

    // 6. Board Yield
    let rawBoards = dimension * selectedTypology.baseBoards;
    if (typology === 'kitchen' && kitchenOptions.island) {
      rawBoards += ISLAND_BOARDS;
    }
    const totalBoards = Math.ceil(rawBoards * 1.15); // 15% wastage

    return {
      baseCost,
      fabricationCost,
      hardwareCost,
      countertopCost,
      fabricationSubtotal,
      installFee,
      haulage,
      totalCost,
      totalBoards,
      leadTime: substrate === 3 ? '5-7' : '3-5' // Teak/Oak takes longer
    };
  }, [typology, dimension, kitchenOptions, zone, elevated, substrate, hardware]);

  const applyValueEngineering = () => {
    setSubstrate(1); // Egger MFC
    setHardware('A'); // DTC Soft-close
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 5));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const generateWhatsAppMessage = () => {
    const selectedTypology = TYPOLOGIES.find(t => t.id === typology);
    const selectedZone = ZONES.find(z => z.id === zone);
    const selectedSubstrate = SUBSTRATES.find(s => s.id === substrate);
    const selectedHardware = HARDWARE.find(h => h.id === hardware);

    return `*WOOD EMPIRE LAGOS — COMMISSION INQUIRY*
*Reference:* WEL-2026-${Math.floor(1000 + Math.random() * 9000)}

*CLIENT DETAILS*
Zone: ${selectedZone.label}
Floor Access: ${elevated ? 'Elevated (No Service Elevator)' : 'Ground / Service Elevator Available'}

*SPECIFICATIONS*
Typology: ${selectedTypology.label}
Dimensions: ${dimension} ${selectedTypology.unit}
Substrate: ${selectedSubstrate.label}
Hardware: ${selectedHardware.label}
${typology === 'kitchen' ? `Additions: ${kitchenOptions.countertop ? 'Countertop, ' : ''}${kitchenOptions.island ? 'Island' : ''}` : ''}

*ESTIMATED INVESTMENT*
Provisional BOQ: ${formatNGN(estimate.totalCost)}
Board Yield: ${estimate.totalBoards} Sheets (18mm)
Lead Time: ${estimate.leadTime} Weeks`;
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] text-[#121211] font-sans">

      {/* Header */}
      <header className="border-b border-[#D6D1C7] p-6 bg-[#F6F4EF] sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-medium tracking-widest uppercase">Wood Empire Lagos</h1>
          <p className="text-xs text-[#7A5330] tracking-widest uppercase mt-1">Architectural Millwork Estimator</p>
        </div>
        <div className="flex gap-2">
          {[1,2,3,4,5].map(s => (
            <div key={s} className={`h-1 w-8 ${step >= s ? 'bg-[#7A5330]' : 'bg-[#D6D1C7]'}`} />
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 pb-40">

        {/* STEP 1: Spatial Commission Type */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="mb-10">
              <h2 className="text-3xl font-light mb-2">Spatial Commission Type</h2>
              <p className="text-sm text-gray-600 tracking-widest uppercase">Select architectural joinery category</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TYPOLOGIES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTypology(t.id)}
                  className={`p-6 text-left border transition-all ${
                    typology === t.id ? 'border-[#7A5330] bg-white shadow-md' : 'border-[#D6D1C7] hover:border-gray-400 bg-transparent'
                  }`}
                >
                  <t.icon className={`w-8 h-8 mb-4 ${typology === t.id ? 'text-[#7A5330]' : 'text-gray-400'}`} />
                  <h3 className="font-medium text-lg mb-2">{t.label}</h3>
                  <p className="text-sm text-gray-500 font-mono tracking-wide">BASE: {formatNGN(t.baseRate)} / {t.unit.toUpperCase()}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Dimensional Calibration & Site Zone */}
        {step === 2 && (
          <div className="space-y-12 animate-in fade-in">
            <div className="mb-10">
              <h2 className="text-3xl font-light mb-2">Dimensional Calibration</h2>
              <p className="text-sm text-gray-600 tracking-widest uppercase">Configure scale and logistics</p>
            </div>

            <div className="space-y-6 bg-white p-8 border border-[#D6D1C7]">
              <div>
                <label className="block text-sm tracking-widest uppercase mb-4 text-gray-600">
                  Total {TYPOLOGIES.find(t=>t.id===typology)?.unit}s
                </label>
                <div className="flex items-center gap-6">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={dimension}
                    onChange={(e) => setDimension(parseFloat(e.target.value))}
                    className="w-full accent-[#7A5330]"
                  />
                  <span className="text-2xl font-mono w-20 text-right tabular-nums">{dimension}</span>
                </div>
              </div>

              {typology === 'kitchen' && (
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#D6D1C7]">
                  <label className="flex items-center space-x-3 cursor-pointer p-4 border border-[#D6D1C7] hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={kitchenOptions.countertop}
                      onChange={(e) => setKitchenOptions({...kitchenOptions, countertop: e.target.checked})}
                      className="w-5 h-5 accent-[#7A5330]"
                    />
                    <span className="text-sm tracking-widest uppercase">Add Sintered Stone</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-4 border border-[#D6D1C7] hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={kitchenOptions.island}
                      onChange={(e) => setKitchenOptions({...kitchenOptions, island: e.target.checked})}
                      className="w-5 h-5 accent-[#7A5330]"
                    />
                    <span className="text-sm tracking-widest uppercase">Island Module (+4.5 Sht)</span>
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-6 bg-white p-8 border border-[#D6D1C7]">
              <label className="block text-sm tracking-widest uppercase mb-4 text-gray-600 flex items-center gap-2">
                <MapPin size={16}/> Delivery Zone (Lagos)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ZONES.map(z => (
                  <button
                    key={z.id}
                    onClick={() => setZone(z.id)}
                    className={`p-4 text-left border ${
                      zone === z.id ? 'border-[#7A5330] bg-[#F6F4EF]' : 'border-[#D6D1C7] hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">{z.label}</div>
                    <div className="text-xs text-gray-500">{z.desc}</div>
                  </button>
                ))}
              </div>

              <label className="flex items-center space-x-3 cursor-pointer mt-4 p-4 bg-gray-50 border border-[#D6D1C7]">
                <input
                  type="checkbox"
                  checked={elevated}
                  onChange={(e) => setElevated(e.target.checked)}
                  className="w-5 h-5 accent-[#7A5330]"
                />
                <span className="text-sm">Elevated Access (2nd-10th+ Floor without Service Elevator)</span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: Substrate & Timber Architecture */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="mb-10">
              <h2 className="text-3xl font-light mb-2">Substrate Architecture</h2>
              <p className="text-sm text-gray-600 tracking-widest uppercase">Material specification for Lagos climate</p>
            </div>

            <div className="space-y-4">
              {SUBSTRATES.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSubstrate(s.id)}
                  className={`p-6 border cursor-pointer transition-all flex justify-between items-center ${
                    substrate === s.id ? 'border-[#7A5330] bg-white shadow-md' : 'border-[#D6D1C7] hover:border-gray-400'
                  }`}
                >
                  <div>
                    <h3 className="font-medium text-lg mb-1 flex items-center gap-2">
                      {s.label}
                      {s.id === 2 && <Droplets size={16} className="text-blue-600" />}
                      {s.id === 3 && <ShieldCheck size={16} className="text-amber-700" />}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{s.desc}</p>
                    <span className="text-xs tracking-widest uppercase text-gray-500 border border-gray-300 px-2 py-1">
                      {s.rating}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg">{s.multiplier.toFixed(2)}x</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Multiplier</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Hardware & Integration */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="mb-10">
              <h2 className="text-3xl font-light mb-2">Ironmongery & Illumination</h2>
              <p className="text-sm text-gray-600 tracking-widest uppercase">Mechanisms and lighting integration</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HARDWARE.map(h => (
                <div
                  key={h.id}
                  onClick={() => setHardware(h.id)}
                  className={`p-8 border cursor-pointer transition-all ${
                    hardware === h.id ? 'border-[#7A5330] bg-white shadow-md' : 'border-[#D6D1C7] hover:border-gray-400'
                  }`}
                >
                  <Settings className={`w-8 h-8 mb-4 ${hardware === h.id ? 'text-[#7A5330]' : 'text-gray-400'}`} />
                  <h3 className="font-medium text-lg mb-2">{h.label}</h3>
                  <p className="text-sm text-gray-600 mb-6">{h.desc}</p>

                  <div className="text-sm font-mono bg-gray-50 p-3 border border-gray-200 inline-block">
                    {h.surcharge === 0 ? 'NO SURCHARGE' : `+${h.surcharge * 100}% ON BASE COST`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Tiered Budget Gate */}
        {step === 5 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="mb-10">
              <h2 className="text-3xl font-light mb-2">Budget Validation</h2>
              <p className="text-sm text-gray-600 tracking-widest uppercase">Final specification review</p>
            </div>

            <div className="bg-white p-8 border border-[#D6D1C7]">
              <label className="block text-sm tracking-widest uppercase mb-4 text-gray-600">
                Stated Budget Capacity (Optional)
              </label>
              <div className="flex items-center gap-4 border-b border-[#D6D1C7] pb-2">
                <span className="text-xl">₦</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter budget in NGN"
                  className="w-full text-xl font-mono tabular-nums outline-none bg-transparent"
                />
              </div>

              {budget && Number(budget) < estimate.totalCost && (
                <div className="mt-8 bg-amber-50 p-6 border border-amber-200 flex gap-4 items-start">
                  <Lightbulb className="text-amber-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-amber-900 mb-1">Value-Engineering Recommended</h4>
                    <p className="text-sm text-amber-800 mb-4">
                      Your configured specification exceeds your stated budget. We can optimize materials while maintaining the exact dimensions.
                    </p>
                    <button
                      onClick={applyValueEngineering}
                      className="text-xs tracking-widest uppercase bg-white border border-amber-300 text-amber-900 px-4 py-2 hover:bg-amber-100 flex items-center gap-2"
                    >
                      <Zap size={14} /> Apply Value-Engineering (Target ~{formatNGN(estimate.totalCost * 0.6)})
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-4">
                <button
                  onClick={() => setShowSpecifier(true)}
                  className="w-full bg-[#121211] text-white p-4 uppercase tracking-widest text-sm hover:bg-gray-800 flex justify-center items-center gap-2"
                >
                  <FileText size={16} /> Generate Architectural Specifier & Proceed
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="mt-12 flex justify-between items-center border-t border-[#D6D1C7] pt-6">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className={`uppercase tracking-widest text-sm px-6 py-3 border ${step === 1 ? 'opacity-30 cursor-not-allowed border-transparent' : 'border-[#121211] hover:bg-gray-100'}`}
          >
            Previous
          </button>

          {step < 5 && (
            <button
              onClick={handleNext}
              className="uppercase tracking-widest text-sm px-6 py-3 bg-[#121211] text-white hover:bg-gray-800 flex items-center gap-2"
            >
              Continue <ArrowRight size={16} />
            </button>
          )}
        </div>

      </main>

      {/* Pinned Live Estimation Dock */}
      <div className="fixed bottom-0 w-full bg-white border-t border-[#D6D1C7] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-4 px-6 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="flex-1 w-full">
            <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">Provisional Investment</div>
            <div className="text-3xl font-mono tabular-nums font-light">{formatNGN(estimate.totalCost)}</div>
          </div>

          <div className="flex gap-8 border-l border-[#D6D1C7] pl-8">
            <div>
              <div className="text-[10px] text-gray-500 tracking-widest uppercase flex items-center gap-1 mb-1">
                <Package size={10} /> Board Yield
              </div>
              <div className="font-mono tabular-nums text-sm">{estimate.totalBoards} Sheets</div>
            </div>

            <div>
              <div className="text-[10px] text-gray-500 tracking-widest uppercase flex items-center gap-1 mb-1">
                <Clock size={10} /> Lead Time
              </div>
              <div className="font-mono tabular-nums text-sm">{estimate.leadTime} Weeks</div>
            </div>
          </div>

        </div>
      </div>

      {/* Specifier Modal */}
      {showSpecifier && (
        <div className="fixed inset-0 bg-[#121211]/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#F6F4EF] w-full max-w-4xl h-[90vh] overflow-y-auto border border-[#D6D1C7] flex flex-col md:flex-row">

            {/* BOQ Preview */}
            <div className="flex-1 p-8 border-r border-[#D6D1C7]">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="font-medium tracking-widest uppercase text-lg">Bespoke Specification</h3>
                  <p className="text-sm font-mono text-gray-500 mt-1">REF: WEL-2026-X</p>
                </div>
                <button onClick={() => setShowSpecifier(false)} className="text-gray-500 hover:text-black">✕</button>
              </div>

              <div className="space-y-6">
                <div className="border-b border-dotted border-gray-400 pb-2 flex justify-between">
                  <span className="text-sm">Carcass & Base Subtotal</span>
                  <span className="font-mono tabular-nums">{formatNGN(estimate.baseCost)}</span>
                </div>
                <div className="border-b border-dotted border-gray-400 pb-2 flex justify-between">
                  <span className="text-sm">Timber/Substrate Multiplier ({SUBSTRATES.find(s=>s.id===substrate)?.multiplier}x)</span>
                  <span className="font-mono tabular-nums">{formatNGN(estimate.fabricationCost - estimate.baseCost)}</span>
                </div>
                {estimate.countertopCost > 0 && (
                  <div className="border-b border-dotted border-gray-400 pb-2 flex justify-between">
                    <span className="text-sm">Stone/Countertop Addition</span>
                    <span className="font-mono tabular-nums">{formatNGN(estimate.countertopCost)}</span>
                  </div>
                )}
                {estimate.hardwareCost > 0 && (
                  <div className="border-b border-dotted border-gray-400 pb-2 flex justify-between">
                    <span className="text-sm">Hardware Surcharge (Tier B)</span>
                    <span className="font-mono tabular-nums">{formatNGN(estimate.hardwareCost)}</span>
                  </div>
                )}
                <div className="border-b border-dotted border-gray-400 pb-2 flex justify-between">
                  <span className="text-sm">Haulage & Installation ({ZONES.find(z=>z.id===zone)?.label})</span>
                  <span className="font-mono tabular-nums">{formatNGN(estimate.haulage + estimate.installFee)}</span>
                </div>

                <div className="pt-4 flex justify-between font-medium text-lg">
                  <span>PROVISIONAL TOTAL</span>
                  <span className="font-mono tabular-nums">{formatNGN(estimate.totalCost)}</span>
                </div>
              </div>

              <div className="mt-12 p-4 bg-[#121211] text-white text-xs tracking-widest uppercase">
                Note: Estimate subject to ±10% site-variance upon verifiable laser measurement.
              </div>
            </div>

            {/* WhatsApp Dispatch */}
            <div className="w-full md:w-80 bg-white p-8">
              <h4 className="text-xs tracking-widest uppercase text-gray-500 mb-6 flex items-center gap-2">
                <MessageSquare size={14} /> Dispatch to Sales Desk
              </h4>

              <pre className="bg-gray-50 p-4 text-[10px] font-mono whitespace-pre-wrap border border-gray-200 h-64 overflow-y-auto mb-6 text-gray-700">
                {generateWhatsAppMessage()}
              </pre>

              <button className="w-full bg-[#25D366] text-white py-3 px-4 text-sm font-medium hover:bg-[#1ebd5b] transition-colors flex justify-center items-center gap-2">
                Launch WhatsApp Web
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
