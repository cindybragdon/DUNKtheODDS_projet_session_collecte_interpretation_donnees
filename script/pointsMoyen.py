import sys
import pandas as pd
import json

def main():
    try:
        
        points = sys.stdin.read()
        data= json.loads(points)
        df = pd.DataFrame(data)
        average_points = df.groupby('TeamName')['Points'].mean().astype(int)
        result = average_points.to_json()
        print(result)
    except Exception as e:
        error_result = {
            "error": str(e),
            "type": str(type(e).__name__)
        }
        print(json.dumps(error_result), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
