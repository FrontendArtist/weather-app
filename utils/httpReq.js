const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const API_KEY = "548defbfe8b5c51898bac103a5c78a8a";
const modalBox = document.querySelector("#modal");
const getWeatherData = async (type, data) => {
  let url = null;
  switch (type) {
    case "current":
      if (typeof data === "string") {
        url = `${BASE_URL}weather?q=${data}&appid=${API_KEY}&units=metric`;
      } else {
        url = `${BASE_URL}weather?lat=${data.latitude}&lon=${data.longitude}&appid=${API_KEY}&units=metric`;
      }
      break;
    case "forecast":
      if (typeof data === "string") {
        url = `${BASE_URL}forecast?q=${data}&appid=${API_KEY}&units=metric`;
      } else {
        url = `${BASE_URL}forecast?lat=${data.latitude}&lon=${data.longitude}&appid=${API_KEY}&units=metric`;
      }
      break;
    default:
      break;
  }
  try {
    const response = await fetch(url);
    const json = await response.json();
    if (+json.cod === 200) {
      return json;
    } else {
      makeModal(json);
    }
  } catch (error) {
    console.log(error);
  }
};
const makeModal = (error) => {
  if (typeof error === "string") {
    console.log(error);
    modalBox.querySelector("h2").innerText = error;
    modalBox.querySelector("h1").addEventListener("click", (modal) => (modalBox.style.display = "none"));
    modalBox.style.display = "flex";
  }else{
    modalBox.querySelector("h2").innerText = error.message;
    modalBox.querySelector("h1").addEventListener("click", (modal) => (modalBox.style.display = "none"));
    modalBox.style.display = "flex";
  }
};
export { getWeatherData, makeModal };
