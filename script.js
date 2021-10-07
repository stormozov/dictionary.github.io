const englishInput = document.getElementById('input-eng'),
      russianInput = document.getElementById('input-rus'),
      inputs = document.querySelectorAll('input'),
      saveButton = document.getElementById('btn'),
      cleanButton = document.getElementById('btnClear'), 
      cleanTable = document.querySelector('.dictionary__table'),
      table = document.getElementById('tableBody');

let words;
let deleteButton;
let alertClear;

let errorBlock = document.querySelector('.dictionary__error-block');
/*
    При загрузке страницы проверяю, если в локальном хранилище нет значений, то будет words пустым массивом.
    Если в локалоном хранилище есть значения, то передаю в words те значения, которые хранятся в локал. хранилище.
*/
localStorage.length < 1 ? words = [] : words = JSON.parse(localStorage.getItem('words'));

// Шаблон для вставки элементов в таблицу
const addWordToTable = index => {
    table.innerHTML += `
        <tr>
            <td> ${words[index].translate} </td>
            <td> ${words[index].russianWord} </td>
            <td title="Удалить слово из словаря" class="table-btn-delete">
                <button id="btn-delete"> x </button>
            </td>
        </tr>
    `
};

words.forEach((item, index) => { addWordToTable(index); });

// Создаю объект со словами
class createWord {
    constructor(translate, russianWord) {
        this.translate = translate;
        this.russianWord = russianWord;
    };
};

saveButton.addEventListener('click', () => {
    const validationNull = englishInput.value.length < 1 || russianInput.value.length < 1;
    const validationNumber = !isNaN(englishInput.value) || !isNaN(russianInput.value);

    // Валидация ввода слов в инпуты (Так чище выглядит)
    if ( validationNull || validationNumber ) {
        for ( let key of inputs ) key.classList.add('error');
        errorBlock.innerHTML = 'Пустые строки и числа не принимаю!';
    } else {
        for ( let key of inputs ) key.classList.remove('error'); // Если до отправки была ошибка, то убираю ее        
        errorBlock.innerHTML = '';

        words.push(new createWord(englishInput.value, russianInput.value)); // Если валидация прошла, то добавляем слова в массив
        localStorage.setItem('words', JSON.stringify(words)); // Добавляем массив в локальное хранилище браузера
        addWordToTable(words.length - 1); // Добавляю на страницу введенные слова

        englishInput.value = ''; // Очистка инпута после нажатия на кнопку добавления слова
        russianInput.value = ''; // Очистка инпута после нажатия на кнопку добавления слова

        addEventDelete(); // Вызов функции для удаления слов сразу же без перезагрузки страницы
        showAndHideCleanButton(); // Добавляю кнопку очистки словаря, если в словаре 4 или более пар слов
        showAndHideTableHeader(); // Показываю или скрываю шапку таблицы
    };
});

// Удаление слов из словаря
const deleteWord = e => {
    const indexOfTheTableRow = e.target.parentNode.parentNode.rowIndex; // Нахожу индекс ряда
    e.target.parentNode.parentNode.parentNode.remove(); // Удаляю <tbody> из верстки

    words.splice(indexOfTheTableRow, 1); // Удаляю объект с выбранными словами
    localStorage.removeItem('words'); // Зачищаю локальное хранилище
    localStorage.setItem('words', JSON.stringify(words)); // Добавляю в локальное хранилище массив
    (words.length == 0) ? localStorage.removeItem('words') : false; // Зачищаю локальное хранилище под ноль

    showAndHideTableHeader(); // Показываю или скрываю шапку таблицы
};

const addEventDelete = () => {
    if ( words.length > 0 ) {
        deleteButton = document.querySelectorAll('#btn-delete');

        for ( btn of deleteButton ) {
            btn.addEventListener('click', e => {
                deleteWord(e);
            });
        };
    };
};

addEventDelete();

// * Дополнительно реализовал *
// Полное очищение словаря
const addEventClear = () => {    
    cleanButton.addEventListener('click', e => {
        // Сначала спрашиваю, действительно ли нужно удалить слова, а только потом очищаю
        alertClear = confirm('А ты действительно хочешь удалить все все слова из словарика?!');

        if ( alertClear ) {
            words = []; // Очищаю массив
            table.innerHTML = ''; // Очищаю саму таблицу
            localStorage.removeItem('words'); // Зачищаю локальное хранилище

            cleanTable.classList.remove('active');
            cleanButton.classList.remove('active');
        };
    });
};

addEventClear();

// Добавляю кнопку очистки словаря, если в словаре 4 или более пар слов
const showAndHideCleanButton = () => {
    (words.length >= 4) ? cleanButton.classList.add('active') : cleanButton.classList.remove('active');
};

showAndHideCleanButton();

// Показываю или скрываю шапку таблицы и, если нет шапки, показываю текст об отсутствии слов в словаре
const showAndHideTableHeader = () => {
    (words.length > 0) ? cleanTable.classList.add('active') : cleanTable.classList.remove('active');
};

showAndHideTableHeader();