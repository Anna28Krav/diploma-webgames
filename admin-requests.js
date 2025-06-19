// admin-requests.js
import { db } from './firebase-config.js';
import { collection, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const requestsList = document.getElementById("requestsList");

async function loadRequests() {
  const querySnapshot = await getDocs(collection(db, "requests"));
  requestsList.innerHTML = ""; // очистка перед оновленням

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "request-card";

    div.innerHTML = `
      <h3>${data.title}</h3>
      <p><strong>Опис:</strong> ${data.description}</p>
      <p><strong>Посилання:</strong> <a href="${data.url}" target="_blank">${data.url}</a></p>
      <p><strong>Категорія:</strong> ${data.category}</p>
      <div class="buttons">
        <button class="approve-btn">✅ Підтвердити</button>
        <button class="reject-btn">❌ Відхилити</button>
      </div>
    `;

    const approveBtn = div.querySelector(".approve-btn");
    const rejectBtn = div.querySelector(".reject-btn");

    approveBtn.addEventListener("click", async () => {
      await updateDoc(doc(db, "requests", docSnap.id), { status: "approved" });
      alert("Заявку підтверджено");
      div.remove(); // видаляємо з інтерфейсу
    });

    rejectBtn.addEventListener("click", async () => {
      await deleteDoc(doc(db, "requests", docSnap.id));
      alert("Заявку відхилено");
      div.remove(); // видаляємо з інтерфейсу
    });

    requestsList.appendChild(div);
  });
}

loadRequests();
