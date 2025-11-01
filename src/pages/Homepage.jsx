import React, { useState } from "react";


const Homepage = () => {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleLookup = async () => {
    setError("");
    setData([]);

    if (pincode.length !== 6 || isNaN(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const result = await res.json();
      setLoading(false);

      if (result[0].Status === "Error" || result[0].PostOffice === null) {
        setError("No data found for this pincode.");
        return;
      }

      setData(result[0].PostOffice);
      setMessage(result[0].Message);
      setShowResult(true);
    } catch (err) {
      setLoading(false);
      setError(`Something went wrong. Please try again.${err}`);
    }
  };

  const filteredData = data.filter((postOffice) =>
    postOffice.Name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container">
      {!showResult && (
        <div className="divdata">
          <h1 className="title">Enter Pincode</h1>
          <div className="input-group">
            <div className="two">
            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="input-field"
            />
            <button onClick={handleLookup} className="lookup-btn">
              Lookup
            </button>
</div>
          </div>
          {error && <div className="error-msg">{error}</div>}
          {loading && (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          )}
        </div>
      )}

      {showResult && !loading && (
        <div className="result-page">
          <p>
            <strong>Pincode:</strong> {pincode}
          </p>
          <p>
            <strong>Message:</strong> {message}
          </p>

          <div className="filter-section">
            <input
              type="text"
              placeholder="🔍 Filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="grid-container">
            {filteredData.length > 0 ? (
              filteredData.map((office, idx) => (
                <div key={idx} className="grid-card">
                  <p>
                    <strong>Name:</strong> {office.Name}
                  </p>
                  <p>
                    <strong>Branch Type:</strong> {office.BranchType}
                  </p>
                  <p>
                    <strong>Delivery Status:</strong> {office.DeliveryStatus}
                  </p>
                  <p>
                    <strong>District:</strong> {office.District}
                  </p>
                  <p>
                    <strong>Division:</strong> {office.Division}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-result">
                Couldn’t find the postal data you’re looking for…
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
