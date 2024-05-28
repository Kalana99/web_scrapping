import pandas as pd

def read_excel_file(file_path):

    try:
        df = pd.read_excel(file_path)
        return df.iloc[:, 1].tolist()
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        exit()
