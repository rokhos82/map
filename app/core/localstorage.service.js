export function mapLocalStorage($window) {
  let _service = {};

  _service.set = (key,obj) => {
    $window.localStorage.setItem(key,angular.toJson(obj));
  };

  _service.get = (key) => {
    let ls = $window.localStorage.getItem(key);
    return angular.fromJson(ls);
  };

  return _service;
}

mapLocalStorage.$inject = ["$window"];

// Service Function Definitions Below
