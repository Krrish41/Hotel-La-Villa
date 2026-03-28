import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    name: '',
    address: '',
    country: '',
    zipCode: '',
    email: '',
    sex: '',
    language: [],
    about: ''
  });
  const [errors, setErrors] = useState({});
  const [showTable, setShowTable] = useState(false);

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value; 
  
    if (e.target.type === 'checkbox') {
      const isChecked = e.target.checked; 
      setFormData((prevState) => {
        const updatedLanguages = isChecked
          ? [...prevState.language, fieldValue] 
          : prevState.language.filter((lang) => lang !== fieldValue); 
  
        return { ...prevState, language: updatedLanguages }; 
      });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [fieldName]: fieldValue, 
      }));
    }
  };
  

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (formData.userId.length < 5 || formData.userId.length > 12) {
      newErrors.userId = "Required (5-12 characters)";
      isValid = false;
    }

    if (formData.password.length < 7 || formData.password.length > 12) {
      newErrors.password = "Required (7-12 characters)";
      isValid = false;
    }

    if (!/^[A-Za-z]+$/.test(formData.name)) {
      newErrors.name = "Required (Alphabets only)";
      isValid = false;
    }

    if (formData.country === "") {
      newErrors.country = "Required (Select a country)";
      isValid = false;
    }

    if (!/^\d+$/.test(formData.zipCode)) {
      newErrors.zipCode = "Required (Numeric only)";
      isValid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Required (Valid email)";
      isValid = false;
    }

    if (!formData.sex) {
      newErrors.sex = "Required";
      isValid = false;
    }

    if (formData.language.length === 0) {
      newErrors.language = "Required (At least one)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowTable(true);
    }
  };

  return (
    <div>
      <h2>Registration Form</h2>
      <form id="regForm">
        <label>User ID:</label>
        <input type="text" name="userId" value={formData.userId} onChange={handleChange} placeholder="Required & must be of length 5 to 12" style={{width: '30.5%'}} />
        <span style={{color: 'red', fontSize: '12px'}}>{errors.userId}</span><br />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Required & must be of length 7 to 12" style={{width: '30.5%'}} />
        <span style={{color: 'red', fontSize: '12px'}}>{errors.password}</span><br />

        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Required & Alphabets only" />
        <span style={{color: 'red', fontSize: '12px'}}>{errors.name}</span><br />

        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Optional" /><br />

        <label>Country:</label>
        <select name="country" value={formData.country} onChange={handleChange}>
          <option value="">(Please select a country)</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="Japan">Japan</option>
        </select>
        <span style={{color: 'red', fontSize: '12px'}}>{errors.country}</span><br />

        <label>ZIP Code:</label>
        <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Required & must be Numeric only" style={{width: '28%'}} />
        <span style={{color: 'red', fontSize: '12px'}}>{errors.zipCode}</span><br />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Required & must be a valid email" />
        <span style={{color: 'red', fontSize: '12px'}}>{errors.email}</span><br />

        <label>Sex:</label>
        <input type="radio" name="sex" value="Male" checked={formData.sex === "Male"} onChange={handleChange} /> Male
        <input type="radio" name="sex" value="Female" checked={formData.sex === "Female"} onChange={handleChange} /> Female
        <span style={{color: 'red', fontSize: '12px'}}>{errors.sex}</span><br />

        <label>Language:</label>
        <input type="checkbox" name="language" value="English" checked={formData.language.includes("English")} onChange={handleChange} /> English
        <input type="checkbox" name="language" value="Non-English" checked={formData.language.includes("Non-English")} onChange={handleChange} /> Non-English
        <span style={{color: 'red', fontSize: '12px'}}>{errors.language}</span><br />

        <label>About:</label>
        <textarea name="about" value={formData.about} onChange={handleChange} placeholder="Optional"></textarea><br />

        <button type="button" onClick={handleSubmit}>Submit</button>
      </form>

      {showTable && (
  <div>
    <h2>Entered Details:</h2>
    <table border="1">
      <tbody>
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>User ID</td><td>{formData.userId}</td></tr>
        <tr><td>Password</td><td>{formData.password}</td></tr>
        <tr><td>Name</td><td>{formData.name}</td></tr>
        <tr><td>Address</td><td>{formData.address || 'N/A'}</td></tr>
        <tr><td>Country</td><td>{formData.country}</td></tr>
        <tr><td>ZIP Code</td><td>{formData.zipCode}</td></tr>
        <tr><td>Email</td><td>{formData.email}</td></tr>
        <tr><td>Sex</td><td>{formData.sex}</td></tr>
        <tr><td>Language</td><td>{formData.language.join(', ')}</td></tr>
        <tr><td>About</td><td>{formData.about || 'N/A'}</td></tr>
      </tbody>
    </table>
  </div>
)}
    </div>
  );
};

export default RegistrationForm;
