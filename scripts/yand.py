import requests
import csv

def fetch_coordinates(apikey, city, place):
    base_url = "https://search-maps.yandex.ru/v1/"
    text = city + ', ' + place
    params = {"text": text, "apikey": apikey, "lang": "ru_RU", "type": "biz"}
    response = requests.get(base_url, params=params)
    response.raise_for_status()
    places_found = response.json()['features']
    data = []
    for p in places_found:
        coord = p['geometry']['coordinates']
        try:
            meta = p['properties']['CompanyMetaData']['Categories'][0]['name']
        except:
            meta = ''
        data.append((text, meta, list(coord)))
    return data
if __name__ == "__main__":
    api_key = 'e1a86caf-d0fd-4444-969f-4349fb4823bc'
    data = []
    city = 'Владивосток'
    
    # places - запросы к яндекс картам
    
    """ places = ['OZON, пункты выдачи', 'boxberry', 'халва', 'pickpoint', \
              'Pickup DPD', 'pony express', 'bus-курьер', 'DHL', \
              'EMS', 'Major Express', 'UPS', 'Pro100Почта', 'Fedex', \
              'Сиа Лайн', 'Курьер сервис Экспресс', 'Почта России', \
              'СДЭК', 'TopDelivery', 'IML', 'МБИ', 'СПСР -Экспресс'] """
    """ places = ['остановка', 'вокзал', 'порт', 'воинская часть', 'продуктовый магазин', \
        'морской вокзал', 'суд', 'школа', 'университет', 'колледж', 'общежитие', 'ночная парковка', 'парк'] """
    filtr = set()
    for p in places:
        response = fetch_coordinates(api_key, city, p)
        for r in response:
            if str(r[2]) not in filtr:
                filtr.add(str(r[2]))
                data.append(r)
    with open('/home/rustam/Ural/ai_centr/data/attraction.csv', 'w') as file:
        csv_writer = csv.writer(file, delimiter=';')
        csv_writer.writerow(['name', 'meta', 'coordinates'])
        for d in data:
            q = [str(d[0]), str(d[1]), str(d[2])]
            csv_writer.writerow(q)
    