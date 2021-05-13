class UserService {
    // Не нужно предварительно объявлять переменные для конструктора
    
    // Так как используются геттеры, стоит конструктировать переменные класса с префиксом "_"  
  constructor(username, password) {
    this._username = username;
    this._password = password;
  }

//   С помощью геттера мы возвращаем свойство класса, так же мы обращаемся к инстансу this, а не к классу в общем
  get username() {
    return this._username;
  }

  get password() {
    throw "You are not allowed to get password";
  }

//   Так как код кнопки формы зависит от выполнения данной функции, всё обращение XML мы помещаем в промис.
  static authenticate_user(usernameUrl, passwordUrl) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

    //   Заменяем "UserService.username и UserService.password" на аргументы функции, так как мы хотим передать данные пользователя, т.е инстанса класса, а не самого класса. 
      xhr.open(
        "GET",
        `https://examples.com/api/user/authenticate?username=${usernameUrl}&password=${passwordUrl}`,
        true
      );

      xhr.responseType = "json";
// Так как переменная result будет изменяться в ходе выполнения функции, то объявить ее нужно с let
      let result;

      xhr.onload = function () {
        if (xhr.status !== "200") {
          result = xhr.response;
        } else {
          result = true;
        }
// Вместо return result возвращаем разрешенный промис 
        resolve(result);
      };
// Чтобы получить данные с удаленного ресурса, нужно отправить запрос
      xhr.send();
    });
  }
}

// Так как в селекторе есть id, не нужно специфично указывать form
${'#login'}.click(() => {
    // Чтобы отправить логин и пароль, нужно получить значения инпутов
    let username = $('#username').val();
    let password = $('#password').val();

    // Конструктор класса нельзя вызывать без ключевого слова "new", поэтому сначала объявляем инстанс класса, а затем, так как в классе "UserService" метод authenticate_user - статичный, вызываем его на самом классе, передавая данные пользователя в качестве аргументов
    const user = new UserService(username, password);

    var res = await UserService.authenticate_user(user.username, user._password);
  
    if (res == true) {
      document.location.href = '/home';
    } else {
      alert(res.error);
    }
})

// Вместо XML запроса я бы использовал fetch api или axios, чтобы обрабатывать эти запросы как промисы. Так же вместо метода "GET" я бы использовал "POST", а логин и пароль вложил в тело запроса