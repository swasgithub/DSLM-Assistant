import { C } from '../styles/theme';

const RESPONSES = {
  regression: {
    title: 'Regression Workflow',
    color: C.accent,
    badge: 'Supervised · Continuous Target',
    insight: 'XGBoost dominates regression benchmarks on tabular data. Always start with it as your baseline before trying deep learning.',
    algorithms: [
      { 
        name: 'XGBoost', score: 93, metric: 'R² 0.93', 
        note: 'Best overall — handles non-linearity & missing values',
        why: 'Gradient boosting handles complex tabular relationships and has built-in support for the missing values detected in your profile.',
        failure: 'Can overfit on very small datasets or if learning_rate is too high.',
        tune: 'n_estimators, learning_rate, max_depth'
      },
      { 
        name: 'Random Forest', score: 90, metric: 'R² 0.90', 
        note: 'Robust baseline, low variance',
        why: 'Bagging reduces variance and is less sensitive to outliers than linear models.',
        failure: 'Can be slow to predict on extremely large ensembles.',
        tune: 'n_estimators, max_features'
      },
      { 
        name: 'Neural Net (MLP)', score: 88, metric: 'R² 0.88', 
        note: 'Best for large datasets > 100k rows',
        why: 'Universal function approximator; captures deep interactions when feature engineering is minimal.',
        failure: 'Requires significantly more data and careful scaling (StandardScaler).',
        tune: 'hidden_layer_sizes, activation'
      },
      { 
        name: 'Ridge Regression', score: 82, metric: 'R² 0.82', 
        note: 'Linear relationships, fully interpretable',
        why: 'L2 regularization prevents multicollinearity issues in highly correlated feature sets.',
        failure: 'Fails to capture non-linear patterns (e.g. exponential growth).',
        tune: 'alpha (regularization strength)'
      },
    ],
    metrics: ['RMSE', 'MAE', 'R²', 'MAPE'],
    preprocessing: ['StandardScaler / MinMaxScaler', 'Median imputation for NaNs', 'One-Hot Encoding for categoricals', 'Log-transform skewed targets'],
    code: `from xgboost import XGBRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('model', XGBRegressor(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=6,
        random_state=42
    ))
])

pipe.fit(X_train, y_train)
preds = pipe.predict(X_test)
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, preds)):.4f}")
print(f"R²:   {r2_score(y_test, preds):.4f}")`,
  },

  classification: {
    title: 'Classification Workflow',
    color: C.green,
    badge: 'Supervised · Discrete Target',
    insight: 'LightGBM trains 10× faster than XGBoost with near-identical accuracy. Use class_weight="balanced" for imbalanced datasets.',
    algorithms: [
      { name: 'LightGBM',           score: 94, metric: 'F1 0.94', note: 'Best for class imbalance, fastest training' },
      { name: 'XGBoost',            score: 91, metric: 'F1 0.91', note: 'Strong generalisation' },
      { name: 'SVM (RBF)',          score: 87, metric: 'F1 0.87', note: 'Feature-rich, medium datasets' },
      { name: 'Logistic Regression',score: 80, metric: 'F1 0.80', note: 'Interpretable baseline' },
    ],
    metrics: ['F1-Score', 'AUC-ROC', 'Precision', 'Recall'],
    preprocessing: ['Label Encoding / One-Hot', 'SMOTE for class imbalance', 'StandardScaler', 'Feature selection via chi²'],
    code: `import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

model = lgb.LGBMClassifier(
    n_estimators=500,
    learning_rate=0.05,
    num_leaves=31,
    class_weight='balanced'
)
model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    callbacks=[lgb.early_stopping(50)]
)

preds = model.predict(X_test)
print(classification_report(y_test, preds))
print(f"AUC: {roc_auc_score(y_test, model.predict_proba(X_test)[:,1]):.4f}")`,
  },

  clustering: {
    title: 'Clustering Workflow',
    color: C.purple,
    badge: 'Unsupervised · Group Discovery',
    insight: 'HDBSCAN eliminates the need to specify k and handles noise robustly. Use PCA first to reduce dimensionality.',
    algorithms: [
      { name: 'HDBSCAN',         score: 78, metric: 'Sil 0.78', note: 'No k needed, density-based' },
      { name: 'K-Means++',       score: 71, metric: 'Sil 0.71', note: 'Fast, interpretable' },
      { name: 'Spectral Clust.', score: 74, metric: 'Sil 0.74', note: 'Non-convex cluster shapes' },
      { name: 'GMM',             score: 67, metric: 'Sil 0.67', note: 'Soft probabilistic assignments' },
    ],
    metrics: ['Silhouette Score', 'Davies-Bouldin', 'Calinski-Harabasz', 'Inertia'],
    preprocessing: ['StandardScaler (critical)', 'PCA for high-dim data', 'Remove correlated features', 'Handle outliers with IQR'],
    code: `import hdbscan
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

pca = PCA(n_components=10, random_state=42)
X_pca = pca.fit_transform(X_scaled)

clusterer = hdbscan.HDBSCAN(min_cluster_size=10, min_samples=5)
labels = clusterer.fit_predict(X_pca)

mask = labels != -1
if mask.sum() > 1:
    score = silhouette_score(X_pca[mask], labels[mask])
    print(f"Clusters: {labels.max()+1}, Silhouette: {score:.4f}")
    print(f"Noise points: {(labels==-1).sum()}")`,
  },

  timeseries: {
    title: 'Time-Series Forecasting',
    color: C.amber,
    badge: 'Sequential · Temporal Patterns',
    insight: 'Temporal Fusion Transformer is SOTA but Prophet is best for business series with holidays and irregular events.',
    algorithms: [
      { name: 'Temporal Fusion',  score: 97, metric: 'MAPE 3.2%', note: 'SOTA multivariate forecasting' },
      { name: 'LSTM (PyTorch)',   score: 96, metric: 'MAPE 3.8%', note: 'Long sequences, seasonality' },
      { name: 'Prophet',          score: 96, metric: 'MAPE 4.2%', note: 'Business series + holidays' },
      { name: 'SARIMA',           score: 94, metric: 'MAPE 5.6%', note: 'Stationary series, interpretable' },
    ],
    metrics: ['MAPE', 'SMAPE', 'MAE', 'RMSE'],
    preprocessing: ['Stationarity test (ADF)', 'Differencing for trends', 'Log transform for growth', 'Holiday & event features'],
    code: `from prophet import Prophet
import pandas as pd
from sklearn.metrics import mean_absolute_percentage_error

df = pd.DataFrame({'ds': dates, 'y': values})
df_train = df[:-30]
df_test  = df[-30:]

m = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    changepoint_prior_scale=0.05
)
m.add_country_holidays(country_name='US')
m.fit(df_train)

future = m.make_future_dataframe(periods=30)
forecast = m.predict(future)

preds = forecast['yhat'].iloc[-30:].values
mape  = mean_absolute_percentage_error(df_test['y'], preds)
print(f"MAPE: {mape*100:.2f}%")`,
  },

  anomaly: {
    title: 'Anomaly Detection',
    color: C.coral,
    badge: 'Unsupervised · Outlier Detection',
    insight: 'Isolation Forest is the fastest production-ready anomaly detector for tabular data. Set contamination to your expected anomaly rate.',
    algorithms: [
      { name: 'Isolation Forest', score: 91, metric: 'Prec 0.91', note: 'Tabular, fast, scalable' },
      { name: 'Autoencoder',      score: 89, metric: 'Prec 0.89', note: 'High-dim, time-series' },
      { name: 'HDBSCAN noise',    score: 87, metric: 'Prec 0.87', note: 'No threshold needed' },
      { name: 'LOF',              score: 83, metric: 'Prec 0.83', note: 'Local density-based' },
    ],
    metrics: ['Precision@K', 'Recall', 'AUC-PR', 'F1 (rare class)'],
    preprocessing: ['RobustScaler (outlier-safe)', 'Remove duplicate rows', 'Encode categoricals', 'Feature interaction terms'],
    code: `from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import RobustScaler
import numpy as np

scaler = RobustScaler()
X_scaled = scaler.fit_transform(X)

iso = IsolationForest(
    n_estimators=200,
    contamination=0.05,   # adjust to your expected anomaly rate
    random_state=42,
    n_jobs=-1
)
iso.fit(X_scaled)

labels = iso.predict(X_scaled)    # -1 = anomaly, 1 = normal
scores = iso.decision_function(X_scaled)
anomalies = X[labels == -1]

print(f"Anomalies detected: {(labels==-1).sum()}")
print(f"Anomaly rate: {(labels==-1).mean()*100:.2f}%")`,
  },

  recommendation: {
    title: 'Recommendation System',
    color: C.pink,
    badge: 'Collaborative + Content Filtering',
    insight: 'BERT4Rec captures sequential patterns that matrix factorization completely misses. Use LightFM as a hybrid baseline first.',
    algorithms: [
      { name: 'BERT4Rec',         score: 93, metric: 'NDCG 0.93', note: 'Sequential, rich user history' },
      { name: 'Neural CF',        score: 91, metric: 'NDCG 0.91', note: 'Deep user-item interactions' },
      { name: 'LightFM (Hybrid)', score: 88, metric: 'NDCG 0.88', note: 'Collaborative + content' },
      { name: 'Matrix Factor.',   score: 86, metric: 'NDCG 0.86', note: 'Scalable, interpretable' },
    ],
    metrics: ['NDCG@K', 'Hit Rate@K', 'MRR', 'Coverage'],
    preprocessing: ['User-Item matrix construction', 'Implicit feedback binarization', 'Normalize interaction counts', 'Cold-start handling strategy'],
    code: `from lightfm import LightFM
from lightfm.data import Dataset
from lightfm.evaluation import ndcg_score

dataset = Dataset()
dataset.fit(users, items)

(interactions, weights) = dataset.build_interactions(
    [(u, i, r) for u, i, r in ratings]
)

model = LightFM(
    no_components=64,
    loss='warp',
    learning_rate=0.05,
    item_alpha=1e-6
)
model.fit(interactions, epochs=30, num_threads=4)

ndcg = ndcg_score(model, interactions, k=10)
print(f"NDCG@10: {ndcg:.4f}")`,
  },

  pipeline: {
    title: 'Pipeline Generation',
    color: C.green,
    badge: 'End-to-End · AutoML Style',
    insight: 'ColumnTransformer + Pipeline ensures zero data leakage across train/test splits. Always fit preprocessors on train only.',
    algorithms: [
      { name: 'Data Ingestion',    score: 100, metric: 'Step 1', note: 'CSV/JSON/SQL → DataFrame' },
      { name: 'ColumnTransformer', score: 100, metric: 'Step 2', note: 'Mixed dtype preprocessing' },
      { name: 'GridSearchCV',      score: 100, metric: 'Step 3', note: 'Hyperparameter tuning' },
      { name: 'Evaluation',        score: 100, metric: 'Step 4', note: 'AUC, F1, classification_report' },
    ],
    metrics: ['Pipeline Score', 'CV Mean', 'CV Std', 'Fit Time'],
    preprocessing: ['Auto dtype detection', 'Train/test split first', 'Fit preprocessors on train only', 'Log all transformations'],
    code: `from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import GridSearchCV
from xgboost import XGBClassifier

num_pipe = Pipeline([
    ('imp', SimpleImputer(strategy='median')),
    ('scl', StandardScaler())
])
cat_pipe = Pipeline([
    ('imp', SimpleImputer(strategy='most_frequent')),
    ('ohe', OneHotEncoder(handle_unknown='ignore'))
])

pre = ColumnTransformer([
    ('num', num_pipe, num_cols),
    ('cat', cat_pipe, cat_cols)
])

clf = Pipeline([('pre', pre), ('model', XGBClassifier())])

params = {
    'model__n_estimators': [100, 300],
    'model__max_depth':    [4, 6]
}
gs = GridSearchCV(clf, params, cv=5, scoring='roc_auc', n_jobs=-1)
gs.fit(X_train, y_train)
print(f"Best AUC: {gs.best_score_:.4f}")`,
  },

  modelcompare: {
    title: 'Model Comparison',
    color: C.purple,
    badge: 'Benchmarking · Leaderboard',
    insight: 'Always benchmark with LightGBM first — it wins 80% of tabular ML competitions. Use the same CV folds for fair comparison.',
    algorithms: [
      { name: 'LightGBM',     score: 95, metric: 'AUC 0.947', note: 'Best overall + speed' },
      { name: 'XGBoost',      score: 93, metric: 'AUC 0.933', note: 'Strong regularisation' },
      { name: 'Random Forest',score: 92, metric: 'AUC 0.918', note: 'Low variance, easy tuning' },
      { name: 'Logistic Reg.',score: 85, metric: 'AUC 0.853', note: 'Interpretable baseline' },
    ],
    metrics: ['AUC-ROC', 'F1 Macro', 'CV Score', 'Train Time'],
    preprocessing: ['Consistent preprocessing for all models', 'Use same CV folds (KFold)', 'Statistical significance tests', 'Track memory & inference time'],
    code: `import lightgbm as lgb
import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
import pandas as pd

models = {
    'LightGBM':   lgb.LGBMClassifier(n_estimators=300),
    'XGBoost':    xgb.XGBClassifier(n_estimators=300, eval_metric='logloss'),
    'RandomForest': RandomForestClassifier(n_estimators=300),
    'LogisticReg':  LogisticRegression(max_iter=1000)
}

results = []
for name, m in models.items():
    scores = cross_val_score(m, X, y, cv=5, scoring='roc_auc')
    results.append({
        'Model':    name,
        'AUC Mean': round(scores.mean(), 4),
        'AUC Std':  round(scores.std(), 4)
    })

df = pd.DataFrame(results).sort_values('AUC Mean', ascending=False)
print(df.to_string(index=False))`,
  },

  explainability: {
    title: 'Model Explainability',
    color: C.amber,
    badge: 'XAI · Interpretability',
    insight: 'SHAP TreeExplainer is exact (not approximate) for tree-based models. Run it on a sample of 500 rows to keep it fast.',
    algorithms: [
      { name: 'SHAP TreeExplainer', score: 97, metric: 'Fidelity 0.97', note: 'Exact Shapley, tree models' },
      { name: 'SHAP Kernel',        score: 91, metric: 'Fidelity 0.91', note: 'Model-agnostic' },
      { name: 'LIME',               score: 86, metric: 'Fidelity 0.86', note: 'Local linear approximation' },
      { name: 'Permutation Imp.',   score: 80, metric: 'Fidelity 0.80', note: 'Drop-column impact' },
    ],
    metrics: ['Fidelity', 'Stability', 'Complexity', 'Runtime'],
    preprocessing: ['Train model first', 'Use representative sample', 'Remove correlated features', 'Store feature names'],
    code: `import shap
import matplotlib.pyplot as plt

explainer   = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Global feature importance
shap.summary_plot(
    shap_values, X_test,
    feature_names=feature_names, show=False
)
plt.savefig('shap_summary.png', bbox_inches='tight', dpi=150)
plt.close()

# Single prediction waterfall
shap.waterfall_plot(shap.Explanation(
    values=shap_values[0],
    base_values=explainer.expected_value,
    data=X_test[0],
    feature_names=feature_names
))

# Top 3 most important features
idx = abs(shap_values).mean(0).argsort()[-3:][::-1]
for i in idx:
    print(f"{feature_names[i]}: {abs(shap_values).mean(0)[i]:.4f}")`,
  },

  hypertuning: {
    title: 'Hyperparameter Tuning',
    color: C.accent,
    badge: 'Bayesian · Search Strategies',
    insight: 'Optuna finds better hyperparameters in 50 trials than GridSearchCV does in 500. Use pruning to terminate bad trials early.',
    algorithms: [
      { name: 'Optuna (TPE)',    score: 97, metric: 'Efficiency 0.97', note: 'Bayesian, best sample efficiency' },
      { name: 'HyperOpt',       score: 92, metric: 'Efficiency 0.92', note: 'Tree Parzen Estimator' },
      { name: 'RandomSearchCV', score: 80, metric: 'Efficiency 0.80', note: 'Large search spaces' },
      { name: 'GridSearchCV',   score: 75, metric: 'Efficiency 0.75', note: 'Small, exhaustive search' },
    ],
    metrics: ['Best Score', 'N Trials', 'Wall Time', 'Pruned Trials'],
    preprocessing: ['Define objective function', 'Set parameter space', 'Use pruning for speed', 'Log all trial results'],
    code: `import optuna
from sklearn.model_selection import cross_val_score
import lightgbm as lgb

def objective(trial):
    params = {
        'n_estimators':      trial.suggest_int('n_estimators', 100, 1000),
        'learning_rate':     trial.suggest_float('learning_rate', 1e-3, 0.3, log=True),
        'num_leaves':        trial.suggest_int('num_leaves', 20, 200),
        'max_depth':         trial.suggest_int('max_depth', 3, 12),
        'min_child_samples': trial.suggest_int('min_child_samples', 5, 100),
    }
    model  = lgb.LGBMClassifier(**params)
    scores = cross_val_score(model, X_train, y_train, cv=5, scoring='roc_auc')
    return scores.mean()

study = optuna.create_study(
    direction='maximize',
    sampler=optuna.samplers.TPESampler(seed=42)
)
study.optimize(objective, n_trials=100, show_progress_bar=True)

print(f"Best AUC:    {study.best_value:.4f}")
print(f"Best params: {study.best_params}")`,
  },
};

export function buildFallback(taskId) {
  return RESPONSES[taskId] || null;
}
