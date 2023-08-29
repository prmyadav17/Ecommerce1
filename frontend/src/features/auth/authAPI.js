export function createUser(userData) {
  return new Promise(async (resolve) => {
    const response = await fetch("/myauth/mysignup", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function loginUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/myauth/mylogin", {
        method: "POST",
        body: JSON.stringify(loginInfo),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject({ error });
      }
    } catch (error) {
      reject({ error });
    }
  });
}

export function checkAuth() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/myauth/mycheck");
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject({ error });
      }
    } catch (error) {
      reject({ error });
    }
  });
}

export function signOut(userId) {
  return new Promise(async (resolve) => {
    //TODO: on server we will remove user session info
    resolve({ data: "success" });
  });
}
