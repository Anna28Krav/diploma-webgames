// admin-login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  try {
    const q = query(collection(db, "adminRequests"), where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const request = querySnapshot.docs[0].data();
      if (request.status === "підтверджено") {
        window.location.href = "admin.html";
      } else {
        alert("Вашу заявку ще не підтверджено.");
      }
    } else {
      alert("Заявки не знайдено.");
    }
  } catch (error) {
    console.error("Помилка перевірки адміна:", error);
    alert("Помилка авторизації. Спробуйте ще раз.");
  }
});
