import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import UserHeader from "../../../components/UserHeader";
import { LoadingSpinner } from "../../../components/Spinner";
import { handleSignout } from "../../../Services/supabase/authService";

// ============================================================================
// ICON COMPONENTS (SVG-based, matching existing patterns)
// ============================================================================

const KYCStepIcon = ({ step, isCompleted, isActive }) => {
  const stepIcons = {
    1: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    2: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
        />
      </svg>
    ),
    3: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isCompleted
          ? "bg-green-600 text-white"
          : isActive
            ? "bg-basic text-primary"
            : "bg-gray-200 text-gray-600"
      }`}
    >
      {isCompleted ? (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        stepIcons[step]
      )}
    </div>
  );
};

const UploadIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className="w-12 h-12"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// ============================================================================
// FORM COMPONENTS
// ============================================================================

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans ${
        error
          ? "border-red-500 focus:ring-red-500 focus:ring-opacity-50"
          : "border-secondary focus:ring-basic focus:ring-opacity-30"
      } ${
        disabled ? "bg-gray-100 opacity-50 cursor-not-allowed" : "bg-primary"
      }`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
  error,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans ${
        error
          ? "border-red-500 focus:ring-red-500 focus:ring-opacity-50"
          : "border-secondary focus:ring-basic focus:ring-opacity-30"
      } ${
        disabled ? "bg-gray-100 opacity-50 cursor-not-allowed" : "bg-primary"
      }`}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

// ============================================================================
// STEP 1: PERSONAL INFORMATION
// ============================================================================

const StepPersonalInfo = ({ formData, onFormChange, errors }) => {
  const documentTypes = [
    { value: "passport", label: "Passport" },
    { value: "national_id", label: "National ID" },
    { value: "drivers_license", label: "Driver's License" },
  ];

  const countries = [
    { value: "Afghanistan", label: "Afghanistan" },
    { value: "Albania", label: "Albania" },
    { value: "Algeria", label: "Algeria" },
    { value: "Andorra", label: "Andorra" },
    { value: "Angola", label: "Angola" },
    { value: "Antigua and Barbuda", label: "Antigua and Barbuda" },
    { value: "Argentina", label: "Argentina" },
    { value: "Armenia", label: "Armenia" },
    { value: "Australia", label: "Australia" },
    { value: "Austria", label: "Austria" },
    { value: "Azerbaijan", label: "Azerbaijan" },
    { value: "Bahamas", label: "Bahamas" },
    { value: "Bahrain", label: "Bahrain" },
    { value: "Bangladesh", label: "Bangladesh" },
    { value: "Barbados", label: "Barbados" },
    { value: "Belarus", label: "Belarus" },
    { value: "Belgium", label: "Belgium" },
    { value: "Belize", label: "Belize" },
    { value: "Benin", label: "Benin" },
    { value: "Bhutan", label: "Bhutan" },
    { value: "Bolivia", label: "Bolivia" },
    { value: "Bosnia and Herzegovina", label: "Bosnia and Herzegovina" },
    { value: "Botswana", label: "Botswana" },
    { value: "Brazil", label: "Brazil" },
    { value: "Brunei", label: "Brunei" },
    { value: "Bulgaria", label: "Bulgaria" },
    { value: "Burkina Faso", label: "Burkina Faso" },
    { value: "Burundi", label: "Burundi" },
    { value: "Cabo Verde", label: "Cabo Verde" },
    { value: "Cambodia", label: "Cambodia" },
    { value: "Cameroon", label: "Cameroon" },
    { value: "Canada", label: "Canada" },
    { value: "Central African Republic", label: "Central African Republic" },
    { value: "Chad", label: "Chad" },
    { value: "Chile", label: "Chile" },
    { value: "China", label: "China" },
    { value: "Colombia", label: "Colombia" },
    { value: "Comoros", label: "Comoros" },
    { value: "Congo", label: "Congo" },
    { value: "Costa Rica", label: "Costa Rica" },
    { value: "Cote d’Ivoire", label: "Cote d’Ivoire" },
    { value: "Croatia", label: "Croatia" },
    { value: "Cuba", label: "Cuba" },
    { value: "Cyprus", label: "Cyprus" },
    { value: "Czech Republic", label: "Czech Republic" },
    { value: "Denmark", label: "Denmark" },
    { value: "Djibouti", label: "Djibouti" },
    { value: "Dominica", label: "Dominica" },
    { value: "Dominican Republic", label: "Dominican Republic" },
    { value: "Ecuador", label: "Ecuador" },
    { value: "Egypt", label: "Egypt" },
    { value: "El Salvador", label: "El Salvador" },
    { value: "Equatorial Guinea", label: "Equatorial Guinea" },
    { value: "Eritrea", label: "Eritrea" },
    { value: "Estonia", label: "Estonia" },
    { value: "Eswatini", label: "Eswatini" },
    { value: "Ethiopia", label: "Ethiopia" },
    { value: "Fiji", label: "Fiji" },
    { value: "Finland", label: "Finland" },
    { value: "France", label: "France" },
    { value: "Gabon", label: "Gabon" },
    { value: "Gambia", label: "Gambia" },
    { value: "Georgia", label: "Georgia" },
    { value: "Germany", label: "Germany" },
    { value: "Ghana", label: "Ghana" },
    { value: "Greece", label: "Greece" },
    { value: "Grenada", label: "Grenada" },
    { value: "Guatemala", label: "Guatemala" },
    { value: "Guinea", label: "Guinea" },
    { value: "Guinea-Bissau", label: "Guinea-Bissau" },
    { value: "Guyana", label: "Guyana" },
    { value: "Haiti", label: "Haiti" },
    { value: "Honduras", label: "Honduras" },
    { value: "Hungary", label: "Hungary" },
    { value: "Iceland", label: "Iceland" },
    { value: "India", label: "India" },
    { value: "Indonesia", label: "Indonesia" },
    { value: "Iran", label: "Iran" },
    { value: "Iraq", label: "Iraq" },
    { value: "Ireland", label: "Ireland" },
    { value: "Israel", label: "Israel" },
    { value: "Italy", label: "Italy" },
    { value: "Jamaica", label: "Jamaica" },
    { value: "Japan", label: "Japan" },
    { value: "Jordan", label: "Jordan" },
    { value: "Kazakhstan", label: "Kazakhstan" },
    { value: "Kenya", label: "Kenya" },
    { value: "Kiribati", label: "Kiribati" },
    { value: "Kuwait", label: "Kuwait" },
    { value: "Kyrgyzstan", label: "Kyrgyzstan" },
    { value: "Laos", label: "Laos" },
    { value: "Latvia", label: "Latvia" },
    { value: "Lebanon", label: "Lebanon" },
    { value: "Lesotho", label: "Lesotho" },
    { value: "Liberia", label: "Liberia" },
    { value: "Libya", label: "Libya" },
    { value: "Liechtenstein", label: "Liechtenstein" },
    { value: "Lithuania", label: "Lithuania" },
    { value: "Luxembourg", label: "Luxembourg" },
    { value: "Madagascar", label: "Madagascar" },
    { value: "Malawi", label: "Malawi" },
    { value: "Malaysia", label: "Malaysia" },
    { value: "Maldives", label: "Maldives" },
    { value: "Mali", label: "Mali" },
    { value: "Malta", label: "Malta" },
    { value: "Marshall Islands", label: "Marshall Islands" },
    { value: "Mauritania", label: "Mauritania" },
    { value: "Mauritius", label: "Mauritius" },
    { value: "Mexico", label: "Mexico" },
    { value: "Micronesia", label: "Micronesia" },
    { value: "Moldova", label: "Moldova" },
    { value: "Monaco", label: "Monaco" },
    { value: "Mongolia", label: "Mongolia" },
    { value: "Montenegro", label: "Montenegro" },
    { value: "Morocco", label: "Morocco" },
    { value: "Mozambique", label: "Mozambique" },
    { value: "Myanmar", label: "Myanmar" },
    { value: "Namibia", label: "Namibia" },
    { value: "Nauru", label: "Nauru" },
    { value: "Nepal", label: "Nepal" },
    { value: "Netherlands", label: "Netherlands" },
    { value: "New Zealand", label: "New Zealand" },
    { value: "Nicaragua", label: "Nicaragua" },
    { value: "Niger", label: "Niger" },
    { value: "Nigeria", label: "Nigeria" },
    { value: "North Korea", label: "North Korea" },
    { value: "North Macedonia", label: "North Macedonia" },
    { value: "Norway", label: "Norway" },
    { value: "Oman", label: "Oman" },
    { value: "Pakistan", label: "Pakistan" },
    { value: "Palau", label: "Palau" },
    { value: "Palestine", label: "Palestine" },
    { value: "Panama", label: "Panama" },
    { value: "Papua New Guinea", label: "Papua New Guinea" },
    { value: "Paraguay", label: "Paraguay" },
    { value: "Peru", label: "Peru" },
    { value: "Philippines", label: "Philippines" },
    { value: "Poland", label: "Poland" },
    { value: "Portugal", label: "Portugal" },
    { value: "Qatar", label: "Qatar" },
    { value: "Romania", label: "Romania" },
    { value: "Russia", label: "Russia" },
    { value: "Rwanda", label: "Rwanda" },
    { value: "Saint Kitts and Nevis", label: "Saint Kitts and Nevis" },
    { value: "Saint Lucia", label: "Saint Lucia" },
    {
      value: "Saint Vincent and the Grenadines",
      label: "Saint Vincent and the Grenadines",
    },
    { value: "Samoa", label: "Samoa" },
    { value: "San Marino", label: "San Marino" },
    { value: "Sao Tome and Principe", label: "Sao Tome and Principe" },
    { value: "Saudi Arabia", label: "Saudi Arabia" },
    { value: "Senegal", label: "Senegal" },
    { value: "Serbia", label: "Serbia" },
    { value: "Seychelles", label: "Seychelles" },
    { value: "Sierra Leone", label: "Sierra Leone" },
    { value: "Singapore", label: "Singapore" },
    { value: "Slovakia", label: "Slovakia" },
    { value: "Slovenia", label: "Slovenia" },
    { value: "Solomon Islands", label: "Solomon Islands" },
    { value: "Somalia", label: "Somalia" },
    { value: "South Africa", label: "South Africa" },
    { value: "South Korea", label: "South Korea" },
    { value: "South Sudan", label: "South Sudan" },
    { value: "Spain", label: "Spain" },
    { value: "Sri Lanka", label: "Sri Lanka" },
    { value: "Sudan", label: "Sudan" },
    { value: "Suriname", label: "Suriname" },
    { value: "Sweden", label: "Sweden" },
    { value: "Switzerland", label: "Switzerland" },
    { value: "Syria", label: "Syria" },
    { value: "Taiwan", label: "Taiwan" },
    { value: "Tajikistan", label: "Tajikistan" },
    { value: "Tanzania", label: "Tanzania" },
    { value: "Thailand", label: "Thailand" },
    { value: "Timor-Leste", label: "Timor-Leste" },
    { value: "Togo", label: "Togo" },
    { value: "Tonga", label: "Tonga" },
    { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
    { value: "Tunisia", label: "Tunisia" },
    { value: "Turkey", label: "Turkey" },
    { value: "Turkmenistan", label: "Turkmenistan" },
    { value: "Tuvalu", label: "Tuvalu" },
    { value: "Uganda", label: "Uganda" },
    { value: "Ukraine", label: "Ukraine" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "United States", label: "United States" },
    { value: "Uruguay", label: "Uruguay" },
    { value: "Uzbekistan", label: "Uzbekistan" },
    { value: "Vanuatu", label: "Vanuatu" },
    { value: "Vatican City", label: "Vatican City" },
    { value: "Venezuela", label: "Venezuela" },
    { value: "Vietnam", label: "Vietnam" },
    { value: "Yemen", label: "Yemen" },
    { value: "Zambia", label: "Zambia" },
    { value: "Zimbabwe", label: "Zimbabwe" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-secondary mb-4">
          Personal Information
        </h3>
        <p className="text-sm text-secondary opacity-70 mb-6">
          Please provide your personal details as they appear on your
          government-issued ID.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={onFormChange}
          placeholder="Your full name"
          required
          error={errors.full_name}
        />

        <FormField
          label="Date of Birth"
          name="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={onFormChange}
          required
          error={errors.date_of_birth}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          label="Phone Number"
          name="phone_number"
          value={formData.phone_number}
          onChange={onFormChange}
          placeholder="+31 6 XXXX XXXX"
          required
          error={errors.phone_number}
        />

        <SelectField
          label="Nationality"
          name="nationality"
          value={formData.nationality}
          onChange={onFormChange}
          options={countries}
          required
          error={errors.nationality}
        />
      </div>

      <SelectField
        label="Document Type"
        name="document_type"
        value={formData.document_type}
        onChange={onFormChange}
        options={documentTypes}
        required
        error={errors.document_type}
      />

      <FormField
        label="Document Number"
        name="document_number"
        value={formData.document_number}
        onChange={onFormChange}
        placeholder="e.g., AB123456"
        required
        error={errors.document_number}
      />

      <FormField
        label="Document Expiry Date"
        name="document_expiry"
        type="date"
        value={formData.document_expiry}
        onChange={onFormChange}
        required
        error={errors.document_expiry}
      />
    </div>
  );
};

// ============================================================================
// STEP 2: ADDRESS INFORMATION
// ============================================================================

const StepAddressInfo = ({ formData, onFormChange, errors }) => {
  const countries = [
    { value: "Afghanistan", label: "Afghanistan" },
    { value: "Albania", label: "Albania" },
    { value: "Algeria", label: "Algeria" },
    { value: "Andorra", label: "Andorra" },
    { value: "Angola", label: "Angola" },
    { value: "Antigua and Barbuda", label: "Antigua and Barbuda" },
    { value: "Argentina", label: "Argentina" },
    { value: "Armenia", label: "Armenia" },
    { value: "Australia", label: "Australia" },
    { value: "Austria", label: "Austria" },
    { value: "Azerbaijan", label: "Azerbaijan" },
    { value: "Bahamas", label: "Bahamas" },
    { value: "Bahrain", label: "Bahrain" },
    { value: "Bangladesh", label: "Bangladesh" },
    { value: "Barbados", label: "Barbados" },
    { value: "Belarus", label: "Belarus" },
    { value: "Belgium", label: "Belgium" },
    { value: "Belize", label: "Belize" },
    { value: "Benin", label: "Benin" },
    { value: "Bhutan", label: "Bhutan" },
    { value: "Bolivia", label: "Bolivia" },
    { value: "Bosnia and Herzegovina", label: "Bosnia and Herzegovina" },
    { value: "Botswana", label: "Botswana" },
    { value: "Brazil", label: "Brazil" },
    { value: "Brunei", label: "Brunei" },
    { value: "Bulgaria", label: "Bulgaria" },
    { value: "Burkina Faso", label: "Burkina Faso" },
    { value: "Burundi", label: "Burundi" },
    { value: "Cabo Verde", label: "Cabo Verde" },
    { value: "Cambodia", label: "Cambodia" },
    { value: "Cameroon", label: "Cameroon" },
    { value: "Canada", label: "Canada" },
    { value: "Central African Republic", label: "Central African Republic" },
    { value: "Chad", label: "Chad" },
    { value: "Chile", label: "Chile" },
    { value: "China", label: "China" },
    { value: "Colombia", label: "Colombia" },
    { value: "Comoros", label: "Comoros" },
    { value: "Congo", label: "Congo" },
    { value: "Costa Rica", label: "Costa Rica" },
    { value: "Cote d’Ivoire", label: "Cote d’Ivoire" },
    { value: "Croatia", label: "Croatia" },
    { value: "Cuba", label: "Cuba" },
    { value: "Cyprus", label: "Cyprus" },
    { value: "Czech Republic", label: "Czech Republic" },
    { value: "Denmark", label: "Denmark" },
    { value: "Djibouti", label: "Djibouti" },
    { value: "Dominica", label: "Dominica" },
    { value: "Dominican Republic", label: "Dominican Republic" },
    { value: "Ecuador", label: "Ecuador" },
    { value: "Egypt", label: "Egypt" },
    { value: "El Salvador", label: "El Salvador" },
    { value: "Equatorial Guinea", label: "Equatorial Guinea" },
    { value: "Eritrea", label: "Eritrea" },
    { value: "Estonia", label: "Estonia" },
    { value: "Eswatini", label: "Eswatini" },
    { value: "Ethiopia", label: "Ethiopia" },
    { value: "Fiji", label: "Fiji" },
    { value: "Finland", label: "Finland" },
    { value: "France", label: "France" },
    { value: "Gabon", label: "Gabon" },
    { value: "Gambia", label: "Gambia" },
    { value: "Georgia", label: "Georgia" },
    { value: "Germany", label: "Germany" },
    { value: "Ghana", label: "Ghana" },
    { value: "Greece", label: "Greece" },
    { value: "Grenada", label: "Grenada" },
    { value: "Guatemala", label: "Guatemala" },
    { value: "Guinea", label: "Guinea" },
    { value: "Guinea-Bissau", label: "Guinea-Bissau" },
    { value: "Guyana", label: "Guyana" },
    { value: "Haiti", label: "Haiti" },
    { value: "Honduras", label: "Honduras" },
    { value: "Hungary", label: "Hungary" },
    { value: "Iceland", label: "Iceland" },
    { value: "India", label: "India" },
    { value: "Indonesia", label: "Indonesia" },
    { value: "Iran", label: "Iran" },
    { value: "Iraq", label: "Iraq" },
    { value: "Ireland", label: "Ireland" },
    { value: "Israel", label: "Israel" },
    { value: "Italy", label: "Italy" },
    { value: "Jamaica", label: "Jamaica" },
    { value: "Japan", label: "Japan" },
    { value: "Jordan", label: "Jordan" },
    { value: "Kazakhstan", label: "Kazakhstan" },
    { value: "Kenya", label: "Kenya" },
    { value: "Kiribati", label: "Kiribati" },
    { value: "Kuwait", label: "Kuwait" },
    { value: "Kyrgyzstan", label: "Kyrgyzstan" },
    { value: "Laos", label: "Laos" },
    { value: "Latvia", label: "Latvia" },
    { value: "Lebanon", label: "Lebanon" },
    { value: "Lesotho", label: "Lesotho" },
    { value: "Liberia", label: "Liberia" },
    { value: "Libya", label: "Libya" },
    { value: "Liechtenstein", label: "Liechtenstein" },
    { value: "Lithuania", label: "Lithuania" },
    { value: "Luxembourg", label: "Luxembourg" },
    { value: "Madagascar", label: "Madagascar" },
    { value: "Malawi", label: "Malawi" },
    { value: "Malaysia", label: "Malaysia" },
    { value: "Maldives", label: "Maldives" },
    { value: "Mali", label: "Mali" },
    { value: "Malta", label: "Malta" },
    { value: "Marshall Islands", label: "Marshall Islands" },
    { value: "Mauritania", label: "Mauritania" },
    { value: "Mauritius", label: "Mauritius" },
    { value: "Mexico", label: "Mexico" },
    { value: "Micronesia", label: "Micronesia" },
    { value: "Moldova", label: "Moldova" },
    { value: "Monaco", label: "Monaco" },
    { value: "Mongolia", label: "Mongolia" },
    { value: "Montenegro", label: "Montenegro" },
    { value: "Morocco", label: "Morocco" },
    { value: "Mozambique", label: "Mozambique" },
    { value: "Myanmar", label: "Myanmar" },
    { value: "Namibia", label: "Namibia" },
    { value: "Nauru", label: "Nauru" },
    { value: "Nepal", label: "Nepal" },
    { value: "Netherlands", label: "Netherlands" },
    { value: "New Zealand", label: "New Zealand" },
    { value: "Nicaragua", label: "Nicaragua" },
    { value: "Niger", label: "Niger" },
    { value: "Nigeria", label: "Nigeria" },
    { value: "North Korea", label: "North Korea" },
    { value: "North Macedonia", label: "North Macedonia" },
    { value: "Norway", label: "Norway" },
    { value: "Oman", label: "Oman" },
    { value: "Pakistan", label: "Pakistan" },
    { value: "Palau", label: "Palau" },
    { value: "Palestine", label: "Palestine" },
    { value: "Panama", label: "Panama" },
    { value: "Papua New Guinea", label: "Papua New Guinea" },
    { value: "Paraguay", label: "Paraguay" },
    { value: "Peru", label: "Peru" },
    { value: "Philippines", label: "Philippines" },
    { value: "Poland", label: "Poland" },
    { value: "Portugal", label: "Portugal" },
    { value: "Qatar", label: "Qatar" },
    { value: "Romania", label: "Romania" },
    { value: "Russia", label: "Russia" },
    { value: "Rwanda", label: "Rwanda" },
    { value: "Saint Kitts and Nevis", label: "Saint Kitts and Nevis" },
    { value: "Saint Lucia", label: "Saint Lucia" },
    {
      value: "Saint Vincent and the Grenadines",
      label: "Saint Vincent and the Grenadines",
    },
    { value: "Samoa", label: "Samoa" },
    { value: "San Marino", label: "San Marino" },
    { value: "Sao Tome and Principe", label: "Sao Tome and Principe" },
    { value: "Saudi Arabia", label: "Saudi Arabia" },
    { value: "Senegal", label: "Senegal" },
    { value: "Serbia", label: "Serbia" },
    { value: "Seychelles", label: "Seychelles" },
    { value: "Sierra Leone", label: "Sierra Leone" },
    { value: "Singapore", label: "Singapore" },
    { value: "Slovakia", label: "Slovakia" },
    { value: "Slovenia", label: "Slovenia" },
    { value: "Solomon Islands", label: "Solomon Islands" },
    { value: "Somalia", label: "Somalia" },
    { value: "South Africa", label: "South Africa" },
    { value: "South Korea", label: "South Korea" },
    { value: "South Sudan", label: "South Sudan" },
    { value: "Spain", label: "Spain" },
    { value: "Sri Lanka", label: "Sri Lanka" },
    { value: "Sudan", label: "Sudan" },
    { value: "Suriname", label: "Suriname" },
    { value: "Sweden", label: "Sweden" },
    { value: "Switzerland", label: "Switzerland" },
    { value: "Syria", label: "Syria" },
    { value: "Taiwan", label: "Taiwan" },
    { value: "Tajikistan", label: "Tajikistan" },
    { value: "Tanzania", label: "Tanzania" },
    { value: "Thailand", label: "Thailand" },
    { value: "Timor-Leste", label: "Timor-Leste" },
    { value: "Togo", label: "Togo" },
    { value: "Tonga", label: "Tonga" },
    { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
    { value: "Tunisia", label: "Tunisia" },
    { value: "Turkey", label: "Turkey" },
    { value: "Turkmenistan", label: "Turkmenistan" },
    { value: "Tuvalu", label: "Tuvalu" },
    { value: "Uganda", label: "Uganda" },
    { value: "Ukraine", label: "Ukraine" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "United States", label: "United States" },
    { value: "Uruguay", label: "Uruguay" },
    { value: "Uzbekistan", label: "Uzbekistan" },
    { value: "Vanuatu", label: "Vanuatu" },
    { value: "Vatican City", label: "Vatican City" },
    { value: "Venezuela", label: "Venezuela" },
    { value: "Vietnam", label: "Vietnam" },
    { value: "Yemen", label: "Yemen" },
    { value: "Zambia", label: "Zambia" },
    { value: "Zimbabwe", label: "Zimbabwe" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-secondary mb-4">
          Address Information
        </h3>
        <p className="text-sm text-secondary opacity-70 mb-6">
          Please provide your current residential address.
        </p>
      </div>

      <FormField
        label="Street Address"
        name="address"
        value={formData.address}
        onChange={onFormChange}
        placeholder="Street address"
        required
        error={errors.address}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          label="City"
          name="city"
          value={formData.city}
          onChange={onFormChange}
          placeholder="City"
          required
          error={errors.city}
        />

        <FormField
          label="Postal Code"
          name="postal_code"
          value={formData.postal_code}
          onChange={onFormChange}
          placeholder="Postal code"
          required
          error={errors.postal_code}
        />
      </div>

      <SelectField
        label="Country"
        name="country"
        value={formData.country}
        onChange={onFormChange}
        options={countries}
        required
        error={errors.country}
      />

      {/* Confirmation Checkbox */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-sm border border-blue-200">
        <input
          type="checkbox"
          name="address_matches_id"
          checked={formData.address_matches_id}
          onChange={onFormChange}
          className="w-5 h-5 mt-1 text-blue-600"
        />
        <label className="text-sm text-blue-900">
          I confirm that this address matches the address on my
          government-issued ID.
        </label>
      </div>
    </div>
  );
};

// ============================================================================
// STEP 3: DOCUMENT UPLOAD & REVIEW
// ============================================================================

const StepDocumentUpload = ({ formData, onFileChange, errors }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onFileChange({ target: { files: [file] } }, "document_front");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-secondary mb-4">
          Upload & Review Documents
        </h3>
        <p className="text-sm text-secondary opacity-70 mb-6">
          Upload a clear, legible image of your government-issued ID. All pages
          must be visible. After submission, we'll validate your documents
          immediately.
        </p>
      </div>

      {/* Document Front Upload */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-secondary mb-3 uppercase tracking-wider opacity-80">
          Document Front <span className="text-red-600">*</span>
        </label>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e)}
          className={`relative border-2 border-dashed rounded-sm p-8 text-center transition-all ${
            dragActive
              ? "border-basic bg-blue-50"
              : "border-secondary bg-gray-50"
          } ${errors.document_front ? "border-red-500" : ""}`}
        >
          {formData.document_front ? (
            <div className="space-y-3">
              <div className="text-green-600">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-semibold text-secondary">
                {formData.document_front.name}
              </p>
              <p className="text-xs text-secondary opacity-70">
                {(formData.document_front.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={() =>
                  onFileChange(
                    {
                      target: { files: [] },
                    },
                    "document_front",
                  )
                }
                className="text-xs text-red-600 hover:text-red-700 font-semibold"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <UploadIcon />
              <p className="mt-3 font-semibold text-secondary">
                Drag and drop your document here
              </p>
              <p className="text-xs text-secondary opacity-70 mt-1">
                or click to browse
              </p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => onFileChange(e, "document_front")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
        {errors.document_front && (
          <p className="text-xs text-red-600 mt-2">{errors.document_front}</p>
        )}
      </div>

      {/* Document Back Upload (Optional) */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-secondary mb-3 uppercase tracking-wider opacity-80">
          Document Back{" "}
          <span className="text-gray-500 text-xs">(Optional)</span>
        </label>

        <div
          className={`relative border-2 border-dashed rounded-sm p-8 text-center transition-all border-secondary bg-gray-50`}
        >
          {formData.document_back ? (
            <div className="space-y-3">
              <div className="text-green-600">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-semibold text-secondary">
                {formData.document_back.name}
              </p>
              <p className="text-xs text-secondary opacity-70">
                {(formData.document_back.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={() =>
                  onFileChange(
                    {
                      target: { files: [] },
                    },
                    "document_back",
                  )
                }
                className="text-xs text-red-600 hover:text-red-700 font-semibold"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <UploadIcon />
              <p className="mt-3 font-semibold text-secondary">
                Drag and drop document back
              </p>
              <p className="text-xs text-secondary opacity-70 mt-1">
                or click to browse
              </p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => onFileChange(e, "document_back")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      </div>

      {/* File Requirements */}
      <div className="bg-yellow-50 rounded-sm border border-yellow-200 p-4">
        <p className="text-xs font-semibold text-yellow-900 mb-2">
          File Requirements:
        </p>
        <ul className="text-xs text-yellow-800 space-y-1 opacity-90">
          <li>• Maximum file size: 10 MB</li>
          <li>• Accepted formats: JPG, PNG, PDF</li>
          <li>• Document must be clear and legible</li>
          <li>• All four corners must be visible</li>
        </ul>
      </div>

      {/* Review Checklist */}
      <div className="bg-blue-50 rounded-sm border border-blue-200 p-4">
        <p className="text-xs font-semibold text-blue-900 mb-3">
          Before submitting, verify:
        </p>
        <ul className="text-xs text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 text-blue-600"
              disabled
            />
            <span>Document is not expired and expiry date matches form</span>
          </li>
          <li className="flex items-start gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 text-blue-600"
              disabled
            />
            <span>All text is legible and not blurry or cut off</span>
          </li>
          <li className="flex items-start gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 text-blue-600"
              disabled
            />
            <span>No reflections or glare on document</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN KYC COMPONENT
// ============================================================================

export function KYCPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    phone_number: "",
    nationality: "",
    document_type: "",
    document_number: "",
    document_expiry: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    address_matches_id: true,
    document_front: null,
    document_back: null,
  });

  const [errors, setErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);

  // Load profile on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data: { session } = {} } = await supabase.auth.getSession();
        const uid = session?.user?.id;

        if (!uid) {
          navigate("/auth/login", { replace: true });
          return;
        }

        setUserId(uid);

        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", uid)
          .eq("is_deleted", false)
          .maybeSingle();

        if (profileError) {
          console.error("[KYC] Profile error:", profileError);
          throw new Error("Failed to load profile");
        }

        if (mounted) {
          setProfile(profileData);

          // Pre-fill form with existing data
          if (profileData) {
            setFormData((prev) => ({
              ...prev,
              full_name: profileData.full_name || "",
              date_of_birth: profileData.date_of_birth || "",
              phone_number: profileData.phone_number || "",
              nationality: profileData.nationality || "",
              address: profileData.address || "",
              city: profileData.city || "",
              postal_code: profileData.postal_code || "",
              country: profileData.country || "",
            }));
          }

          // If already verified, show success
          if (profileData?.kyc_status === "verified") {
            setCompletedSteps([1, 2, 3]);
            setCurrentStep(4);
          }
        }
      } catch (err) {
        console.error("[KYC] Load error:", err);
        if (mounted) {
          setMessage({
            type: "error",
            text: "Failed to load profile. Please refresh.",
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.full_name) newErrors.full_name = "Full name is required";
      if (!formData.date_of_birth)
        newErrors.date_of_birth = "Date of birth is required";
      if (!formData.phone_number)
        newErrors.phone_number = "Phone number is required";
      if (!formData.nationality)
        newErrors.nationality = "Nationality is required";
      if (!formData.document_type)
        newErrors.document_type = "Document type is required";
      if (!formData.document_number)
        newErrors.document_number = "Document number is required";
      if (!formData.document_expiry)
        newErrors.document_expiry = "Document expiry is required";
    } else if (step === 2) {
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.postal_code)
        newErrors.postal_code = "Postal code is required";
      if (!formData.country) newErrors.country = "Country is required";
    } else if (step === 3) {
      if (!formData.document_front)
        newErrors.document_front = "Document front image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10 MB
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          [field]: "File size must be less than 10 MB",
        }));
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [field]: "Only JPG, PNG, or PDF files are allowed",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;

    setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmitKYC = async () => {
    if (!validateStep(3)) return;

    setSubmitting(true);
    try {
      // Simulate document validation (in production, call backend for OCR/verification)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update user profile with KYC data and mark as verified
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          kyc_status: "verified",
          kyc_verified_at: new Date().toISOString(),
          kyc_document_id: `doc_${Date.now()}`,
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          phone_number: formData.phone_number,
          nationality: formData.nationality,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          country: formData.country,
          metadata: {
            document_type: formData.document_type,
            document_number: formData.document_number,
            document_expiry: formData.document_expiry,
            verified_timestamp: new Date().toISOString(),
          },
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      setCompletedSteps([1, 2, 3]);
      setCurrentStep(4);
      setMessage({
        type: "success",
        text: "KYC verification completed successfully!",
      });
    } catch (err) {
      console.error("[KYC] Submit error:", err);
      setMessage({
        type: "error",
        text: err?.message || "Failed to complete KYC verification",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userId || !profile) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  const steps = [
    { id: 1, label: "Personal Info", icon: 1 },
    { id: 2, label: "Address", icon: 2 },
    { id: 3, label: "Documents", icon: 3 },
  ];

  return (
    <div className="min-h-screen bg-primary">
      <UserHeader
        profile={profile}
        handleSignOut={() => handleSignout(navigate)}
      />

      <main className="container mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-secondary opacity-70">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:opacity-100 font-bold"
          >
            &lt; Dashboard
          </button>
          <span>/</span>
          <span className="font-semibold opacity-100">KYC Verification</span>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-sm border-l-4 ${
              message.type === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : "bg-red-50 border-red-500 text-red-800"
            }`}
          >
            <p className="text-sm font-semibold">{message.text}</p>
          </div>
        )}

        {currentStep <= 3 && (
          <>
            {/* Progress Steps */}
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center justify-between mb-8">
                {steps.map((step, idx) => (
                  <div key={step.id} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center flex-1">
                      <KYCStepIcon
                        step={step.icon}
                        isCompleted={completedSteps.includes(step.id)}
                        isActive={currentStep === step.id}
                      />
                      <p className="text-xs sm:text-sm font-semibold text-secondary mt-2 text-center">
                        {step.label}
                      </p>
                    </div>

                    {idx < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 rounded-full ${
                          completedSteps.includes(step.id)
                            ? "bg-green-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Indicator */}
              <div className="text-center">
                <p className="text-sm text-secondary opacity-70">
                  Step {currentStep} of {steps.length}
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-primary rounded-sm border border-secondary p-6 sm:p-8 shadow-md mb-8">
              {currentStep === 1 && (
                <StepPersonalInfo
                  formData={formData}
                  onFormChange={handleFormChange}
                  errors={errors}
                />
              )}

              {currentStep === 2 && (
                <StepAddressInfo
                  formData={formData}
                  onFormChange={handleFormChange}
                  errors={errors}
                />
              )}

              {currentStep === 3 && (
                <StepDocumentUpload
                  formData={formData}
                  onFileChange={handleFileChange}
                  errors={errors}
                />
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                  className="flex-1 py-3 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex-1 py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all active:scale-95"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitKYC}
                    disabled={submitting}
                    className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-sm hover:bg-green-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner size="sm" /> Validating...
                      </>
                    ) : (
                      "Complete KYC"
                    )}
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Success Screen */}
        {currentStep === 4 && (
          <div className="bg-primary rounded-sm border border-secondary p-8 sm:p-12 text-center shadow-md">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldIcon />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-3">
              KYC Verified!
            </h2>

            <p className="text-secondary opacity-70 mb-2">
              Your identity has been successfully verified.
            </p>

            <p className="text-sm text-secondary opacity-60 mb-8">
              Verification completed on{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="bg-green-50 rounded-sm border border-green-200 p-6 mb-8 text-left">
              <h3 className="font-semibold text-green-900 mb-3">
                You can now:
              </h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>✓ Transfer money instantly</li>
                <li>✓ Increase your transaction limits</li>
                <li>✓ Access premium banking features</li>
                <li>✓ Manage multiple accounts</li>
              </ul>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 px-6 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all active:scale-95"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default KYCPage;
