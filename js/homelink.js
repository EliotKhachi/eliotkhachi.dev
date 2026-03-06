(function () {
  var el = document.querySelector(".title");
  if (!el) return;

  // Derive base path from the script's own src (e.g. "../js/homelink.js" -> "../")
  var scripts = document.querySelectorAll("script[src*='homelink.js']");
  var src = scripts[scripts.length - 1].getAttribute("src");
  var base = src.replace("js/homelink.js", "");

  var link = document.createElement("a");
  link.className = "title";
  link.href = "/";

  var img = document.createElement("img");
  img.id = "headshot";
  img.src = base + "resources/headshot.jpg";

  var span = document.createElement("span");
  span.id = "title";
  span.textContent = "Eliot Khachi";

  link.appendChild(img);
  link.appendChild(span);
  el.replaceWith(link);
})();
