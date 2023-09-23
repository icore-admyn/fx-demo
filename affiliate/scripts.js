const claimButton = document.getElementById("claimButton");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const submitEmail = document.getElementById("submitEmail");
  
  claimButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  submitEmail.addEventListener("click", () => {
    const emailInput = document.getElementById("emailInput").value;
    if (emailInput) {
      // You can handle the email submission here (e.g., send to server)
      modal.style.display = "none";
      alert(`Thank you for submitting your email: ${emailInput}`);
    }
  });