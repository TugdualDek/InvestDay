import React from "react";
import "../style/rechercher.css";

function Rechercher() {
  return (
    <div className="searchContainer">
      <h1>Rechercher</h1>
      <form class="example" action="/action_page.php">
        <div className="formContainer">
          <input type="text" placeholder="Search.." name="search" />
          <button type="submit">
            <ion-icon name="search-outline"></ion-icon>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Rechercher;
