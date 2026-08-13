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
        method: "GET",

        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY
        }
      }
    );


    if (!response.ok) {

      console.error(
        "LOAD ERROR:",
        await response.text()
      );

      return;
    }


    const items = await response.json();

    console.log("WISHLIST FROM DATABASE:", items);


    items.forEach(function(item) {

      const button = document.querySelector(
        '[data-item-id="' + item.item_id + '"]'
      );


      if (!button) {

        console.log(
          "No button found for:",
          item.item_id
        );

        return;
      }


      // Convert database value to an actual boolean

      const isClaimed =
        item.claimed === true ||
        item.claimed === "true";


      if (isClaimed) {

        button.textContent = "CLAIMED 💕";

        button.disabled = true;

      } else {

        button.textContent = "I'll get this! 🎁";

        button.disabled = false;

      }

    });


  } catch (error) {

    console.error(
      "LOAD ERROR:",
      error
    );

  }

}


// ==========================
// CLAIM ITEM
// ==========================

async function reserveItem(button) {

  const itemId =
    button.getAttribute("data-item-id");


  if (!itemId) {

    console.error("NO ITEM ID");

    return;
  }


  const confirmation = confirm(
    "Are you sure you want to get this item? 🎁"
  );


  if (!confirmation) {
    return;
  }


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

      console.error(
        "CLAIM ERROR:",
        await response.text()
      );

      button.disabled = false;

      button.textContent =
        "I'll get this! 🎁";

      alert(
        "Something went wrong. Please try again."
      );

      return;
    }


    const result = await response.json();


    // ==========================
    // SOMEONE ALREADY CLAIMED IT
    // ==========================

    if (result.length === 0) {

      button.textContent =
        "CLAIMED 💕";

      button.disabled = true;

      alert(
        "Oops! Someone already claimed this 💕"
      );

      return;
    }


    // ==========================
    // SUCCESS
    // ==========================

    button.textContent =
      "CLAIMED 💕";

    button.disabled = true;

    alert(
      "Yay! This item is now claimed! Thank you sooo much <3 🎁💕"
    );


  } catch (error) {

    console.error(
      "CLAIM ERROR:",
      error
    );

    button.disabled = false;

    button.textContent =
      "I'll get this! 🎁";

    alert(
      "Something went wrong. Please try again."
    );

  }

}


// ==========================
// START
// ==========================

loadWishlist();
