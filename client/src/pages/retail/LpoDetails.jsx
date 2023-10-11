export default function LpoDetails() {
  return (
    <div className="registration-form">
      <h1>Supplier Details</h1>
      <form >

        <div className="form-group">
          <label className="form-label">Supplier:</label>
          <input
            type="text"
            className="form-control"
            id="supplier"
            name="supplier"
            value=""            
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">KRA PIN:</label>
          <input
            type="text"
            className="form-control"
            id="kra_pin"
            name="kra_pin"
            value=""            
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">USD RATE:</label>
          <input
            type="text"
            className="form-control"
            id="usd_rate"
            name="usd_rate"
            value=""            
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" >
          Register
        </button>      

      </form>
    </div>
  );
}
