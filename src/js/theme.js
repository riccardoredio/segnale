(function () {
  var toggle = document.querySelector(".theme-toggle");
  var body = document.body;
  var stored = localStorage.getItem("theme");

  if (stored) {
    body.setAttribute("data-theme", stored);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    body.setAttribute("data-theme", "dark");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next =
        body.getAttribute("data-theme") === "dark" ? "light" : "dark";
      body.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }
})();
