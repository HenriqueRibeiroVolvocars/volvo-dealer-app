#!/usr/bin/env node

/**
 * Script para converter dados CSV para formato JSON da API
 * 
 * Uso:
 *   node scripts/convertCsvToJson.js input.csv output.json
 * 
 * O arquivo CSV deve ter as seguintes colunas (separadas por tab ou vírgula):
 *   model | price | engine | power | intensity | autonomy | battery | time_recharge | trunk | sistem | ncap_adult | ncap_child | dealers | quality_materials | resale | comparison | segment
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Tipos
/**
 * @typedef {Object} CSVRecord
 * @property {string} model
 * @property {string} price
 * @property {string} engine
 * @property {string} power
 * @property {string} intensity
 * @property {string} autonomy
 * @property {string} battery
 * @property {string} time_recharge
 * @property {string} trunk
 * @property {string} sistem
 * @property {string} ncap_adult
 * @property {string} ncap_child
 * @property {string} dealers
 * @property {string} quality_materials
 * @property {string} resale
 * @property {string} comparison
 * @property {string} segment
 */

/**
 * @typedef {Object} APIRecord
 * @property {string} name
 * @property {string} price
 * @property {string} motorType
 * @property {string} power
 * @property {string} acceleration
 * @property {string} autonomy
 * @property {string} battery
 * @property {string} chargingTime
 * @property {string} trunk
 * @property {string} os
 * @property {string} ncapAdult
 * @property {string} ncapChildren
 * @property {string} dealerships
 * @property {string} materials
 * @property {string} resaleValue
 * @property {string} flag1
 * @property {string} flag2
 * @property {string} [volvoModel]
 */

/**
 * Converte um record CSV para formato de API
 * @param {CSVRecord} record
 * @returns {APIRecord}
 */
function convertCSVToAPI(record) {
  let flag1;
  let volvoModel;

  if (record.comparison === 'Volvo') {
    flag1 = 'Volvo';
    const parts = record.model.split(' ');
    if (parts[0] === 'Volvo' && parts.length >= 2) {
      volvoModel = parts[1];
    }
  } else {
    flag1 = record.comparison;
  }

  const apiRecord = {
    name: record.model.trim(),
    price: record.price.trim().replace(/[R$\s]/g, ''),
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
 * Parse CSV string para array de records
 * @param {string} csvContent
 * @returns {CSVRecord[]}
 */
function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  // Primeiro, tentar detectar o delimitador (tab ou vírgula)
  const headerLine = lines[0];
  const delimiter = headerLine.includes('\t') ? '\t' : ',';
  
  const headers = headerLine.split(delimiter).map(h => h.trim());
  
  // Mapear índices das colunas
  const columnMap = {
    model: headers.indexOf('model'),
    price: headers.indexOf('price'),
    engine: headers.indexOf('engine'),
    power: headers.indexOf('power'),
    intensity: headers.indexOf('intensity'),
    autonomy: headers.indexOf('autonomy'),
    battery: headers.indexOf('battery'),
    time_recharge: headers.indexOf('time_recharge'),
    trunk: headers.indexOf('trunk'),
    sistem: headers.indexOf('sistem'),
    ncap_adult: headers.indexOf('ncap_adult'),
    ncap_child: headers.indexOf('ncap_child'),
    dealers: headers.indexOf('dealers'),
    quality_materials: headers.indexOf('quality_materials'),
    resale: headers.indexOf('resale'),
    comparison: headers.indexOf('comparison'),
    segment: headers.indexOf('segment'),
  };

  // Validar que todas as colunas foram encontradas
  for (const [col, idx] of Object.entries(columnMap)) {
    if (idx === -1) {
      throw new Error(`Coluna '${col}' não encontrada no CSV`);
    }
  }

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(delimiter).map(p => p.trim());
    
    if (parts.length > 1) {
      records.push({
        model: parts[columnMap.model],
        price: parts[columnMap.price],
        engine: parts[columnMap.engine],
        power: parts[columnMap.power],
        intensity: parts[columnMap.intensity],
        autonomy: parts[columnMap.autonomy],
        battery: parts[columnMap.battery],
        time_recharge: parts[columnMap.time_recharge],
        trunk: parts[columnMap.trunk],
        sistem: parts[columnMap.sistem],
        ncap_adult: parts[columnMap.ncap_adult],
        ncap_child: parts[columnMap.ncap_child],
        dealers: parts[columnMap.dealers],
        quality_materials: parts[columnMap.quality_materials],
        resale: parts[columnMap.resale],
        comparison: parts[columnMap.comparison],
        segment: parts[columnMap.segment],
      });
    }
  }

  return records;
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Uso: node convertCsvToJson.js <input.csv> <output.json>');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1];

  try {
    // Ler arquivo CSV
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Arquivo de entrada não encontrado: ${inputFile}`);
    }

    const csvContent = fs.readFileSync(inputFile, 'utf-8');
    console.log(`✓ CSV lido: ${inputFile}`);

    // Parse CSV
    const records = parseCSV(csvContent);
    console.log(`✓ ${records.length} registros parseados`);

    // Converter para formato API
    const apiRecords = records.map(convertCSVToAPI);
    console.log(`✓ Registros convertidos para formato API`);

    // Salvar JSON
    fs.writeFileSync(outputFile, JSON.stringify(apiRecords, null, 2));
    console.log(`✓ JSON salvo: ${outputFile}`);

    console.log(`\n✅ Conversão concluída com sucesso!`);
    console.log(`   Total de veículos: ${apiRecords.length}`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
