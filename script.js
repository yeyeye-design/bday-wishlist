const SUPABASE_URL = "https://whuhxslxfvilqlecviuu.supabase.co";
const SUPABASE_KEY = "sb_publishable_eZfonS74nqs8I0k61b82UA_mL79NX5U";

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
    alert(JSON.stringify(items));
   items.forEach(function(item) {

      const button = document.querySelector(
        '[data-item-id="' + item.item_id + '"]'
      );

      if (button && item.claimed === true) {
        button.textContent = "CLAIMED 💕";
        button.disabled = true;
      }

    });

  } catch (error) {
    console.log("LOAD ERROR:", error);
  }
}


async function reserveItem(button) {

  const itemId = button.getAttribute("data-item-id");

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

      console.log(
        "CLAIM ERROR:",
        await response.text()
      );

      button.disabled = false;
      button.textContent = "I'll get this! 🎁";

      return;
    }

    const result = await response.json();

    if (result.length === 0) {

      button.textContent = "CLAIMED 💕";
      button.disabled = true;

      alert("Oops! Someone already claimed this 💕");

      return;
    }

    button.textContent = "CLAIMED 💕";
    button.disabled = true;

    alert(
      "Yay! This item is now claimed! Thank you sooo much <3 🎁💕"
    );

  } catch (error) {

    console.log("CLAIM ERROR:", error);

    button.disabled = false;
    button.textContent = "I'll get this! 🎁";

  }
}


loadWishlist();
