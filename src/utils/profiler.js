import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import _ from 'lodash';

/**
 * Profiles a dataset and returns a structured summary.
 * Supports CSV, JSON, and Excel.
 */
export async function profileDataset(file) {
  const data = await parseFile(file);
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);
  const rowCount = data.length;
  const profile = {
    fileName: file.name,
    shape: { rows: rowCount, cols: columns.length },
    columns: [],
  };

  columns.forEach(col => {
    const values = data.map(d => d[col]).filter(v => v !== undefined && v !== null && v !== '');
    const missingCount = rowCount - values.length;
    const distinctValues = new Set(values);
    const cardinality = distinctValues.size;

    // Type detection
    let type = 'string';
    const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v));
    
    if (numericValues.length > values.length * 0.8) {
      type = 'numeric';
    } else if (values.some(v => !isNaN(Date.parse(v)) && String(v).length > 5)) {
      type = 'datetime';
    } else if (cardinality < Math.min(rowCount * 0.05, 20)) {
      type = 'categorical';
    }

    const colInfo = {
      name: col,
      type,
      missing: missingCount,
      missingPct: ((missingCount / rowCount) * 100).toFixed(1),
      unique: cardinality,
    };

    if (type === 'numeric' && numericValues.length > 0) {
      colInfo.stats = {
        min: _.min(numericValues),
        max: _.max(numericValues),
        mean: _.mean(numericValues).toFixed(2),
        skew: calculateSkew(numericValues).toFixed(3),
      };
    }

    profile.columns.push(colInfo);
  });

  profile.guessedType = guessOverallType(profile);
  return profile;
}

function guessOverallType(profile) {
  const cols = profile.columns;
  if (cols.some(c => c.type === 'datetime')) return 'timeseries';
  
  const textCols = cols.filter(c => c.type === 'string' && c.unique > 100);
  if (textCols.length > 0) return 'text';
  
  return 'tabular';
}

/**
 * Parses file into JSON array of objects
 */
async function parseFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();

  return new Promise((resolve, reject) => {
    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: reject
      });
    } else if (extension === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          resolve(Array.isArray(json) ? json : [json]);
        } catch (err) { reject(err); }
      };
      reader.readAsText(file);
    } else if (['xlsx', 'xls'].includes(extension)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target.result, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        resolve(XLSX.utils.sheet_to_json(ws));
      };
      reader.readAsBinaryString(file);
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
}

function calculateSkew(vals) {
  if (vals.length < 3) return 0;
  const n = vals.length;
  const mean = _.mean(vals);
  const std = Math.sqrt(_.sum(vals.map(v => Math.pow(v - mean, 2))) / (n - 1));
  if (std === 0) return 0;
  const m3 = _.sum(vals.map(v => Math.pow(v - mean, 3))) / n;
  return m3 / Math.pow(std, 3);
}

/**
 * Converts profile object to a concise string for AI context
 */
export function profileToContextString(profile) {
  if (!profile) return '';

  let str = `DATASET CONTEXT:\nFile: ${profile.fileName}\nShape: ${profile.shape.rows} rows x ${profile.shape.cols} columns\n\nColumns:\n`;
  
  profile.columns.forEach(c => {
    str += `- ${c.name} (${c.type}): ${c.missingPct}% missing, ${c.unique} unique vals`;
    if (c.stats) {
      str += `. Range: [${c.stats.min}, ${c.stats.max}], Mean: ${c.stats.mean}, Skew: ${c.stats.skew}`;
    }
    str += '\n';
  });

  return str;
}
