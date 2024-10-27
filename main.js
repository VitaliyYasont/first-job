
// Model
const model = {
    notes: [], // массив для заметок 

    addNote(note) {
        this.notes.unshift(note); // добавляем новую заметку в начало массива
    },

    deleteNote(index) {
        this.notes.splice(index, 1); // удаляем заметку по индексу
    },

    toggleFavorite(index) {
        this.notes[index].isFavorite = !this.notes[index].isFavorite; // переключаем статус избранного
    },

    getNotes(isFavorite) {
        if (isFavorite) {
            return this.notes.filter(note => note.isFavorite); // возвращаем только избранные заметки
        }
        return this.notes; // возвращаем все заметки
    }
};

// View
const view = {
    notesContainer: document.getElementById('notesContainer'),
    notesCount: document.querySelector('.header span'),
    messageBox: document.getElementById('message'), // элемент для сообщений
    messageIcon: document.getElementById('message-icon'),
    noNotesMessage: document.getElementById('noNotesMessage'), // сообщение о том, что нет заметок

    renderNotes(notes) {
        this.notesContainer.innerHTML = ''; // очищаем контейнер заметок

        if (notes.length === 0) {
            this.noNotesMessage.style.display = 'block'; // показываем сообщение, если нет заметок
            this.notesCount.textContent = 0; // обновляем счетчик
            return;
        } else {
            this.noNotesMessage.style.display = 'none'; // скрываем сообщение, если есть заметки
        }

        notes.forEach((note, index) => {
            const noteItem = document.createElement('li');
            noteItem.classList.add('note-item');
            noteItem.innerHTML = `<div class="notesFin>"<div class="nNote">
                <h3 class="notHead">${note.title}</h3><button onclick="controller.toggleFavorite(${index})">
                    <img src="${note.isFavorite ? './IMG/heart active.png' : './IMG/heart inactive.png'}" alt="Избранное">
                </button>
                <button onclick="controller.deleteNote(${index})">
                    <img src="./IMG/trash.png" alt="Удалить">
                </button></div></div>
                <p class="notText">${note.content}</p>
            `;
            this.notesContainer.appendChild(noteItem); // добавляем заметку в контейнер
        });

        this.notesCount.textContent = notes.length; // обновляем счетчик заметок
    },

    showMessage(imagePath, message, type) {
        this.messageIcon.src = imagePath; // устанавливаем путь к изображению
        this.messageBox.querySelector('#message-text').textContent = message; // устанавливаем текст сообщения

        // Устанавливаем цвет фона в зависимости от типа сообщения
        this.messageBox.style.backgroundColor = type === 'warning' ? '#f23d5b' : '#47b27d';
        this.messageBox.style.display = 'flex'; // показываем сообщение 
        setTimeout(() => {
            this.messageBox.style.display = 'none'; // скрываем сообщение через 3 секунды
        }, 3000);
    }
};

// Controller
const controller = {
    noteTitleInput: document.getElementById('noteTitle'),
    noteContentInput: document.getElementById('noteContent'),
    addNoteButton: document.getElementById('addNoteButton'),
    showFavorites: false,

    init() {
        this.addNoteButton.addEventListener('click', () => this.addNote());
        document.getElementById('showFavorites').addEventListener('change', (event) => {
            this.showFavorites = event.target.checked; // обновляем состояние фильтрации
            view.renderNotes(model.getNotes(this.showFavorites)); // рендерим заметки
        });

        view.renderNotes(model.getNotes(this.showFavorites)); // инициализируем отображение заметок
    },

    addNote() {
        const title = this.noteTitleInput.value.trim();
        const content = this.noteContentInput.value.trim();

        if (title === '' || content === '') {
            view.showMessage('./IMG/warning.png', 'Заполните все поля', 'warning'); // показываем сообщение об ошибке
            return;
        }

        if (title.length > 50) {
            view.showMessage('./IMG/warning.png', 'Максимальная длина заголовка - 50 символов', 'warning'); // показываем сообщение об ошибке
            return;
        }

        const newNote = { title, content, isFavorite: false };
        model.addNote(newNote); // добавляем заметку в модель
        view.renderNotes(model.getNotes(this.showFavorites)); // обновляем отображение
        this.noteTitleInput.value = ''; // очищаем поля ввода
        this.noteContentInput.value = '';
        view.showMessage('./IMG/Done.png', 'Заметка добавлена', 'success'); // показываем сообщение об успешном добавлении
    },

    toggleFavorite(index) {
        model.toggleFavorite(index); // переключаем статус избранного
        view.renderNotes(model.getNotes(this.showFavorites)); // обновляем отображение
    },

    deleteNote(index) {
        model.deleteNote(index); // удаляем заметку из модели
        view.renderNotes(model.getNotes(this.showFavorites)); // обновляем отображение
        view.showMessage('./IMG/Done.png', 'Заметка удалена', 'success'); // показываем сообщение об удалении
    }
};

// Инициализация приложения
controller.init();