/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(
      data, 
      (err, response) => {
        if (response && response.success) {
          App.getModal("createAccount").close();
          App.getModal("createAccount").element.querySelector("form").reset();
          App.update();
        }
        else {
          alert(err);
        }
      }
    )
  }
}