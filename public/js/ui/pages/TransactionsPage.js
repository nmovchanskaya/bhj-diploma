/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error("Undefined element in TransactionPage constructor");
    }
    this.element = element;
    this.waitingForResponse = 0;
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccountBtn = document.querySelector(".remove-account");
    const removeTransactionBtns = Array.from(document.querySelectorAll(".transaction__remove"));
  
    removeAccountBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.removeAccount();
    });

    removeTransactionBtns.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        this.removeTransaction({id: item.dataset.id});
      });
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    
    if (!this.waitingForResponse) {
      let confirmDel = confirm("Вы действительно хотите удалить счет?");

      if (!confirmDel || !this.lastOptions) {
        return;
      }
    }
    
    if (!this.waitingForResponse) {
      Account.remove({id: this.lastOptions.account_id}, (err, response) => {
        if (response && response.success) {
          App.updateWidgets();
          App.updateForms();
          this.clear();
          this.waitingForResponse = 0;
        }
      });
      this.waitingForResponse = 1;
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {

    let confirmDel = confirm("Вы действительно хотите удалить эту транзакцию?");

    if (!confirmDel) {
      return;
    }

    Transaction.remove(id, (err, response) => {
      if (response && response.success) {
        App.update();
      }
    });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    
    if (!options) {
      return;
    }

    this.lastOptions = options;

    Account.get(options.account_id, (err, response) => {
      if (response && response.data) {
        let accountName = response.data.name;
        this.renderTitle(accountName);
      }
    });

    Transaction.list(options, (err, response) => {
      if (response && response.success) {
        this.renderTransactions(response.data);
        this.registerEvents();
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счета");
    this.lastOptions = {};
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector(".content-title").textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    let newDate = new Date(Date.parse(date));

    var options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    
    console.log(newDate.toLocaleString("ru", options));
    return newDate.toLocaleString("ru", options);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){

    return `
      <div class="transaction transaction_${item.type} row">
          <div class="col-md-7 transaction__details">
            <div class="transaction__icon">
                <span class="fa fa-money fa-2x"></span>
            </div>
            <div class="transaction__info">
                <h4 class="transaction__title">${item.name}</h4>
                <div class="transaction__date">${this.formatDate(item.created_at)}</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="transaction__summ">
              ${item.sum}
              <span class="currency">₽</span>
            </div>
          </div>
          <div class="col-md-2 transaction__controls">
              <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                  <i class="fa fa-trash"></i>  
              </button>
          </div>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){

    let content = document.querySelector(".content");
    let allTransHTML = "";

    data.forEach(item => {
      allTransHTML += this.getTransactionHTML(item);
    });
    content.innerHTML = allTransHTML;
  }
}