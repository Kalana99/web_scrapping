import pandas as pd

class ExcelReader:
    
    @staticmethod
    def read_web():
        return ExcelReader.read_excel_file("scrapper/utils/web.xlsx")
    
    @staticmethod
    def read_news():
        return ExcelReader.read_excel_file("scrapper/utils/news.xlsx")
    
    @staticmethod
    def read_excel_file(file_path):

        try:
            df = pd.read_excel(file_path)
            return (df.iloc[:, 0].tolist(), df.iloc[:, 1].tolist())
        except Exception as e:
            print(f"Error reading Excel file: {e}")
            return Exception("Error reading Excel file" + str(e))