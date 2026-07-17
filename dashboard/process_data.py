import pandas as pd
import numpy as np
import json
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

df = pd.read_csv('youtube.csv')
df.dropna(inplace=True)
df['RANK'] = df['RANK'].str.replace('#', '').astype(int)

def convert_to_number(x):
    x = str(x).strip()
    if 'K' in x:
        return float(x.replace('K', '')) * 1e3
    elif 'M' in x:
        return float(x.replace('M', '')) * 1e6
    elif 'B' in x:
        return float(x.replace('B', '')) * 1e9
    else:
        return float(x.replace(',', ''))

df['TOTAL_NUMBER_OF_VIDEOS'] = df['TOTAL_NUMBER_OF_VIDEOS'].apply(convert_to_number)
df['SUBSCRIBERS'] = df['SUBSCRIBERS'].apply(convert_to_number)
df['VIEWS'] = df['VIEWS'].apply(convert_to_number)
df['CATEGORY'] = df['CATEGORY'].astype(str).str.strip()
df['NAME_OF_CHANNEL'] = df['NAME_OF_CHANNEL'].astype(str).str.strip()

# collapse near-duplicate category labels (whitespace variants etc already stripped)
df = df[df['CATEGORY'].str.len() > 0]

X = df[['TOTAL_NUMBER_OF_VIDEOS', 'VIEWS']]
y = df['SUBSCRIBERS']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)
mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

model_info = {
    "coef_videos": float(model.coef_[0]),
    "coef_views": float(model.coef_[1]),
    "intercept": float(model.intercept_),
    "mae": float(mae),
    "rmse": float(rmse),
    "r2": float(r2),
    "mape": float(mape),
    "n_train": int(len(X_train)),
    "n_test": int(len(X_test)),
}

with open('src/data/model.json', 'w') as f:
    json.dump(model_info, f, indent=2)

channels = df[['RANK','NAME_OF_CHANNEL','TOTAL_NUMBER_OF_VIDEOS','SUBSCRIBERS','VIEWS','CATEGORY']].copy()
channels = channels.rename(columns={
    'RANK':'rank','NAME_OF_CHANNEL':'name','TOTAL_NUMBER_OF_VIDEOS':'videos',
    'SUBSCRIBERS':'subscribers','VIEWS':'views','CATEGORY':'category'
})
channels_list = channels.to_dict(orient='records')
with open('src/data/channels.json', 'w') as f:
    json.dump(channels_list, f)

# category distribution (normalize similar categories by simple grouping already trimmed)
cat_counts = df['CATEGORY'].value_counts().to_dict()
with open('src/data/categories.json', 'w') as f:
    json.dump(cat_counts, f, indent=2)

corr = df[['RANK','TOTAL_NUMBER_OF_VIDEOS','SUBSCRIBERS','VIEWS']].corr().round(3).to_dict()
with open('src/data/correlation.json', 'w') as f:
    json.dump(corr, f, indent=2)

print("Rows used:", len(df))
print("Model:", model_info)
print("Categories:", len(cat_counts))
