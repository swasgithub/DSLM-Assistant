import { C } from '../styles/theme';

export const TASK_TYPES = [
  {
    id: 'regression',
    label: 'Predict House Prices',
    icon: '🏠',
    color: C.accent,
    keywords: ['predict', 'price', 'forecast', 'regress', 'continuous',
               'revenue', 'sales', 'estimate', 'value', 'cost', 'house', 'salary'],
  },
  {
    id: 'classification',
    label: 'Classify Churn',
    icon: '👥',
    color: C.green,
    keywords: ['classif', 'spam', 'churn', 'binary', 'label', 'diagnose',
               'detect', 'categor', 'sentiment', 'email', 'disease'],
  },
  {
    id: 'clustering',
    label: 'User Segments',
    icon: '🔍',
    color: C.purple,
    keywords: ['cluster', 'group', 'segment', 'similar', 'unsupervised',
               'k-means', 'partition', 'customer segment'],
  },
  {
    id: 'timeseries',
    label: 'Forecast Sales',
    icon: '📈',
    color: C.amber,
    keywords: ['time series', 'time-series', 'timeseries', 'temporal',
               'seasonality', 'trend', 'monthly', 'daily', 'weekly',
               'prophet', 'arima', 'quarter', 'next month'],
  },
  {
    id: 'anomaly',
    label: 'Detect Anomalies',
    icon: '🛑',
    color: C.coral,
    keywords: ['anomaly', 'outlier', 'fraud', 'unusual', 'abnormal',
               'intrusion', 'novelty', 'log', 'server'],
  },
  {
    id: 'image',
    label: 'Image Recognition',
    icon: '🖼️',
    color: C.green,
    keywords: ['image', 'vision', 'photo', 'cnn', 'ocr', 'object detection',
               'segmentation', 'pixel', 'resnet', 'efficientnet'],
  },
  {
    id: 'modelcompare',
    label: 'Compare Models',
    icon: '⚖️',
    color: C.purple,
    keywords: ['compare', 'benchmark', 'best model', 'which algorithm',
               'evaluate models', 'leaderboard', 'vs'],
  },
  {
    id: 'pipeline',
    label: 'Full ML Pipeline',
    icon: '⚙️',
    color: C.green,
    keywords: ['pipeline', 'workflow', 'automl', 'end-to-end',
               'preprocessing', 'feature engineering', 'etl'],
  },
  {
    id: 'explainability',
    label: 'Explain Results',
    icon: '🔎',
    color: C.amber,
    keywords: ['explain', 'shap', 'lime', 'interpret', 'feature importance',
               'why', 'transparent', 'xai'],
  },
  {
    id: 'hypertuning',
    label: 'Tune Parameters',
    icon: '🎛️',
    color: C.accent,
    keywords: ['hyperparameter', 'tuning', 'optuna', 'gridsearch',
               'optimize', 'bayesian', 'sweep', 'hyperparam'],
  },
  {
    id: 'recommendation',
    label: 'Build Recommender',
    icon: '🎯',
    color: C.pink,
    keywords: ['recommend', 'suggest', 'collaborative', 'content-based',
               'user-item', 'rating', 'preference', 'product', 'movie', 'item'],
  },
];

/**
 * Scan user text for the first matching task type.
 * O(n * k) — runs synchronously, negligible cost.
 */
export function detectTask(text) {
  const lower = text.toLowerCase();
  for (const task of TASK_TYPES) {
    if (task.keywords.some(k => lower.includes(k))) return task;
  }
  return null;
}
