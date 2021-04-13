import requests 
from bs4 import BeautifulSoup
import html
import time

while 1:
    headers={'user-agent': ('Mozilla/5.0 (X11; Linux x86_64)'
                          'AppleWebKit/537.36 (KHTML, like Gecko)'
                          'Chrome/88.0.4324.150 Safari/537.36 ')}
                        #   'referer': 'https://www.coindesk.com/')}
    response = requests.get('https://www.coindesk.com/' , headers=headers)
    Soup = BeautifulSoup(response.text , features="html.parser")
    data = Soup.find_all(class_='pricing-col')
    original = []
    for i in range(0,len(data)-2):
        rval = data[i].find(class_="half")
        name_of_coin = data[i].find("h5").text.split(' ')[0]
        dval = rval.find("div").text.split('$')[1]
        val={name_of_coin:dval}
        original.append(val)
    val = {'data':original}
    res1 = requests.post('http://localhost:3000/api',data=val)
    time.sleep(60)
