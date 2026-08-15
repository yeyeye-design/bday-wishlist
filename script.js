const SUPABASE_URL = "https://whuhxslxfvilqlecviuu.supabase.co";
const SUPABASE_KEY = "sb_publishable_eZfonS74nqs8I0k61b82UA_mL79NX5U";


// ==========================
// LOAD WISHLIST
// ==========================

async function loadWishlist() {

  try {

    const response = await fetch(
      SUPABASE_URL +
      "/rest/v1/wishlist?select=item_id,claimed,claim_count,claim_limit",
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


      // ==========================
      // GIFT CARDS
      // ==========================

      const isGiftCard =
        button.getAttribute("data-gift-card") === "true";

      if (isGiftCard) {

        button.textContent = "I'll get this! 🎁";
        button.disabled = false;

        return;
      }


      // ==========================
      // NORMAL ITEMS
      // ==========================

      const count = item.claim_count || 0;
      const limit = item.claim_limit || 1;


      // Completely claimed
      if (item.claimed === true || count >= limit) {

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


  // ==========================
  // GIFT CARD CHECK
  // ==========================

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
  button.textContent = "Claiming... 💗";


  try {

    // ==========================
    // CALL SUPABASE FUNCTION
    // ==========================

    const claimResponse = await fetch(
      SUPABASE_URL + "/rest/v1/rpc/claim_gift",
      {
        method: "POST",

        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          p_item_id: itemId
        })
      }
    );


    // ==========================
    // ERROR
    // ==========================

    if (!claimResponse.ok) {

      console.log(
        "CLAIM ERROR:",
        await claimResponse.text()
      );

      button.disabled = false;
      button.textContent = "I'll get this! 🎁";

      alert(
        "Something went wrong 💗 Please try again."
      );

      return;
    }


    // ==========================
    // READ RESULT
    // ==========================

    const result = await claimResponse.json();

    console.log("CLAIM RESULT:", result);


    // ==========================
    // CLAIM FAILED
    // ==========================

    if (!result.success) {

      button.textContent = "CLAIMED 💕";
      button.disabled = true;

      alert(
        "Oops! This item has already reached its claim limit 💕"
      );

      return;
    }


    // ==========================
    // SUCCESS
    // ==========================

    const count = result.claim_count;
    const limit = result.claim_limit;


    // Completely claimed
    if (result.claimed === true) {

      button.textContent = "CLAIMED 💕";
      button.disabled = true;

      alert(
        "Yay! This item is now fully claimed! Thank you sooo much <3 🎁💕"
      );

    }


    // Still has spots available
    else {

      button.textContent =
        "I'll get this! 🎁";

      button.disabled = false;

      alert(
        "Yay! Thank you sooo much! 💕🎁\n\n" +
        count + " / " + limit +
        " people have claimed this item."
      );

    }


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

     
