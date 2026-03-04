import { useQuery } from '@tanstack/react-query';
import type { VehicleVersion, VolvoModelData, CompetitorData } from '@/data/comparisonData';

// Raw API response shape
export interface VehicleApiRecord {
  name: string;
  price: string;
  motorType: string;
  power: string;
  acceleration: string;
  autonomy: string;
  battery: string;
  chargingTime: string;
  trunk: string;
  os: string;
  ncapAdult: string;
  ncapChildren: string;
  dealerships: string;
  materials: string;
  resaleValue: string;
  flag1: string; // "Volvo" for Volvo vehicles, or the Volvo model it competes against (e.g. "EX30", "EC40 | EX40")
  flag2: string; // "Premium" or "Non Premium"
  volvoModel?: string; // Only for Volvo vehicles - which model line (EX30, EC40, XC60, etc.)
}

// Example API URL - replace with your real endpoint
const API_URL = '/api/vehicles.json';

async function fetchVehicles(): Promise<VehicleApiRecord[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Falha ao carregar dados dos veículos');
  return res.json();
}

function recordToVersion(record: VehicleApiRecord): VehicleVersion {
  // Extract version name from full name
  // For Volvo: "Volvo EX30 Core" -> "Core"
  // For competitors: use full name as version name
  const name = record.flag1 === 'Volvo'
    ? record.name.replace(`Volvo ${record.volvoModel} `, '')
    : record.name;

  return {
    name,
    price: `R$ ${record.price}`,
    motorType: record.motorType,
    power: record.power,
    acceleration: record.acceleration,
    autonomy: record.autonomy,
    battery: record.battery,
    chargingTime: record.chargingTime,
    trunk: record.trunk,
    os: record.os,
    ncapAdult: record.ncapAdult,
    ncapChildren: record.ncapChildren,
    dealerships: record.dealerships,
    materials: record.materials,
    resaleValue: record.resaleValue,
  };
}

function groupByBrandModel(records: VehicleApiRecord[]): CompetitorData[] {
  const groups = new Map<string, VehicleApiRecord[]>();

  for (const r of records) {
    // Try to extract brand (first word) and model (rest)
    const parts = r.name.split(' ');
    const brand = parts[0];
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
  // Get unique Volvo models
  const volvoRecords = records.filter(r => r.flag1 === 'Volvo');
  const volvoModelNames = [...new Set(volvoRecords.map(r => r.volvoModel!))];

  return volvoModelNames.map(modelName => {
    // Volvo versions for this model
    const volvoVersionRecords = volvoRecords.filter(r => r.volvoModel === modelName);

    // Competitors: records where flag1 contains this modelName and flag2 matches
    const competitorRecords = records.filter(r => {
      if (r.flag1 === 'Volvo') return false;
      const targets = r.flag1.split(' | ').map(s => s.trim());
      return targets.includes(modelName) && r.flag2 === filterFlag2;
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
