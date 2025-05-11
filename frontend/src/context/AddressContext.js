import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '../utils/tokenUtils';

const AddressContext = createContext();

export const useAddress = () => useContext(AddressContext);

// Helper function to check if data is older than 3 hours
const isDataStale = (timestamp) => {
  if (!timestamp) return true;
  
  const currentTime = new Date().getTime();
  const threeHoursInMs = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  return (currentTime - timestamp) > threeHoursInMs;
};

// Helper function to get user data storage key based on JWT token
const getUserDataStorageKey = () => {
  const token = getToken();
  if (!token) return null;
  
  // Use a hash of the token as the key to avoid storing the full token
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `userData_${hash}`;
};

export const AddressProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [userData, setUserData] = useState(() => {
    const storageKey = getUserDataStorageKey();
    if (!storageKey) return null;
    
    const savedUserData = localStorage.getItem(storageKey);
    return savedUserData ? JSON.parse(savedUserData) : null;
  });
  
  const [useAlternativeAddress, setUseAlternativeAddress] = useState(() => {
    const storageKey = getUserDataStorageKey();
    if (!storageKey) return false;
    
    const key = `${storageKey}_useAlternativeAddress`;
    const savedAddressType = localStorage.getItem(key);
    return savedAddressType ? JSON.parse(savedAddressType) : false;
  });
  
  const [formData, setFormData] = useState(() => {
    const storageKey = getUserDataStorageKey();
    if (!storageKey) return {
      firstName: '',
      lastName: '',
      email: '',
      primary_street: '',
      primary_buildingNumber: '',
      primary_apartmentNumber: '',
      primary_postalCode: '',
      primary_city: '',
      primary_voivodeship: '',
      primary_district: '',
      primary_commune: '',
      primary_phoneNumber: '',
      primary_nip: '',
      primary_companyName: '',
      alternative_street: '',
      alternative_buildingNumber: '',
      alternative_apartmentNumber: '',
      alternative_postalCode: '',
      alternative_city: '',
      alternative_voivodeship: '',
      alternative_district: '',
      alternative_commune: '',
      alternative_phoneNumber: '',
      alternative_nip: '',
      alternative_companyName: '',
    };
    
    const key = `${storageKey}_formData`;
    const savedFormData = localStorage.getItem(key);
    return savedFormData ? JSON.parse(savedFormData) : {
      firstName: '',
      lastName: '',
      email: '',
      primary_street: '',
      primary_buildingNumber: '',
      primary_apartmentNumber: '',
      primary_postalCode: '',
      primary_city: '',
      primary_voivodeship: '',
      primary_district: '',
      primary_commune: '',
      primary_phoneNumber: '',
      primary_nip: '',
      primary_companyName: '',
      alternative_street: '',
      alternative_buildingNumber: '',
      alternative_apartmentNumber: '',
      alternative_postalCode: '',
      alternative_city: '',
      alternative_voivodeship: '',
      alternative_district: '',
      alternative_commune: '',
      alternative_phoneNumber: '',
      alternative_nip: '',
      alternative_companyName: '',
    };
  });
  
  const [lastFetchTime, setLastFetchTime] = useState(() => {
    const storageKey = getUserDataStorageKey();
    if (!storageKey) return null;
    
    const key = `${storageKey}_fetchTime`;
    const savedTime = localStorage.getItem(key);
    return savedTime ? parseInt(savedTime, 10) : null;
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Check for token changes and update state accordingly
  useEffect(() => {
    const handleTokenChange = () => {
      const storageKey = getUserDataStorageKey();
      if (!storageKey) {
        // No token, reset state
        setUserData(null);
        setUseAlternativeAddress(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          primary_street: '',
          primary_buildingNumber: '',
          primary_apartmentNumber: '',
          primary_postalCode: '',
          primary_city: '',
          primary_voivodeship: '',
          primary_district: '',
          primary_commune: '',
          primary_phoneNumber: '',
          primary_nip: '',
          primary_companyName: '',
          alternative_street: '',
          alternative_buildingNumber: '',
          alternative_apartmentNumber: '',
          alternative_postalCode: '',
          alternative_city: '',
          alternative_voivodeship: '',
          alternative_district: '',
          alternative_commune: '',
          alternative_phoneNumber: '',
          alternative_nip: '',
          alternative_companyName: '',
        });
        setLastFetchTime(null);
        return;
      }
      
      // Load data for the new token
      const savedUserData = localStorage.getItem(storageKey);
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
      
      const addressTypeKey = `${storageKey}_useAlternativeAddress`;
      const savedAddressType = localStorage.getItem(addressTypeKey);
      if (savedAddressType) {
        setUseAlternativeAddress(JSON.parse(savedAddressType));
      }
      
      const formDataKey = `${storageKey}_formData`;
      const savedFormData = localStorage.getItem(formDataKey);
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
      
      const fetchTimeKey = `${storageKey}_fetchTime`;
      const savedTime = localStorage.getItem(fetchTimeKey);
      if (savedTime) {
        setLastFetchTime(parseInt(savedTime, 10));
      }
    };

    // Listen for storage events (in case token changes in another tab)
    window.addEventListener('storage', (event) => {
      if (event.key === 'token') {
        handleTokenChange();
      }
    });
    
    // Also listen for our own token changes
    window.addEventListener('tokenChanged', handleTokenChange);
    
    return () => {
      window.removeEventListener('storage', (event) => {
        if (event.key === 'token') handleTokenChange();
      });
      window.removeEventListener('tokenChanged', handleTokenChange);
    };
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const storageKey = getUserDataStorageKey();
    if (!storageKey) return; // No token, don't save
    
    if (userData) {
      localStorage.setItem(storageKey, JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    const storageKey = getUserDataStorageKey();
    if (!storageKey) return; // No token, don't save
    
    const key = `${storageKey}_useAlternativeAddress`;
    localStorage.setItem(key, JSON.stringify(useAlternativeAddress));
  }, [useAlternativeAddress]);

  useEffect(() => {
    const storageKey = getUserDataStorageKey();
    if (!storageKey) return; // No token, don't save
    
    const key = `${storageKey}_formData`;
    localStorage.setItem(key, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    const storageKey = getUserDataStorageKey();
    if (!storageKey || !lastFetchTime) return; // No token or timestamp, don't save
    
    const key = `${storageKey}_fetchTime`;
    localStorage.setItem(key, lastFetchTime.toString());
  }, [lastFetchTime]);

  const updateUserData = (data) => {
    setUserData(data);
    setLastFetchTime(new Date().getTime());
  };

  const updateFormData = (data) => {
    setFormData(data);
  };

  const toggleAddressType = (useAlternative) => {
    setUseAlternativeAddress(useAlternative);
  };

  const getCurrentAddressData = () => {
    const prefix = useAlternativeAddress ? 'alternative_' : 'primary_';
    return {
      street: formData[`${prefix}street`] || '',
      buildingNumber: formData[`${prefix}buildingNumber`] || '',
      apartmentNumber: formData[`${prefix}apartmentNumber`] || '',
      postalCode: formData[`${prefix}postalCode`] || '',
      city: formData[`${prefix}city`] || '',
      voivodeship: formData[`${prefix}voivodeship`] || '',
      district: formData[`${prefix}district`] || '',
      commune: formData[`${prefix}commune`] || '',
      phoneNumber: formData[`${prefix}phoneNumber`] || '',
      nip: formData[`${prefix}nip`] || '',
      companyName: formData[`${prefix}companyName`] || '',
      isAlternative: useAlternativeAddress
    };
  };

  const getFormattedAddress = () => {
    const addressData = getCurrentAddressData();
    const addressParts = [];

    if (addressData.street) {
      let streetLine = addressData.street;
      if (addressData.buildingNumber) {
        streetLine += ` ${addressData.buildingNumber}`;
        if (addressData.apartmentNumber) {
          streetLine += `/${addressData.apartmentNumber}`;
        }
      }
      addressParts.push(streetLine);
    }

    if (addressData.postalCode || addressData.city) {
      let cityLine = '';
      if (addressData.postalCode) {
        cityLine += addressData.postalCode;
      }
      if (addressData.city) {
        if (cityLine) cityLine += ' ';
        cityLine += addressData.city;
      }
      if (cityLine) addressParts.push(cityLine);
    }

    if (addressData.voivodeship) {
      addressParts.push(`woj. ${addressData.voivodeship}`);
    }

    return {
      addressLines: addressParts,
      phoneNumber: addressData.phoneNumber,
      companyName: addressData.companyName,
      nip: addressData.nip,
      isAlternative: addressData.isAlternative
    };
  };

  const saveUserData = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    const token = getToken();
    if (!token) {
      setSaveError("Brak tokenu uwierzytelniającego. Zaloguj się.");
      setIsSaving(false);
      return;
    }

    try {
      // Prepare data for API
      const primaryAddress = {
        street: formData.primary_street,
        buildingNumber: formData.primary_buildingNumber,
        apartmentNumber: formData.primary_apartmentNumber,
        postalCode: formData.primary_postalCode,
        city: formData.primary_city,
        voivodeship: formData.primary_voivodeship,
        district: formData.primary_district,
        commune: formData.primary_commune,
        phoneNumber: formData.primary_phoneNumber,
        nip: formData.primary_nip,
        companyName: formData.primary_companyName
      };

      const alternativeAddress = {
        street: formData.alternative_street,
        buildingNumber: formData.alternative_buildingNumber,
        apartmentNumber: formData.alternative_apartmentNumber,
        postalCode: formData.alternative_postalCode,
        city: formData.alternative_city,
        voivodeship: formData.alternative_voivodeship,
        district: formData.alternative_district,
        commune: formData.alternative_commune,
        phoneNumber: formData.alternative_phoneNumber,
        nip: formData.alternative_nip,
        companyName: formData.alternative_companyName
      };

      const userDataToSave = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        primaryAddress,
        alternativeAddress
      };

      const encodedToken = encodeURIComponent(token);
      const response = await fetch(`http://localhost:8080/update-user?token=${encodedToken}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDataToSave)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Błąd serwera: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setSaveSuccess(true);
        // Update userData with the saved data
        setUserData({
          ...userData,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          primaryAddress,
          alternativeAddress
        });
      } else {
        throw new Error(result.message || "Nie udało się zapisać danych użytkownika.");
      }
    } catch (err) {
      console.error("Błąd podczas zapisywania danych użytkownika:", err);
      setSaveError(err.message || "Wystąpił błąd podczas zapisywania danych.");
    } finally {
      setIsSaving(false);
    }
  };

  const shouldFetchUserData = () => {
    return !userData || isDataStale(lastFetchTime);
  };

  return (
    <AddressContext.Provider
      value={{
        userData,
        formData,
        useAlternativeAddress,
        updateUserData,
        updateFormData,
        toggleAddressType,
        getCurrentAddressData,
        getFormattedAddress,
        saveUserData,
        shouldFetchUserData,
        isSaving,
        saveSuccess,
        saveError
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
