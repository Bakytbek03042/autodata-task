#Autodata-task

##Требования
Язык программирования - Node.js
База данных - MongoDB
Валидация полей: не больше 3 ссылок на фото, описание не больше 1000 символов, название не больше 200 символов

###3 метода:
- [x] [получение списка объявлений](https://github.com/Bakytbek03042/autodata-task "Получение списка объявлений")
- [x] [получение одного объявления]()
- [x] [создание объявления]()

##Получение списка объявлений
- [x] Пагинация: на одной странице должно присутствовать 10 объявлений
|  Параметр | Допустимые варианты  |
| ------------ | ------------ |
| page  | 0-999  |

- [x] Cортировки: по цене (возрастание/убывание) и по дате создания (возрастание/убывание)
- [x] Поля в ответе: название объявления, ссылка на главное фото (первое в списке), цена
