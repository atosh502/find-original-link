let shortUrl = "";
let originalUrl = "";

const proxyUrl = "https://secure-oasis-95293.herokuapp.com/";
const redirectCodes = [301, 302, 303, 304, 307, 308];

const resetBtn = document.getElementById("reset-btn");
const findLinksBtn = document.getElementById("find-links-btn");
const shortUrlInput = document.getElementById("short-link");
const originalLink = document.getElementById("original-link");
const error = document.getElementById("error");

resetBtn.addEventListener("click", () => {
  shortUrlInput.value = "";
  originalLink.innerHTML = "";
  error.hidden = true;
});

// https://stackoverflow.com/a/5717133/7358595
const isUrlValid = (url) => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(url);
};

const showError = (msg) => {
  error.innerHTML = msg;
  error.hidden = false;
  originalLink.innerHTML = "";
};

findLinksBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  let url = shortUrlInput.value.trim().toLowerCase();
  if (isUrlValid(url)) {
    if (!url.startsWith("http")) {
      shortUrlInput.value = "http://" + url;
    }
  } else {
    showError("Invalid URL entered");
    return;
  }

  url = shortUrlInput.value;
  if (url) {
    try {
      originalLink.innerHTML = `Original URL: Updating...`;
      error.hidden = true;

      const response = await fetch(proxyUrl + url, {
        method: "GET",
      });

      if (response.status !== 200) {
        showError(`Status code: ${response.status}`);
      } else {
        const finalUrl = response.headers.get("X-Final-Url");
        var a = document.createElement("a");
        var linkText = document.createTextNode(finalUrl);
        a.appendChild(linkText);
        a.href = finalUrl;
        originalLink.innerHTML = "Original URL: ";
        originalLink.appendChild(a);
      }
    } catch (err) {
      showError(`Unknown error ${err}`);
    }
  }
});
