import {
  fetchVehicles,
  transformData,
} from '../src/hooks/useVehicleData.ts';

// type VehicleApiRecord imported only for TS inference below
import type { VehicleApiRecord } from '../src/hooks/useVehicleData.ts';

// The hooks file is using ES modules; we'll use ts-node to run this test or compile first.

async function run() {
  // fake the fetch call by monkey-patching global.fetch
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      ResultSets: {
        Table1: [
          // Volvo entries include brand and model now
          {
            id: 1,
            brand: 'Volvo',
            model: 'Volvo EX30 Core',
            engine: 'BEV',
            power: '272',
            intensity: '5,7',
            autonomy: '250',
            battery: '51',
            time_recharge: '26',
            trunk: '318',
            sistem: 'Google',
            ncap_adult: '88%',
            ncap_child: '85%',
            dealers: '52',
            quality_materials: 'Premium Escandinavo',
            resale: '65-70%',
            comparison: 'EX30',
            segment: 'Premium',
          },
          {
            id: 2,
            brand: 'Volvo',
            model: 'Volvo EX30 Plus',
            engine: 'BEV',
            power: '272',
            intensity: '5,3',
            autonomy: '338',
            battery: '69',
            time_recharge: '28',
            trunk: '318',
            sistem: 'Google',
            ncap_adult: '88%',
            ncap_child: '85%',
            dealers: '52',
            quality_materials: 'Premium Escandinavo',
            resale: '65-70%',
            comparison: 'EX30',
            segment: 'Premium',
          },
          {
            id: 3,
            brand: 'Volvo',
            model: 'Volvo EX30 Ultra',
            engine: 'BEV AWD',
            power: '428',
            intensity: '3,6',
            autonomy: '310',
            battery: '69',
            time_recharge: '26',
            trunk: '318',
            sistem: 'Google',
            ncap_adult: '88%',
            ncap_child: '85%',
            dealers: '52',
            quality_materials: 'Premium Escandinavo',
            resale: '65-70%',
            comparison: 'EX30',
            segment: 'Premium',
          },
          // competitor record for EX30
          {
            id: 4,
            brand: 'Mini',
            model: 'Mini Aceman E',
            price: '254.990',
            engine: 'BEV',
            power: '184',
            intensity: '9,0',
            autonomy: '270',
            battery: '49,2',
            time_recharge: '30',
            trunk: '300',
            sistem: 'Mini OS',
            ncap_adult: '83%',
            ncap_child: '80%',
            dealers: '50',
            quality_materials: 'Premium Britânico',
            resale: '55-65%',
            comparison: 'EX30',
            segment: 'Premium',
          },
        ],
      },
    }),
  } as any);

  const records: VehicleApiRecord[] = await fetchVehicles();
  console.log('records raw', records);
  const volvoModels = transformData(records, 'Premium');
  console.log(JSON.stringify(volvoModels, null, 2));
}

run().catch(console.error);
