import React from "react";

// Render will pause the server if 15 minutes no request, so we will access this page every 10 minutes to keep the server running
function Health() {
  return <div>Health Check OK</div>;
}

export default Health;
