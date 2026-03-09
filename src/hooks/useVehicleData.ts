import { useQuery } from '@tanstack/react-query';
import type { VehicleVersion, VolvoModelData, CompetitorData } from '@/data/comparisonData';

// Raw API response shape
// the backend may return arrays directly or an object with ResultSets.Table1
// field names also differ, so most properties are optional and we include
// legacy names for compatibility.
export interface VehicleApiRecord {
  // primary identifiers
  name?: string;      // prefer name when available
  brand?: string;     // manufacturer name, e.g. "Volvo" or "Mini"
  model?: string;     // full model name (Volvo EX30 Core, etc)
  price?: string;

  // powertrain / spec fields
  motorType?: string;
  engine?: string;    // legacy
  power?: string;
  acceleration?: string;
  intensity?: string; // legacy
  autonomy?: string;
  battery?: string;
  chargingTime?: string;
  time_recharge?: string; // legacy
  trunk?: string;
  os?: string;
  sistem?: string;    // legacy

  // safety/quality
  ncapAdult?: string;
  ncap_adult?: string;
  ncapChildren?: string;
  ncap_child?: string;
  dealerships?: string;
  dealers?: string;
  materials?: string;
  quality_materials?: string;
  resaleValue?: string;
  resale?: string;

  // classification
  flag1?: string;
  comparison?: string;
  flag2?: string;
  segment?: string;

  // Volvo-specific
  volvoModel?: string;

  // other
  id?: number;
}

// Example API URL - replace with your real endpoint
const API_URL = 'https://prod-26.northcentralus.logic.azure.com:443/workflows/2e26fac806ee4191b869476ad427b107/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=kIbyT1chxg5NlApCd7XJdC-34uA4YXjJghPKEGvM8lA&tipo=geral';
// TODO: replace above URL with your real API endpoint or keep in config


async function fetchVehicles(): Promise<VehicleApiRecord[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Falha ao carregar dados dos veículos');
  const json = await res.json();

  // support SQL-Server style payload { ResultSets: { Table1: [...] } }
  if (json && typeof json === 'object' && 'ResultSets' in json) {
    const table = json.ResultSets?.Table1;
    if (Array.isArray(table)) {
      return table as VehicleApiRecord[];
    }
  }

  if (Array.isArray(json)) {
    return json as VehicleApiRecord[];
  }

  // fallback: wrap single object in array
  return [json] as VehicleApiRecord[];
}


// infer the Volvo model (EX30, XC60, etc) from a record
// prefers explicit volvoModel field, otherwise parses from name/model string
function inferVolvoModel(record: VehicleApiRecord): string {
  if (record.volvoModel) return record.volvoModel;
  const rawName = (record.model ?? record.name ?? '').toString();
  const parts = rawName.split(' ');
  if (parts[0].toLowerCase() === 'volvo' && parts.length >= 2) {
    return parts[1];
  }
  // if name/model doesn't help, try using comparison/flag1 if it's not literally 'Volvo'
  const f1 = getFlag1(record).trim();
  if (f1 && f1.toLowerCase() !== 'volvo') {
    return f1;
  }
  return '';
}

// helper to read flags with fallbacks (used by multiple functions)
// exported for testing or external use if needed
export function getFlag1(r: VehicleApiRecord) {
  return (r.flag1 ?? r.comparison ?? '').toString();
}
export function getFlag2(r: VehicleApiRecord) {
  return (r.flag2 ?? r.segment ?? '').toString();
}

function recordToVersion(record: VehicleApiRecord): VehicleVersion {
  // derive name from whichever field is available
  let rawName = record.model ?? record.name ?? '';
  if (!rawName && record.id != null) {
    rawName = `#${record.id}`; // fallback if API didn't provide name/model
  }

  // Extract version name from full name for Volvo records
  const lowerFlag1 = getFlag1(record).toLowerCase();
  const isVolvoName = rawName.toString().toLowerCase().startsWith('volvo ');
  const versionName = (lowerFlag1 === 'volvo' || isVolvoName) && rawName
    ? rawName.replace(new RegExp(`^Volvo\\s+${inferVolvoModel(record)}\\s+`, 'i'), '').trim()
    : rawName;

  // helpers to pick a value from either legacy or new field
  const pick = <T>(...vals: Array<T|undefined>): T|
    '' => vals.find(v => v !== undefined) as T || '';

  return {
    name: versionName,
    price: pick(record.price),
    motorType: pick(record.motorType, record.engine),
    power: pick(record.power),
    acceleration: pick(record.acceleration, record.intensity),
    autonomy: pick(record.autonomy),
    battery: pick(record.battery),
    chargingTime: pick(record.chargingTime, record.time_recharge),
    trunk: pick(record.trunk),
    os: pick(record.os, record.sistem),
    ncapAdult: pick(record.ncapAdult, record.ncap_adult),
    ncapChildren: pick(record.ncapChildren, record.ncap_child),
    dealerships: pick(record.dealerships, record.dealers),
    materials: pick(record.materials, record.quality_materials),
    resaleValue: pick(record.resaleValue, record.resale),
  };
}

function groupByBrandModel(records: VehicleApiRecord[]): CompetitorData[] {
  const groups = new Map<string, VehicleApiRecord[]>();

  for (const r of records) {
    // Try to extract brand (first word) and model (rest) from whichever field exists
    const text = (r.name ?? r.model ?? '').toString();
    const parts = text.split(' ');
    const brand = parts[0] || '';
    const model = parts.slice(1).join(' ');
    const key = `${brand}|||${model}`;

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  return Array.from(groups.entries()).map(([key, recs]) => {
    const [brand, model] = key.split('|||');
    return {
      brand,
      model,
      versions: recs.map(r => ({
        ...recordToVersion(r),
        name: recs.length === 1 ? 'Única' : recordToVersion(r).name,
      })),
    };
  });
}

function transformData(
  records: VehicleApiRecord[],
  filterFlag2: 'Premium' | 'Non Premium'
): VolvoModelData[] {
  // helper to read flags with fallbacks (already defined above)
  // we don't need local definitions here

  // if the brand field is present we can detect Volvo using it directly.
  // older heuristics (commented below) are preserved but not used when brand
  // exists, so we avoid false positives from the `comparison` column.

  // determine whether a record represents a Volvo vehicle. APIs can be
  // inconsistent, so we use layered heuristics:
  //   1. comparison/flag1 exactly "Volvo"
  //   2. missing name/model (common when backend only returns numeric specs)
  //   3. name/model string contains "Volvo"
  //   4. comparison value matches one of the volvo model candidates gathered
  //      from other records (e.g. when backend uses "EX30" instead of "Volvo").
  const isVolvoRecord = (r: VehicleApiRecord) => {
    // brand explicitly provided?
    if (r.brand && r.brand.toString().trim().toLowerCase() === 'volvo') {
      return true;
    }
    const f1 = getFlag1(r).trim().toLowerCase();
    if (f1 === 'volvo') return true;
    // if the record has no explicit model, assume it's a Volvo version
    if (!r.model) return true;
    // also treat any record whose model string contains "Volvo" as Volvo
    const rawName = (r.model ?? r.name ?? '').toString().toLowerCase();
    if (rawName.includes('volvo')) return true;
    return false;
  };

  // helper to infer volvo model name from record
  const inferVolvoModel = (r: VehicleApiRecord): string => {
    if (r.volvoModel) return r.volvoModel;
    const rawName = (r.name ?? r.model ?? '').toString();
    const parts = rawName.split(' ');
    if (parts[0].toLowerCase() === 'volvo' && parts.length >= 2) {
      return parts[1];
    }
    return '';
  };

  // Get unique Volvo models (names like EX30, XC60, etc)
  const volvoRecords = records.filter(isVolvoRecord);
  const volvoModelNames = [...new Set(volvoRecords.map(inferVolvoModel).filter(Boolean))];

  return volvoModelNames.map(modelName => {
    // Volvo versions for this model
    const volvoVersionRecords = volvoRecords.filter(r => inferVolvoModel(r) === modelName);

    // Competitors: records where flag1 contains this modelName and flag2 matches
    const competitorRecords = records.filter(r => {
      if (isVolvoRecord(r)) return false;
      const f1 = getFlag1(r);
      const targets = f1.split(' | ').map(s => s.trim());
      return targets.includes(modelName) && getFlag2(r) === filterFlag2;
    });

    return {
      model: modelName,
      versions: volvoVersionRecords.map(recordToVersion),
      competitors: groupByBrandModel(competitorRecords),
    };
  }).filter(m => m.competitors.length > 0); // Only include models that have competitors for this flag2
}

export function useVehicleData(type: 'Premium' | 'Non Premium') {
  return useQuery({
    queryKey: ['vehicles', type],
    queryFn: fetchVehicles,
    select: (data) => transformData(data, type),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// helpers exported for testing/utility
export type { VehicleApiRecord };
export { fetchVehicles, transformData };
