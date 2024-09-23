const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Define the columns you want to read
const columnsToRead = [
  'STATE_CODE_001',
  'FACILITY_CARRIED_007',
  'LAT_016',
  'LONG_017',
  'COUNTY_CODE_003',
  'DECK_COND_058',
  'SUPERSTRUCTURE_COND_059',
  'SUBSTRUCTURE_COND_060',
  'CULVERT_COND_062',
  'YEAR_BUILT_027',
  'YEAR_RECONSTRUCTED_106',
  'ADT_029',
  'TRAFFIC_LANES_ON_028A',
  'TRAFFIC_LANES_UND_028B',
  'PERCENT_ADT_TRUCK_109',
  'SCOUR_CRITICAL_113',
  'BRIDGE_IMP_COST_094',
  'ROADWAY_IMP_COST_095',
  'TOTAL_IMP_COST_096',
  'FUNCTIONAL_CLASS_026',
];

// Define a class to hold bridge data
class Bridge {
  constructor(data, id) {
    this.id = id; // Add ID property
    this.stateCode = data['STATE_CODE_001'];
    this.facilityCarried = data['FACILITY_CARRIED_007'];
    this.latitude = parseFloat(data['LAT_016']);
    this.longitude = parseFloat(data['LONG_017']);
    this.countyCode = data['COUNTY_CODE_003'];
    this.deckCondition = data['DECK_COND_058'];
    this.superstructureCondition = data['SUPERSTRUCTURE_COND_059'];
    this.substructureCondition = data['SUBSTRUCTURE_COND_060'];
    this.culvertCondition = data['CULVERT_COND_062'];
    this.yearBuilt = parseInt(data['YEAR_BUILT_027'], 10);
    this.yearReconstructed = parseInt(data['YEAR_RECONSTRUCTED_106'], 10);
    this.adt = parseInt(data['ADT_029'], 10);
    this.trafficLanesOn = parseInt(data['TRAFFIC_LANES_ON_028A'], 10);
    this.trafficLanesUnd = parseInt(data['TRAFFIC_LANES_UND_028B'], 10);
    this.percentAdtTruck = parseFloat(data['PERCENT_ADT_TRUCK_109']);
    this.scourCritical = data['SCOUR_CRITICAL_113'];
    this.bridgeImpCost = parseFloat(data['BRIDGE_IMP_COST_094']);
    this.roadwayImpCost = parseFloat(data['ROADWAY_IMP_COST_095']);
    this.totalImpCost = parseFloat(data['TOTAL_IMP_COST_096']);
    this.functionalClassificationCode = parseFloat(
      data['FUNCTIONAL_CLASS_026']
    );
  }
}

// Array to store bridge data objects
const bridges = [];

// Read and process the CSV file
fs.createReadStream(path.join(__dirname, './PA22.csv'))
  .pipe(csv())
  .on('data', (row) => {
    // Filter and map the data to Bridge objects
    const filteredData = columnsToRead.reduce((acc, column) => {
      if (row[column]) {
        acc[column] = row[column];
      }
      return acc;
    }, {});

    // Generate a unique ID (e.g., starting from 100000)
    const id = 100000 + bridges.length;
    bridges.push(new Bridge(filteredData, id));
  })
  .on('end', () => {
    console.log(`Parsed ${bridges.length} bridges.`);

    // Convert the array of bridge objects to a JavaScript module
    const jsData = `export default ${JSON.stringify(bridges, null, 2)};`;

    // Write the JavaScript data to a file
    fs.writeFileSync(
      path.join(__dirname, '../api/src/data/rawBridges.ts'),
      jsData,
      'utf8'
    );
    console.log('Data has been written to rawBridges.ts');
  });
