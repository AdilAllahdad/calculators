'use client'
import React, { useState, useEffect } from 'react'

const sectionClass =
  "bg-white rounded-xl shadow p-6 mb-4 border border-gray-100";
const labelClass =
  "block text-sm font-medium text-gray-700 mb-1";
const inputClass =
  "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-base font-mono";
const inputErrorClass =
  "border-red-500 ring-2 ring-red-200";
const rowClass = "mb-4";
const rowFlexClass = "flex items-center gap-2";

// Validation ranges for each element
const limits = {
  c: { min: 0, max: 2, label: "Carbon content must be between 0-2%." },
  mn: { min: 0, max: 14, label: "Manganese content must be between 0-14%." },
  si: { min: 0, max: 0.6, label: "Silicon content must be between 0-0.6%." },
  cr: { min: 0, max: 27, label: "Chromium content must be between 0-27%." },
  mo: { min: 0, max: 1, label: "Molybdenum content must be between 0-1%." },
  v: { min: 0, max: 0.5, label: "Vanadium content must be between 0-0.5%." },
  cu: { min: 0, max: 2, label: "Copper content must be between 0-2%." },
  ni: { min: 0, max: 10, label: "Nickel content must be between 0-10%." },
  b: { min: 0, max: 0.003, label: "Boron content must be between 0-0.003%." }
};

const validate = (val: string, min: number, max: number) => {
  if (val === '') return false;
  const num = Number(val);
  return isNaN(num) || num < min || num > max;
};

const weldabilityRating = (ceIIW: number) => {
  if (ceIIW <= 0.35) return "Excellent";
  if (ceIIW <= 0.40) return "Very good";
  if (ceIIW <= 0.45) return "Good";
  if (ceIIW <= 0.50) return "Fair";
  return "Poor";
};

const page = () => {
  // Alloy composition states
  const [c, setC] = useState('');
  const [mn, setMn] = useState('');
  const [si, setSi] = useState('');
  const [cr, setCr] = useState('');
  const [mo, setMo] = useState('');
  const [v, setV] = useState('');
  const [cu, setCu] = useState('');
  const [ni, setNi] = useState('');
  const [b, setB] = useState('');

  // Carbon equivalent states (auto-calculated)
  const [ceAws, setCeAws] = useState('');
  const [ceIiw, setCeIiw] = useState('');
  const [ceJwes, setCeJwes] = useState('');
  const [critical, setCritical] = useState('');
  const [weldability, setWeldability] = useState('');

  // Helper: parse or 0
  const num = (val: string) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  // Auto-calculate all carbon equivalents
  useEffect(() => {
    // If any field is blank, treat as 0
    const C = num(c);
    const Mn = num(mn);
    const Si = num(si);
    const Cr = num(cr);
    const Mo = num(mo);
    const V = num(v);
    const Cu = num(cu);
    const Ni = num(ni);
    const B = num(b);

    // If any input is invalid, do not calculate
    if (
      validate(c, limits.c.min, limits.c.max) ||
      validate(mn, limits.mn.min, limits.mn.max) ||
      validate(si, limits.si.min, limits.si.max) ||
      validate(cr, limits.cr.min, limits.cr.max) ||
      validate(mo, limits.mo.min, limits.mo.max) ||
      validate(v, limits.v.min, limits.v.max) ||
      validate(cu, limits.cu.min, limits.cu.max) ||
      validate(ni, limits.ni.min, limits.ni.max) ||
      validate(b, limits.b.min, limits.b.max)
    ) {
      setCeAws('');
      setCeIiw('');
      setCeJwes('');
      setCritical('');
      setWeldability('');
      return;
    }

    // CE (AWS): C + (Mn + Si)/6 + (Cr + Mo + V)/5 + (Cu + Ni)/15
    const ce_aws = C + (Mn + Si) / 6 + (Cr + Mo + V) / 5 + (Cu + Ni) / 15;
    setCeAws(ce_aws ? ce_aws.toFixed(4) : '');

    // CE (IIW): C + Mn/6 + (Cr + Mo + V)/5 + (Cu + Ni)/15
    const ce_iiw = C + Mn / 6 + (Cr + Mo + V) / 5 + (Cu + Ni) / 15;
    setCeIiw(ce_iiw ? ce_iiw.toFixed(4) : '');

    // CE (JWES): C + Si/24 + Mn/6 + Ni/40 + Cr/5 + Mo/4 + V/14
    const ce_jwes = C + Si / 24 + Mn / 6 + Ni / 40 + Cr / 5 + Mo / 4 + V / 14;
    setCeJwes(ce_jwes ? ce_jwes.toFixed(4) : '');

    // Pcm: C + Si/30 + (Mn + Cu + Cr)/20 + Ni/60 + Mo/15 + V/10 + 5*B
    const pcm = C + Si / 30 + (Mn + Cu + Cr) / 20 + Ni / 60 + Mo / 15 + V / 10 + 5 * B;
    setCritical(pcm ? pcm.toFixed(4) : '');

    // Weldability rating (for IIW)
    setWeldability(ce_iiw ? weldabilityRating(ce_iiw) : '');
  }, [c, mn, si, cr, mo, v, cu, ni, b]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#f8fafd] py-8">
      <h1 className="text-2xl font-bold mb-8 text-center capitalize">carbon equivalent calculator</h1>
      <div className="w-full max-w-md">
        {/* Alloy composition */}
        <div className={sectionClass}>
          <div className="font-semibold text-base mb-4">Alloy composition of steel by weight %</div>
          {/* Carbon */}
          <div className={rowClass}>
            <label className={labelClass}>Carbon (C)</label>
            <div className={rowFlexClass}>
              <input
                className={inputClass + (validate(c, limits.c.min, limits.c.max) ? ` ${inputErrorClass}` : '')}
                value={c}
                onChange={e => setC(e.target.value.replace(/[^0-9.]/g, ''))}
              />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
            {validate(c, limits.c.min, limits.c.max) && (
              <div className="text-red-500 text-xs mt-1">{limits.c.label}</div>
            )}
          </div>
          {/* Manganese */}
          <div className={rowClass}>
            <label className={labelClass}>Manganese (Mn)</label>
            <div className={rowFlexClass}>
              <input
                className={inputClass + (validate(mn, limits.mn.min, limits.mn.max) ? ` ${inputErrorClass}` : '')}
                value={mn}
                onChange={e => setMn(e.target.value.replace(/[^0-9.]/g, ''))}
              />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
            {validate(mn, limits.mn.min, limits.mn.max) && (
              <div className="text-red-500 text-xs mt-1">{limits.mn.label}</div>
            )}
          </div>
          {/* Silicon */}
          <div className={rowClass}>
            <label className={labelClass}>Silicon (Si)</label>
            <div className={rowFlexClass}>
              <input
                className={inputClass + (validate(si, limits.si.min, limits.si.max) ? ` ${inputErrorClass}` : '')}
                value={si}
                onChange={e => setSi(e.target.value.replace(/[^0-9.]/g, ''))}
              />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
            {validate(si, limits.si.min, limits.si.max) && (
              <div className="text-red-500 text-xs mt-1">{limits.si.label}</div>
            )}
          </div>
          {/* Chromium */}
          <div className={rowClass}>
            <label className={labelClass}>Chromium (Cr)</label>
            <div className={rowFlexClass}>
              <input
                className={inputClass + (validate(cr, limits.cr.min, limits.cr.max) ? ` ${inputErrorClass}` : '')}
                value={cr}
                onChange={e => setCr(e.target.value.replace(/[^0-9.]/g, ''))}
              />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
            {validate(cr, limits.cr.min, limits.cr.max) && (
              <div className="text-red-500 text-xs mt-1">{limits.cr.label}</div>
            )}
          </div>
          {/* Molybdenum */}
          <div className={rowClass}>
            <label className={labelClass}>Molybdenum (Mo)</label>
            <div className={rowFlexClass}>
              <input
                className={inputClass + (validate(mo, limits.mo.min, limits.mo.max) ? ` ${inputErrorClass}` : '')}
                value={mo}
                onChange={e => setMo(e.target.value.replace(/[^0-9.]/g, ''))}
              />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
            {validate(mo, limits.mo.min, limits.mo.max) && (
              <div className="text-red-500 text-xs mt-1">{limits.mo.label}</div>
            )}
          </div>
          {/* Vanadium */}
          <div className={rowClass}>
            <label className={labelClass}>Vanadium (V)</label>
            <div className={rowFlexClass}>
              <input
                className={inputClass + (validate(v, limits.v.min, limits.v.max) ? ` ${inputErrorClass}` : '')}
                value={v}
                onChange={e => setV(e.target.value.replace(/[^0-9.]/g, ''))}
              />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
            {validate(v, limits.v.min, limits.v.max) && (
              <div className="text-red-500 text-xs mt-1">{limits.v.label}</div>
            )}
          </div>
          {/* Copper */}
          <div className={rowClass}>
            <label className={labelClass}>Copper (Cu)</label>
            <div className={rowFlexClass}>
              <input
                className={inputClass + (validate(cu, limits.cu.min, limits.cu.max) ? ` ${inputErrorClass}` : '')}
                value={cu}
                onChange={e => setCu(e.target.value.replace(/[^0-9.]/g, ''))}
              />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
            {validate(cu, limits.cu.min, limits.cu.max) && (
              <div className="text-red-500 text-xs mt-1">{limits.cu.label}</div>
            )}
          </div>
          {/* Nickel */}
          <div className={rowClass}>
            <label className={labelClass}>Nickel (Ni)</label>
            <div className={rowFlexClass}>
              <input
                className={inputClass + (validate(ni, limits.ni.min, limits.ni.max) ? ` ${inputErrorClass}` : '')}
                value={ni}
                onChange={e => setNi(e.target.value.replace(/[^0-9.]/g, ''))}
              />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
            {validate(ni, limits.ni.min, limits.ni.max) && (
              <div className="text-red-500 text-xs mt-1">{limits.ni.label}</div>
            )}
          </div>
          {/* Boron */}
          <div className={rowClass}>
            <label className={labelClass}>Boron (B)</label>
            <div className={rowFlexClass}>
              <input
                className={inputClass + (validate(b, limits.b.min, limits.b.max) ? ` ${inputErrorClass}` : '')}
                value={b}
                onChange={e => setB(e.target.value.replace(/[^0-9.]/g, ''))}
              />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
            {validate(b, limits.b.min, limits.b.max) && (
              <div className="text-red-500 text-xs mt-1">{limits.b.label}</div>
            )}
          </div>
        </div>
        {/* Carbon equivalent */}
        <div className={sectionClass}>
          <div className="font-semibold text-base mb-4">Carbon equivalent of steel by weight %</div>
          <div className={rowClass}>
            <label className={labelClass}>CE (AWS)</label>
            <div className={rowFlexClass}>
              <input className={inputClass} value={ceAws} readOnly />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
          </div>
          <div className={rowClass}>
            <label className={labelClass}>CE (IIW)</label>
            <div className={rowFlexClass}>
              <input className={inputClass} value={ceIiw} readOnly />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
            {ceIiw && (
              <div className="text-blue-600 text-xs mt-1">
                Weldability: <span className="font-semibold">{weldability}</span>
              </div>
            )}
          </div>
          <div className={rowClass}>
            <label className={labelClass}>CE (JWES)</label>
            <div className={rowFlexClass}>
              <input className={inputClass} value={ceJwes} readOnly />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
          </div>
          <div className={rowClass}>
            <label className={labelClass}>Critical metal parameter (P<sub>cm</sub>)</label>
            <div className={rowFlexClass}>
              <input className={inputClass} value={critical} readOnly />
              <span className="text-gray-400 text-base font-mono">%</span>
            </div>
          </div>
          {/* Clear button */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
              onClick={() => {
                setC('');
                setMn('');
                setSi('');
                setCr('');
                setMo('');
                setV('');
                setCu('');
                setNi('');
                setB('');
                setCeAws('');
                setCeIiw('');
                setCeJwes('');
                setCritical('');
                setWeldability('');
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
