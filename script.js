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

      // Gift cards NEVER become claimed
      const isGiftCard =
        button.getAttribute("data-gift-card") === "true";

      if (isGiftCard) {

        button.textContent = "I'll get this! 🎁";
        button.disabled = false;

        return;
      }

      // Normal items
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

    const response = await fetch(
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


    if (!response.ok) {

      console.log(
        "CLAIM ERROR:",
        await response.text()
      );

      button.disabled = false;
      button.textContent = "I'll get this! 🎁";

      return;
    }


    const result = await response.json();


    // Someone already claimed it

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
