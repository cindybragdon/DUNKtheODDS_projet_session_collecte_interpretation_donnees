#!/usr/bin/env python3
import sys
import json
import pandas as pd
import numpy as np

def main():
    try:
        data = sys.stdin.read()
        home_points = json.loads(data)

        
        df = pd.DataFrame({'homePoints': home_points})
        
        Q1 = df['homePoints'].quantile(0.25)
        Q3 = df['homePoints'].quantile(0.75)
        IQR = Q3 - Q1
        
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        outliers = df[(df['homePoints'] < lower_bound) | (df['homePoints'] > upper_bound)]
        result = {
            "statistics": {
                "Q1": float(Q1),
                "Q3": float(Q3),
                "IQR": float(IQR),
                "lower_bound": float(lower_bound),
                "upper_bound": float(upper_bound),
                "total_points": len(df)
            }
        }
        
        print(json.dumps(result))
        sys.stdout.flush()

    except Exception as e:
        error_result = {
            "error": str(e),
            "type": str(type(e).__name__)
        }
        print(json.dumps(error_result), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
