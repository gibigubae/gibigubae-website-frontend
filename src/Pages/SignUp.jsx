import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useAuth";
import "./Auth.css";
import ErrorPage from "../Components/ErrorPage";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    christianName: "",
    phoneNumber: "",
    department: "",
    year: "",
    dormBlock: "",
    roomNumber: "",
    gender: "",
    id: "",
    idFile: null,
    email: "",
    password: "",
  });

  const [validationError, setValidationError] = useState("");

  // Use React Query mutation hook for signup
  const { mutate: signup, isPending, error, isError } = useSignup({
    onSuccess: (data) => {
      localStorage.setItem("userRole", data?.data?.role || "student");
      navigate("/student/courses");
    },
  }); 

  // Clear any stale role when the signup page mounts
  useEffect(() => {
    localStorage.removeItem("userRole");
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setValidationError("");

    // Validation to check required fields
    if (
      !formData.firstName ||
      !formData.fatherName ||
      !formData.grandfatherName ||
      !formData.phoneNumber ||
      !formData.department ||
      !formData.year ||
      !formData.dormBlock ||
      !formData.roomNumber ||
      !formData.gender ||
      !formData.id ||
      !formData.idFile ||
      !formData.email ||
      !formData.password
    ) {
      setValidationError("Please fill in all required fields");
      return;
    }

    // Prepare FormData
    const formDataWithFile = new FormData();
    formDataWithFile.append("first_name", formData.firstName);
    formDataWithFile.append("father_name", formData.fatherName);
    formDataWithFile.append("grand_father_name", formData.grandfatherName);
    formDataWithFile.append("christian_name", formData.christianName);
    formDataWithFile.append("phone_number", formData.phoneNumber);
    formDataWithFile.append("department", formData.department);
    formDataWithFile.append("year", formData.year);
    formDataWithFile.append("dorm_block", formData.dormBlock);
    formDataWithFile.append("room_number", formData.roomNumber);
    formDataWithFile.append("gender", formData.gender);
    formDataWithFile.append("id_number", formData.id);
    formDataWithFile.append("email", formData.email);
    formDataWithFile.append("password", formData.password);

    if (formData.idFile) {
      formDataWithFile.append("id_card", formData.idFile);
    }

    // Call the signup mutation
    signup(formDataWithFile);
  };
 
  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Welcome Section */}
        <div className="auth-welcome-section hide-on-mobile">
          <div className="welcome-card">
            <div className="logo-circle">
              <span className="logo-text">
                GIBI
                <br />
                GUBAE
              </span>
            </div>
            <h2 className="welcome-title">Hello. Welcome</h2>
            <p className="welcome-message">
              Create your account to get started. Stay connected, manage your
              profile, and access all available services. Already have an
              account?{" "}
              <span onClick={() => navigate("/")} className="welcome-link">
                Sign in to continue.
              </span>
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="auth-form-section">
          <div className="auth-form">
            <h1 className="auth-title">Create your account</h1>

            {validationError && (
              <ErrorPage compact title="Validation Error" message={validationError} />
            )}

            {isError && (
              <ErrorPage
                compact
                title="Registration Error"
                message={error?.response?.data?.message || error?.message || "Registration failed"}
              />
            )}

            <form onSubmit={handleSignUp}>
              {/* Name Row 1 */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="fatherName"
                    placeholder="Father Name"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              {/* Name Row 2 */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="grandfatherName"
                    placeholder="Grandfather Name"
                    value={formData.grandfatherName}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="christianName"
                    placeholder="Christian Name"
                    value={formData.christianName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Phone & Gender */}
              <div className="form-row">
                <div className="form-group">
                  <div className="phone-input-wrapper">
                    <span className="phone-prefix">+251</span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="form-input phone-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* Department & Year */}
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select Department</option>
                    <option value="Electromechanical Engineering">
                      Electromechanical Engineering
                    </option>
                    <option value="Chemical Engineering">
                      Chemical Engineering
                    </option>
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                    <option value="Mechanical Engineering">
                      Mechanical Engineering
                    </option>
                    <option value="Electrical and Computer Engineering">
                      Electrical and Computer Engineering
                    </option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Applied Science">Applied Science</option>
                    <option value="Freshman Engineering">
                      Freshman Engineering
                    </option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Industrial Chemistry">
                      Industrial Chemistry
                    </option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <input
                    type="number"
                    name="year"
                    placeholder="Year"
                    min="1"
                    max="7"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              {/* Dorm & Room */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="dormBlock"
                    placeholder="Dorm Block"
                    value={formData.dormBlock}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="roomNumber"
                    placeholder="Room Number"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              {/* ID Number & Upload */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="id"
                    placeholder="ID Number"
                    value={formData.id}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group file-upload-group">
                  {/* Label removed or styled differently if needed */}
                  <input
                    type="file"
                    id="idFile"
                    name="idFile"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="form-input file-input" // Ensure both classes are here
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <button type="submit" disabled={isPending} className="auth-button">
                {isPending ? "Registering..." : "Register"}
                {!isPending && <span className="button-arrow">→</span>}
              </button>
            </form>

            <div className="auth-link">
              Already have an account?{" "}
              <span onClick={() => navigate("/")} className="link-text">
                login
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
