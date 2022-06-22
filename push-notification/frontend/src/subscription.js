const convertedVapidKey = urlBase64ToUint8Array(
  process.env.REACT_APP_PUBLIC_VAPID_KEY
);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String?.length % 4)) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  let rawData;
  try {
    rawData = window?.atob(base64);
  } catch (error) {
    rawData = window?.atob(window.btoa("SEDRFTGYHU"));
  }

  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendSubscription(data, subscription) {
  // const { jwt: token, user }= data
  const { jwt, ...rest } = data;
  console.log(">>>", jwt, rest, subscription);
  return fetch(`${process.env.REACT_APP_API_URL}/user-notification-keys`, {
    method: "POST",
    body: JSON.stringify({
      data: {
        // users_permissions_user: +user.id,
        ...rest,
        subscription,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

export function subscribeUser(authData) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then(function (registration) {
        if (!registration.pushManager) {
          console.log("Push manager unavailable.");
          return;
        }

        registration.pushManager
          .getSubscription()
          .then(function (existedSubscription) {
            if (existedSubscription === null) {
              console.log("No subscription detected, make a request.");
              registration.pushManager
                .subscribe({
                  applicationServerKey: convertedVapidKey,
                  userVisibleOnly: true,
                })
                .then(function (newSubscription) {
                  console.log("New subscription added.");
                  sendSubscription(authData, newSubscription);
                })
                .catch(function (e) {
                  if (Notification.permission !== "granted") {
                    console.log("Permission was not granted.");
                  } else {
                    console.error(
                      "An error ocurred during the subscription process.",
                      e
                    );
                  }
                });
            } else {
              console.log("Existed subscription detected.");
              sendSubscription(authData, existedSubscription);
            }
          });
      })
      .catch(function (e) {
        console.error(
          "An error ocurred during Service Worker registration.",
          e
        );
      });
  }
}
