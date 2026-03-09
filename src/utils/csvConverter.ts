/**
 * Converter de dados CSV para formato de API esperado
 * 
 * Colunas de entrada:
 * model | price | engine | power | intensity | autonomy | battery | time_recharge | trunk | sistem | ncap_adult | ncap_child | dealers | quality_materials | resale | comparison | segment
 * 
 * Formato de saída compatível com useVehicleData hook
 */

interface CSVRecord {
  model: string;
  price: string;
  engine: string;
  power: string;
  intensity: string;
  autonomy: string;
  battery: string;
  time_recharge: string;
  trunk: string;
  sistem: string;
  ncap_adult: string;
  ncap_child: string;
  dealers: string;
  quality_materials: string;
  resale: string;
  comparison: string;
  segment: string;
}

interface APIRecord {
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
  flag1: string;
  flag2: string;
  volvoModel?: string;
}

/**
 * Converte um record CSV para formato de API
 * @param record Record do CSV
 * @returns Record formatado para API
 */
export function convertCSVToAPI(record: CSVRecord): APIRecord {
  // Determinar flag1 e volvoModel
  let flag1: string;
  let volvoModel: string | undefined;

  if (record.comparison === 'Volvo') {
    flag1 = 'Volvo';
    // Extrair modelo Volvo do nome (ex: "Volvo EX30 Core" -> "EX30")
    const parts = record.model.split(' ');
    if (parts[0] === 'Volvo' && parts.length >= 2) {
      volvoModel = parts[1];
    }
  } else {
    // comparison contém o modelo Volvo contra o qual compete (ex: "EX30")
    flag1 = record.comparison;
  }

  const apiRecord: APIRecord = {
    name: record.model,
    price: record.price.trim(),
    motorType: record.engine.trim(),
    power: record.power.trim(),
    acceleration: record.intensity.trim(),
    autonomy: record.autonomy.trim(),
    battery: record.battery.trim(),
    chargingTime: record.time_recharge.trim(),
    trunk: record.trunk.trim(),
    os: record.sistem.trim(),
    ncapAdult: record.ncap_adult.trim(),
    ncapChildren: record.ncap_child.trim(),
    dealerships: record.dealers.trim(),
    materials: record.quality_materials.trim(),
    resaleValue: record.resale.trim(),
    flag1,
    flag2: record.segment.includes('Premium') ? 'Premium' : 'Non Premium',
  };

  if (volvoModel) {
    apiRecord.volvoModel = volvoModel;
  }

  return apiRecord;
}

/**
 * Exemplo de uso:
 * 
 * const csvData: CSVRecord = {
 *   model: 'Volvo EX30 Core',
 *   price: '229.950',
 *   engine: 'BEV',
 *   power: '272',
 *   intensity: '5,7',
 *   autonomy: '250',
 *   battery: '51',
 *   time_recharge: '26',
 *   trunk: '318',
 *   sistem: 'Google',
 *   ncap_adult: '88%',
 *   ncap_child: '85%',
 *   dealers: '52',
 *   quality_materials: 'Premium Escandinavo',
 *   resale: '65-70%',
 *   comparison: 'Volvo',
 *   segment: 'Premium'
 * };
 * 
 * const apiRecord = convertCSVToAPI(csvData);
 * console.log(JSON.stringify(apiRecord, null, 2));
 */
