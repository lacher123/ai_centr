import geopandas as gpd
from geopandas import GeoSeries
from sys import argv

if __name__ == "__main__":
    
    # Получаем аргументы с командной строки
    script, filename = argv
    print(argv)

    index = filename.rfind('/')
    if index >= 0:
        new_filename = filename[:index + 1] + 'upd_' + filename[index + 1:]
    else:
        new_filename = 'upd_' + filename
    print(new_filename)
    df = gpd.read_file(filename)
    series = [row for row in df['geometry']]
    g_series = GeoSeries(series)
    centres = g_series.centroid
    areas = g_series.area
    data = {}
    for col in df:
        if col == 'geometry':
            data[col] = [center for center in centres]
            continue
        data[col] = df[col]
    data['area'] = [area for area in areas]
    
    
    new_df = gpd.GeoDataFrame(data, crs="EPSG:4326")
    new_df.to_file(new_filename, driver='GeoJSON')
        