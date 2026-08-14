const SUPABASE_URL = "https://whuhxslxfvilqlecviuu.supabase.co";
const SUPABASE_KEY = "sb_publishable_eZfonS74nqs8I0k61b82UA_mL79NX5U";


// ==========================
// LOAD CLAIMED ITEMS
// ==========================

async function loadWishlist() {

  try {

    const response = await fetch(
      SUPABASE_URL + "/rest/v1/wishlist?select=item_id,claimed",
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY
        }
      }
    );

    if (!response.ok) {
      console.log("LOAD ERROR:", await response.text());
      return;
    }

    const items = await response.json();

    items.forEach(function(item) {

      const cleanId = item.item_id.trim();

      const button = document.querySelector(
        '[data-item-id="' + cleanId + '"]'
      );

      if (!button) {
        return;
      }

      // Gift cards are ALWAYS available
      const isGiftCard =
        button.getAttribute("data-gift-card") === "true";

      if (isGiftCard) {
        button.textContent = "I'll get this! 🎁";
        button.disabled = false;
        return;
      }

      // Normal claimed item
      if (item.claimed === true) {
        button.textContent = "CLAIMED 💕";
        button.disabled = true;
      }

    });

  } catch (error) {

    console.log("LOAD ERROR:", error);

  }

}


// ==========================
// CLAIM ITEM
// ==========================

async function reserveItem(button) {

  const itemId = button.getAttribute("data-item-id");

  if (!itemId) {
    return;
  }

  // Gift cards never get saved as claimed
  const isGiftCard =
    button.getAttribute("data-gift-card") === "true";


  const confirmation = confirm(
    "Are you sure you want to get this item? 🎁"
  );

  if (!confirmation) {
    return;
  }


  // ==========================
  // GIFT CARDS
  // ==========================

  if (isGiftCard) {

    alert(
      "Yay! Thank you sooo much! 💕🎁"
    );

    return;
  }


  // ==========================
  // NORMAL ITEMS
  // ==========================

  button.disabled = true;
  button.textContent = "Checking... 💗";


  try {

    // First check the CURRENT database status
    const checkResponse = await fetch(
      SUPABASE_URL +
      "/rest/v1/wishlist?item_id=eq." +
      encodeURIComponent(itemId) +
      "&select=item_id,claimed",

      {
        method: "GET",

        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY
        }
      }
    );


    if (!checkResponse.ok) {

      console.log(
        "CHECK ERROR:",
        await checkResponse.text()
      );

      button.disabled = false;
      button.textContent = "I'll get this! 🎁";

      return;
    }


    const currentItems = await checkResponse.json();


    // Item doesn't exist in database
    if (currentItems.length === 0) {

      alert("This item isn't set up correctly yet 💗");

      button.disabled = false;
      button.textContent = "I'll get this! 🎁";

      return;
    }


    const currentItem = currentItems[0];


    // ==========================
    // ALREADY CLAIMED
    // ==========================

    if (currentItem.claimed === true) {

      button.textContent = "CLAIMED 💕";
      button.disabled = true;

      alert(
        "Oops! Someone already claimed this 💕"
      );

      return;
    }


    // ==========================
    // CLAIM IT
    // ==========================

    const claimResponse = await fetch(
      SUPABASE_URL +
      "/rest/v1/wishlist?item_id=eq." +
      encodeURIComponent(itemId) +
      "&claimed=eq.false",

      {
        method: "PATCH",

        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },

        body: JSON.stringify({
          claimed: true
        })
      }
    );


    if (!claimResponse.ok) {

      console.log(
        "CLAIM ERROR:",
        await claimResponse.text()
      );

      button.disabled = false;
      button.textContent = "I'll get this! 🎁";

      return;
    }


    const result = await claimResponse.json();


    // Someone claimed it between our check and our update
    if (result.length === 0) {

      button.textContent = "CLAIMED 💕";
      button.disabled = true;

      alert(
        "Oops! Someone already claimed this 💕"
      );

      return;
    }


    // Successfully claimed
    button.textContent = "CLAIMED 💕";
    button.disabled = true;

    alert(
      "Yay! This item is now claimed! Thank you sooo much <3 🎁💕"
    );


  } catch (error) {

    console.log(
      "CLAIM ERROR:",
      error
    );

    button.disabled = false;
    button.textContent = "I'll get this! 🎁";

  }

}


// ==========================
// START
// ==========================

loadWishlist();
