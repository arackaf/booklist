self.addEventListener("push", () => {
  console.log("Push notification received!!!");
  self.registration.showNotification("Push notification received!");
});
