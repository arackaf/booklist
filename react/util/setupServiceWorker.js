import { isLoggedIn } from "util/loginStatus";

console.log("F");

export default function setupServiceWorker() {
  if ("serviceWorker" in navigator) {
    //} && !/localhost/.test(window.location)) {
    navigator.serviceWorker.register("/service-worker.js").then(registration => {
      navigator.serviceWorker.ready.then(reg => {
        let loginInfo = isLoggedIn();
        try {
          if (loginInfo.logged_in) {
            navigator.serviceWorker.controller.postMessage({ command: "do-sync", userId: loginInfo.userId });
          } else {
            navigator.serviceWorker.controller.postMessage({ command: "loggeed-out" });
          }
        } catch (er) {}
      });
      if (registration.waiting && registration.active) {
        newerSwAvailable(registration.waiting);
      }
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              newerSwAvailable(installingWorker);
            }
          }
        };
      };
    });

    function newerSwAvailable(sw) {
      try {
        navigator.serviceWorker.addEventListener("message", event => {
          if (event.data == "sw-updated") {
            location.reload();
          }
        });
        Promise.all([import("toastify-js"), import("toastify-js/src/toastify.css")]).then(([{ default: Toastify }]) => {
          window.addEventListener("click", evt => {
            try {
              if (evt.target.classList.contains("do-sw-update")) {
                sw.postMessage("sw-update-accepted");
              }
            } catch (e) {}
          });
          Toastify({
            text: `
            <h4 style='display: inline'>An update is available!</h4>
            <br><br>
            <a class='do-sw-update'>Click to update and reload</a>&nbsp;&nbsp;
          `.trim(),
            duration: 700000,
            gravity: "bottom",
            close: true,
            className: "toast-notification"
          }).showToast();
        });
      } catch (er) {}
    }

    // if (Notification) {
    //   Notification.requestPermission().then(permission => {});
    // }

    if (isLoggedIn()) {
      // let subscriptionOptions = {
      //   userVisibleOnly: true,
      //   applicationServerKey: urlBase64ToUint8Array("BCC0wqyL-OGz5duRO9-kOSUEv72BMGf0x0oaMGryF1eLa3FF-sW2YmunhNqQegrXHykP-Wa6xC1rEnDuBGtjgUo")
      // };
      // navigator.serviceWorker.ready.then(registration => {
      //   registration.pushManager.subscribe(subscriptionOptions).then(subscription => {
      //     ajaxUtil.post("/user/saveNotificationSubscription", { subscription: JSON.stringify(subscription) });
      //   });
      // });
      /*
      
        async saveNotificationSubscription({ subscription }) {
          let userId = this.request.user.id;
          await new UserDAO().updateSubscription(userId, JSON.parse(subscription));
          this.send({ success: true });
        }
      
      */
    }
  }
}
