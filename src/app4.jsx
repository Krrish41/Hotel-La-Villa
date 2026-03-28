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
    let newErrors = {};

    if (formData.userId.length < 5 || formData.userId.length > 12) {
      newErrors.userId = "Required (5-12 characters)";
    }

    if (formData.password.length < 7 || formData.password.length > 12) {
      newErrors.password = "Required (7-12 characters)";
    }

    if (!/^[A-Za-z]+$/.test(formData.name)) {
      newErrors.name = "Required (Alphabets only)";
    }

    if (formData.country === "") {
      newErrors.country = "Required (Select a country)";
    }

    if (!/^\d+$/.test(formData.zipCode)) {
      newErrors.zipCode = "Required (Numeric only)";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Required (Valid email)";
    }

    if (!formData.sex) {
      newErrors.sex = "Required";
    }

    if (formData.language.length === 0) {
      newErrors.language = "Required (At least one)";
    }

    setErrors(newErrors);
  };

  const error = {
    color:'red',
    fontSize:'12px',
  };

  return (
    <div>
      <h2>Registration Form</h2>
      <form id="regForm">
        <label>User ID:</label>
        <input type="text" name="userId" value={formData.userId} onChange={handleChange} placeholder="Required & must be of length 5 to 12" style={{width: '30.5%'}} />
        <br/>
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Required & must be of length 7 to 12" style={{width: '30.5%'}} />
        <br/>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Required & Alphabets only" />
        <br/>
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
        <br/>
        <label>ZIP Code:</label>
        <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Required & must be Numeric only" style={{width: '28%'}} />
        <br/>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Required & must be a valid email" />
        <br/>
        <label>Sex:</label>
        <input type="radio" name="sex" value="Male" checked={formData.sex === "Male"} onChange={handleChange} /> Male
        <input type="radio" name="sex" value="Female" checked={formData.sex === "Female"} onChange={handleChange} /> Female
        <br/>
        <label>Language:</label>
        <input type="checkbox" name="language" value="English" checked={formData.language.includes("English")} onChange={handleChange} /> English
        <input type="checkbox" name="language" value="Non-English" checked={formData.language.includes("Non-English")} onChange={handleChange} /> Non-English
        <br/>
        <label>About:</label>
        <textarea name="about" value={formData.about} onChange={handleChange} placeholder="Optional"></textarea><br />

        <button type="button" onClick={validateForm}>Submit</button>
      </form>

    

    <span>User ID Entry ERROR: </span><p style={error}>{errors.userId}</p><br/>
    <span>Password Entry ERROR: </span><p style={error}>{errors.password}</p><br/>
    <span>Name Entry ERROR: </span><p style={error}>{errors.name}</p><br/>
    <span>Country Selection ERROR: </span><p style={error}>{errors.country}</p><br/>
    <span>Zipcode Entry ERROR: </span><p style={error}>{errors.zipCode}</p><br/>
    <span>Email Entry ERROR: </span><p style={error}>{errors.email}</p><br/>
    <span>Sex Selection ERROR: </span><p style={error}>{errors.sex}</p><br/>
    <span>Language Selection ERROR: </span><p style={error}>{errors.language}</p><br></br>


    </div>
  );
};

export default RegistrationForm;
